const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Permission name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    // Specific Permissions for Category Management
    canCreateCategory: { type: Boolean, default: false },
    canCreateProduct: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` field before saving
permissionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Permission', permissionSchema);
