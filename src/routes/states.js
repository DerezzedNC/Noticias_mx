const express = require('express');
const { body, validationResult } = require('express-validator');
const State = require('../models/State');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Validaciones
const stateValidation = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('codigo')
    .trim()
    .isLength({ min: 2, max: 5 })
    .isAlpha()
    .withMessage('El código debe tener entre 2 y 5 caracteres alfabéticos'),
  body('region')
    .isIn(['Norte', 'Centro', 'Sur', 'Occidente', 'Oriente'])
    .withMessage('La región debe ser Norte, Centro, Sur, Occidente u Oriente')
];

// @route   GET /api/states
// @desc    Obtener todos los estados activos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { region } = req.query;
    
    let filtros = { activo: true };
    if (region) {
      filtros.region = region;
    }

    const estados = await State.find(filtros)
      .sort({ nombre: 1 });

    // Agrupar por región si no se especifica una región
    if (!region) {
      const estadosPorRegion = estados.reduce((acc, estado) => {
        if (!acc[estado.region]) {
          acc[estado.region] = [];
        }
        acc[estado.region].push(estado);
        return acc;
      }, {});

      return res.json({
        success: true,
        data: { 
          estados,
          estadosPorRegion
        }
      });
    }

    res.json({
      success: true,
      data: { estados }
    });

  } catch (error) {
    console.error('Error obteniendo estados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/states/all
// @desc    Obtener todos los estados (incluyendo inactivos)
// @access  Private (Solo admin)
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const estados = await State.find()
      .sort({ region: 1, nombre: 1 });

    res.json({
      success: true,
      data: { estados }
    });

  } catch (error) {
    console.error('Error obteniendo todos los estados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/states/regiones
// @desc    Obtener lista de regiones disponibles
// @access  Public
router.get('/regiones', async (req, res) => {
  try {
    const regiones = ['Norte', 'Centro', 'Sur', 'Occidente', 'Oriente'];
    
    res.json({
      success: true,
      data: { regiones }
    });

  } catch (error) {
    console.error('Error obteniendo regiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/states/:id
// @desc    Obtener un estado por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const estado = await State.findById(req.params.id);

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado no encontrado'
      });
    }

    res.json({
      success: true,
      data: { estado }
    });

  } catch (error) {
    console.error('Error obteniendo estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/states
// @desc    Crear nuevo estado
// @access  Private (Solo admin)
router.post('/', auth, isAdmin, stateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { nombre, codigo, region } = req.body;

    // Verificar si ya existe un estado con ese nombre o código
    const estadoExistente = await State.findOne({
      $or: [
        { nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } },
        { codigo: codigo.toUpperCase() }
      ]
    });

    if (estadoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un estado con ese nombre o código'
      });
    }

    const nuevoEstado = new State({
      nombre,
      codigo: codigo.toUpperCase(),
      region
    });

    await nuevoEstado.save();

    res.status(201).json({
      success: true,
      message: 'Estado creado exitosamente',
      data: { estado: nuevoEstado }
    });

  } catch (error) {
    console.error('Error creando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/states/:id
// @desc    Actualizar estado
// @access  Private (Solo admin)
router.put('/:id', auth, isAdmin, [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('codigo')
    .optional()
    .trim()
    .isLength({ min: 2, max: 5 })
    .isAlpha()
    .withMessage('El código debe tener entre 2 y 5 caracteres alfabéticos'),
  body('region')
    .optional()
    .isIn(['Norte', 'Centro', 'Sur', 'Occidente', 'Oriente'])
    .withMessage('La región debe ser Norte, Centro, Sur, Occidente u Oriente'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser verdadero o falso')
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

    const estado = await State.findById(req.params.id);

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado no encontrado'
      });
    }

    const { nombre, codigo, region, activo } = req.body;

    // Verificar unicidad si se está actualizando nombre o código
    if ((nombre && nombre !== estado.nombre) || (codigo && codigo.toUpperCase() !== estado.codigo)) {
      const estadoExistente = await State.findOne({
        $or: [
          nombre ? { nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } } : null,
          codigo ? { codigo: codigo.toUpperCase() } : null
        ].filter(Boolean),
        _id: { $ne: req.params.id }
      });

      if (estadoExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un estado con ese nombre o código'
        });
      }
    }

    // Actualizar campos
    if (nombre !== undefined) estado.nombre = nombre;
    if (codigo !== undefined) estado.codigo = codigo.toUpperCase();
    if (region !== undefined) estado.region = region;
    if (activo !== undefined) estado.activo = activo;

    await estado.save();

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: { estado }
    });

  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/states/:id
// @desc    Eliminar estado
// @access  Private (Solo admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const estado = await State.findById(req.params.id);

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado no encontrado'
      });
    }

    // Verificar si hay noticias asociadas a este estado
    const News = require('../models/News');
    const noticiasAsociadas = await News.countDocuments({ estado: req.params.id });

    if (noticiasAsociadas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el estado porque tiene ${noticiasAsociadas} noticia(s) asociada(s)`
      });
    }

    await State.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Estado eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PATCH /api/states/:id/toggle
// @desc    Activar/desactivar estado
// @access  Private (Solo admin)
router.patch('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const estado = await State.findById(req.params.id);

    if (!estado) {
      return res.status(404).json({
        success: false,
        message: 'Estado no encontrado'
      });
    }

    estado.activo = !estado.activo;
    await estado.save();

    res.json({
      success: true,
      message: `Estado ${estado.activo ? 'activado' : 'desactivado'} exitosamente`,
      data: { estado }
    });

  } catch (error) {
    console.error('Error cambiando estado del estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;