import Link from "next/link";

export default function Ragnarok() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{ fontSize: '2rem', borderBottom: '2px solid #555', paddingBottom: '1rem' }}>
        🛡️ Bienvenido al Núcleo del Sistema RAGNAROK
      </h1>
      <p style={{ marginTop: '1rem', color: '#ccc' }}>
        Desde aquí podés acceder a todos los módulos del sistema de gestión SINISTER.
      </p>
      <ul style={{ marginTop: '2rem', lineHeight: '2' }}>
        <li>⚔️ <Link href="/produccion"><span style={{ color: '#8ae' }}>Producción</span></Link></li>
        <li>📦 <Link href="/stock"><span style={{ color: '#8ae' }}>Stock</span></Link></li>
        <li>🧾 <Link href="/costos"><span style={{ color: '#8ae' }}>Costos</span></Link></li>
        <li>📊 <Link href="/dashboard"><span style={{ color: '#8ae' }}>Dashboard</span></Link></li>
        <li>🧪 <Link href="/calidad"><span style={{ color: '#8ae' }}>Calidad</span></Link></li>
        <li>🍾 <Link href="/champenoise"><span style={{ color: '#8ae' }}>Champenoise</span></Link></li>
        <li>🧬 <Link href="/formulas"><span style={{ color: '#8ae' }}>Fórmulas</span></Link></li>
        <li>📆 <Link href="/cronologia"><span style={{ color: '#8ae' }}>Cronología</span></Link></li>
        <li>🛒 <Link href="/ventas"><span style={{ color: '#8ae' }}>Ventas</span></Link></li>
      </ul>
      <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#999' }}>
        Ragnarok – Sistema integral de trazabilidad, rentabilidad y control épico.
      </p>
    </div>
  );
}
