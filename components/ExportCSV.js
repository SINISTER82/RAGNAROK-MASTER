
import React from 'react';

const ExportCSV = ({ ventas }) => {
  const generarCSV = () => {
    const encabezado = 'Factura,Fecha,Cliente,Vendedor,Total\n';
    const filas = ventas.map(v =>
      `${v.nro},${v.fecha},${v.clienteNombre},${v.vendedor},${v.total}`
    );
    const csv = encabezado + filas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ventas.csv';
    link.click();
  };

  return <button onClick={generarCSV}>📤 Exportar Ventas</button>;
};

export default ExportCSV;
