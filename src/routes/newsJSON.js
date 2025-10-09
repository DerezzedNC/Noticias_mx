const express = require('express');
const { body, validationResult, query } = require('express-validator');
const News = require('../models/NewsJSON');
const { auth } = require('../middleware/authJSON');

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

// @route   GET /api/news
// @desc    Obtener todas las noticias (solo aprobadas para usuarios normales)
// @access  Public
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     noticias:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/News'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         page:
 *                           type: number
 *                         pages:
 *                           type: number
 *                         limit:
 *                           type: number
 */
router.get('/', async (req, res) => {
  try {
    const { categoria, estado, page = 1, limit = 10, buscar } = req.query;

    // Construir filtros
    let filtros = { 
      activa: true 
    };

    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;

    let noticias;
    
    // Si hay búsqueda de texto
    if (buscar) {
      filtros.$text = { $search: buscar };
    }

    const opciones = {
      sort: { fechaPublicacion: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    noticias = await News.find(filtros, opciones);
    
    // Poblar referencias
    noticias = await News.populate(noticias, [
      { path: 'autor', select: 'nombre' },
      { path: 'categoria', select: 'nombre color' },
      { path: 'estado', select: 'nombre codigo' }
    ]);

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
router.get('/pendientes', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const opciones = {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    let noticias = await News.find({ estadoVerificacion: 'pendiente' }, opciones);
    
    // Poblar referencias
    noticias = await News.populate(noticias, [
      { path: 'autor', select: 'nombre email' },
      { path: 'categoria', select: 'nombre' },
      { path: 'estado', select: 'nombre' }
    ]);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: Noticia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    let noticia = await News.findById(req.params.id);

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Poblar referencias
    noticia = await News.populate(noticia, [
      { path: 'autor', select: 'nombre' },
      { path: 'categoria', select: 'nombre color descripcion' },
      { path: 'estado', select: 'nombre codigo region' },
      { path: 'verificadoPor', select: 'nombre' }
    ]);

    // Incrementar visitas
    await News.updateById(req.params.id, { visitas: noticia.visitas + 1 });

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
 *                 minLength: 10
 *                 maxLength: 200
 *                 description: Título de la noticia
 *               contenido:
 *                 type: string
 *                 minLength: 100
 *                 description: Contenido completo de la noticia
 *               resumen:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 300
 *                 description: Resumen de la noticia
 *               categoria:
 *                 type: string
 *                 description: ID de la categoría
 *               estado:
 *                 type: string
 *                 description: ID del estado
 *               fuente:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Fuente de la noticia
 *               imagenUrl:
 *                 type: string
 *                 description: URL de la imagen (opcional)
 *               etiquetas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Etiquetas de la noticia (opcional)
 *             example:
 *               titulo: "Nueva infraestructura en Ciudad de México"
 *               contenido: "El gobierno de la Ciudad de México anunció una inversión millonaria para mejorar la infraestructura urbana..."
 *               resumen: "Inversión millonaria para infraestructura urbana en CDMX"
 *               categoria: "507f1f77bcf86cd799439011"
 *               estado: "507f1f77bcf86cd799439012"
 *               fuente: "Gobierno CDMX"
 *               imagenUrl: "https://example.com/imagen.jpg"
 *               etiquetas: ["infraestructura", "cdmx", "gobierno"]
 *     responses:
 *       201:
 *         description: Noticia creada exitosamente
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
 *                   $ref: '#/components/schemas/News'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', auth, createNewsValidation, async (req, res) => {
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

    let nuevaNoticia = await News.create({
      titulo,
      contenido,
      resumen,
      autor: req.user._id,
      categoria,
      estado,
      fuente,
      imagenUrl,
      etiquetas: etiquetas || [],
      estadoVerificacion: 'aprobada',
      fechaPublicacion: new Date(),
      verificadoPor: req.user._id,
      fechaVerificacion: new Date()
    });

    // Poblar referencias
    nuevaNoticia = await News.populate(nuevaNoticia, [
      { path: 'autor', select: 'nombre' },
      { path: 'categoria', select: 'nombre' },
      { path: 'estado', select: 'nombre' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Noticia creada y publicada exitosamente.',
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
router.put('/:id/verificar', auth, [
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

    const updates = {
      verificadoPor: req.user._id,
      fechaVerificacion: new Date()
    };

    if (accion === 'aprobar') {
      updates.estadoVerificacion = 'aprobada';
      updates.fechaPublicacion = new Date();
    } else {
      updates.estadoVerificacion = 'rechazada';
      updates.motivoRechazo = motivoRechazo;
    }

    let noticiaActualizada = await News.updateById(req.params.id, updates);
    
    // Poblar referencias
    noticiaActualizada = await News.populate(noticiaActualizada, [
      { path: 'autor', select: 'nombre email' },
      { path: 'verificadoPor', select: 'nombre' }
    ]);

    res.json({
      success: true,
      message: `Noticia ${accion === 'aprobar' ? 'aprobada' : 'rechazada'} exitosamente`,
      data: { noticia: noticiaActualizada }
    });

  } catch (error) {
    console.error('Error verificando noticia:', error);
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

    const opciones = {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    let noticias = await News.find({ autor: req.user._id }, opciones);
    
    // Poblar referencias
    noticias = await News.populate(noticias, [
      { path: 'categoria', select: 'nombre' },
      { path: 'estado', select: 'nombre' }
    ]);

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

// @route   PUT /api/news/:id
// @desc    Actualizar noticia (solo el autor o admin)
// @access  Private
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
 *                 minLength: 10
 *                 maxLength: 200
 *               contenido:
 *                 type: string
 *                 minLength: 100
 *               resumen:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 300
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
 *             example:
 *               titulo: "Título actualizado de la noticia"
 *               contenido: "Contenido actualizado..."
 *               resumen: "Resumen actualizado"
 *     responses:
 *       200:
 *         description: Noticia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       403:
 *         description: No tienes permisos para actualizar esta noticia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Noticia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', auth, createNewsValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const noticia = await News.findById(req.params.id);

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Solo el autor o admin pueden actualizar
    if (noticia.autor.toString() !== req.user._id.toString() && req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar esta noticia'
      });
    }

    const { titulo, contenido, resumen, categoria, estado, fuente, imagenUrl, etiquetas } = req.body;

    const datosActualizacion = {
      titulo,
      contenido, 
      resumen,
      categoria,
      estado,
      fuente,
      imagenUrl,
      etiquetas,
      updatedAt: new Date()
    };

    // Si no es admin, resetear verificación
    if (req.user.rol !== 'administrador') {
      datosActualizacion.estadoVerificacion = 'pendiente';
    }

    const noticiaActualizada = await News.updateById(req.params.id, datosActualizacion);

    res.json({
      success: true,
      message: 'Noticia actualizada exitosamente',
      data: noticiaActualizada
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       403:
 *         description: No tienes permisos para eliminar esta noticia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Noticia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
    if (noticia.autor !== req.user._id && req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta noticia'
      });
    }

    await News.deleteById(req.params.id);

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

module.exports = router;