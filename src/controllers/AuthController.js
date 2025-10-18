const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

class AuthController {
    constructor() {
        this.usersFile = path.join(__dirname, '../../data/users.json');
        this.jwtSecret = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2023';
        this.jwtExpiry = process.env.JWT_EXPIRY || '7d';
    }

    // Leer usuarios del archivo JSON
    readUsers() {
        try {
            if (!fs.existsSync(this.usersFile)) {
                return [];
            }
            const data = fs.readFileSync(this.usersFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo archivo de usuarios:', error);
            return [];
        }
    }

    // Escribir usuarios al archivo JSON
    writeUsers(users) {
        try {
            // Asegurar que el directorio existe
            const dir = path.dirname(this.usersFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
            return true;
        } catch (error) {
            console.error('Error escribiendo archivo de usuarios:', error);
            return false;
        }
    }

    // Registro de usuarios
    async register(req, res) {
        try {
            // Verificar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { username, email, password, role = 'user' } = req.body;

            // Leer usuarios existentes
            const users = this.readUsers();

            // Verificar si el usuario ya existe
            const existingUser = users.find(user => 
                user.username === username || user.email === email
            );

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'El usuario ya existe',
                    details: 'Username o email ya está registrado'
                });
            }

            // Encriptar contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Crear nuevo usuario
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                username,
                email,
                password: hashedPassword,
                role,
                createdAt: new Date().toISOString(),
                isActive: true
            };

            // Agregar usuario a la lista
            users.push(newUser);

            // Guardar en archivo
            if (!this.writeUsers(users)) {
                return res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor',
                    details: 'No se pudo guardar el usuario'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: newUser.id, 
                    username: newUser.username, 
                    email: newUser.email,
                    role: newUser.role 
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiry }
            );

            // Respuesta exitosa (sin incluir la contraseña)
            const { password: _, ...userResponse } = newUser;
            
            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    user: userResponse,
                    token,
                    expiresIn: this.jwtExpiry
                }
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : 'Error procesando solicitud'
            });
        }
    }

    // Login de usuarios
    async login(req, res) {
        try {
            // Verificar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { username, password } = req.body;

            // Leer usuarios
            const users = this.readUsers();

            // Buscar usuario por username o email
            const user = users.find(u => 
                u.username === username || u.email === username
            );

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas',
                    details: 'Usuario no encontrado'
                });
            }

            // Verificar si el usuario está activo
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Cuenta desactivada',
                    details: 'Tu cuenta ha sido desactivada. Contacta al administrador.'
                });
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas',
                    details: 'Contraseña incorrecta'
                });
            }

            // Actualizar último login
            user.lastLogin = new Date().toISOString();
            this.writeUsers(users);

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username, 
                    email: user.email,
                    role: user.role 
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiry }
            );

            // Respuesta exitosa (sin incluir la contraseña)
            const { password: _, ...userResponse } = user;
            
            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user: userResponse,
                    token,
                    expiresIn: this.jwtExpiry
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : 'Error procesando solicitud'
            });
        }
    }

    // Obtener perfil del usuario autenticado
    async getProfile(req, res) {
        try {
            const users = this.readUsers();
            const user = users.find(u => u.id === req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Respuesta sin contraseña
            const { password: _, ...userProfile } = user;
            
            res.status(200).json({
                success: true,
                message: 'Perfil obtenido exitosamente',
                data: userProfile
            });

        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Cambiar contraseña
    async changePassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { currentPassword, newPassword } = req.body;
            const users = this.readUsers();
            const userIndex = users.findIndex(u => u.id === req.user.id);

            if (userIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Verificar contraseña actual
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[userIndex].password);
            
            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña actual incorrecta'
                });
            }

            // Encriptar nueva contraseña
            const saltRounds = 12;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            // Actualizar contraseña
            users[userIndex].password = hashedNewPassword;
            users[userIndex].passwordChangedAt = new Date().toISOString();

            this.writeUsers(users);

            res.status(200).json({
                success: true,
                message: 'Contraseña cambiada exitosamente'
            });

        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Método para verificar token (usado por middleware)
    static verifyToken(token) {
        try {
            const jwtSecret = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2023';
            return jwt.verify(token, jwtSecret);
        } catch (error) {
            return null;
        }
    }
}

module.exports = AuthController;
