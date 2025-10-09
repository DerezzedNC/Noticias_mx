/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría por su ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               descripcion:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *               color:
 *                 type: string
 *                 pattern: '^#[0-9A-F]{6}$'
 *               activa:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado (solo administradores)
 *   delete:
 *     summary: Eliminar una categoría por su ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado (solo administradores)
 *
 * /api/states:
 *   get:
 *     summary: Obtener todos los estados
 *     tags: [Estados]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           enum: [Norte, Centro, Sur, Occidente, Oriente]
 *         description: Filtrar por región
 *     responses:
 *       200:
 *         description: Lista de estados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/State'
 *   post:
 *     summary: Crear un nuevo estado
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Nombre del estado
 *               codigo:
 *                 type: string
 *                 description: Código del estado
 *               region:
 *                 type: string
 *                 enum: [Norte, Centro, Sur, Occidente, Oriente]
 *                 description: Región del estado
 *             example:
 *               nombre: "Nuevo Estado"
 *               codigo: "NE"
 *               region: "Centro"
 *     responses:
 *       201:
 *         description: Estado creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado (solo administradores)
 *
 * /api/states/{id}:
 *   get:
 *     summary: Obtener un estado por su ID
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
 *         description: Estado obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/State'
 *       404:
 *         description: Estado no encontrado
 *   put:
 *     summary: Actualizar un estado por su ID
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado
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
 *                 enum: [Norte, Centro, Sur, Occidente, Oriente]
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       404:
 *         description: Estado no encontrado
 *       401:
 *         description: No autorizado (solo administradores)
 *   delete:
 *     summary: Eliminar un estado por su ID
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Estado eliminado exitosamente
 *       404:
 *         description: Estado no encontrado
 *       401:
 *         description: No autorizado (solo administradores)
 *
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *           enum: [contribuidor, administrador]
 *         description: Filtrar por rol
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, inactivo, suspendido]
 *         description: Filtrar por estado
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
 *         description: Usuarios por página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *                     usuarios:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *       401:
 *         description: No autorizado (solo administradores)
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               rol:
 *                 type: string
 *                 enum: [contribuidor, administrador]
 *             example:
 *               nombre: "Nuevo Usuario"
 *               email: "nuevo@example.com"
 *               password: "password123"
 *               rol: "contribuidor"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado (solo administradores)
 *
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado (solo administradores)
 *   put:
 *     summary: Actualizar un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               rol:
 *                 type: string
 *                 enum: [contribuidor, administrador]
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo, suspendido]
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado (solo administradores)
 *   delete:
 *     summary: Eliminar un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado (solo administradores)
 */

module.exports = {};