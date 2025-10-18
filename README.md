# 📰 API de Noticias Express México - MVC# 📰 API de Noticias Express México



Una API REST completa desarrollada con arquitectura MVC para la gestión de noticias en México con sistema de validaciones, documentación Swagger y relaciones automáticas.Una API REST completa para la gestión de noticias en México con sistema de verificación y administración de usuarios.



## 🌟 Características Principales## 🌟 Características



- ✅ **Arquitectura MVC** - Modelo, Vista, Controlador bien estructurada- ✅ Sistema de autenticación JWT

- 🛡️ **Sistema de Validaciones** - Express-validator integrado- 👥 Roles de usuario (Contribuidor/Administrador)

- 📚 **Documentación Swagger** - API completamente documentada- 📝 CRUD completo para noticias, categorías, estados y usuarios

- 🔗 **Relaciones Automáticas** - Datos relacionados automáticamente- 🔍 Sistema de verificación de noticias

- 📝 **CRUD Completo** - Create, Read, Update, Delete para todas las entidades- 🌎 Organización por estados de México

- 🏛️ **Estados de México** - Organización por estados mexicanos- 📊 Categorización de noticias

- 📊 **Sistema de Categorías** - Clasificación de noticias- 🔒 Middleware de seguridad

- 👥 **Gestión de Usuarios** - Sistema completo de usuarios con perfiles- 📱 API preparada para aplicaciones móviles y web

- 📱 **API REST** - Preparada para aplicaciones móviles y web

- 🎯 **Respuestas Limpias** - Sin wrappers, datos directos## 🚀 Problemática y Solución



## 🏗️ Arquitectura del Proyecto### Problemática

En México existe una limitación en la diversidad de fuentes de información confiables en los medios tradicionales. La concentración de medios restringe las perspectivas y puede resultar en información sesgada.

### 📁 Estructura de Directorios

### Solución

```Esta API proporciona una plataforma donde:

noticias_express/- Los contribuidores pueden registrar noticias de diversas fuentes

├── src/                           # Código fuente principal- Un sistema de verificación por administradores garantiza la calidad

│   ├── app.js                     # Servidor principal con Swagger- Las noticias se organizan por categorías y estados

│   ├── controllers/               # Lógica de negocio (MVC)- Se facilita el acceso a información diversa y verificada

│   │   ├── CategoryController.js  # Gestión de categorías

│   │   ├── NewsController.js      # Gestión de noticias con relaciones## 📋 Requisitos Previos

│   │   ├── UserController.js      # Gestión de usuarios con perfiles

│   │   ├── StateController.js     # Gestión de estados de México- Node.js (v14 o superior)

│   │   └── ProfileController.js   # Gestión de perfiles de usuario- MongoDB (v4.4 o superior)

│   ├── routes/                    # Definición de rutas (MVC)- npm o yarn

│   │   ├── CategoryRoute.js       # Rutas de categorías

│   │   ├── NewRoute.js           # Rutas de noticias## ⚡ Instalación Rápida

│   │   ├── UserRoute.js          # Rutas de usuarios

│   │   ├── StateRoute.js         # Rutas de estados1. **Clonar e instalar dependencias:**

│   │   └── ProfileRoute.js       # Rutas de perfiles```bash

│   ├── models/                    # Modelos de datos JSONcd noticias_express

│   │   ├── CategoryJSON.js        # Modelo de categoríasnpm install

│   │   ├── NewsJSON.js           # Modelo de noticias```

│   │   ├── UserJSON.js           # Modelo de usuarios

│   │   ├── StateJSON.js          # Modelo de estados2. **Configurar variables de entorno:**

│   │   └── ProfileJSON.js        # Modelo de perfiles```bash

│   └── config/                    # Configuraciones# Copiar archivo de ejemplo

├── validators/                    # Validaciones con Express-validatorcp .env.example .env

│   ├── CategoryValidator.js       # Validaciones de categorías

│   ├── NewValidator.js           # Validaciones de noticias# Editar .env con tus configuraciones

│   ├── UserValidator.js          # Validaciones de usuariosPORT=3000

│   └── StateValidator.js         # Validaciones de estadosMONGODB_URI=mongodb://localhost:27017/noticias_express

