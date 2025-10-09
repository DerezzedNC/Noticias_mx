const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del estado es obligatorio'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'El código del estado es obligatorio'],
    unique: true,
    uppercase: true,
    maxlength: [5, 'El código no puede exceder 5 caracteres']
  },
  region: {
    type: String,
    required: [true, 'La región es obligatoria'],
    enum: ['Norte', 'Centro', 'Sur', 'Occidente', 'Oriente']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('State', stateSchema);