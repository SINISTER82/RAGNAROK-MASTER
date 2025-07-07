const mongoose = require("mongoose");

const LoteSchema = new mongoose.Schema({
  codigo: String,
  tipo: String,
  volumenInicial: Number,
  volumenFinal: Number,
  fechaInicio: Date,
  fechaFin: Date,
  OG: Number,
  FG: Number,
  temperaturaInicial: Number,
  temperaturaMedia: Number,
  temperaturaFinal: Number,
  pHInicial: Number,
  pHMedio: Number,
  pHFinal: Number,
  conservantes: [{
    tipo: String,
    dosis: Number,
    fechaAdicion: Date,
    observaciones: String
  }],
  estado: String,
  observaciones: String
});

module.exports = mongoose.model("Lote", LoteSchema);