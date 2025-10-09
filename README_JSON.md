# 🎉 ¡API de Noticias Express México - FUNCIONANDO!

## ✅ Estado Actual
La API está ejecutándose correctamente en **http://localhost:3000** usando archivos JSON como base de datos.

## 🔑 Credenciales Predeterminadas

### 👨‍💼 Administrador
- **Email:** admin@noticiasexpress.mx
- **Contraseña:** admin123

### 👤 Usuario Contribuidor
- **Email:** juan@example.com
- **Contraseña:** 123456

## 🚀 Cómo Usar la API

### 1. Verificar que la API está funcionando
Abrir en el navegador: http://localhost:3000

### 2. Importar la colección de Postman
1. Abrir Postman
2. Clic en "Import"
3. Seleccionar el archivo `postman_collection.json`
4. Configurar las variables:
   - `base_url`: http://localhost:3000/api
   - `token`: (se llenará automáticamente al hacer login)

### 3. Flujo de trabajo recomendado en Postman

#### A. Hacer Login
1. Ir a "🔐 Autenticación" → "Iniciar Sesión"
2. Usar las credenciales del admin o usuario
3. El token se guardará automáticamente

#### B. Explorar Categorías y Estados
1. "📑 Categorías" → "Obtener Categorías Activas"
2. "🌎 Estados" → "Obtener Estados Activos"

#### C. Crear una Noticia (como contribuidor)
1. Login como juan@example.com / 123456
2. "📰 Noticias" → "Crear Noticia (Contribuidor)"
3. Usar IDs de categorías y estados obtenidos anteriormente

#### D. Verificar Noticias (como admin)
1. Login como admin@noticiasexpress.mx / admin123
2. "📰 Noticias" → "Obtener Noticias Pendientes (Admin)"
3. "📰 Noticias" → "Aprobar Noticia (Admin)"

## 📁 Archivos de Datos
Los datos se guardan en archivos JSON en la carpeta `data/`:
- `users.json` - Usuarios del sistema
- `categories.json` - Categorías de noticias
- `states.json` - Estados de México
- `news.json` - Noticias

## 🛠️ Comandos Útiles

### Iniciar el servidor
```bash
npm run dev:json
```

### Parar el servidor
Presionar `Ctrl + C` en la terminal

### Reiniciar el servidor
Escribir `rs` en la terminal y presionar Enter

## 📋 Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Página de inicio | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/registro` | Registrar usuario | No |
| GET | `/api/categories` | Ver categorías | No |
| GET | `/api/states` | Ver estados | No |
| GET | `/api/news` | Ver noticias aprobadas | No |
| POST | `/api/news` | Crear noticia | Sí |
| GET | `/api/news/pendientes` | Ver pendientes | Admin |
| PUT | `/api/news/:id/verificar` | Aprobar/rechazar | Admin |

## 🎯 Casos de Uso Principales

### 1. Usuario Contribuidor
- Registrarse en la plataforma
- Crear noticias
- Ver sus propias noticias
- Actualizar su perfil

### 2. Administrador
- Ver todas las noticias pendientes
- Aprobar o rechazar noticias
- Gestionar usuarios
- Crear/editar categorías y estados

### 3. Usuario Público (sin autenticación)
- Ver noticias aprobadas
- Buscar noticias por categoría/estado
- Ver detalles de una noticia específica

## 🔧 Características Técnicas

- ✅ Sin necesidad de MongoDB
- ✅ Datos persistentes en JSON
- ✅ Autenticación JWT
- ✅ Validaciones completas
- ✅ Sistema de roles
- ✅ Búsqueda de texto
- ✅ Paginación
- ✅ Manejo de errores

## 📞 Si Algo No Funciona

1. **Verificar puerto:** La API debe estar en http://localhost:3000
2. **Reiniciar servidor:** `Ctrl + C` y luego `npm run dev:json`
3. **Verificar archivos:** Los archivos JSON deben existir en `data/`
4. **Token expirado:** Hacer login nuevamente en Postman

## 🎊 ¡Listo para Usar!

Tu API de Noticias Express México está completamente funcional y lista para ser probada. Todos los endpoints están disponibles y puedes empezar a crear noticias inmediatamente.

**¡No necesitas instalar MongoDB ni ninguna base de datos adicional!**