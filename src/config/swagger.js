const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Noticias Express México',
      version: '1.0.0',
      description: `
        API REST completa para la gestión de noticias en México con sistema de verificación y administración de usuarios.
        
        ## Características principales:
        - Sistema de autenticación JWT simple
        - CRUD completo para noticias, categorías, estados y usuarios
        - Todos los usuarios autenticados tienen acceso completo
        - Organización por estados de México
        - Categorización de noticias
        
        ## Credenciales de prueba:
        - **Usuario:** admin@noticiasexpress.mx / admin123
        - **Usuario:** juan@example.com / 123456
        
        **Nota:** Todos los usuarios autenticados tienen acceso completo a la API.
      `,
      contact: {
        name: 'API Support',
        email: 'soporte@noticiasexpress.mx'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID único del usuario' },
            nombre: { type: 'string', description: 'Nombre completo del usuario' },
            email: { type: 'string', format: 'email', description: 'Email del usuario' },
            rol: { type: 'string', description: 'Rol del usuario (informativo)' },
            estado: { type: 'string', enum: ['activo', 'inactivo', 'suspendido'], description: 'Estado del usuario' },
            fechaRegistro: { type: 'string', format: 'date-time', description: 'Fecha de registro' },
            ultimoAcceso: { type: 'string', format: 'date-time', description: 'Último acceso' }
          }
        },
        News: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID único de la noticia' },
            titulo: { type: 'string', description: 'Título de la noticia' },
            contenido: { type: 'string', description: 'Contenido completo de la noticia' },
            resumen: { type: 'string', description: 'Resumen de la noticia' },
            autor: { type: 'string', description: 'ID del autor' },
            categoria: { type: 'string', description: 'ID de la categoría' },
            estado: { type: 'string', description: 'ID del estado' },
            imagenUrl: { type: 'string', description: 'URL de la imagen' },
            fuente: { type: 'string', description: 'Fuente de la noticia' },
            estadoVerificacion: { type: 'string', description: 'Estado de la noticia (automático)' },
            fechaPublicacion: { type: 'string', format: 'date-time', description: 'Fecha de publicación' },
            etiquetas: { type: 'array', items: { type: 'string' }, description: 'Etiquetas de la noticia' },
            visitas: { type: 'number', description: 'Número de visitas' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID único de la categoría' },
            nombre: { type: 'string', description: 'Nombre de la categoría' },
            descripcion: { type: 'string', description: 'Descripción de la categoría' },
            color: { type: 'string', pattern: '^#[0-9A-F]{6}$', description: 'Color en formato hexadecimal' },
            activa: { type: 'boolean', description: 'Si la categoría está activa' }
          }
        },
        State: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID único del estado' },
            nombre: { type: 'string', description: 'Nombre del estado' },
            codigo: { type: 'string', description: 'Código del estado' },
            region: { type: 'string', enum: ['Norte', 'Centro', 'Sur', 'Occidente', 'Oriente'], description: 'Región del estado' },
            activo: { type: 'boolean', description: 'Si el estado está activo' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', description: 'Mensaje de error' },
            errors: { type: 'array', items: { type: 'object' }, description: 'Detalles de errores de validación' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', description: 'Mensaje de éxito' },
            data: { type: 'object', description: 'Datos de respuesta' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints para registro, login y gestión de perfil'
      },
      {
        name: 'Noticias',
        description: 'Gestión completa de noticias'
      },
      {
        name: 'Categorías',
        description: 'Gestión de categorías de noticias'
      },
      {
        name: 'Estados',
        description: 'Gestión de estados de México'
      },
      {
        name: 'Usuarios',
        description: 'Gestión de usuarios del sistema'
      },
      {
        name: 'General',
        description: 'Endpoints generales de la API'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/serverJSON.js', './src/docs/*.js'] // rutas a los archivos que contienen anotaciones de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = specs;