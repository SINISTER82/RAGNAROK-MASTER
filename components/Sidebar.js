export default function Sidebar() {
  return (
    <aside style={{ width: '200px', backgroundColor: '#1e1e1e', height: '100vh', padding: '20px', color: 'white' }}>
      <h2>SINISTER</h2>
      <nav>
        <a href="/">Inicio</a>
        <a href="/produccion">Producción</a>
        <a href="/ventas">Ventas</a>
        <a href="/costos">Costos</a>
      </nav>
    </aside>
  );
}
