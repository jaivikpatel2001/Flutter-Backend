// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Import the email utility function
const { sendEmail } = require("../utils/email");

// ! Register user with role-based permissions
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", result: false });
    }

    const creator = await User.findById(req.user.id);
    if (!creator) return res.status(404).json({ message: "Creator not found", result: false });

    // Role-based permission checks
    if (creator.role === "superadmin") {
      if (role !== "club") {
        return res.status(403).json({ message: "Superadmin can only create Club users", result: false });
      }
    } else if (creator.role === "club") {
      if (!["doctor", "sportsperson"].includes(role)) {
        return res.status(403).json({ message: "Club can only create Doctor and Sportsperson users", result: false });
      }
    } else {
      return res.status(403).json({ message: "You are not allowed to create users", result: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", result: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, createdBy: req.user.id });
    await user.save();

    res.status(201).json({ message: "User created successfully", user, result: true });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

// ! Authenticate user and return JWT token
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", result: false });
    }

    const user = await User.findOne({ email }).populate('createdBy', null, null, { strictPopulate: false });
    if (!user) return res.status(400).json({ message: "User not found", result: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password", result: false });

    // Generate JWT token with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token in Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);

    res.json({ message: "Login successful", role: user.role, user, token, result: true });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};


// ! Change user password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required", result: false });
    }

    const user = await User.findById(req.user.id).populate('createdBy');
    if (!user) return res.status(400).json({ message: "User not found", result: false });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password", result: false });

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from old password", result: false });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully", user, result: true });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

// ! Get all users
exports.getUsers = async (req, res) => {
  try {
    // Get all users grouped by their roles
    const superadmins = await User.find({ role: 'superadmin' }).select('-password').populate('createdBy', null, null, { strictPopulate: false });
    const doctors = await User.find({ role: 'doctor' }).select('-password').populate('createdBy', null, null, { strictPopulate: false });
    const sportspersons = await User.find({ role: 'sportsperson' }).select('-password').populate('createdBy', null, null, { strictPopulate: false });
    const clubs = await User.find({ role: 'club' }).select('-password').populate('createdBy', null, null, { strictPopulate: false });

    res.json({
      users: {
        superadmins,
        doctors,
        sportspersons,
        clubs
      },
      result: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const result = await exports.getUserByIdHandler(id);

  if (!result.result) {
    return res.status(result.error === "User not found" ? 404 : 400).json(result);
  }

  res.json(result);
};

// ! Update User Profile (Only Name)
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required", result: false });
  }

  // Inform the user that only the name can be updated
  if (Object.keys(req.body).length > 1) {
    return res.status(400).json({ message: "You can only update the name field", result: false });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", result: false });
    }

    user.name = name;
    await user.save();

    res.json({ message: "User profile updated successfully", user, result: true });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};



exports.getUserByIdHandler = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { error: "Invalid user ID", result: false };
    }
    const user = await User.findById(userId)
      .select('-password')
      .populate('createdBy', null, null, { strictPopulate: false });

    if (!user) {
      return { error: "User not found", result: false };
    }

    return { user, result: true };
  } catch (error) {
    return { error: error.message, result: false };
  }
};

// ! Forgot Password (Send Email)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required", result: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", result: false });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send the email using the email utility
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Password reset link sent to email", result: true });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

// ! Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required", result: false });
    }

    const trimmedToken = token.trim();
    if (!trimmedToken || trimmedToken.length !== 64) {
      return res.status(400).json({ message: "Invalid token format", result: false });
    }

    const user = await User.findOne({ resetPasswordToken: trimmedToken });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
        details: "Please request a new password reset link",
        result: false
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        message: "Token has expired",
        details: "Please request a new password reset link",
        result: false
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long", result: false });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      message: "Password reset successful",
      details: "You can now log in with your new password",
      result: true
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while resetting password",
      error: error.message,
      result: false
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // Since token is in Authorization header, no need to clear cookies
    // Simply return success response
    res.status(200).json({ message: "Logged out successfully", result: true });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};
