const State = require('../models/StateJSON');
const { validationResult } = require('express-validator');

const get = async (request, response) => {
  try {
    const { nombre, abreviacion } = request.query;
    const filters = {};

    if (nombre) {
      filters.nombre = { $regex: nombre, $options: 'i' };
    }
    if (abreviacion) {
      filters.abreviacion = { $regex: abreviacion, $options: 'i' };
    }

    const estados = await State.find(filters, { sort: { nombre: 1 } });
    response.json(estados);

  } catch (error) {
    console.log(error);
    response.status(500).send('Error consultando los datos');
  }
}

const getById = async (request, response) => {
  try {
    const id = request.params.id;
    const estado = await State.findById(id);

    if (estado) {
      response.json(estado);
    } else {
      response.status(404).send('Recurso no encontrado');
    }

  } catch (error) {
    response.status(500).send('Error al consultar el dato');
  }
}

const create = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    const nuevoEstado = await State.create(request.body);
    response.status(201).json(nuevoEstado);

  } catch (error) {
    console.log(error);
    response.status(500).send('Error al crear');
  }
}

const update = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    const id = request.params.id;
    const estado = await State.findById(id);

    if (!estado) {
      return response.status(404).send('Recurso no encontrado');
    }

    const estadoActualizado = await State.update(id, request.body);
    response.json(estadoActualizado);

  } catch (error) {
    console.log(error);
    response.status(500).send('Error al actualizar');
  }
}

const destroy = async (request, response) => {
  try {
    const id = request.params.id;
    const estado = await State.findById(id);

    if (!estado) {
      return response.status(404).send('Recurso no encontrado');
    }

    await State.delete(id);
    response.status(200).send('Estado eliminado exitosamente');

  } catch (error) {
    console.log(error);
    response.status(500).send('Error al eliminar');
  }
}

module.exports = {
  get,
  getById,
  create,
  update,
  destroy
};