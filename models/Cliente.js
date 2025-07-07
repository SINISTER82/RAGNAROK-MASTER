const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  identificacion: String,
  canal: String,
  saldoCuentaCorriente: Number,
  razonSocial: String,
  cuit: String,
  direccion: String,
  telefono: String
});

module.exports = mongoose.model("Cliente", ClienteSchema);