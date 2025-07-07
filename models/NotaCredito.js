const mongoose = require('mongoose');
const NotaCreditoSchema = new mongoose.Schema({
    clienteId: mongoose.Schema.Types.ObjectId,
    motivo: { type: String, required: true },
    productos: [{ producto: String, cantidad: Number, monto: Number }],
    fecha: { type: Date, default: Date.now },
    afectaStock: { type: Boolean, default: false }
});
module.exports = mongoose.model('NotaCredito', NotaCreditoSchema);