├── data/                          # Base de datos JSONJWT_SECRET=tu_clave_secreta_jwt_muy_segura_aqui_2024

│   ├── categories.json           # Datos de categoríasJWT_EXPIRES_IN=7d

│   ├── news.json                 # Datos de noticiasNODE_ENV=development

│   ├── users.json                # Datos de usuarios```

│   ├── states.json               # Datos de estados mexicanos

│   └── profiles.json             # Datos de perfiles3. **Iniciar MongoDB:**

├── package.json                   # Dependencias y scripts```bash

└── README.md                     # Documentación# Windows

```net start MongoDB



### 🔧 Componentes Principales# macOS/Linux

sudo systemctl start mongod

#### **1. Servidor Principal (app.js)**```

- **Swagger UI Integrado** - Documentación interactiva en `/docs`

- **Middleware de Seguridad** - CORS y Helmet4. **Ejecutar la aplicación:**

- **Configuración Sin Errores** - Swagger optimizado para localhost```bash

- **Endpoints Documentados** - Todos los endpoints con ejemplos# Desarrollo

npm run dev

#### **2. Controladores (Controllers)**

- **Patrón MVC** - Separación clara de responsabilidades# Producción

- **Relaciones Automáticas** - Las noticias incluyen categoría, estado y usuario completosnpm start

- **Validaciones Integradas** - Express-validator en todos los métodos```

- **Manejo de Errores** - Respuestas estructuradas y consistentes

## 🛠️ Scripts Disponibles

#### **3. Validadores (Validators)**

- **Express-validator** - Validaciones robustas y flexibles```bash

- **Validaciones por Método** - Diferentes validaciones para CREATE y UPDATEnpm start          # Iniciar en producción

- **Mensajes en Español** - Errores descriptivos y clarosnpm run dev        # Iniciar en desarrollo con nodemon

- **Respuestas 422** - Formato estándar para errores de validación```



#### **4. Modelos JSON**## 📡 Endpoints de la API

- **Base de Datos en Archivos** - Sistema de persistencia simple

- **Métodos CRUD** - Create, Read, Update, Delete### 🔐 Autenticación (`/api/auth`)

- **Búsquedas Flexibles** - Filtros y consultas personalizadas

- **Relaciones Manuales** - Población de datos relacionados| Método | Endpoint | Descripción | Acceso |

|--------|----------|-------------|---------|

## 🛠️ Tecnologías Utilizadas| POST | `/registro` | Registrar nuevo contribuidor | Público |

| POST | `/login` | Iniciar sesión | Público |

### **Backend Framework**| GET | `/perfil` | Obtener perfil del usuario | Privado |

- **Node.js** - Runtime de JavaScript| PUT | `/perfil` | Actualizar perfil | Privado |

- **Express.js** - Framework web minimalista

### 📰 Noticias (`/api/news`)

### **Documentación**

- **Swagger UI** - Interfaz interactiva de documentación| Método | Endpoint | Descripción | Acceso |

- **swagger-jsdoc** - Generación de documentación OpenAPI 3.0|--------|----------|-------------|---------|

- **swagger-ui-express** - Servidor de documentación| GET | `/` | Obtener noticias aprobadas | Público |

| GET | `/pendientes` | Obtener noticias pendientes | Admin |

### **Validaciones**| GET | `/user/mis-noticias` | Obtener mis noticias | Privado |

- **express-validator** - Middleware de validación| GET | `/:id` | Obtener noticia por ID | Público |

- **Validaciones Personalizadas** - Verificación de duplicados y formatos| POST | `/` | Crear nueva noticia | Contribuidor |

| PUT | `/:id` | Actualizar noticia | Autor/Admin |

### **Seguridad**| PUT | `/:id/verificar` | Aprobar/rechazar noticia | Admin |

- **Helmet** - Middlewares de seguridad HTTP| DELETE | `/:id` | Eliminar noticia | Autor/Admin |

- **CORS** - Control de acceso entre dominios

### 📑 Categorías (`/api/categories`)

### **Base de Datos**

- **JSON Files** - Sistema de persistencia basado en archivos| Método | Endpoint | Descripción | Acceso |

- **File System** - Operaciones de lectura/escritura|--------|----------|-------------|---------|

| GET | `/` | Obtener categorías activas | Público |

