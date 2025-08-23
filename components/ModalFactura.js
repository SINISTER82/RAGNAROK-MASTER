
import React from 'react';

const ModalFactura = ({ venta, onClose, onConfirm }) => {
  return (
    <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', color: 'white' }}>
      <h3>🧾 Vista Previa de Factura</h3>
      <p><strong>Factura Nº:</strong> FA-{venta.nro.toString().padStart(6, '0')}</p>
      <p><strong>Cliente:</strong> {venta.cliente?.nombre || 'Sin nombre'}</p>
      <p><strong>Vendedor:</strong> {venta.vendedor}</p>
      <table>
        <thead>
          <tr><th>Producto</th><th>Cant</th><th>Precio</th><th>Desc%</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          {venta.detalle.map((d, i) => (
            <tr key={i}>
              <td>{d.producto}</td>
              <td>{d.cantidad}</td>
              <td>${d.precio}</td>
              <td>{d.descuento}%</td>
              <td>${d.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total:</strong> ${venta.total}</p>
      <button onClick={onConfirm}>✅ Confirmar</button>
      <button onClick={onClose}>❌ Cancelar</button>
    </div>
  );
};

export default ModalFactura;
