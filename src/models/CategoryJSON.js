const db = require('../utils/jsonDatabase');

class Category {
  static async create(categoryData) {
    // Validaciones básicas
    if (!categoryData.nombre || !categoryData.descripcion) {
      throw new Error('Nombre y descripción son obligatorios');
    }

    // Verificar nombre único
    const existing = await this.findOne({ 
      nombre: { $regex: `^${categoryData.nombre}$`, $options: 'i' } 
    });
    if (existing) {
      throw new Error('Ya existe una categoría con ese nombre');
    }

    const category = {
      nombre: categoryData.nombre.trim(),
      descripcion: categoryData.descripcion.trim(),
      color: categoryData.color || '#007bff',
      activa: categoryData.activa !== undefined ? categoryData.activa : true
    };

    return await db.create('categories', category);
  }

  static async findById(id) {
    return await db.findById('categories', id);
  }

  static async findOne(filter) {
    return await db.findOne('categories', filter);
  }

  static async findAll(filter = {}) {
    return await db.findAll('categories', filter);
  }

  static async updateById(id, updates) {
    return await db.updateById('categories', id, updates);
  }

  static async deleteById(id) {
    return await db.deleteById('categories', id);
  }

  static async countDocuments(filter = {}) {
    return await db.count('categories', filter);
  }

  static async find(filter = {}, options = {}) {
    let results = await db.findAll('categories', filter);
    
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
    
    // Aplicar paginación
    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  static async save(category) {
    if (category._id) {
      return await this.updateById(category._id, category);
    } else {
      return await this.create(category);
    }
  }
}

module.exports = Category;