## 📋 Entidades del Sistema| GET | `/all` | Obtener todas las categorías | Admin |

| GET | `/:id` | Obtener categoría por ID | Público |

### **📊 Categorías**| POST | `/` | Crear nueva categoría | Admin |

```json| PUT | `/:id` | Actualizar categoría | Admin |

{| DELETE | `/:id` | Eliminar categoría | Admin |

  "id": 1,| PATCH | `/:id/toggle` | Activar/desactivar categoría | Admin |

  "nombre": "Deportes",

  "descripcion": "Noticias deportivas y eventos",### 🌎 Estados (`/api/states`)

  "activa": true

}| Método | Endpoint | Descripción | Acceso |

```|--------|----------|-------------|---------|

| GET | `/` | Obtener estados activos | Público |

### **📰 Noticias (con relaciones automáticas)**| GET | `/all` | Obtener todos los estados | Admin |

```json| GET | `/regiones` | Obtener lista de regiones | Público |

{| GET | `/:id` | Obtener estado por ID | Público |

  "id": 1,| POST | `/` | Crear nuevo estado | Admin |

  "titulo": "Noticia importante",| PUT | `/:id` | Actualizar estado | Admin |

  "contenido": "Contenido de la noticia...",| DELETE | `/:id` | Eliminar estado | Admin |

  "categoria": {| PATCH | `/:id/toggle` | Activar/desactivar estado | Admin |

    "id": 1,

    "nombre": "Deportes"### 👥 Usuarios (`/api/users`)

  },

  "estado": {| Método | Endpoint | Descripción | Acceso |

    "id": 1,|--------|----------|-------------|---------|

    "nombre": "Ciudad de México"| GET | `/` | Obtener todos los usuarios | Admin |

  },| GET | `/stats` | Obtener estadísticas | Admin |

  "usuario": {| GET | `/:id` | Obtener usuario por ID | Admin/Propio |

    "id": 1,| POST | `/` | Crear nuevo usuario | Admin |

    "nombre": "Juan Pérez"| PUT | `/:id` | Actualizar usuario | Admin/Propio |

  }| PUT | `/:id/password` | Cambiar contraseña | Admin/Propio |

}| DELETE | `/:id` | Eliminar usuario | Admin |

```| PATCH | `/:id/toggle-estado` | Suspender/activar usuario | Admin |



### **👥 Usuarios (con perfil incluido)**## 📊 Estructura de Datos

```json

{### Usuario

  "id": 1,```json

  "nombre": "Juan Pérez",{

  "email": "juan@email.com",  "_id": "ObjectId",

  "perfil": {  "nombre": "String",

    "id": 1,  "email": "String",

    "nombre": "Administrador"  "rol": "contribuidor|administrador",

  }  "estado": "activo|inactivo|suspendido",

}  "fechaRegistro": "Date",

```  "ultimoAcceso": "Date"

}

### **🏛️ Estados de México**```

```json

{### Noticia

  "id": 1,```json

  "nombre": "Ciudad de México",{

  "abreviacion": "CDMX"  "_id": "ObjectId",

}  "titulo": "String",

```  "contenido": "String",

  "resumen": "String",

## 🚀 Instalación y Configuración  "autor": "ObjectId",

  "categoria": "ObjectId",

### **1. Requisitos Previos**  "estado": "ObjectId",

- Node.js (v14 o superior)  "imagenUrl": "String",

- npm o yarn  "fuente": "String",

  "estadoVerificacion": "pendiente|aprobada|rechazada",

### **2. Instalación**  "fechaPublicacion": "Date",

  "verificadoPor": "ObjectId",

```bash  "etiquetas": ["String"],

# Clonar el repositorio  "visitas": "Number"

git clone https://github.com/tu-usuario/noticias_express.git}

cd noticias_express```



# Instalar dependencias### Categoría

npm install```json

