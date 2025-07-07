const mongoose = require("mongoose");

const VentaSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  productos: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
    cantidad: Number,
    descuento: Number
  }],
  fecha: Date,
  metodoEntrega: String,
  total: Number,
  observaciones: String
});

module.exports = mongoose.model("Venta", VentaSchema);