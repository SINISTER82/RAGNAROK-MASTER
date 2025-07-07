const mongoose = require('mongoose');
const StockSchema = new mongoose.Schema({
    insumo: { type: String, required: true },
    cantidad: { type: Number, required: true },
    unidad: { type: String, required: true },
    fechaIngreso: { type: Date, default: Date.now },
    fechaVencimiento: Date,
    observaciones: String
});
module.exports = mongoose.model('Stock', StockSchema);