{

# Instalar express-validator (si no está)  "_id": "ObjectId",

npm install express-validator  "nombre": "String",

```  "descripcion": "String",

  "color": "String",

### **3. Ejecutar el Servidor**  "activa": "Boolean"

}

```bash```

# Desde el directorio raíz

node src/app.js### Estado

``````json

{

### **4. Acceder a la Documentación**  "_id": "ObjectId",

  "nombre": "String",

- **API Server:** `http://localhost:3000`  "codigo": "String",

- **Swagger Docs:** `http://localhost:3000/docs`  "region": "Norte|Centro|Sur|Occidente|Oriente",

  "activo": "Boolean"

## 📚 Endpoints Disponibles}

```

### **📊 Categorías** `/api/categorias`

- `GET /api/categorias` - Listar todas las categorías## 🔑 Autenticación

- `GET /api/categorias/{id}` - Obtener categoría por ID

- `POST /api/categorias` - Crear nueva categoría (con validaciones)La API utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header:

- `PUT /api/categorias/{id}` - Actualizar categoría (con validaciones)

- `DELETE /api/categorias/{id}` - Eliminar categoría```

Authorization: Bearer <tu_token_jwt>

### **📰 Noticias** `/api/noticias````

- `GET /api/noticias` - Listar noticias con relaciones automáticas

- `GET /api/noticias/{id}` - Obtener noticia por ID con relaciones### Ejemplo de registro:

- `POST /api/noticias` - Crear nueva noticia (con validaciones)```bash

- `PUT /api/noticias/{id}` - Actualizar noticia (con validaciones)curl -X POST http://localhost:3000/api/auth/registro \

- `DELETE /api/noticias/{id}` - Eliminar noticia  -H "Content-Type: application/json" \

  -d '{

### **👥 Usuarios** `/api/usuarios`    "nombre": "Juan Pérez",

- `GET /api/usuarios` - Listar usuarios con perfil (sin contraseñas)    "email": "juan@example.com",

- `GET /api/usuarios/{id}` - Obtener usuario por ID con perfil    "password": "123456"

- `POST /api/usuarios` - Crear nuevo usuario (con validaciones)  }'

- `PUT /api/usuarios/{id}` - Actualizar usuario (con validaciones)```

- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Ejemplo de login:

### **🏛️ Estados** `/api/estados````bash

- `GET /api/estados` - Listar estados de Méxicocurl -X POST http://localhost:3000/api/auth/login \

- `GET /api/estados/{id}` - Obtener estado por ID  -H "Content-Type: application/json" \

- `POST /api/estados` - Crear nuevo estado (con validaciones)  -d '{

- `PUT /api/estados/{id}` - Actualizar estado (con validaciones)    "email": "juan@example.com",

- `DELETE /api/estados/{id}` - Eliminar estado    "password": "123456"

  }'

### **👤 Perfiles** `/api/perfiles````

- `GET /api/perfiles` - Listar perfiles de usuario

- `GET /api/perfiles/{id}` - Obtener perfil por ID## 📱 Uso con Postman



## 🛡️ Sistema de Validaciones### 1. Importar Colección



### **Tipos de Validaciones Implementadas**Hemos preparado una colección completa de Postman con todos los endpoints:



#### **Campos Obligatorios**1. Descarga el archivo `postman_collection.json` del repositorio

```javascript2. Abre Postman

check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')3. Haz clic en "Import" → "Upload Files"

```4. Selecciona el archivo descargado

5. La colección "API Noticias Express México" aparecerá en tu workspace

#### **Tipos de Datos**

```javascript### 2. Configurar Variables de Entorno

check('email').isEmail().withMessage('Debe ser un email valido')

check('categoria_id').isInt().withMessage('Debe ser un numero entero')Crea un entorno en Postman con estas variables:

check('activo').isBoolean().withMessage('Debe ser un booleano')

``````json

{

#### **Longitud de Campos**  "base_url": "http://localhost:3000/api",

```javascript  "token": "",

check('nombre').isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres')  "user_id": "",

```  "news_id": "",

  "category_id": "",

#### **Campos Opcionales**  "state_id": ""

```javascript}

check('descripcion').optional().isString()```

```

### 3. Workflow Sugerido

#### **Respuestas de Error (Status 422)**

