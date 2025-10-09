# 📰 API de Noticias Express México

Una API REST completa para la gestión de noticias en México con sistema de verificación y administración de usuarios.

## 🌟 Características

- ✅ Sistema de autenticación JWT
- 👥 Roles de usuario (Contribuidor/Administrador)
- 📝 CRUD completo para noticias, categorías, estados y usuarios
- 🔍 Sistema de verificación de noticias
- 🌎 Organización por estados de México
- 📊 Categorización de noticias
- 🔒 Middleware de seguridad
- 📱 API preparada para aplicaciones móviles y web

## 🚀 Problemática y Solución

### Problemática
En México existe una limitación en la diversidad de fuentes de información confiables en los medios tradicionales. La concentración de medios restringe las perspectivas y puede resultar en información sesgada.

### Solución
Esta API proporciona una plataforma donde:
- Los contribuidores pueden registrar noticias de diversas fuentes
- Un sistema de verificación por administradores garantiza la calidad
- Las noticias se organizan por categorías y estados
- Se facilita el acceso a información diversa y verificada

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## ⚡ Instalación Rápida

1. **Clonar e instalar dependencias:**
```bash
cd noticias_express
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
PORT=3000
MONGODB_URI=mongodb://localhost:27017/noticias_express
JWT_SECRET=tu_clave_secreta_jwt_muy_segura_aqui_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

3. **Iniciar MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

4. **Ejecutar la aplicación:**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🛠️ Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
```

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| POST | `/registro` | Registrar nuevo contribuidor | Público |
| POST | `/login` | Iniciar sesión | Público |
| GET | `/perfil` | Obtener perfil del usuario | Privado |
| PUT | `/perfil` | Actualizar perfil | Privado |

### 📰 Noticias (`/api/news`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/` | Obtener noticias aprobadas | Público |
| GET | `/pendientes` | Obtener noticias pendientes | Admin |
| GET | `/user/mis-noticias` | Obtener mis noticias | Privado |
| GET | `/:id` | Obtener noticia por ID | Público |
| POST | `/` | Crear nueva noticia | Contribuidor |
| PUT | `/:id` | Actualizar noticia | Autor/Admin |
| PUT | `/:id/verificar` | Aprobar/rechazar noticia | Admin |
| DELETE | `/:id` | Eliminar noticia | Autor/Admin |

### 📑 Categorías (`/api/categories`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/` | Obtener categorías activas | Público |
| GET | `/all` | Obtener todas las categorías | Admin |
| GET | `/:id` | Obtener categoría por ID | Público |
| POST | `/` | Crear nueva categoría | Admin |
| PUT | `/:id` | Actualizar categoría | Admin |
| DELETE | `/:id` | Eliminar categoría | Admin |
| PATCH | `/:id/toggle` | Activar/desactivar categoría | Admin |

### 🌎 Estados (`/api/states`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/` | Obtener estados activos | Público |
| GET | `/all` | Obtener todos los estados | Admin |
| GET | `/regiones` | Obtener lista de regiones | Público |
| GET | `/:id` | Obtener estado por ID | Público |
| POST | `/` | Crear nuevo estado | Admin |
| PUT | `/:id` | Actualizar estado | Admin |
| DELETE | `/:id` | Eliminar estado | Admin |
| PATCH | `/:id/toggle` | Activar/desactivar estado | Admin |

### 👥 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/` | Obtener todos los usuarios | Admin |
| GET | `/stats` | Obtener estadísticas | Admin |
| GET | `/:id` | Obtener usuario por ID | Admin/Propio |
| POST | `/` | Crear nuevo usuario | Admin |
| PUT | `/:id` | Actualizar usuario | Admin/Propio |
| PUT | `/:id/password` | Cambiar contraseña | Admin/Propio |
| DELETE | `/:id` | Eliminar usuario | Admin |
| PATCH | `/:id/toggle-estado` | Suspender/activar usuario | Admin |

## 📊 Estructura de Datos

### Usuario
```json
{
  "_id": "ObjectId",
  "nombre": "String",
  "email": "String",
  "rol": "contribuidor|administrador",
  "estado": "activo|inactivo|suspendido",
  "fechaRegistro": "Date",
  "ultimoAcceso": "Date"
}
```

