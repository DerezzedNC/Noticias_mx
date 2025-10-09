const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const app = express();

// Importar rutas
const authRoutes = require('./routes/authJSON');
const newsRoutes = require('./routes/newsJSON');
const categoryRoutes = require('./routes/categoriesJSON');
const stateRoutes = require('./routes/statesJSON');
const userRoutes = require('./routes/usersJSON');

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

// Inicializar al arrancar
initializeDatabase();

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/users', userRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🏠 Bienvenido a la API de Noticias Express México (JSON Mode)',
    version: '1.0.0',
    database: 'JSON Files',
    endpoints: {
      auth: '/api/auth',
      news: '/api/news',
      categories: '/api/categories',
      states: '/api/states',
      users: '/api/users'
    },
    note: 'Esta API utiliza archivos JSON para almacenamiento de datos'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}`);
  console.log(`🗃️ Base de datos: Archivos JSON`);
  console.log(`📂 Datos guardados en: ./data/`);
});

module.exports = app;