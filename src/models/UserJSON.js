const db = require('../utils/jsonDatabase');

class User {
  static async create(userData) {
    // Validaciones básicas
    if (!userData.nombre || !userData.email || !userData.password) {
      throw new Error('Nombre, email y contraseña son obligatorios');
    }

    // Verificar email único
    const existingUser = await this.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está en uso');
    }

    const user = {
      nombre: userData.nombre.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      rol: userData.rol || 'contribuidor',
      estado: userData.estado || 'activo',
      fechaRegistro: new Date(),
      ultimoAcceso: new Date()
    };

    return await db.create('users', user);
  }

  static async findById(id) {
    return await db.findById('users', id);
  }

  static async findOne(filter) {
    return await db.findOne('users', filter);
  }

  static async findAll(filter = {}) {
    return await db.findAll('users', filter);
  }

  static async updateById(id, updates) {
    return await db.updateById('users', id, updates);
  }

  static async deleteById(id) {
    return await db.deleteById('users', id);
  }

  static async countDocuments(filter = {}) {
    return await db.count('users', filter);
  }

  static async find(filter = {}, options = {}) {
    let results = await db.findAll('users', filter);
    
    // Aplicar paginación
    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    // Aplicar ordenamiento
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      results.sort((a, b) => {
        if (sortOrder === 1) {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      });
    }

    return results;
  }

  static async save(user) {
    if (user._id) {
      return await this.updateById(user._id, user);
    } else {
      return await this.create(user);
    }
  }
}

module.exports = User;