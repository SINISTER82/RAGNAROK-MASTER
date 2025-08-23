import React, { useState } from 'react';

const NotaCredito = ({ ventas, emitirNotaCredito }) => {
  const [nroFactura, setNroFactura] = useState('');

  const procesarNota = () => {
    const venta = ventas.find(v => v.nro === nroFactura && v.tipo === 'FA');
    if (!venta) return alert('Factura no encontrada o ya anulada');

    const motivo = prompt('Motivo de la nota de crédito:');
    if (!motivo) return alert('Debe ingresar un motivo válido');

    emitirNotaCredito(venta, motivo);
    setNroFactura('');
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <input
        type="text"
        placeholder="Nro factura a anular (FA-000001)..."
        value={nroFactura}
        onChange={e => setNroFactura(e.target.value)}
      />
      <button onClick={procesarNota}>➖ Nota de Crédito</button>
    </div>
  );
};

export default NotaCredito;
