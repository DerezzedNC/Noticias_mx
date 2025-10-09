const db = require('../utils/jsonDatabase');

class News {
  static async create(newsData) {
    // Validaciones básicas
    if (!newsData.titulo || !newsData.contenido || !newsData.resumen) {
      throw new Error('Título, contenido y resumen son obligatorios');
    }

    const news = {
      titulo: newsData.titulo.trim(),
      contenido: newsData.contenido.trim(),
      resumen: newsData.resumen.trim(),
      autor: newsData.autor,
      categoria: newsData.categoria,
      estado: newsData.estado,
      imagenUrl: newsData.imagenUrl || null,
      fuente: newsData.fuente.trim(),
      estadoVerificacion: newsData.estadoVerificacion || 'pendiente',
      fechaPublicacion: newsData.fechaPublicacion || null,
      verificadoPor: newsData.verificadoPor || null,
      fechaVerificacion: newsData.fechaVerificacion || null,
      motivoRechazo: newsData.motivoRechazo || null,
      etiquetas: newsData.etiquetas || [],
      visitas: newsData.visitas || 0,
      activa: newsData.activa !== undefined ? newsData.activa : true
    };

    return await db.create('news', news);
  }

  static async findById(id) {
    return await db.findById('news', id);
  }

  static async findOne(filter) {
    return await db.findOne('news', filter);
  }

  static async findAll(filter = {}) {
    return await db.findAll('news', filter);
  }

  static async updateById(id, updates) {
    return await db.updateById('news', id, updates);
  }

  static async deleteById(id) {
    return await db.deleteById('news', id);
  }

  static async countDocuments(filter = {}) {
    return await db.count('news', filter);
  }

  static async find(filter = {}, options = {}) {
    let results = await db.findAll('news', filter);
    
    // Búsqueda de texto
    if (filter.$text && filter.$text.$search) {
      const searchTerm = filter.$text.$search;
      const searchFields = ['titulo', 'contenido', 'resumen'];
      results = await db.search('news', searchTerm, searchFields);
      
      // Aplicar otros filtros después de la búsqueda de texto
      const otherFilters = { ...filter };
      delete otherFilters.$text;
      
      if (Object.keys(otherFilters).length > 0) {
        results = results.filter(item => {
          for (const [key, value] of Object.entries(otherFilters)) {
            if (item[key] !== value) return false;
          }
          return true;
        });
      }
    }
    
    // Aplicar ordenamiento
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      results.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        // Manejar fechas
        if (sortField.includes('fecha') || sortField.includes('At')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (sortOrder === 1) {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
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

  static async save(news) {
    if (news._id) {
      return await this.updateById(news._id, news);
    } else {
      return await this.create(news);
    }
  }

  // Método para poblar referencias (simular populate de MongoDB)
  static async populate(news, populateFields) {
    if (!news) return news;
    
    const User = require('./UserJSON');
    const Category = require('./CategoryJSON');
    const State = require('./StateJSON');
    
    // Si es un array de noticias
    if (Array.isArray(news)) {
      const populatedNews = [];
      for (const item of news) {
        populatedNews.push(await this.populate(item, populateFields));
      }
      return populatedNews;
    }
    
    // Poblar campos individuales
    for (const field of populateFields) {
      if (field.path === 'autor' && news.autor) {
        const autor = await User.findById(news.autor);
        if (autor) {
          news.autor = field.select ? 
            this.selectFields(autor, field.select) : autor;
        }
      }
      
      if (field.path === 'categoria' && news.categoria) {
        const categoria = await Category.findById(news.categoria);
        if (categoria) {
          news.categoria = field.select ? 
            this.selectFields(categoria, field.select) : categoria;
        }
      }
      
      if (field.path === 'estado' && news.estado) {
        const estado = await State.findById(news.estado);
        if (estado) {
          news.estado = field.select ? 
            this.selectFields(estado, field.select) : estado;
        }
      }
      
      if (field.path === 'verificadoPor' && news.verificadoPor) {
        const verificador = await User.findById(news.verificadoPor);
        if (verificador) {
          news.verificadoPor = field.select ? 
            this.selectFields(verificador, field.select) : verificador;
        }
      }
    }
    
    return news;
  }
  
  static selectFields(obj, selectString) {
    const fields = selectString.split(' ');
    const result = {};
    
    for (const field of fields) {
      if (obj[field] !== undefined) {
        result[field] = obj[field];
      }
    }
    
    return result;
  }
}

module.exports = News;