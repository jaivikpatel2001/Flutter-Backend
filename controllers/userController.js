// * Import required modules
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ! Register user with role-based permissions
// ? Handles user registration with role validation
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const creator = await User.findById(req.user.id);
    if (!creator) return res.status(404).json({ message: "Creator not found" });

    // * Role-based permission checks
    if (creator.role === "superadmin") {
      if (role !== "club") {
        return res.status(403).json({ message: "Superadmin can only create Club users" });
      }
    } else if (creator.role === "club") {
      if (!["doctor", "sportsperson"].includes(role)) {
        return res.status(403).json({ message: "Club can only create Doctor and Sportsperson users" });
      }
    } else {
      return res.status(403).json({ message: "You are not allowed to create users" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, createdBy: req.user.id });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Authenticate user and return JWT token
// ? Handles user login and JWT token generation
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).populate('createdBy', null, null, { strictPopulate: false });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30*24*60*60*1000,
      sameSite: 'strict'
    });

    res.json({ message: "Login successful", role: user.role, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Change user password
// ? Handles password change for authenticated users
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const user = await User.findById(req.user.id).populate('createdBy');
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Get all users
// ? Retrieves all users (password excluded)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('createdBy', null, null, { strictPopulate: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Get user by ID for profile
// ? Retrieves a single user by ID (password excluded)
exports.getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id).select('-password').populate('createdBy', null, null, { strictPopulate: false });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// * Setup Nodemailer Transporter
// ? Configures email transporter for password reset
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ! Forgot Password (Send Email)
// ? Handles password reset request and sends email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // * Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + + 15 * 60 * 1000;; // 1 hour expiry
    await user.save();

    // * Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // * Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! Reset Password
// ? Handles actual password reset with token validation
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // * Trim and validate token
    const trimmedToken = token.trim();
    if (!trimmedToken || trimmedToken.length !== 64) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    // Find user by token
    const user = await User.findOne({ resetPasswordToken: trimmedToken });
    
    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired token",
        details: "Please request a new password reset link"
      });
    }

    // Check if token is expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ 
        message: "Token has expired",
        details: "Please request a new password reset link"
      });
    }

    // * Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // * Hash new password and clear reset fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ 
      message: "Password reset successful",
      details: "You can now log in with your new password" 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "An error occurred while resetting password",
      error: error.message 
    });
  }
};

// ! Logout user by clearing authentication token
// ? Handles user logout by clearing JWT cookie
exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(200).json({ message: "Already logged out" });

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(200).json({ message: "Session expired. Already logged out" });
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};