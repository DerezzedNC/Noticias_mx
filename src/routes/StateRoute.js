var express = require('express');

const {get, getById, create, update, destroy}  = require('../controllers/StateController');
const {validatorStateRequire, validatorStateOptional} = require('../../validators/StateValidator')
const api = express.Router();

/**
 * @swagger
 * /api/estados:
 *   get:
 *     summary: Obtener todos los estados de México
 *     tags: [Estados]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del estado
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Filtrar por código del estado
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filtrar por región
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *     responses:
 *       200:
 *         description: Lista de estados
 */
api.get('/estados', get);

/**
 * @swagger
 * /api/estados/{id}:
 *   get:
 *     summary: Obtener estado por ID
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Estado encontrado
 *       404:
 *         description: Estado no encontrado
 */
api.get('/estados/:id', getById)

/**
 * @swagger
 * /api/estados:
 *   post:
 *     summary: Crear nuevo estado
 *     tags: [Estados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - codigo
 *               - region
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               region:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estado creado exitosamente
 *       400:
 *         description: Ya existe un estado con este nombre o código
 */
api.post('/estados', validatorStateRequire, create)

/**
 * @swagger
 * /api/estados/{id}:
 *   put:
 *     summary: Actualizar estado
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               region:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Estado no encontrado
 */
api.put('/estados/:id', validatorStateOptional, update)

/**
 * @swagger
 * /api/estados/{id}:
 *   delete:
 *     summary: Eliminar estado
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado eliminado
 *       400:
 *         description: No se puede eliminar porque tiene noticias asociadas
 *       404:
 *         description: Estado no encontrado
 */
api.delete('/estados/:id', destroy)

module.exports = api;