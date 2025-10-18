const { check } = require('express-validator');

const validatorUserCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos').optional()
        .isString().withMessage('El campo apellido debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick').optional()
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres'),

    check('email').notEmpty().withMessage('El campo email es obligatorio')
        .isEmail().withMessage('Debe ser un email valido'),

    check('password').notEmpty().withMessage('El campo password es obligatorio')
        .isString().withMessage('El campo password debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),
];

const validatorUserUpdate = [
    check('nombre').optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos').optional()
        .isString().withMessage('El campo apellido debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick').optional()
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres'),

    check('email').optional()
        .isEmail().withMessage('Debe ser un email valido'),

    check('password').optional()
        .isString().withMessage('El campo password debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),
];

module.exports = {
    validatorUserCreate,
    validatorUserUpdate
}