```json1. **Registro/Login:** Ejecuta el endpoint de registro o login

{2. **Token:** Copia el token de la respuesta a la variable `token`

  "errors": {3. **Crear Datos:** Crea categorías y estados (requiere admin)

    "nombre": {4. **Crear Noticias:** Como contribuidor, crea noticias

      "msg": "El campo nombre es obligatorio"5. **Verificar:** Como admin, aprueba/rechaza noticias

    },

    "email": {## 🌐 Regiones de México

      "msg": "Debe ser un email valido"

    }La API organiza los estados en 5 regiones:

  }

}- **Norte:** Baja California, Sonora, Chihuahua, Coahuila, Nuevo León, Tamaulipas

```- **Centro:** Ciudad de México, Estado de México, Hidalgo, Morelos, Puebla, Tlaxcala

- **Sur:** Chiapas, Oaxaca, Tabasco, Veracruz, Yucatán, Campeche, Quintana Roo

### **Validadores por Entidad**- **Occidente:** Jalisco, Colima, Michoacán, Nayarit, Sinaloa

- **Oriente:** San Luis Potosí, Querétaro, Guanajuato, Aguascalientes, Zacatecas

#### **CategoryValidator.js**

- **CREATE:** nombre (obligatorio, 5-50 chars), descripcion (obligatorio, 5-255 chars)## 🔧 Configuración Avanzada

- **UPDATE:** campos opcionales con mismas reglas

### Variables de Entorno

#### **NewValidator.js**

- **CREATE:** titulo, descripcion, categoria_id, usuario_id, estado_id (obligatorios)| Variable | Descripción | Valor por Defecto |

- **UPDATE:** todos los campos opcionales|----------|-------------|-------------------|

| `PORT` | Puerto del servidor | `3000` |

#### **UserValidator.js**| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/noticias_express` |

- **CREATE:** nombre, email, password (obligatorios)| `JWT_SECRET` | Clave secreta para JWT | - |

- **UPDATE:** todos los campos opcionales| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |

| `NODE_ENV` | Entorno de ejecución | `development` |

#### **StateValidator.js**

- **CREATE:** nombre (obligatorio, 2-50 chars), abreviacion (obligatorio, 2-5 chars)### Seguridad

- **UPDATE:** campos opcionales

- Rate limiting: 100 peticiones por 15 minutos

## 🔗 Características Especiales- Helmet.js para headers de seguridad

- Validación de entrada con express-validator

### **1. Relaciones Automáticas**- Contraseñas hasheadas con bcrypt

Las noticias se devuelven con datos completos de:- CORS habilitado

- **Categoría** - Información completa de la categoría

- **Estado** - Datos del estado mexicano## 🚦 Códigos de Estado HTTP

- **Usuario** - Información del autor (sin contraseña)

| Código | Descripción |

**Ejemplo de respuesta con relaciones:**|--------|-------------|

```json| 200 | Éxito |

{| 201 | Creado exitosamente |

  "id": 1,| 400 | Petición incorrecta |

  "titulo": "Noticia sobre deportes en CDMX",| 401 | No autorizado |

  "contenido": "Contenido...",| 403 | Prohibido |

  "categoria": {| 404 | No encontrado |

    "id": 1,| 500 | Error interno del servidor |

    "nombre": "Deportes",

    "descripcion": "Noticias deportivas"## 🧪 Testing

  },

  "estado": {Para probar la API manualmente:

    "id": 1,

    "nombre": "Ciudad de México",1. Instala MongoDB y asegúrate de que esté ejecutándose

    "abreviacion": "CDMX"2. Ejecuta `npm run dev`

  },3. Usa Postman o curl para probar los endpoints

  "usuario": {4. Primero registra un usuario administrador

    "id": 1,5. Crea categorías y estados

    "nombre": "Juan Pérez",6. Registra usuarios contribuidores

    "email": "juan@email.com"7. Crea y verifica noticias

  }

}## 📁 Estructura del Proyecto

```

