
import React, { useState, useEffect } from 'react';

const ImportarDesdeCostos = () => {
  const [costos, setCostos] = useState([]);
  const [stock, setStock] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [margen, setMargen] = useState(30);
  const [stockInicial, setStockInicial] = useState(0);
  const [sku, setSku] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  useEffect(() => {
    const costosData = JSON.parse(localStorage.getItem('costos')) || [];
    const stockData = JSON.parse(localStorage.getItem('stock')) || [];
    const stockNombres = stockData.map(i => i.nombre);
    const noImportados = costosData.filter(i => !stockNombres.includes(i.nombre));
    setCostos(noImportados);
    setStock(stockData);
  }, []);

  const abrirModal = (insumo, index) => {
    const nuevoSku = `SKU-${(stock.length + index + 1).toString().padStart(3, '0')}`;
    setInsumoSeleccionado(insumo);
    setSku(nuevoSku);
    setMargen(30);
    setStockInicial(0);
    setFechaVencimiento('');
  };

  const confirmarImportacion = () => {
    if (!insumoSeleccionado) return;
    const precioBase = parseFloat(insumoSeleccionado.precioUnitario || 0);
    const margenValor = parseFloat(margen || 0);
    const precioVenta = (precioBase * (1 + margenValor / 100)).toFixed(2);

    const nuevoItem = {
      sku,
      nombre: insumoSeleccionado.nombre,
      tipo: insumoSeleccionado.tipo,
      precio: precioBase,
      unidad: insumoSeleccionado.unidad,
      margen: margenValor,
      precioVenta: precioVenta,
      stock: parseFloat(stockInicial),
      vencimiento: fechaVencimiento
    };
    const nuevoStock = [...stock, nuevoItem];
    localStorage.setItem('stock', JSON.stringify(nuevoStock));
    setStock(nuevoStock);
    setInsumoSeleccionado(null);
  };

  const eliminarDelStock = (skuEliminar) => {
    const actualizado = stock.filter(item => item.sku !== skuEliminar);
    localStorage.setItem('stock', JSON.stringify(actualizado));
    setStock(actualizado);
  };

  return (
    <div>
      <h2>Importar desde Costos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Unidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {costos.map((insumo, idx) => (
            <tr key={idx}>
              <td>{insumo.nombre}</td>
              <td>{insumo.tipo}</td>
              <td>${insumo.precioUnitario}</td>
              <td>{insumo.unidad}</td>
              <td><button onClick={() => abrirModal(insumo, idx)}>Importar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {insumoSeleccionado && (
        <div className="modal">
          <h3>Importar: {insumoSeleccionado.nombre}</h3>
          <label>SKU: <input value={sku} onChange={e => setSku(e.target.value)} /></label><br/>
          <label>Margen de ganancia (%): <input type="number" value={margen} onChange={e => setMargen(e.target.value)} /></label><br/>
          <label>Precio final de venta: ${(parseFloat(insumoSeleccionado?.precioUnitario || 0) * (1 + parseFloat(margen || 0) / 100)).toFixed(2)}</label><br/>
          <label>Stock inicial: <input type="number" value={stockInicial} onChange={e => setStockInicial(e.target.value)} /></label><br/>
          <label>Fecha de vencimiento: <input type="date" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} /></label><br/>
          <button onClick={confirmarImportacion}>Confirmar Importación</button>
        </div>
      )}

      <h2>Stock Actual</h2>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Unidad</th>
            <th>Stock</th>
            <th>Margen %</th>
            <th>Venta $</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item, idx) => (
            <tr key={idx}>
              <td>{item.sku}</td>
              <td>{item.nombre}</td>
              <td>{item.tipo}</td>
              <td>${item.precio}</td>
              <td>{item.unidad}</td>
              <td>{item.stock}</td>
              <td>{item.margen}%</td>
              <td>${item.precioVenta}</td>
              <td><button onClick={() => eliminarDelStock(item.sku)}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportarDesdeCostos;
