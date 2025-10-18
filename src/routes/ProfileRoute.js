var express = require('express');
const api = express.Router();

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtener información del perfil
 *     tags: [Perfil]
 *     responses:
 *       200:
 *         description: Información del perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Perfil endpoint"
 */

// Ruta simple para perfil
api.get('/perfil', (req, res) => {
  res.json({ message: 'Perfil endpoint' });
});

module.exports = api;