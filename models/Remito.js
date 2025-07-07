const mongoose = require('mongoose');
const RemitoSchema = new mongoose.Schema({
    clienteId: mongoose.Schema.Types.ObjectId,
    productos: [{ producto: String, cantidad: Number }],
    fechaEnvio: { type: Date, default: Date.now },
    tipoEntrega: String,
    observaciones: String
});
module.exports = mongoose.model('Remito', RemitoSchema);