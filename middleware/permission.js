// const Permission = require('../models/Permission');

// // Middleware to check if the user has the required permission
// const checkPermission = (permissionName) => {
//     return async (req, res, next) => {
//         try {
//             const userPermissions = await Permission.find({ _id: { $in: req.user.permissions } });
//             const hasPermission = userPermissions.some(permission => permission.name === permissionName);

//             if (!hasPermission) {
//                 return res.status(403).json({ message: "You do not have permission to perform this action." });
//             }
//             next();
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     };
// };

// module.exports = { checkPermission };
