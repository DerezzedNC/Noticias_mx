const User = require('../models/UserJSON');
const Category = require('../models/CategoryJSON');
const State = require('../models/StateJSON');
const bcrypt = require('bcryptjs');

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

const seedEstadosJSON = async () => {
  try {
    // Verificar si ya existen estados
    const estadosExistentes = await State.countDocuments();
    
    if (estadosExistentes === 0) {
      console.log('📍 Insertando estados de México...');
      for (const estado of estadosMexicanos) {
        await State.create(estado);
      }
      console.log('✅ Estados de México insertados correctamente');
    } else {
      console.log('ℹ️ Los estados ya existen en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error insertando estados:', error);
  }
};

const seedCategoriasJSON = async () => {
  try {
    // Verificar si ya existen categorías
    const categoriasExistentes = await Category.countDocuments();
    
    if (categoriasExistentes === 0) {
      console.log('📂 Insertando categorías por defecto...');
      for (const categoria of categoriasDefault) {
        await Category.create(categoria);
      }
      console.log('✅ Categorías por defecto insertadas correctamente');
    } else {
      console.log('ℹ️ Las categorías ya existen en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error insertando categorías:', error);
  }
};

const createAdminUserJSON = async () => {
  try {
    // Verificar si ya existe un admin
    const adminExistente = await User.findOne({ rol: 'administrador' });
    
    if (!adminExistente) {
      console.log('👤 Creando usuario administrador...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        nombre: 'Administrador',
        email: 'admin@noticiasexpress.mx',
        password: hashedPassword,
        rol: 'administrador'
      });
      
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

const createSampleUserJSON = async () => {
  try {
    // Verificar si ya existe un contribuidor de ejemplo
    const contribuidorExistente = await User.findOne({ email: 'juan@example.com' });
    
    if (!contribuidorExistente) {
      console.log('👤 Creando usuario contribuidor de ejemplo...');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      await User.create({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: hashedPassword,
        rol: 'contribuidor'
      });
      
      console.log('✅ Usuario contribuidor creado');
      console.log('📧 Email: juan@example.com');
      console.log('🔑 Contraseña: 123456');
    } else {
      console.log('ℹ️ Ya existe el usuario contribuidor de ejemplo');
    }
  } catch (error) {
    console.error('❌ Error creando usuario contribuidor:', error);
  }
};

const seedDatabaseJSON = async () => {
  console.log('🌱 Iniciando población de base de datos JSON...');
  
  await seedEstadosJSON();
  await seedCategoriasJSON();
  await createAdminUserJSON();
  await createSampleUserJSON();
  
  console.log('🎉 Población de base de datos JSON completada');
  console.log('');
  console.log('🔑 Credenciales de acceso:');
  console.log('👤 Admin: admin@noticiasexpress.mx / admin123');
  console.log('👤 Usuario: juan@example.com / 123456');
  console.log('');
};

module.exports = {
  seedDatabaseJSON,
  seedEstadosJSON,
  seedCategoriasJSON,
  createAdminUserJSON,
  createSampleUserJSON,
  estadosMexicanos,
  categoriasDefault
};