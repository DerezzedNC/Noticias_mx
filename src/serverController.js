const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const app = express();

// Importar rutas con controladores
const authRoutes = require('./routes/authController');
const newsRoutes = require('./routes/newsController');
const categoryRoutes = require('./routes/categoryController');

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por ventana de tiempo
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter);

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger
/**
 * @swagger
 * /:
 *   get:
 *     summary: Endpoint de bienvenida
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Mensaje de bienvenida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "¡Bienvenido a la API de Noticias Express México!"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Noticias Express México",
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Inicializar base de datos JSON y poblar con datos iniciales
const initializeDatabase = async () => {
  try {
    console.log('🗃️ Inicializando base de datos JSON...');
    
    // Importar función de seed
    const { seedDatabaseJSON } = require('./utils/seedDataJSON');
    await seedDatabaseJSON();
    
    console.log('✅ Base de datos JSON inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos JSON:', error);
  }
};

// Endpoint de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a la API de Noticias Express México con Controladores!',
    version: '2.0.0',
    documentation: 'http://localhost:3000/api-docs',
    architecture: 'MVC with Controllers',
    features: [
      'Autenticación JWT',
      'CRUD completo',
      'Arquitectura con Controladores',
      'Validaciones mejoradas',
      'Documentación Swagger',
      'Base de datos JSON'
    ]
  });
});

// Rutas de la API usando controladores
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: {
      auth: '/api/auth (login, registro, perfil)',
      news: '/api/news (CRUD de noticias)',
      categories: '/api/categories (CRUD de categorías)',
      documentation: '/api-docs'
    }
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log('\n🚀 Servidor corriendo en puerto ' + PORT);
      console.log('📱 API disponible en: http://localhost:' + PORT);
      console.log('📚 Documentación: http://localhost:' + PORT + '/api-docs');
      console.log('🗃️ Base de datos: Archivos JSON');
      console.log('📂 Datos guardados en: ./data/');
      console.log('🏗️ Arquitectura: MVC con Controladores\n');
      
      console.log('🔑 Credenciales de acceso:');
      console.log('👤 Admin: admin@noticiasexpress.mx / admin123');
      console.log('👤 Usuario: juan@example.com / 123456\n');
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;