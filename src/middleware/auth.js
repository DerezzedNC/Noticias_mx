const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuario no encontrado.'
      });
    }

    if (user.estado !== 'activo') {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo o suspendido.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};

// Middleware para verificar si el usuario es contribuidor o admin
const isContribuidor = (req, res, next) => {
  if (!['contribuidor', 'administrador'].includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de contribuidor.'
    });
  }
  next();
};

module.exports = {
  auth,
  isAdmin,
  isContribuidor
};