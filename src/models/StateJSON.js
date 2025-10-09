const db = require('../utils/jsonDatabase');

class State {
  static async create(stateData) {
    // Validaciones básicas
    if (!stateData.nombre || !stateData.codigo || !stateData.region) {
      throw new Error('Nombre, código y región son obligatorios');
    }

    // Verificar nombre y código únicos
    const existing = await this.findOne({ 
      $or: [
        { nombre: { $regex: `^${stateData.nombre}$`, $options: 'i' } },
        { codigo: stateData.codigo.toUpperCase() }
      ]
    });
    
    if (existing) {
      throw new Error('Ya existe un estado con ese nombre o código');
    }

    const state = {
      nombre: stateData.nombre.trim(),
      codigo: stateData.codigo.toUpperCase().trim(),
      region: stateData.region,
      activo: stateData.activo !== undefined ? stateData.activo : true
    };

    return await db.create('states', state);
  }

  static async findById(id) {
    return await db.findById('states', id);
  }

  static async findOne(filter) {
    // Manejar consultas con $or
    if (filter.$or) {
      const data = await db.findAll('states');
      return data.find(item => {
        for (const condition of filter.$or) {
          let match = true;
          for (const [key, value] of Object.entries(condition)) {
            if (typeof value === 'object' && value.$regex) {
              const regex = new RegExp(value.$regex, value.$options || '');
              if (!regex.test(item[key])) {
                match = false;
                break;
              }
            } else if (item[key] !== value) {
              match = false;
              break;
            }
          }
          if (match) return true;
        }
        return false;
      }) || null;
    }
    
    return await db.findOne('states', filter);
  }

  static async findAll(filter = {}) {
    return await db.findAll('states', filter);
  }

  static async updateById(id, updates) {
    return await db.updateById('states', id, updates);
  }

  static async deleteById(id) {
    return await db.deleteById('states', id);
  }

  static async countDocuments(filter = {}) {
    return await db.count('states', filter);
  }

  static async find(filter = {}, options = {}) {
    let results = await db.findAll('states', filter);
    
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

  static async save(state) {
    if (state._id) {
      return await this.updateById(state._id, state);
    } else {
      return await this.create(state);
    }
  }
}

module.exports = State;