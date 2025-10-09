const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { auth, isAdmin } = require('../middleware/auth');

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
router.get('/', async (req, res) => {
  try {
    const categorias = await Category.find({ activa: true })
      .sort({ nombre: 1 });

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
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const categorias = await Category.find()
      .sort({ nombre: 1 });

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
router.post('/', auth, isAdmin, categoryValidation, async (req, res) => {
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

    // Verificar si ya existe una categoría con ese nombre
    const categoriaExistente = await Category.findOne({ 
      nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } 
    });

    if (categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const nuevaCategoria = new Category({
      nombre,
      descripcion,
      color: color || '#007bff'
    });

    await nuevaCategoria.save();

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: { categoria: nuevaCategoria }
    });

  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Actualizar categoría
// @access  Private (Solo admin)
router.put('/:id', auth, isAdmin, [
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

    // Si se está actualizando el nombre, verificar que no exista otra categoría con ese nombre
    if (nombre && nombre !== categoria.nombre) {
      const categoriaExistente = await Category.findOne({ 
        nombre: { $regex: new RegExp(`^${nombre}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (categoriaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    // Actualizar campos
    if (nombre !== undefined) categoria.nombre = nombre;
    if (descripcion !== undefined) categoria.descripcion = descripcion;
    if (color !== undefined) categoria.color = color;
    if (activa !== undefined) categoria.activa = activa;

    await categoria.save();

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: { categoria }
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
// @desc    Eliminar categoría (soft delete)
// @access  Private (Solo admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar si hay noticias asociadas a esta categoría
    const News = require('../models/News');
    const noticiasAsociadas = await News.countDocuments({ categoria: req.params.id });

    if (noticiasAsociadas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${noticiasAsociadas} noticia(s) asociada(s)`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

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
router.patch('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    categoria.activa = !categoria.activa;
    await categoria.save();

    res.json({
      success: true,
      message: `Categoría ${categoria.activa ? 'activada' : 'desactivada'} exitosamente`,
      data: { categoria }
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