### Noticia
```json
{
  "_id": "ObjectId",
  "titulo": "String",
  "contenido": "String",
  "resumen": "String",
  "autor": "ObjectId",
  "categoria": "ObjectId",
  "estado": "ObjectId",
  "imagenUrl": "String",
  "fuente": "String",
  "estadoVerificacion": "pendiente|aprobada|rechazada",
  "fechaPublicacion": "Date",
  "verificadoPor": "ObjectId",
  "etiquetas": ["String"],
  "visitas": "Number"
}
```

### Categoría
```json
{
  "_id": "ObjectId",
  "nombre": "String",
  "descripcion": "String",
  "color": "String",
  "activa": "Boolean"
}
```

### Estado
```json
{
  "_id": "ObjectId",
  "nombre": "String",
  "codigo": "String",
  "region": "Norte|Centro|Sur|Occidente|Oriente",
  "activo": "Boolean"
}
```

## 🔑 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

### Ejemplo de registro:
```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456"
  }'
```

### Ejemplo de login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
```

## 📱 Uso con Postman

### 1. Importar Colección

Hemos preparado una colección completa de Postman con todos los endpoints:

1. Descarga el archivo `postman_collection.json` del repositorio
2. Abre Postman
3. Haz clic en "Import" → "Upload Files"
4. Selecciona el archivo descargado
5. La colección "API Noticias Express México" aparecerá en tu workspace

### 2. Configurar Variables de Entorno

Crea un entorno en Postman con estas variables:

```json
{
  "base_url": "http://localhost:3000/api",
  "token": "",
  "user_id": "",
  "news_id": "",
  "category_id": "",
  "state_id": ""
}
```

### 3. Workflow Sugerido

1. **Registro/Login:** Ejecuta el endpoint de registro o login
2. **Token:** Copia el token de la respuesta a la variable `token`
3. **Crear Datos:** Crea categorías y estados (requiere admin)
4. **Crear Noticias:** Como contribuidor, crea noticias
5. **Verificar:** Como admin, aprueba/rechaza noticias

## 🌐 Regiones de México

La API organiza los estados en 5 regiones:

- **Norte:** Baja California, Sonora, Chihuahua, Coahuila, Nuevo León, Tamaulipas
- **Centro:** Ciudad de México, Estado de México, Hidalgo, Morelos, Puebla, Tlaxcala
- **Sur:** Chiapas, Oaxaca, Tabasco, Veracruz, Yucatán, Campeche, Quintana Roo
- **Occidente:** Jalisco, Colima, Michoacán, Nayarit, Sinaloa
- **Oriente:** San Luis Potosí, Querétaro, Guanajuato, Aguascalientes, Zacatecas

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/noticias_express` |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |
| `NODE_ENV` | Entorno de ejecución | `development` |

### Seguridad

- Rate limiting: 100 peticiones por 15 minutos
- Helmet.js para headers de seguridad
- Validación de entrada con express-validator
- Contraseñas hasheadas con bcrypt
- CORS habilitado

## 🚦 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 400 | Petición incorrecta |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | No encontrado |
| 500 | Error interno del servidor |

## 🧪 Testing

Para probar la API manualmente:

1. Instala MongoDB y asegúrate de que esté ejecutándose
2. Ejecuta `npm run dev`
3. Usa Postman o curl para probar los endpoints
4. Primero registra un usuario administrador
5. Crea categorías y estados
6. Registra usuarios contribuidores
7. Crea y verifica noticias

## 📁 Estructura del Proyecto

```
noticias_express/
├── src/
│   ├── models/          # Modelos de MongoDB
│   │   ├── User.js
│   │   ├── News.js
│   │   ├── Category.js
│   │   └── State.js
│   ├── routes/          # Rutas de la API
│   │   ├── auth.js
│   │   ├── news.js
│   │   ├── categories.js
│   │   ├── states.js
│   │   └── users.js
│   ├── middleware/      # Middlewares
│   │   └── auth.js
│   └── server.js        # Servidor principal
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
├── postman_collection.json
└── README.md
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@noticiasexpress.mx
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/noticias-express/issues)

## 🔄 Changelog

### v1.0.0 (2024-10-08)
- ✅ Implementación inicial de la API
- ✅ Sistema de autenticación completo
- ✅ CRUD para todas las entidades
- ✅ Sistema de verificación de noticias
- ✅ Documentación completa
- ✅ Colección de Postman

---

<div align="center">
  <strong>🚀 ¡Construyendo el futuro de las noticias en México! 🇲🇽</strong>
</div>