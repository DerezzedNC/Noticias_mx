const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/CategoryJSON');
const { auth } = require('../middleware/authJSON');

const router = express.Router();

// Validaciones
const categoryValidation = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('descripcion')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('La descripción debe tener entre 10 y 200 caracteres'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('El color debe ser un código hexadecimal válido')
];

// @route   GET /api/categories
// @desc    Obtener todas las categorías activas
// @access  Public
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', async (req, res) => {
  try {
    const categorias = await Category.find({ activa: true }, { sort: { nombre: 1 } });

    res.json({
      success: true,
      data: { categorias }
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/categories/all
// @desc    Obtener todas las categorías (incluyendo inactivas)
// @access  Private (Solo admin)
router.get('/all', auth, async (req, res) => {
  try {
    const categorias = await Category.find({}, { sort: { nombre: 1 } });

    res.json({
      success: true,
      data: { categorias }
    });

  } catch (error) {
    console.error('Error obteniendo todas las categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Obtener una categoría por ID
// @access  Public
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: { categoria }
    });

  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/categories
// @desc    Crear nueva categoría
// @access  Private (Solo admin)
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Nombre de la categoría
 *               descripcion:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 description: Descripción de la categoría
 *               color:
 *                 type: string
 *                 pattern: '^#[0-9A-F]{6}$'
 *                 description: Color en formato hexadecimal (opcional)
 *             example:
 *               nombre: "Tecnología"
 *               descripcion: "Noticias relacionadas con tecnología e innovación"
 *               color: "#FF5733"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado (solo administradores)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', auth, categoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { nombre, descripcion, color } = req.body;

    const nuevaCategoria = await Category.create({
      nombre,
      descripcion,
      color: color || '#007bff'
    });

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: { categoria: nuevaCategoria }
    });

  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Actualizar categoría
// @access  Private (Solo admin)
router.put('/:id', auth, [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('La descripción debe tener entre 10 y 200 caracteres'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('El color debe ser un código hexadecimal válido'),
  body('activa')
    .optional()
    .isBoolean()
    .withMessage('El campo activa debe ser verdadero o falso')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const categoria = await Category.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    const { nombre, descripcion, color, activa } = req.body;

    // Verificar nombre único si se está cambiando
    if (nombre && nombre !== categoria.nombre) {
      const categoriaExistente = await Category.findOne({ 
        nombre: { $regex: `^${nombre}$`, $options: 'i' }
      });

      if (categoriaExistente && categoriaExistente._id !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    // Preparar actualizaciones
    const updates = {};
    if (nombre !== undefined) updates.nombre = nombre;
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (color !== undefined) updates.color = color;
    if (activa !== undefined) updates.activa = activa;

    const categoriaActualizada = await Category.updateById(req.params.id, updates);

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: { categoria: categoriaActualizada }
    });

  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Eliminar categoría
// @access  Private (Solo admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar si hay noticias asociadas a esta categoría
    const News = require('../models/NewsJSON');
    const noticiasAsociadas = await News.countDocuments({ categoria: req.params.id });

    if (noticiasAsociadas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${noticiasAsociadas} noticia(s) asociada(s)`
      });
    }

    await Category.deleteById(req.params.id);

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PATCH /api/categories/:id/toggle
// @desc    Activar/desactivar categoría
// @access  Private (Solo admin)
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    const categoriaActualizada = await Category.updateById(req.params.id, { 
      activa: !categoria.activa 
    });

    res.json({
      success: true,
      message: `Categoría ${categoriaActualizada.activa ? 'activada' : 'desactivada'} exitosamente`,
      data: { categoria: categoriaActualizada }
    });

  } catch (error) {
    console.error('Error cambiando estado de categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;