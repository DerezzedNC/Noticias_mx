const User = require('../models/UserJSON');
const { validationResult } = require('express-validator');

const get = async (request, response) => {
  try {
    const { nombre, nick } = request.query;
    const filters = {};

    if (nombre) {
      filters.nombre = { $regex: nombre, $options: 'i' };
    }
    if (nick) {
      filters.nick = { $regex: nick, $options: 'i' };
    }

    const usuarios = await User.find(filters, { sort: { fechaRegistro: -1 } });
    
    // Excluir contraseñas y agregar relación de perfil simulada
    const usuariosSinPassword = usuarios.map(usuario => {
      const { password, ...usuarioSinPassword } = usuario;
      return {
        ...usuarioSinPassword,
        perfil: { id: usuario._id, nombre: usuario.nombre } // Simulando relación con perfil
      };
    });

    response.json(usuariosSinPassword);

  } catch (error) {
    console.log(error);
    response.status(500).send('Error consultando los datos');
  }
};

const getById = async (request, response) => {
  try {
    const id = request.params.id;
    const usuario = await User.findById(id);

    if (usuario) {
      // Excluir contraseña y agregar relación de perfil simulada
      const { password, ...usuarioSinPassword } = usuario;
      const usuarioConPerfil = {
        ...usuarioSinPassword,
        perfil: { id: usuario._id, nombre: usuario.nombre } // Simulando relación con perfil
      };
      response.json(usuarioConPerfil);
    } else {
      response.status(404).send('Recurso no encontrado');
    }

  } catch (error) {
    response.status(500).send('Error al consultar el dato');
  }
};

const create = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    const bcrypt = require('bcryptjs');
    const { nombre, email, password } = request.body;

    // Verificar si ya existe un usuario con el mismo email
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return response.status(400).send('Ya existe un usuario con este email');
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      estado: 'activo'
    });

    // Excluir contraseña de la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    response.status(201).json(usuarioSinPassword);

  } catch (error) {
    console.log(error);
    response.status(500).send('Error al crear');
  }
};

const update = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    const bcrypt = require('bcryptjs');
    const id = request.params.id;
    const usuario = await User.findById(id);

    if (!usuario) {
      return response.status(404).send('Recurso no encontrado');
    }

    const { nombre, email, password } = request.body;

    // Si se está cambiando el email, verificar que no exista otro usuario
    if (email && email !== usuario.email) {
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
        return response.status(400).send('Ya existe un usuario con este email');
      }
    }

    const datosActualizacion = {
      ...request.body,
      updatedAt: new Date()
    };

    // Si se proporciona nueva contraseña, encriptarla
    if (password) {
      const saltRounds = 10;
      datosActualizacion.password = await bcrypt.hash(password, saltRounds);
    }

    const resultado = await User.updateById(id, datosActualizacion);
    
    if (resultado) {
      response.status(200).send('1 registro actualizado');
    } else {
      response.status(404).send('Recurso no encontrado');
    }

  } catch (error) {
    console.log(error);
    response.status(500).send('Error al actualizar');
  }
};

const destroy = async (request, response) => {
  try {
    const id = request.params.id;
    
    // Verificar si hay noticias creadas por este usuario
    const News = require('../models/NewsJSON');
    const noticiasDelUsuario = await News.find({ autor: id });
    
    if (noticiasDelUsuario.length > 0) {
      return response.status(400).send('No se puede eliminar el usuario porque tiene noticias asociadas');
    }

    const resultado = await User.deleteById(id);
    
    if (resultado) {
      response.status(200).send('1 registro eliminado');
    } else {
      response.status(404).send('Recurso no encontrado');
    }

  } catch (error) {
    console.log(error);
    response.status(500).send('Error al eliminar');
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  destroy
};