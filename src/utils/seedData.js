const State = require('../models/State');

const estadosMexicanos = [
  // NORTE
  { nombre: 'Baja California', codigo: 'BC', region: 'Norte' },
  { nombre: 'Baja California Sur', codigo: 'BCS', region: 'Norte' },
  { nombre: 'Sonora', codigo: 'SON', region: 'Norte' },
  { nombre: 'Chihuahua', codigo: 'CHIH', region: 'Norte' },
  { nombre: 'Coahuila', codigo: 'COAH', region: 'Norte' },
  { nombre: 'Nuevo León', codigo: 'NL', region: 'Norte' },
  { nombre: 'Tamaulipas', codigo: 'TAMS', region: 'Norte' },
  
  // CENTRO
  { nombre: 'Ciudad de México', codigo: 'CDMX', region: 'Centro' },
  { nombre: 'Estado de México', codigo: 'MEX', region: 'Centro' },
  { nombre: 'Hidalgo', codigo: 'HGO', region: 'Centro' },
  { nombre: 'Morelos', codigo: 'MOR', region: 'Centro' },
  { nombre: 'Puebla', codigo: 'PUE', region: 'Centro' },
  { nombre: 'Tlaxcala', codigo: 'TLAX', region: 'Centro' },
  
  // SUR
  { nombre: 'Chiapas', codigo: 'CHIS', region: 'Sur' },
  { nombre: 'Oaxaca', codigo: 'OAX', region: 'Sur' },
  { nombre: 'Tabasco', codigo: 'TAB', region: 'Sur' },
  { nombre: 'Veracruz', codigo: 'VER', region: 'Sur' },
  { nombre: 'Yucatán', codigo: 'YUC', region: 'Sur' },
  { nombre: 'Campeche', codigo: 'CAMP', region: 'Sur' },
  { nombre: 'Quintana Roo', codigo: 'QROO', region: 'Sur' },
  
  // OCCIDENTE
  { nombre: 'Jalisco', codigo: 'JAL', region: 'Occidente' },
  { nombre: 'Colima', codigo: 'COL', region: 'Occidente' },
  { nombre: 'Michoacán', codigo: 'MICH', region: 'Occidente' },
  { nombre: 'Nayarit', codigo: 'NAY', region: 'Occidente' },
  { nombre: 'Sinaloa', codigo: 'SIN', region: 'Occidente' },
  { nombre: 'Durango', codigo: 'DGO', region: 'Occidente' },
  
  // ORIENTE
  { nombre: 'San Luis Potosí', codigo: 'SLP', region: 'Oriente' },
  { nombre: 'Querétaro', codigo: 'QRO', region: 'Oriente' },
  { nombre: 'Guanajuato', codigo: 'GTO', region: 'Oriente' },
  { nombre: 'Aguascalientes', codigo: 'AGS', region: 'Oriente' },
  { nombre: 'Zacatecas', codigo: 'ZAC', region: 'Oriente' },
  { nombre: 'Guerrero', codigo: 'GRO', region: 'Oriente' }
];

const categoriasDefault = [
  { nombre: 'Política', descripcion: 'Noticias sobre política nacional, estatal y municipal', color: '#FF5733' },
  { nombre: 'Economía', descripcion: 'Noticias sobre economía, finanzas y negocios', color: '#28A745' },
  { nombre: 'Sociedad', descripcion: 'Noticias sobre temas sociales y comunitarios', color: '#17A2B8' },
  { nombre: 'Seguridad', descripcion: 'Noticias sobre seguridad pública y justicia', color: '#DC3545' },
  { nombre: 'Salud', descripcion: 'Noticias sobre salud pública y medicina', color: '#FFC107' },
  { nombre: 'Educación', descripcion: 'Noticias sobre educación y ciencia', color: '#6F42C1' },
  { nombre: 'Deportes', descripcion: 'Noticias deportivas locales y nacionales', color: '#FD7E14' },
  { nombre: 'Cultura', descripcion: 'Noticias sobre arte, cultura y entretenimiento', color: '#E83E8C' },
  { nombre: 'Tecnología', descripcion: 'Noticias sobre tecnología e innovación', color: '#20C997' },
  { nombre: 'Medio Ambiente', descripcion: 'Noticias sobre ecología y medio ambiente', color: '#198754' }
];

const seedEstados = async () => {
  try {
    // Verificar si ya existen estados
    const estadosExistentes = await State.countDocuments();
    
    if (estadosExistentes === 0) {
      await State.insertMany(estadosMexicanos);
      console.log('✅ Estados de México insertados correctamente');
    } else {
      console.log('ℹ️ Los estados ya existen en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error insertando estados:', error);
  }
};

const seedCategorias = async () => {
  try {
    const Category = require('../models/Category');
    
    // Verificar si ya existen categorías
    const categoriasExistentes = await Category.countDocuments();
    
    if (categoriasExistentes === 0) {
      await Category.insertMany(categoriasDefault);
      console.log('✅ Categorías por defecto insertadas correctamente');
    } else {
      console.log('ℹ️ Las categorías ya existen en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error insertando categorías:', error);
  }
};

const createAdminUser = async () => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    
    // Verificar si ya existe un admin
    const adminExistente = await User.findOne({ rol: 'administrador' });
    
    if (!adminExistente) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        nombre: 'Administrador',
        email: 'admin@noticiasexpress.mx',
        password: hashedPassword,
        rol: 'administrador'
      });
      
      await adminUser.save();
      console.log('✅ Usuario administrador creado');
      console.log('📧 Email: admin@noticiasexpress.mx');
      console.log('🔑 Contraseña: admin123');
    } else {
      console.log('ℹ️ Ya existe un usuario administrador');
    }
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
  }
};

const seedDatabase = async () => {
  console.log('🌱 Iniciando población de base de datos...');
  
  await seedEstados();
  await seedCategorias();
  await createAdminUser();
  
  console.log('🎉 Población de base de datos completada');
};

module.exports = {
  seedDatabase,
  seedEstados,
  seedCategorias,
  createAdminUser,
  estadosMexicanos,
  categoriasDefault
};