const mongoose = require('mongoose');
const InsumoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: String,
    precioUnitario: Number,
    proveedor: String,
    fechaVencimiento: Date,
    stockMinimo: Number
});
module.exports = mongoose.model('Insumo', InsumoSchema);