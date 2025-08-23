import React, { useState, useEffect } from 'react';
import styles from '../styles/stock.module.css';
import StockModal from '../components/StockModal';

const Stock = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    nombre: '',
    tipo: '',
    unidad: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('stock');
    if (stored) {
      const data = JSON.parse(stored);
      setItems(data);
      setFiltered(data);
    }
  }, []);

  const handleSave = (item) => {
    const exists = items.find(i => i.sku === item.sku);
    let updated;
    if (exists) {
      updated = items.map(i => i.sku === item.sku ? item : i);
    } else {
      updated = [...items, item];
      localStorage.setItem('skuTracker', JSON.stringify({ lastSKU: parseInt(item.sku) }));
    }
    setItems(updated);
    setFiltered(updated);
    localStorage.setItem('stock', JSON.stringify(updated));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filteredItems = items.filter(item =>
      item.nombre.toLowerCase().includes(newFilters.nombre.toLowerCase()) &&
      (newFilters.tipo === '' || item.tipo === newFilters.tipo) &&
      (newFilters.unidad === '' || item.unidad === newFilters.unidad)
    );
    setFiltered(filteredItems);
  };

  return (
    <div style={{ paddingLeft: '160px', paddingRight: '20px', paddingTop: '20px' }}>
      <h1 className={styles.titulo}>📦 Control de Stock y Costos</h1>

      <div className={styles.filtros}>
        <input
          name="nombre"
          placeholder="Buscar por nombre"
          value={filters.nombre}
          onChange={handleFilterChange}
        />
        <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
          <option value="">Todos los tipos</option>
          <option>insumo</option>
          <option>merchandising</option>
          <option>producto terminado</option>
          <option>packaging</option>
          <option>etiqueta</option>
          <option>botella</option>
          <option>otro</option>
        </select>
        <select name="unidad" value={filters.unidad} onChange={handleFilterChange}>
          <option value="">Todas las unidades</option>
          <option>kg</option>
          <option>g</option>
          <option>L</option>
          <option>ml</option>
          <option>u</option>
          <option>pack</option>
        </select>
        <button className={styles.boton} onClick={() => { setEditingItem(null); setShowModal(true); }}>+ Agregar producto</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Precio Total</th>
            <th>Unitario</th>
            <th>Margen</th>
            <th>Venta</th>
            <th>Ubicación</th>
            <th>Imagen</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, idx) => (
            <tr key={idx}>
              <td>{item.sku}</td>
              <td>{item.fecha}</td>
              <td>{item.tipo}</td>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>{item.unidad}</td>
              <td>${item.precioTotal}</td>
              <td>${item.precioUnitario}</td>
              <td>{item.margen}%</td>
              <td>${item.precioVenta}</td>
              <td>{item.ubicacion}</td>
              <td>{item.imagen ? <img src={item.imagen} className={styles.imagenMiniatura} alt="imagen" /> : '—'}</td>
              <td><button onClick={() => { setEditingItem(item); setShowModal(true); }}>✏️</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <StockModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default Stock;
