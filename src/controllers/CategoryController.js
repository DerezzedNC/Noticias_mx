const Category = require('../models/CategoryJSON');
const { validationResult } = require('express-validator');

const get = async (request, response) => {
  try {
    const { nombre, descripcion, activa } = request.query;
    const filters = {};

    if (nombre) {
      filters.nombre = { $regex: nombre, $options: 'i' };
    }
    if (descripcion) {
      filters.descripcion = { $regex: descripcion, $options: 'i' };
    }
    if (activa !== undefined) {
      filters.activa = activa === 'true';
    } else {
      filters.activa = true; // Por defecto solo mostrar categorías activas
    }

    const categorias = await Category.find(filters, { sort: { nombre: 1 } });
    response.json(categorias);

  } catch (error) {
    console.log(error);
    response.status(500).send('Error consultando los datos');
  }
};

const getById = async (request, response) => {
  try {
    const id = request.params.id;
    const categoria = await Category.findById(id);

    if (categoria) {
      response.json(categoria);
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

    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await Category.findOne({ nombre: request.body.nombre });
    if (categoriaExistente) {
      return response.status(400).send('Ya existe una categoría con este nombre');
    }

    const datosCategoria = {
      ...request.body,
      color: request.body.color || '#007bff',
      activa: true
    };

    const nuevaCategoria = await Category.create(datosCategoria);
    response.status(201).json(nuevaCategoria);

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
    const categoria = await Category.findById(id);

    if (!categoria) {
      return response.status(404).send('Recurso no encontrado');
    }

    // Si se está cambiando el nombre, verificar que no exista otra categoría con ese nombre
    if (request.body.nombre && request.body.nombre !== categoria.nombre) {
      const categoriaExistente = await Category.findOne({ nombre: request.body.nombre });
      if (categoriaExistente) {
        return response.status(400).send('Ya existe una categoría con este nombre');
      }
    }

    const datosActualizacion = {
      ...request.body,
      updatedAt: new Date()
    };

    const resultado = await Category.updateById(id, datosActualizacion);
    
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
    
    // Verificar si hay noticias usando esta categoría
    const News = require('../models/NewsJSON');
    const noticiasConCategoria = await News.find({ categoria: id });
    
    if (noticiasConCategoria.length > 0) {
      return response.status(400).send('No se puede eliminar la categoría porque tiene noticias asociadas');
    }

    const resultado = await Category.deleteById(id);
    
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