```

### **2. Validaciones Robustas**noticias_express/

- **CREATE vs UPDATE** - Validaciones diferentes según operación├── src/

- **Campos Opcionales** - Flexibilidad en actualizaciones│   ├── models/          # Modelos de MongoDB

- **Mensajes Descriptivos** - Errores claros en español│   │   ├── User.js

- **Middleware Integration** - Validaciones como middleware en rutas│   │   ├── News.js

│   │   ├── Category.js

### **3. Documentación Interactiva**│   │   └── State.js

- **Swagger UI** - Interfaz web para probar endpoints│   ├── routes/          # Rutas de la API

- **Ejemplos Incluidos** - Datos de ejemplo en cada endpoint│   │   ├── auth.js

- **Esquemas Detallados** - Estructura de datos documentada│   │   ├── news.js

- **Try It Out** - Ejecución en vivo de endpoints│   │   ├── categories.js

│   │   ├── states.js

### **4. Respuestas Limpias**│   │   └── users.js

- **Sin Wrappers** - Datos directos sin envoltorios innecesarios│   ├── middleware/      # Middlewares

- **Consistencia** - Formato uniforme en todas las respuestas│   │   └── auth.js

- **Códigos HTTP** - Estados apropiados (200, 201, 404, 422, 500)│   └── server.js        # Servidor principal

├── .env                 # Variables de entorno

## 🧪 Cómo Probar la API├── .gitignore

├── package.json

### **1. Usando Swagger UI**├── postman_collection.json

1. Ir a `http://localhost:3000/docs`└── README.md

2. Expandir cualquier endpoint```

3. Hacer clic en "Try it out"

4. Completar parámetros## 🤝 Contribuir

5. Ejecutar y ver respuesta

1. Fork el repositorio

### **2. Ejemplos de Uso**2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)

3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)

#### **Crear una Categoría**4. Push a la rama (`git push origin feature/AmazingFeature`)

```bash5. Abre un Pull Request

POST http://localhost:3000/api/categorias

Content-Type: application/json## 📝 Licencia



{Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

  "nombre": "Tecnología",

  "descripcion": "Noticias sobre tecnología e innovación"## 📞 Soporte

}

```Para soporte técnico o preguntas:



#### **Crear una Noticia**- 📧 Email: soporte@noticiasexpress.mx

```bash- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/noticias-express/issues)

POST http://localhost:3000/api/noticias

Content-Type: application/json## 🔄 Changelog



{### v1.0.0 (2024-10-08)

  "titulo": "Nueva tecnología en México",- ✅ Implementación inicial de la API

  "contenido": "Contenido de la noticia...",- ✅ Sistema de autenticación completo

  "categoria_id": 1,- ✅ CRUD para todas las entidades

  "estado_id": 1,- ✅ Sistema de verificación de noticias

  "usuario_id": 1- ✅ Documentación completa

}- ✅ Colección de Postman

```

---

#### **Probar Validaciones**

```bash<div align="center">

POST http://localhost:3000/api/categorias  <strong>🚀 ¡Construyendo el futuro de las noticias en México! 🇲🇽</strong>

Content-Type: application/json</div>

{
  "nombre": "a"  // Error: muy corto
}
```

**Respuesta (422):**
```json
{
  "errors": {
    "nombre": {
      "msg": "El campo debe tener entre 5 y 50 caracteres"
    },
    "descripcion": {
      "msg": "El campo descripcion es obligatorio"
    }
  }
}
```

### **3. Obtener Datos con Relaciones**
```bash
GET http://localhost:3000/api/noticias
```

**Respuesta automática con relaciones:**
```json
[
  {
    "id": 1,
    "titulo": "Noticia deportiva",
    "categoria": { "id": 1, "nombre": "Deportes" },
    "estado": { "id": 1, "nombre": "Ciudad de México" },
    "usuario": { "id": 1, "nombre": "Juan Pérez" }
  }
]
```

## 🎯 Características Técnicas

### **Arquitectura MVC**
- **Modelos** - Gestión de datos JSON con métodos CRUD
- **Vistas** - Respuestas JSON estructuradas
- **Controladores** - Lógica de negocio y validaciones

### **Validaciones Express-validator**
- **Middleware Integration** - Validaciones como middleware en rutas
- **Error Handling** - Manejo consistente de errores 422
- **Custom Validations** - Validaciones personalizadas disponibles
- **Multilingual** - Mensajes en español

### **Swagger Documentation**
- **OpenAPI 3.0** - Estándar de documentación
- **Interactive Testing** - Pruebas en vivo desde la interfaz
- **Schema Definitions** - Estructuras de datos documentadas
- **No External References** - Sin errores de referencias

### **Base de Datos JSON**
- **File System Based** - Persistencia en archivos JSON
- **CRUD Operations** - Create, Read, Update, Delete
- **Relationship Handling** - Población manual de relaciones
- **Filter Support** - Búsquedas y filtros personalizados

## 🚧 Desarrollo y Contribución

### **Scripts Disponibles**
```bash
# Iniciar servidor
node src/app.js

