const News = require('../models/NewsJSON');
const Category = require('../models/CategoryJSON');
const State = require('../models/StateJSON');
const User = require('../models/UserJSON');
const { validationResult } = require('express-validator');

const get = async (request, response) => {
  try {
    const { titulo, activo } = request.query;
    const filters = {};

    if (titulo) {
      filters.titulo = { $regex: titulo, $options: 'i' };
    }
    if (activo) {
      filters.activa = activo === 'true';
    }

    const noticias = await News.find(filters, { sort: { fechaPublicacion: -1 } });
    
    // Poblar relaciones manualmente
    const noticiasCompletas = await Promise.all(noticias.map(async (noticia) => {
      const categoria = noticia.categoria ? await Category.findById(noticia.categoria) : null;
      const estado = noticia.estado ? await State.findById(noticia.estado) : null;
      const usuario = noticia.autor ? await User.findById(noticia.autor) : null;

      return {
        ...noticia,
        categoria: categoria ? { id: categoria._id, nombre: categoria.nombre, descripcion: categoria.descripcion } : null,
        estado: estado ? { id: estado._id, nombre: estado.nombre, abreviacion: estado.codigo } : null,
        usuario: usuario ? { 
          id: usuario._id, 
          nick: usuario.nick || usuario.email, 
          nombre: usuario.nombre,
          perfil: { id: usuario._id, nombre: usuario.nombre } // Simulando perfil
        } : null
      };
    }));

    response.json(noticiasCompletas);

  } catch (error) {
    console.log(error);
    response.status(500).send('Error consultando los datos');
  }
};

const getById = async (request, response) => {
  try {
    const id = request.params.id;
    const noticia = await News.findById(id);

    if (noticia) {
      // Poblar relaciones manualmente
      const categoria = noticia.categoria ? await Category.findById(noticia.categoria) : null;
      const estado = noticia.estado ? await State.findById(noticia.estado) : null;
      const usuario = noticia.autor ? await User.findById(noticia.autor) : null;

      const noticiaCompleta = {
        ...noticia,
        categoria: categoria ? { id: categoria._id, nombre: categoria.nombre, descripcion: categoria.descripcion } : null,
        estado: estado ? { id: estado._id, nombre: estado.nombre, abreviacion: estado.codigo } : null,
        usuario: usuario ? { 
          id: usuario._id, 
          nick: usuario.nick || usuario.email, 
          nombre: usuario.nombre,
          perfil: { id: usuario._id, nombre: usuario.nombre } // Simulando perfil
        } : null
      };

      // Incrementar visitas
      await News.updateById(id, { visitas: noticia.visitas + 1 });

      response.json(noticiaCompleta);
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

    // Agregar datos automáticos
    const datosNoticia = {
      ...request.body,
      autor: request.user ? request.user._id : null,
      estadoVerificacion: 'aprobada',
      fechaPublicacion: new Date(),
      verificadoPor: request.user ? request.user._id : null,
      fechaVerificacion: new Date(),
      visitas: 0,
      activa: true
    };

    const nuevaNoticia = await News.create(datosNoticia);
    response.status(201).json(nuevaNoticia);

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

    const id = request.params.id;
    const datosActualizacion = {
      ...request.body,
      updatedAt: new Date()
    };

    const resultado = await News.updateById(id, datosActualizacion);
    
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
    const resultado = await News.deleteById(id);
    
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