const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/authJSON');
const { get, getById, create, update, destroy } = require('../controllers/NewsController');

const router = express.Router();

// Validaciones
const createNewsValidation = [
  body('titulo')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('El título debe tener entre 10 y 200 caracteres'),
  body('contenido')
    .trim()
    .isLength({ min: 100 })
    .withMessage('El contenido debe tener al menos 100 caracteres'),
  body('resumen')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('El resumen debe tener entre 20 y 300 caracteres'),
  body('categoria')
    .notEmpty()
    .withMessage('La categoría es obligatoria'),
  body('estado')
    .notEmpty()
    .withMessage('El estado es obligatorio'),
  body('fuente')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La fuente debe tener entre 2 y 100 caracteres')
];

// Middleware para validar datos
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Obtener todas las noticias aprobadas
 *     tags: [Noticias]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado de México
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de noticias por página
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *         description: Buscar en título y contenido
 *     responses:
 *       200:
 *         description: Lista de noticias obtenida exitosamente
 */
router.get('/', get);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Obtener una noticia por su ID
 *     tags: [Noticias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la noticia
 *     responses:
 *       200:
 *         description: Noticia obtenida exitosamente
 *       404:
 *         description: Noticia no encontrada
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Crear una nueva noticia
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - contenido
 *               - resumen
 *               - categoria
 *               - estado
 *               - fuente
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *               resumen:
 *                 type: string
 *               categoria:
 *                 type: string
 *               estado:
 *                 type: string
 *               fuente:
 *                 type: string
 *               imagenUrl:
 *                 type: string
 *               etiquetas:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Noticia creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', auth, createNewsValidation, validateInput, create);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Actualizar una noticia por su ID
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la noticia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *               resumen:
 *                 type: string
 *               categoria:
 *                 type: string
 *               estado:
 *                 type: string
 *               fuente:
 *                 type: string
 *               imagenUrl:
 *                 type: string
 *               etiquetas:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Noticia actualizada exitosamente
 *       403:
 *         description: No tienes permisos para actualizar esta noticia
 *       404:
 *         description: Noticia no encontrada
 */
router.put('/:id', auth, createNewsValidation, validateInput, update);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Eliminar una noticia por su ID
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la noticia a eliminar
 *     responses:
 *       200:
 *         description: Noticia eliminada exitosamente
 *       403:
 *         description: No tienes permisos para eliminar esta noticia
 *       404:
 *         description: Noticia no encontrada
 */
router.delete('/:id', auth, destroy);

module.exports = router;