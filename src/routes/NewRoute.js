const express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/NewsController');
const { validatorNewCreate, validatorNewUpdate } = require('../../validators/NewValidator');

const api = express.Router();

/**
 * @swagger
 * /api/noticias:
 *   get:
 *     summary: Obtener todas las noticias con relaciones automáticas
 *     tags: [Noticias]
 *     description: Devuelve noticias con categoria, estado y usuario completos
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Filtrar por título de noticia
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *     responses:
 *       200:
 *         description: Lista de noticias con relaciones completas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   contenido:
 *                     type: string
 *                   categoria:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                   estado:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       abreviacion:
 *                         type: string
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nick:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       perfil:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           nombre:
 *                             type: string
 */
api.get('/noticias', get);

/**
 * @swagger
 * /api/noticias/{id}:
 *   get:
 *     summary: Obtener noticia por ID con relaciones
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
 *         description: Noticia encontrada con relaciones
 *       404:
 *         description: Noticia no encontrada
 */
api.get('/noticias/:id', getById)

/**
 * @swagger
 * /api/noticias:
 *   post:
 *     summary: Crear nueva noticia
 *     tags: [Noticias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - contenido
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *               categoria:
 *                 type: string
 *                 description: ID de la categoría
 *               estado:
 *                 type: string
 *                 description: ID del estado
 *     responses:
 *       201:
 *         description: Noticia creada exitosamente
 *       400:
 *         description: Error de validación
 */
api.post('/noticias', validatorNewCreate, create)

/**
 * @swagger
 * /api/noticias/{id}:
 *   put:
 *     summary: Actualizar noticia
 *     tags: [Noticias]
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
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *               categoria:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Noticia actualizada
 *       404:
 *         description: Noticia no encontrada
 */
api.put('/noticias/:id', validatorNewUpdate, update)

/**
 * @swagger
 * /api/noticias/{id}:
 *   delete:
 *     summary: Eliminar noticia
 *     tags: [Noticias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Noticia eliminada
 *       404:
 *         description: Noticia no encontrada
 */
api.delete('/noticias/:id', destroy)

module.exports = api;