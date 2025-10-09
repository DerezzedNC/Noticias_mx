const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/UserJSON');
const { auth } = require('../middleware/authJSON');

const router = express.Router();

// @route   GET /api/users
// @desc    Obtener todos los usuarios (solo admin)
// @access  Private (Solo admin)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, rol, estado } = req.query;

    let filtros = {};
    if (rol) filtros.rol = rol;
    if (estado) filtros.estado = estado;

    const opciones = {
      sort: { fechaRegistro: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const usuarios = await User.find(filtros, opciones);

    // Remover contraseñas
    const usuariosSinPassword = usuarios.map(user => {
      const userObj = { ...user };
      delete userObj.password;
      return userObj;
    });

    const total = await User.countDocuments(filtros);

    res.json({
      success: true,
      data: {
        usuarios: usuariosSinPassword,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Obtener estadísticas de usuarios
// @access  Private (Solo admin)
router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const usuariosActivos = await User.countDocuments({ estado: 'activo' });
    const contribuidores = await User.countDocuments({ rol: 'contribuidor' });
    const administradores = await User.countDocuments({ rol: 'administrador' });
    const usuariosSuspendidos = await User.countDocuments({ estado: 'suspendido' });

    // Usuarios registrados en los últimos 30 días
    const fecha30DiasAtras = new Date();
    fecha30DiasAtras.setDate(fecha30DiasAtras.getDate() - 30);
    
    const usuarios = await User.findAll();
    const nuevosUsuarios = usuarios.filter(user => 
      new Date(user.fechaRegistro) >= fecha30DiasAtras
    ).length;

    res.json({
      success: true,
      data: {
        total: totalUsuarios,
        activos: usuariosActivos,
        contribuidores,
        administradores,
        suspendidos: usuariosSuspendidos,
        nuevosUltimos30Dias: nuevosUsuarios
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Obtener un usuario por ID
// @access  Private (Solo admin o el mismo usuario)
router.get('/:id', auth, async (req, res) => {
  try {
    // Solo admin puede ver otros usuarios, cualquier usuario puede ver su propio perfil
    if (req.user.rol !== 'administrador' && req.user._id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este usuario'
      });
    }

    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Remover contraseña
    const usuarioSinPassword = { ...usuario };
    delete usuarioSinPassword.password;

    res.json({
      success: true,
      data: { usuario: usuarioSinPassword }
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/users
// @desc    Crear nuevo usuario (solo admin)
// @access  Private (Solo admin)
router.post('/', auth, [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Por favor ingresa un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .optional()
    .isIn(['contribuidor', 'administrador'])
    .withMessage('El rol debe ser contribuidor o administrador')
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

    const { nombre, email, password, rol = 'contribuidor' } = req.body;

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    // Retornar usuario sin contraseña
    const usuarioRespuesta = { ...nuevoUsuario };
    delete usuarioRespuesta.password;

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: { usuario: usuarioRespuesta }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Actualizar usuario
// @access  Private (Admin o el mismo usuario)
router.put('/:id', auth, [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Por favor ingresa un email válido'),
  body('rol')
    .optional()
    .isIn(['contribuidor', 'administrador'])
    .withMessage('El rol debe ser contribuidor o administrador'),
  body('estado')
    .optional()
    .isIn(['activo', 'inactivo', 'suspendido'])
    .withMessage('El estado debe ser activo, inactivo o suspendido')
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

    // Verificar permisos
    const esElMismoUsuario = req.user._id === req.params.id;
    const esAdmin = req.user.rol === 'administrador';

    if (!esAdmin && !esElMismoUsuario) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este usuario'
      });
    }

    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const { nombre, email, rol, estado } = req.body;

    // Solo admin puede cambiar rol y estado
    if (!esAdmin && (rol !== undefined || estado !== undefined)) {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden cambiar el rol y estado'
      });
    }

    // Verificar email único si se está cambiando
    if (email && email !== usuario.email) {
      const emailExistente = await User.findOne({ email });
      if (emailExistente && emailExistente._id !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con este email'
        });
      }
    }

    // Preparar actualizaciones
    const updates = {};
    if (nombre !== undefined) updates.nombre = nombre;
    if (email !== undefined) updates.email = email;
    if (rol !== undefined) updates.rol = rol;
    if (estado !== undefined) updates.estado = estado;

    const usuarioActualizado = await User.updateById(req.params.id, updates);

    // Retornar usuario sin contraseña
    const usuarioRespuesta = { ...usuarioActualizado };
    delete usuarioRespuesta.password;

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: { usuario: usuarioRespuesta }
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Eliminar usuario
// @access  Private (Solo admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir que un admin se elimine a sí mismo
    if (req.user._id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    // Verificar si el usuario tiene noticias asociadas
    const News = require('../models/NewsJSON');
    const noticiasAsociadas = await News.countDocuments({ autor: req.params.id });

    if (noticiasAsociadas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el usuario porque tiene ${noticiasAsociadas} noticia(s) asociada(s)`
      });
    }

    await User.deleteById(req.params.id);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PATCH /api/users/:id/toggle-estado
// @desc    Cambiar estado de usuario (activo/suspendido)
// @access  Private (Solo admin)
router.patch('/:id/toggle-estado', auth, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir suspender al propio admin
    if (req.user._id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes cambiar tu propio estado'
      });
    }

    // Alternar entre activo y suspendido
    const nuevoEstado = usuario.estado === 'activo' ? 'suspendido' : 'activo';
    const usuarioActualizado = await User.updateById(req.params.id, { estado: nuevoEstado });

    // Retornar usuario sin contraseña
    const usuarioRespuesta = { ...usuarioActualizado };
    delete usuarioRespuesta.password;

    res.json({
      success: true,
      message: `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'suspendido'} exitosamente`,
      data: { usuario: usuarioRespuesta }
    });

  } catch (error) {
    console.error('Error cambiando estado de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;