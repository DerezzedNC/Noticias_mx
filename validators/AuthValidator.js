const { check } = require('express-validator');

// Validaciones para registro de usuario
const validatorAuthRegister = [
    check('username')
        .notEmpty().withMessage('El username es obligatorio')
        .isString().withMessage('El username debe ser texto')
        .isLength({ min: 3, max: 30 }).withMessage('El username debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('El username solo puede contener letras, números y guiones bajos'),

    check('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido')
        .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres'),

    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isString().withMessage('La contraseña debe ser texto')
        .isLength({ min: 8, max: 128 }).withMessage('La contraseña debe tener entre 8 y 128 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&)'),

    check('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('El rol debe ser "user" o "admin"')
];

// Validaciones para login
const validatorAuthLogin = [
    check('username')
        .notEmpty().withMessage('Username o email es obligatorio')
        .isString().withMessage('Username o email debe ser texto')
        .isLength({ min: 3, max: 100 }).withMessage('Username o email debe tener entre 3 y 100 caracteres'),

    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isString().withMessage('La contraseña debe ser texto')
        .isLength({ min: 1, max: 128 }).withMessage('Contraseña inválida')
];

// Validaciones para cambio de contraseña
const validatorAuthChangePassword = [
    check('currentPassword')
        .notEmpty().withMessage('La contraseña actual es obligatoria')
        .isString().withMessage('La contraseña actual debe ser texto'),

    check('newPassword')
        .notEmpty().withMessage('La nueva contraseña es obligatoria')
        .isString().withMessage('La nueva contraseña debe ser texto')
        .isLength({ min: 8, max: 128 }).withMessage('La nueva contraseña debe tener entre 8 y 128 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La nueva contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&)')
];

// Validaciones para actualizar perfil
const validatorAuthUpdateProfile = [
    check('username')
        .optional()
        .isString().withMessage('El username debe ser texto')
        .isLength({ min: 3, max: 30 }).withMessage('El username debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('El username solo puede contener letras, números y guiones bajos'),

    check('email')
        .optional()
        .isEmail().withMessage('Debe ser un email válido')
        .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres'),

    check('firstName')
        .optional()
        .isString().withMessage('El nombre debe ser texto')
        .isLength({ min: 1, max: 50 }).withMessage('El nombre debe tener entre 1 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),

    check('lastName')
        .optional()
        .isString().withMessage('El apellido debe ser texto')
        .isLength({ min: 1, max: 50 }).withMessage('El apellido debe tener entre 1 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios')
];

module.exports = {
    validatorAuthRegister,
    validatorAuthLogin,
    validatorAuthChangePassword,
    validatorAuthUpdateProfile
}