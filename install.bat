@echo off
echo ===================================
echo   🚀 API Noticias Express México
echo   📱 Script de Instalación
echo ===================================
echo.

echo 📦 Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.

echo 📝 Configurando variables de entorno...
if not exist .env (
    echo Creando archivo .env...
    copy nul .env > nul
    echo PORT=3000 >> .env
    echo MONGODB_URI=mongodb://localhost:27017/noticias_express >> .env
    echo JWT_SECRET=tu_clave_secreta_jwt_muy_segura_aqui_2024_%RANDOM% >> .env
    echo JWT_EXPIRES_IN=7d >> .env
    echo NODE_ENV=development >> .env
    echo ✅ Archivo .env creado
) else (
    echo ℹ️ El archivo .env ya existe
)

echo.
echo 🗃️ Verificando MongoDB...
mongod --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB no está instalado o no está en el PATH
    echo 📖 Por favor instala MongoDB desde: https://www.mongodb.com/try/download/community
    echo.
    echo Después de instalar MongoDB, ejecuta:
    echo   net start MongoDB
    echo.
    pause
    exit /b 1
) else (
    echo ✅ MongoDB detectado
)

echo.
echo 🎯 Iniciando la aplicación...
echo.
echo 📋 Credenciales de administrador por defecto:
echo    📧 Email: admin@noticiasexpress.mx
echo    🔑 Contraseña: admin123
echo.
echo 🌐 La API estará disponible en: http://localhost:3000
echo 📚 Documentación disponible en el README.md
echo 📱 Importa postman_collection.json en Postman para probar los endpoints
echo.

npm run dev