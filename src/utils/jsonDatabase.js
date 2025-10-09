const fs = require('fs').promises;
const path = require('path');

class JSONDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.collections = {
      users: 'users.json',
      news: 'news.json',
      categories: 'categories.json',
      states: 'states.json'
    };
    this.init();
  }

  async init() {
    try {
      // Crear directorio de datos si no existe
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Inicializar archivos JSON si no existen
      for (const [collection, filename] of Object.entries(this.collections)) {
        const filePath = path.join(this.dataDir, filename);
        try {
          await fs.access(filePath);
        } catch {
          await fs.writeFile(filePath, JSON.stringify([], null, 2));
        }
      }
    } catch (error) {
      console.error('Error inicializando base de datos JSON:', error);
    }
  }

  async read(collection) {
    try {
      const filePath = path.join(this.dataDir, this.collections[collection]);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error leyendo ${collection}:`, error);
      return [];
    }
  }

  async write(collection, data) {
    try {
      const filePath = path.join(this.dataDir, this.collections[collection]);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error escribiendo ${collection}:`, error);
      return false;
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Métodos CRUD
  async create(collection, item) {
    try {
      const data = await this.read(collection);
      item._id = this.generateId();
      item.createdAt = new Date();
      item.updatedAt = new Date();
      data.push(item);
      await this.write(collection, data);
      return item;
    } catch (error) {
      throw new Error(`Error creando en ${collection}: ${error.message}`);
    }
  }

  async findAll(collection, filter = {}) {
    try {
      const data = await this.read(collection);
      if (Object.keys(filter).length === 0) return data;
      
      return data.filter(item => {
        for (const [key, value] of Object.entries(filter)) {
          if (item[key] !== value) return false;
        }
        return true;
      });
    } catch (error) {
      throw new Error(`Error buscando en ${collection}: ${error.message}`);
    }
  }

  async findById(collection, id) {
    try {
      const data = await this.read(collection);
      return data.find(item => item._id === id) || null;
    } catch (error) {
      throw new Error(`Error buscando por ID en ${collection}: ${error.message}`);
    }
  }

  async findOne(collection, filter) {
    try {
      const data = await this.read(collection);
      return data.find(item => {
        for (const [key, value] of Object.entries(filter)) {
          if (typeof value === 'object' && value.$regex) {
            const regex = new RegExp(value.$regex, value.$options || '');
            if (!regex.test(item[key])) return false;
          } else if (item[key] !== value) {
            return false;
          }
        }
        return true;
      }) || null;
    } catch (error) {
      throw new Error(`Error buscando uno en ${collection}: ${error.message}`);
    }
  }

  async updateById(collection, id, updates) {
    try {
      const data = await this.read(collection);
      const index = data.findIndex(item => item._id === id);
      
      if (index === -1) return null;
      
      data[index] = { 
        ...data[index], 
        ...updates, 
        updatedAt: new Date() 
      };
      
      await this.write(collection, data);
      return data[index];
    } catch (error) {
      throw new Error(`Error actualizando en ${collection}: ${error.message}`);
    }
  }

  async deleteById(collection, id) {
    try {
      const data = await this.read(collection);
      const index = data.findIndex(item => item._id === id);
      
      if (index === -1) return null;
      
      const deleted = data.splice(index, 1)[0];
      await this.write(collection, data);
      return deleted;
    } catch (error) {
      throw new Error(`Error eliminando en ${collection}: ${error.message}`);
    }
  }

  async count(collection, filter = {}) {
    try {
      const results = await this.findAll(collection, filter);
      return results.length;
    } catch (error) {
      throw new Error(`Error contando en ${collection}: ${error.message}`);
    }
  }

  // Método para buscar texto
  async search(collection, searchTerm, fields = []) {
    try {
      const data = await this.read(collection);
      const term = searchTerm.toLowerCase();
      
      return data.filter(item => {
        for (const field of fields) {
          if (item[field] && item[field].toLowerCase().includes(term)) {
            return true;
          }
        }
        return false;
      });
    } catch (error) {
      throw new Error(`Error buscando texto en ${collection}: ${error.message}`);
    }
  }
}

// Singleton
const db = new JSONDatabase();

module.exports = db;