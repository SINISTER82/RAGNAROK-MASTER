import React, { useState } from 'react';
import styles from '../styles/ventas.module.css';

const HistorialVentas = ({ ventas, onVerFactura }) => {
  const [filtro, setFiltro] = useState('');

  const filtradas = ventas.filter(v =>
    (v.clienteNombre?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (v.vendedor?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (v.clienteID?.toString() || '').includes(filtro)
  );

  return (
    <div className={styles.historialVentas}>
      <h3>📚 Historial de Ventas</h3>
      <input
        className={styles.input}
        type="text"
        placeholder="Filtrar por cliente o vendedor..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      <table className={styles.tablaHistorial}>
        <thead>
          <tr>
            <th>Factura</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((v, i) => (
            <tr key={i}>
              <td>{v.nro}</td>
              <td>{v.fecha}</td>
              <td>[{v.clienteID}] {v.clienteNombre}</td>
              <td>{v.vendedor}</td>
              <td>${v.total}</td>
              <td>
                <button className={styles.botonTabla} onClick={() => onVerFactura && onVerFactura(v)}>
                  🧾 Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialVentas;
