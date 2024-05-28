const { verifyToken } = require('../utils/authServices')
const User = require('../model/user')
const AppError = require('../utils/AppError')
const mongoose = require('mongoose')
const Role = require('../model/roles')
const Permissions = require('../model/permissions');

const checkAuthenticate = async (req,res,next) => {
    try {
      let token;
      let userData;
  
      if (
        req.headers?.authorization &&
        req.headers?.authorization?.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
  
      if (!token) {
         next(new AppError("token is not accessible", 401))
      }
  
      // userInformation
      const decodedUserAuthData = await verifyToken(token);

      userData = await User.findOne( {
        _id: mongoose.Types.ObjectId(decodedUserAuthData.id),
      })

      if (!userData) {
        next(new AppError("user is not authorized", 401))
      }
  
      req.user = userData;
  
      next();
    }
    catch (error) {
      next(error);
    }
}

// Check if the user has the required permission for a route
const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : 'anonymous';
    const userPermissions = new Permissions().getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
};

const checkRole = (roles) =>{
  return async (req, res, next) => {
    !roles.includes(req.user.role)
      ? res.status(401).json({ message :"Sorry you do not have access to this route" })
      : next();
  };
}

module.exports = {
    checkAuthenticate,
    checkRole,
    checkPermission
}