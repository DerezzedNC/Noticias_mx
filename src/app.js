const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

// Middleware básico
app.use(helmet());
app.use(cors());
app.use(express.json());

// Configuración SIMPLE de Swagger (sin errores)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Noticias México - MVC',
      version: '1.0.0',
      description: 'API de noticias con patrón MVC y relaciones automáticas',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: []  // Sin archivos externos para evitar errores
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Agregar endpoints completos CRUD
swaggerSpec.paths = {
  '/api/categorias': {
    get: {
      tags: ['Categorías'],
      summary: 'Obtener todas las categorías',
      responses: {
        '200': {
          description: 'Lista de categorías',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    categoria: { type: 'string' },
                    descripcion: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Categorías'],
      summary: 'Crear nueva categoría',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['categoria'],
              properties: {
                categoria: { type: 'string', example: 'Deportes' },
                descripcion: { type: 'string', example: 'Noticias deportivas' }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'Categoría creada exitosamente' },
        '400': { description: 'Datos inválidos' }
      }
    }
  },
  '/api/categorias/{id}': {
    get: {
      tags: ['Categorías'],
      summary: 'Obtener categoría por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        '200': { description: 'Categoría encontrada' },
        '404': { description: 'Categoría no encontrada' }
      }
    },
    put: {
      tags: ['Categorías'],
      summary: 'Actualizar categoría',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                categoria: { type: 'string' },
                descripcion: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Categoría actualizada' },
        '404': { description: 'Categoría no encontrada' }
      }
    },
    delete: {
      tags: ['Categorías'],
      summary: 'Eliminar categoría',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        '200': { description: 'Categoría eliminada' },
        '404': { description: 'Categoría no encontrada' }
      }
    }
  },
  '/api/noticias': {
    get: {
      tags: ['Noticias'],
      summary: 'Obtener noticias con relaciones automáticas',
      description: 'Devuelve noticias con categoria, estado y usuario completos',
      responses: {
        '200': {
          description: 'Lista de noticias con relaciones',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    titulo: { type: 'string' },
                    contenido: { type: 'string' },
                    categoria: { type: 'object' },
                    estado: { type: 'object' },
                    usuario: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Noticias'],
      summary: 'Crear nueva noticia',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['titulo', 'contenido', 'categoria_id', 'estado_id', 'usuario_id'],
              properties: {
                titulo: { type: 'string', example: 'Nueva noticia importante' },
                contenido: { type: 'string', example: 'Contenido de la noticia...' },
                categoria_id: { type: 'integer', example: 1 },
                estado_id: { type: 'integer', example: 1 },
                usuario_id: { type: 'integer', example: 1 }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'Noticia creada con relaciones' },
        '400': { description: 'Datos inválidos' }
      }
    }
  },
  '/api/noticias/{id}': {
    get: {
      tags: ['Noticias'],
      summary: 'Obtener noticia por ID con relaciones',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        '200': { description: 'Noticia con relaciones' },
        '404': { description: 'Noticia no encontrada' }
      }
    },
    put: {
      tags: ['Noticias'],
      summary: 'Actualizar noticia',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                titulo: { type: 'string' },
                contenido: { type: 'string' },
                categoria_id: { type: 'integer' },
                estado_id: { type: 'integer' },
                usuario_id: { type: 'integer' }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Noticia actualizada' },
        '404': { description: 'Noticia no encontrada' }
      }
    },
    delete: {
      tags: ['Noticias'],
      summary: 'Eliminar noticia',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        '200': { description: 'Noticia eliminada' },
        '404': { description: 'Noticia no encontrada' }
      }
    }
  },
  '/api/usuarios': {
    get: {
      tags: ['Usuarios'], 
      summary: 'Obtener usuarios con perfil incluido',
      description: 'Devuelve usuarios con perfil y sin contraseñas',
      responses: {
        '200': {
          description: 'Lista de usuarios con perfil',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    nombre: { type: 'string' },
                    email: { type: 'string' },
                    perfil: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Usuarios'],
      summary: 'Crear nuevo usuario',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['nombre', 'email', 'password'],
              properties: {
                nombre: { type: 'string', example: 'Juan Pérez' },
                email: { type: 'string', example: 'juan@email.com' },
                password: { type: 'string', example: 'password123' },
                telefono: { type: 'string', example: '555-1234' }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'Usuario creado exitosamente' },
        '400': { description: 'Email ya existe o datos inválidos' }
      }
    }
  },
  '/api/usuarios/{id}': {
    get: {
      tags: ['Usuarios'],
      summary: 'Obtener usuario por ID con perfil',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        '200': { description: 'Usuario con perfil' },
        '404': { description: 'Usuario no encontrado' }
      }
    },
    put: {
      tags: ['Usuarios'],
      summary: 'Actualizar usuario',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nombre: { type: 'string' },
                email: { type: 'string' },
                telefono: { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Usuario actualizado' },
        '404': { description: 'Usuario no encontrado' }
      }
    },
    delete: {
      tags: ['Usuarios'],
      summary: 'Eliminar usuario',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        '200': { description: 'Usuario eliminado' },
        '404': { description: 'Usuario no encontrado' }
      }
    }
  },
  '/api/estados': {
    get: {
      tags: ['Estados'],
      summary: 'Obtener estados de México',
      responses: {
        '200': {
          description: 'Lista de estados',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    estado: { type: 'string' },
                    abreviacion: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/estados/{id}': {
    get: {
      tags: ['Estados'],
      summary: 'Obtener estado por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        '200': { description: 'Estado encontrado' },
        '404': { description: 'Estado no encontrado' }
      }
    }
  }
};

// Ruta de documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: 'http://localhost:3000'  // Forzar localhost
  }
}));

// Exportar Rutas
const auth_routes = require('./routes/AuthRoute');
const profile_routes = require('./routes/ProfileRoute');
const state_routes = require('./routes/StateRoute');
const category_routes = require('./routes/CategoryRoute');
const new_routes = require('./routes/NewRoute');
const user_routes = require('./routes/UserRoute');

// Usar las rutas
app.use('/api/auth', auth_routes);
app.use('/api', profile_routes, state_routes, category_routes, new_routes, user_routes);

app.listen(PORT, () => {
    console.log('🚀 Servidor MVC corriendo en puerto ' + PORT);
    console.log('📱 API disponible en: http://localhost:' + PORT);
    console.log('📖 Documentación Swagger en: http://localhost:' + PORT + '/docs');
    console.log('🔧 Swagger configurado para localhost solamente');
});

module.exports = app;