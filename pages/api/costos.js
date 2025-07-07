export default function handler(req, res) {
  if (req.method === 'POST') {
    const { insumo, unidad, precio, fecha, comentario } = req.body;
    console.log("💰 Guardar Costo:", req.body);
    res.status(200).json({ mensaje: 'Costo registrado correctamente.' });
  } else {
    res.status(405).json({ mensaje: 'Método no permitido' });
  }
}