const express = require('express');
const { body, validationResult, query } = require('express-validator');
const News = require('../models/News');
const { auth, isAdmin, isContribuidor } = require('../middleware/auth');

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
    .isMongoId()
    .withMessage('ID de categoría inválido'),
  body('estado')
    .isMongoId()
    .withMessage('ID de estado inválido'),
  body('fuente')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La fuente debe tener entre 2 y 100 caracteres')
];

// @route   GET /api/news
// @desc    Obtener todas las noticias (solo aprobadas para usuarios normales)
// @access  Public
router.get('/', [
  query('categoria').optional().isMongoId().withMessage('ID de categoría inválido'),
  query('estado').optional().isMongoId().withMessage('ID de estado inválido'),
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('El límite debe estar entre 1 y 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros de consulta inválidos',
        errors: errors.array()
      });
    }

    const { categoria, estado, page = 1, limit = 10, buscar } = req.query;

    // Construir filtros
    let filtros = { 
      estadoVerificacion: 'aprobada',
      activa: true 
    };

    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;

    // Si hay búsqueda de texto
    if (buscar) {
      filtros.$text = { $search: buscar };
    }

    const opciones = {
      populate: [
        { path: 'autor', select: 'nombre' },
        { path: 'categoria', select: 'nombre color' },
        { path: 'estado', select: 'nombre codigo' }
      ],
      sort: { fechaPublicacion: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const noticias = await News.find(filtros, null, opciones);
    const total = await News.countDocuments(filtros);

    res.json({
      success: true,
      data: {
        noticias,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo noticias:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/pendientes
// @desc    Obtener noticias pendientes de verificación
// @access  Private (Solo admin)
router.get('/pendientes', auth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const noticias = await News.find({ estadoVerificacion: 'pendiente' })
      .populate('autor', 'nombre email')
      .populate('categoria', 'nombre')
      .populate('estado', 'nombre')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await News.countDocuments({ estadoVerificacion: 'pendiente' });

    res.json({
      success: true,
      data: {
        noticias,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo noticias pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/:id
// @desc    Obtener una noticia por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const noticia = await News.findById(req.params.id)
      .populate('autor', 'nombre')
      .populate('categoria', 'nombre color descripcion')
      .populate('estado', 'nombre codigo region')
      .populate('verificadoPor', 'nombre');

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Solo mostrar noticias aprobadas a usuarios no autenticados
    if (noticia.estadoVerificacion !== 'aprobada' && !req.user) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Incrementar visitas
    if (noticia.estadoVerificacion === 'aprobada') {
      noticia.visitas += 1;
      await noticia.save();
    }

    res.json({
      success: true,
      data: { noticia }
    });

  } catch (error) {
    console.error('Error obteniendo noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/news
// @desc    Crear nueva noticia
// @access  Private (Contribuidor)
router.post('/', auth, isContribuidor, createNewsValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { titulo, contenido, resumen, categoria, estado, fuente, imagenUrl, etiquetas } = req.body;

    const nuevaNoticia = new News({
      titulo,
      contenido,
      resumen,
      autor: req.user._id,
      categoria,
      estado,
      fuente,
      imagenUrl,
      etiquetas: etiquetas || []
    });

    await nuevaNoticia.save();
    await nuevaNoticia.populate([
      { path: 'autor', select: 'nombre' },
      { path: 'categoria', select: 'nombre' },
      { path: 'estado', select: 'nombre' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Noticia creada exitosamente. Pendiente de verificación.',
      data: { noticia: nuevaNoticia }
    });

  } catch (error) {
    console.error('Error creando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/news/:id/verificar
// @desc    Aprobar o rechazar una noticia
// @access  Private (Solo admin)
router.put('/:id/verificar', auth, isAdmin, [
  body('accion')
    .isIn(['aprobar', 'rechazar'])
    .withMessage('La acción debe ser aprobar o rechazar'),
  body('motivoRechazo')
    .if(body('accion').equals('rechazar'))
    .notEmpty()
    .withMessage('El motivo de rechazo es obligatorio')
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

    const { accion, motivoRechazo } = req.body;
    
    const noticia = await News.findById(req.params.id);
    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    if (noticia.estadoVerificacion !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Esta noticia ya ha sido verificada'
      });
    }

    if (accion === 'aprobar') {
      noticia.estadoVerificacion = 'aprobada';
      noticia.fechaPublicacion = new Date();
    } else {
      noticia.estadoVerificacion = 'rechazada';
      noticia.motivoRechazo = motivoRechazo;
    }

    noticia.verificadoPor = req.user._id;
    noticia.fechaVerificacion = new Date();

    await noticia.save();
    await noticia.populate([
      { path: 'autor', select: 'nombre email' },
      { path: 'verificadoPor', select: 'nombre' }
    ]);

    res.json({
      success: true,
      message: `Noticia ${accion === 'aprobar' ? 'aprobada' : 'rechazada'} exitosamente`,
      data: { noticia }
    });

  } catch (error) {
    console.error('Error verificando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/news/:id
// @desc    Actualizar noticia (solo el autor o admin)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const noticia = await News.findById(req.params.id);
    
    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Verificar permisos
    if (noticia.autor.toString() !== req.user._id.toString() && req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta noticia'
      });
    }

    // No permitir editar noticias aprobadas a menos que sea admin
    if (noticia.estadoVerificacion === 'aprobada' && req.user.rol !== 'administrador') {
      return res.status(400).json({
        success: false,
        message: 'No se pueden editar noticias ya aprobadas'
      });
    }

    const camposPermitidos = ['titulo', 'contenido', 'resumen', 'imagenUrl', 'etiquetas'];
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        noticia[campo] = req.body[campo];
      }
    });

    // Si se edita una noticia aprobada, volver a pendiente
    if (noticia.estadoVerificacion === 'aprobada') {
      noticia.estadoVerificacion = 'pendiente';
      noticia.fechaPublicacion = null;
      noticia.verificadoPor = null;
      noticia.fechaVerificacion = null;
    }

    await noticia.save();

    res.json({
      success: true,
      message: 'Noticia actualizada exitosamente',
      data: { noticia }
    });

  } catch (error) {
    console.error('Error actualizando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/news/:id
// @desc    Eliminar noticia (solo el autor o admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const noticia = await News.findById(req.params.id);
    
    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Verificar permisos
    if (noticia.autor.toString() !== req.user._id.toString() && req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta noticia'
      });
    }

    await News.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/user/mis-noticias
// @desc    Obtener noticias del usuario autenticado
// @access  Private
router.get('/user/mis-noticias', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const noticias = await News.find({ autor: req.user._id })
      .populate('categoria', 'nombre')
      .populate('estado', 'nombre')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await News.countDocuments({ autor: req.user._id });

    res.json({
      success: true,
      data: {
        noticias,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo mis noticias:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;