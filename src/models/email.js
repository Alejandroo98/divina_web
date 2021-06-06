const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Email = new Schema({
  nombres: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    require: true,
  },

  mensaje: {
    type: String,
    require: true,
  },

  fechaMensaje: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('emails', Email);
