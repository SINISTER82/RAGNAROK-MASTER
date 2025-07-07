export default function handler(req, res) {
  if (req.method === 'POST') {
    const { lote, miel, agua, levadura, fecha } = req.body;
    console.log("🔧 Guardar Producción:", req.body);
    res.status(200).json({ mensaje: 'Producción guardada correctamente.' });
  } else {
    res.status(405).json({ mensaje: 'Método no permitido' });
  }
}