const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  contenido: {
    type: String,
    required: [true, 'El contenido es obligatorio'],
    minlength: [100, 'El contenido debe tener al menos 100 caracteres']
  },
  resumen: {
    type: String,
    required: [true, 'El resumen es obligatorio'],
    maxlength: [300, 'El resumen no puede exceder 300 caracteres']
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El autor es obligatorio']
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es obligatoria']
  },
  estado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: [true, 'El estado es obligatorio']
  },
  imagenUrl: {
    type: String,
    default: null
  },
  fuente: {
    type: String,
    required: [true, 'La fuente es obligatoria'],
    maxlength: [100, 'La fuente no puede exceder 100 caracteres']
  },
  estadoVerificacion: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente'
  },
  fechaPublicacion: {
    type: Date,
    default: null
  },
  verificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fechaVerificacion: {
    type: Date,
    default: null
  },
  motivoRechazo: {
    type: String,
    default: null,
    maxlength: [500, 'El motivo de rechazo no puede exceder 500 caracteres']
  },
  etiquetas: [{
    type: String,
    trim: true,
    maxlength: [30, 'Cada etiqueta no puede exceder 30 caracteres']
  }],
  visitas: {
    type: Number,
    default: 0
  },
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para mejorar la búsqueda
newsSchema.index({ categoria: 1, estado: 1, estadoVerificacion: 1 });
newsSchema.index({ fechaPublicacion: -1 });
newsSchema.index({ titulo: 'text', contenido: 'text', resumen: 'text' });

module.exports = mongoose.model('News', newsSchema);