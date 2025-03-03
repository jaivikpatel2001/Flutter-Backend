const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["superadmin", "club", "sportsperson", "doctor"],
        default: "sportsperson"
    },
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // To track who created the user
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
