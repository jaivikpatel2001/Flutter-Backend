// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: {
//         type: String,
//         enum: ["superadmin", "club", "sportsperson", "doctor"],
//         default: "club"
//     },
//     permissions: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Permission",
//         validate: {
//             validator: async function (value) {
//                 const count = await mongoose.model('Permission').countDocuments({ _id: value });
//                 return count > 0;
//             },
//             message: 'Invalid permission ID'
//         }
//     }],
//     resetPasswordToken: { type: String },
//     resetPasswordExpire: { type: Date },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // To track who created the user
//     createdAt: { type: Date, default: Date.now },
//     status: { type: Number, default: 1 } // 1 for active user, 0 for soft deleted user
// });

// module.exports = mongoose.model("User", userSchema);



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // Common for all users
    lastName: { type: String, required: true },  // Common for all users
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["superadmin", "club", "sportsperson", "doctor"],
        default: "club"
    },
    address: { type: String }, // Common for all users
    pinCode: { type: String }, // Common for all users
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        validate: {
            validator: async function (value) {
                const count = await mongoose.model('Permission').countDocuments({ _id: value });
                return count > 0;
            },
            message: 'Invalid permission ID'
        }
    }],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    status: { type: Number, default: 1 }, // 1 for active user, 0 for soft deleted user

    // Doctor-specific fields
    doctorDetails: {
        Type: { type: String, enum: ["Physio", "Physician"] },
        WorkExp: { type: Number, min: 0 } // Work experience in years
    },

    // Sportsperson-specific fields
    sportspersonDetails: {
        birthDate: { type: Date },
        allergic: { type: Boolean },
        allergies: { type: [String] }, // Optional: List of allergies if allergic is true
    }
});

// Pre-save hook to ensure only relevant fields are filled based on role
userSchema.pre("save", function (next) {
    if (this.role === "doctor") {
        this.sportspersonDetails = undefined; // Remove sportsperson details for doctors
    } else if (this.role === "sportsperson") {
        this.doctorDetails = undefined; // Remove doctor details for sportspersons
    }
    next();
});

module.exports = mongoose.model("User", userSchema);

