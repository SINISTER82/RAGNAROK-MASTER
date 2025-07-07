const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  descripcion: String,
  precioVenta: Number,
  loteAsociado: String
});

module.exports = mongoose.model("Producto", ProductoSchema);