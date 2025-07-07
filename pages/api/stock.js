export default function handler(req, res) {
  if (req.method === 'POST') {
    const { insumo, cantidad } = req.body;
    console.log("📦 Guardar Stock:", req.body);
    res.status(200).json({ mensaje: 'Stock actualizado correctamente.' });
  } else {
    res.status(405).json({ mensaje: 'Método no permitido' });
  }
}