
import React, { useState, useEffect } from 'react';
import styles from '../styles/stock.module.css';

const StockModal = ({ onClose, onSave, itemToEdit }) => {
  const [formData, setFormData] = useState({
    sku: '',
    fecha: '',
    tipo: 'insumo',
    nombre: '',
    cantidad: '',
    unidad: 'kg',
    precioTotal: '',
    margen: '',
    ubicacion: '',
    imagen: ''
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
    } else {
      const skuTracker = JSON.parse(localStorage.getItem('skuTracker')) || { lastSKU: 0 };
      setFormData(prev => ({ ...prev, sku: String(skuTracker.lastSKU + 1).padStart(4, '0') }));
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen' && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, imagen: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    const {
      sku, fecha, tipo, nombre, cantidad, unidad,
      precioTotal, margen, ubicacion, imagen
    } = formData;

    if (!nombre || !cantidad || !precioTotal) return alert("Faltan campos obligatorios");

    const precioUnitario = (parseFloat(precioTotal) / parseFloat(cantidad)).toFixed(2);
    const precioVenta = (precioUnitario * (1 + parseFloat(margen || 0) / 100)).toFixed(2);

    const newItem = {
      sku, fecha, tipo, nombre, cantidad, unidad,
      precioTotal, precioUnitario, margen, precioVenta, ubicacion, imagen,
      stock: parseFloat(cantidad)
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{itemToEdit ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <input name="sku" value={formData.sku} readOnly />
        <input name="fecha" type="date" value={formData.fecha} onChange={handleChange} />
        <select name="tipo" value={formData.tipo} onChange={handleChange}>
          <option>insumo</option>
          <option>merchandising</option>
          <option>producto terminado</option>
          <option>packaging</option>
          <option>etiqueta</option>
          <option>botella</option>
          <option>otro</option>
        </select>
        <input name="nombre" placeholder="nombre" value={formData.nombre} onChange={handleChange} />
        <input name="cantidad" placeholder="cantidad" value={formData.cantidad} onChange={handleChange} />
        <select name="unidad" value={formData.unidad} onChange={handleChange}>
          <option>kg</option>
          <option>g</option>
          <option>L</option>
          <option>ml</option>
          <option>u</option>
          <option>pack</option>
        </select>
        <input name="precioTotal" placeholder="precioTotal" value={formData.precioTotal} onChange={handleChange} />
        <input name="margen" placeholder="margen (%)" value={formData.margen} onChange={handleChange} />
        <input name="ubicacion" placeholder="ubicación" value={formData.ubicacion} onChange={handleChange} />
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
        <div className={styles.modalButtons}>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default StockModal;
