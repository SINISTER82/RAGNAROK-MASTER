const mongoose = require('mongoose');
const RecetaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipoBebida: String,
    ingredientes: [{ nombre: String, cantidad: Number, unidad: String }],
    rendimiento: Number,
    abvEstimado: Number,
    observaciones: String
});
module.exports = mongoose.model('Receta', RecetaSchema);