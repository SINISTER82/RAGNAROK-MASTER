export default function Champenoise() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#fff', background: '#111', padding: '1rem', borderRadius: '8px' }}>
        Módulo Champenoise – Control por lote
      </h2>
      <p style={{ color: '#ccc', marginTop: '1rem' }}>
        Seguimiento de carbonatación natural, azúcar añadida y estado de pasteurización.
      </p>
      <ul style={{ marginTop: '1rem', color: '#eee' }}>
        <li>🍾 CB – Azúcar añadida: 3g/botella – Listo para pasteurizar</li>
        <li>🍾 ELI – Azúcar: 4g/botella – Incubación controlada – Riesgo: bajo</li>
        <li>⚠️ Advertencia: LOTE 0002 aún no pasteurizado</li>
      </ul>
    </div>
  );
}
