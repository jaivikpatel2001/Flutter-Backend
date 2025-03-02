const Permission = require('../models/Permission');

// Middleware to check if user has specific permission
exports.hasPermission = (permissionName, action) => async (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Superadmin bypasses all permission checks
        if (req.user.role === 'superadmin') {
            return next();
        }

        // Find the permission in user's permissions
        const permission = await Permission.findOne({
            _id: { $in: req.user.permissions },
            name: permissionName
        });

        if (!permission) {
            return res.status(403).json({ 
                message: `You don't have the ${permissionName} permission`
            });
        }

        // Check if the action is allowed
        switch (action) {
            case 'create':
                if (!permission.canCreate) {
                    return res.status(403).json({ 
                        message: `You don't have permission to create with ${permissionName}`
                    });
                }
                break;
            case 'read':
                if (!permission.canRead) {
                    return res.status(403).json({ 
                        message: `You don't have permission to read with ${permissionName}`
                    });
                }
                break;
            case 'update':
                if (!permission.canUpdate) {
                    return res.status(403).json({ 
                        message: `You don't have permission to update with ${permissionName}`
                    });
                }
                break;
            case 'delete':
                if (!permission.canDelete) {
                    return res.status(403).json({ 
                        message: `You don't have permission to delete with ${permissionName}`
                    });
                }
                break;
            default:
                return res.status(400).json({ message: "Invalid action specified" });
        }

        next();
    } catch (error) {
        console.error('Permission check error:', error);
        res.status(500).json({ message: "Error checking permissions" });
    }
};