# Instalar dependencias
npm install

# Verificar estructura
ls -la src/
```

### **Agregar Nuevas Funcionalidades**

#### **1. Agregar Nueva Entidad**
```bash
# 1. Crear modelo
touch src/models/NuevaEntidadJSON.js

# 2. Crear controlador
touch src/controllers/NuevaEntidadController.js

# 3. Crear rutas
touch src/routes/NuevaEntidadRoute.js

# 4. Crear validador
touch validators/NuevaEntidadValidator.js

# 5. Registrar en app.js
```

#### **2. Estructura de Archivos**
```javascript
// Modelo (src/models/EntityJSON.js)
const fs = require('fs');
class Entity {
  static async find() { /* implementación */ }
  static async create() { /* implementación */ }
}

// Controlador (src/controllers/EntityController.js)
const { validationResult } = require('express-validator');
const get = async (req, res) => { /* implementación */ }

// Rutas (src/routes/EntityRoute.js)
const { validator } = require('../../validators/EntityValidator');
api.post('/entities', validator, create);

// Validador (validators/EntityValidator.js)
const { check } = require('express-validator');
const validator = [check('field').notEmpty()];
```

## 📈 Estado del Proyecto

### **Completado ✅**
- ✅ **Arquitectura MVC** - Completamente implementada
- ✅ **Sistema de Validaciones** - Express-validator integrado
- ✅ **Documentación Swagger** - Funcionando sin errores
- ✅ **CRUD Completo** - Todos los endpoints implementados
- ✅ **Relaciones Automáticas** - Datos relacionados incluidos
- ✅ **Base de Datos JSON** - Sistema de persistencia funcional
- ✅ **Manejo de Errores** - Respuestas estructuradas y consistentes

### **En Desarrollo 🚧**
- 🔐 **Sistema de Autenticación JWT**
- 🛡️ **Middleware de Seguridad Avanzado**
- 📄 **Paginación de Resultados**

### **Futuras Mejoras 🔮**
- 🔍 **Búsquedas Avanzadas con Filtros**
- 📊 **Sistema de Analytics y Métricas**
- 🌐 **Integración con Base de Datos Externa**
- 🔄 **Cache de Respuestas**
- 📧 **Sistema de Notificaciones**

## 📊 Métricas del Proyecto

### **Cobertura de Funcionalidades**
- **Endpoints CRUD:** 20/20 (100%)
- **Validaciones:** 4/4 entidades (100%)
- **Documentación:** 20/20 endpoints (100%)
- **Relaciones:** 2/2 implementadas (100%)

### **Archivos y Líneas de Código**
```
src/
├── controllers/     5 archivos  ~800 líneas
├── routes/          5 archivos  ~600 líneas
├── models/          5 archivos  ~500 líneas
validators/          4 archivos  ~300 líneas
Total:              19 archivos  ~2200 líneas
```

## 📞 Contacto y Soporte

### **Documentación**
- **Swagger UI** - `http://localhost:3000/docs`
- **README.md** - Este archivo de documentación

### **Soporte**
- **GitHub Issues** - Para reportar bugs o solicitar features
- **Ejemplos** - Incluidos en Swagger para cada endpoint
- **Validaciones** - Mensajes de error descriptivos en español

### **Recursos Útiles**
- **Express.js Docs** - https://expressjs.com/
- **Express-validator** - https://express-validator.github.io/
- **Swagger/OpenAPI** - https://swagger.io/docs/

---

## 🎉 Resumen del Proyecto

**API de Noticias Express México** es una aplicación backend robusta que combina:

- ⚡ **Arquitectura MVC** para código organizado y mantenible
- 🛡️ **Validaciones Completas** para datos íntegros y seguros
- 📚 **Documentación Interactiva** para facilitar el desarrollo
- 🔗 **Relaciones Automáticas** para respuestas ricas en información
- 📱 **API REST** estándar para integración con cualquier frontend

**Desarrollado con ❤️ para la gestión eficiente de noticias en México**

*Una API REST profesional con arquitectura MVC, validaciones robustas y documentación completa*