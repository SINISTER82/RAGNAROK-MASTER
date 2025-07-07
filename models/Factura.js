const mongoose = require('mongoose');
const FacturaSchema = new mongoose.Schema({
    clienteId: mongoose.Schema.Types.ObjectId,
    razonSocial: String,
    cuit: String,
    detalles: [{
        producto: String,
        cantidad: Number,
        descuento: Number,
        precioUnitario: Number
    }],
    subtotal: Number,
    impuestos: Number,
    total: Number,
    fechaEmision: { type: Date, default: Date.now },
    tipoEntrega: String
});
module.exports = mongoose.model('Factura', FacturaSchema);