// pages/clientes.js
import { useState, useEffect } from 'react';
import styles from '../styles/clientes.module.css';
import codigosPostales from '../data/codigos_postales_arg';

const cpToCiudades = codigosPostales;

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    id: '', nombre: '', apellido: '', mail: '', telefono: '',
    cp: '', ciudad: '', direccion: '', canal: '', modalidad: '',
    condicionIVA: ''
  });
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('clientes');
    if (saved) setClientes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const cp = String(formData.cp).trim(); // ✅ CORRECCIÓN APLICADA
    if (cp && cpToCiudades[cp]) {
      const lista = cpToCiudades[cp];
      setCiudadesDisponibles(lista);
      if (lista.length === 1) {
        setFormData(prev => ({ ...prev, ciudad: lista[0] }));
      } else {
        setFormData(prev => ({ ...prev, ciudad: '' }));
      }
    } else {
      setCiudadesDisponibles([]);
    }
  }, [formData.cp]);

  const guardarCliente = () => {
    const nuevosClientes = [...clientes, formData];
    setClientes(nuevosClientes);
    localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
    setFormData({ id: '', nombre: '', apellido: '', mail: '', telefono: '', cp: '', ciudad: '', direccion: '', canal: '', modalidad: '', condicionIVA: '' });
  };

  const eliminarCliente = (id) => {
    const filtrados = clientes.filter(c => c.id !== id);
    setClientes(filtrados);
    localStorage.setItem('clientes', JSON.stringify(filtrados));
  };

  return (
    <div className={styles.container}>
      <h2 className="text-xl font-bold mb-4">Gestión de Clientes</h2>
      <div className={styles.gridForm}>
        <input placeholder="ID (DNI o CUIT)" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} />
        <input placeholder="Nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
        <input placeholder="Apellido" value={formData.apellido} onChange={e => setFormData({ ...formData, apellido: e.target.value })} />
        <input placeholder="Correo electrónico" value={formData.mail} onChange={e => setFormData({ ...formData, mail: e.target.value })} />
        <input placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
        <input placeholder="Código Postal" value={formData.cp} onChange={e => setFormData({ ...formData, cp: e.target.value })} />

        {ciudadesDisponibles.length > 1 ? (
          <select value={formData.ciudad} onChange={e => setFormData({ ...formData, ciudad: e.target.value })}>
            <option value="">Seleccionar ciudad</option>
            {ciudadesDisponibles.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        ) : (
          <input placeholder="Ciudad" value={formData.ciudad} onChange={e => setFormData({ ...formData, ciudad: e.target.value })} />
        )}

        <input placeholder="Dirección" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} />

        <select value={formData.canal} onChange={e => setFormData({ ...formData, canal: e.target.value })}>
          <option value="">Canal de venta</option>
          <option value="Mayorista">Mayorista</option>
          <option value="Minorista">Minorista</option>
          <option value="Distribuidor">Distribuidor</option>
          <option value="Online">Online</option>
        </select>

        <select value={formData.modalidad} onChange={e => setFormData({ ...formData, modalidad: e.target.value })}>
          <option value="">Modalidad de entrega</option>
          <option value="Envío a domicilio">Envío a domicilio</option>
          <option value="Retiro inmediato">Retiro inmediato</option>
          <option value="Despacho nacional">Despacho nacional</option>
        </select>

        <select value={formData.condicionIVA} onChange={e => setFormData({ ...formData, condicionIVA: e.target.value })}>
          <option value="">Condición frente al IVA</option>
          <option value="Responsable Inscripto">Responsable Inscripto</option>
          <option value="Monotributista">Monotributista</option>
          <option value="Exento">Exento</option>
          <option value="Consumidor Final">Consumidor Final</option>
        </select>
      </div>

      <button className="mt-4 p-2 bg-green-600 text-white rounded" onClick={guardarCliente}>Guardar Cliente</button>

      <div className={styles.scrollHorizontal}>
        <table className="mt-6 w-full text-sm">
          <thead><tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Ciudad</th><th>Eliminar</th></tr></thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.apellido}</td>
                <td>{c.ciudad}</td>
                <td><button onClick={() => eliminarCliente(c.id)} className="text-red-600">🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
