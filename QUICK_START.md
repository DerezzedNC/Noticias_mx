# 🚀 Guía de Inicio Rápido - API Noticias Express México

## ⚡ Instalación Automática (Windows)

1. **Ejecutar script de instalación:**
   ```cmd
   install.bat
   ```

## 🔧 Instalación Manual

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar MongoDB
- Instalar MongoDB: https://www.mongodb.com/try/download/community
- Iniciar servicio: `net start MongoDB`

### 3. Configurar Variables de Entorno
Crear archivo `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/noticias_express
JWT_SECRET=tu_clave_secreta_jwt_muy_segura_aqui_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Ejecutar Aplicación
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🎯 Primeros Pasos

### 1. Verificar Instalación
- Abrir: http://localhost:3000
- Deberías ver el mensaje de bienvenida

### 2. Credenciales de Administrador
```
📧 Email: admin@noticiasexpress.mx
🔑 Contraseña: admin123
```

### 3. Importar Colección de Postman
1. Abrir Postman
2. Import → Upload Files
3. Seleccionar `postman_collection.json`
4. Configurar variables de entorno

### 4. Flujo de Trabajo Recomendado
1. **Login como Admin** → Obtener token
2. **Verificar Categorías y Estados** → Ya están precargados
3. **Registrar Contribuidor** → Nuevo usuario
4. **Crear Noticias** → Como contribuidor
5. **Verificar Noticias** → Como admin

## 📱 Endpoints Principales

| Endpoint | Método | Descripción |
|----------|---------|-------------|
| `/` | GET | Página de inicio |
| `/api/auth/login` | POST | Iniciar sesión |
| `/api/auth/registro` | POST | Registrar contribuidor |
| `/api/news` | GET | Obtener noticias |
| `/api/categories` | GET | Obtener categorías |
| `/api/states` | GET | Obtener estados |

## 🔍 Solución de Problemas

### MongoDB no conecta
```bash
# Verificar servicio
net start MongoDB

# Verificar puerto
netstat -an | findstr :27017
```

### Puerto en uso
- Cambiar `PORT` en `.env`
- O terminar proceso: `netstat -ano | findstr :3000`

### Error de dependencias
```bash
# Limpiar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

- 📖 Documentación completa: README.md
- 🐛 Reportar problemas: GitHub Issues
- 📧 Contacto: soporte@noticiasexpress.mx