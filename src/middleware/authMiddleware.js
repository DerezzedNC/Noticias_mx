const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado',
                details: 'No se proporcionó token de acceso'
            });
        }

        // Verificar token
        const jwtSecret = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2023';
        const decoded = jwt.verify(token, jwtSecret);

        // Verificar que el usuario aún existe y está activo
        const usersFile = path.join(__dirname, '../../data/users.json');
        if (fs.existsSync(usersFile)) {
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            const user = users.find(u => u.id === decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido',
                    details: 'Usuario no encontrado'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Cuenta desactivada',
                    details: 'Tu cuenta ha sido desactivada'
                });
            }
        }

        // Agregar información del usuario a la request
        req.user = decoded;
        next();

    } catch (error) {
        console.error('Error en autenticación:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado',
                details: 'El token de acceso ha expirado'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
                details: 'El token de acceso no es válido'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            details: 'Error verificando autenticación'
        });
    }
};

// Middleware para verificar rol de administrador
const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, (err) => {
        if (err) return next(err);

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado',
                details: 'Se requieren permisos de administrador'
            });
        }

        next();
    });
};

// Middleware para verificar que el usuario es el propietario o admin
const authenticateOwnerOrAdmin = (req, res, next) => {
    authenticateToken(req, res, (err) => {
        if (err) return next(err);

        const resourceUserId = parseInt(req.params.id || req.params.userId);
        const currentUserId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && resourceUserId !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado',
                details: 'Solo puedes acceder a tus propios recursos'
            });
        }

        next();
    });
};

// Middleware opcional de autenticación (no falla si no hay token)
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            req.user = null;
            return next();
        }

        const jwtSecret = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2023';
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        
    } catch (error) {
        req.user = null;
    }
    
    next();
};

module.exports = {
    authenticateToken,
    authenticateAdmin,
    authenticateOwnerOrAdmin,
    optionalAuth
};