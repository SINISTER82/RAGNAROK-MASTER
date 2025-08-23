import React, { useState, useEffect } from 'react';
import Modal from '../components/ModalFactura';
import ExportCSV from '../components/ExportCSV';
import HistorialVentas from '../components/HistorialVentas';
import NotaCredito from '../components/NotaCredito';
import FacturaPDFPreview from '../components/FacturaPDFPreview';
import styles from '../styles/ventas.module.css';

const Ventas = () => {
  const [clientes, setClientes] = useState([]);
  const [stock, setStock] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [clienteID, setClienteID] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [descuento, setDescuento] = useState(0);
  const [vendedor, setVendedor] = useState('');
  const [claveAutorizada, setClaveAutorizada] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [facturaNro, setFacturaNro] = useState(1);
  const [notaCreditoNro, setNotaCreditoNro] = useState(1);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [mostrarFacturaPDF, setMostrarFacturaPDF] = useState(false);
  const [ventaConfirmada, setVentaConfirmada] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  useEffect(() => {
    const cli = JSON.parse(localStorage.getItem('clientes')) || [];
    const stk = JSON.parse(localStorage.getItem('stock')) || [];
    const vts = JSON.parse(localStorage.getItem('ventas')) || [];
    setClientes(cli);
    setStock(stk);
    setVentas(vts);
    setFacturaNro(vts.filter(v => v.tipo !== 'NC').length + 1);
    setNotaCreditoNro(vts.filter(v => v.tipo === 'NC').length + 1);
  }, []);

  const buscarCliente = () => {
    const cliente = clientes.find(c => c.id === clienteID);
    if (!cliente) {
      alert("Cliente no encontrado.");
      setClienteSeleccionado(null);
    } else {
      setClienteSeleccionado(cliente);
    }
  };

  const productosFiltrados = stock.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && p.cantidad > 0
  );

  const agregarLinea = () => {
    if (!productoSeleccionado || !cantidad || !vendedor) return alert("Campos obligatorios incompletos.");
    if (cantidad > productoSeleccionado.cantidad) return alert("Stock insuficiente.");
    if (descuento > 20 && !claveAutorizada) {
      const clave = prompt("Descuento mayor al 20%. Ingrese clave:");
      if (clave !== "clave2025") return alert("Clave incorrecta.");
      setClaveAutorizada(true);
    }

    const precio = parseFloat(productoSeleccionado.precioVenta);
    const subtotal = ((precio * cantidad) * (1 - descuento / 100)).toFixed(2);

    const nuevaLinea = {
      sku: productoSeleccionado.sku || productoSeleccionado.SKU || '',
      producto: productoSeleccionado.nombre,
      cantidad,
      precio,
      descuento,
      subtotal
    };

    setDetalle([...detalle, nuevaLinea]);
  };

  const totalFactura = detalle.reduce((acc, item) => acc + parseFloat(item.subtotal), 0).toFixed(2);

  const registrarVenta = () => {
    if (!clienteID || !vendedor || detalle.length === 0) return alert("Faltan datos.");
    const cliente = clientes.find(c => c.id === clienteID);
    const nuevaVenta = {
      tipo: 'FA',
      nro: `FA-${facturaNro.toString().padStart(6, '0')}`,
      fecha: new Date().toLocaleString(),
      clienteID,
      clienteNombre: cliente?.nombre || '',
      vendedor,
      detalle,
      total: totalFactura
    };

    const stockActualizado = stock.map(item => {
      const linea = detalle.find(d => d.sku === item.sku);
      if (linea) {
        const nuevaCantidad = Math.max((item.cantidad || 0) - linea.cantidad, 0);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });

    setStock(stockActualizado);
    localStorage.setItem('stock', JSON.stringify(stockActualizado));

    const nuevasVentas = [...ventas, nuevaVenta];
    setVentas(nuevasVentas);
    localStorage.setItem('ventas', JSON.stringify(nuevasVentas));
    setFacturaNro(facturaNro + 1);
    setDetalle([]);
    setMostrarPreview(false);
    setVentaConfirmada(nuevaVenta);
    setMostrarFacturaPDF(true);
  };

  const emitirNotaCredito = (ventaOriginal, motivo) => {
    const nuevaNC = {
      tipo: 'NC',
      nro: `NC-${notaCreditoNro.toString().padStart(6, '0')}`,
      fecha: new Date().toLocaleString(),
      clienteID: ventaOriginal.clienteID,
      clienteNombre: ventaOriginal.clienteNombre,
      vendedor: ventaOriginal.vendedor,
      detalle: ventaOriginal.detalle,
      total: ventaOriginal.total,
      motivo,
      referencia: ventaOriginal.nro
    };

    const stockDevuelto = stock.map(item => {
      const linea = ventaOriginal.detalle.find(d => d.sku === item.sku);
      if (linea) {
        const nuevaCantidad = (item.cantidad || 0) + linea.cantidad;
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });

    const ventasActualizadas = ventas.map(v =>
      v.nro === ventaOriginal.nro ? { ...v, anulada: true } : v
    );

    const nuevasVentas = [...ventasActualizadas, nuevaNC];

    setStock(stockDevuelto);
    localStorage.setItem('stock', JSON.stringify(stockDevuelto));
    setVentas(nuevasVentas);
    localStorage.setItem('ventas', JSON.stringify(nuevasVentas));
    setNotaCreditoNro(notaCreditoNro + 1);
    setVentaConfirmada(nuevaNC);
    setMostrarFacturaPDF(true);
  };

  return (
    <div className={styles.contenedorVentas}>
      <h2>📦 Registro de Ventas</h2>

      <div className={styles.formularioVentas}>
        <label className={styles.label}>ID Cliente:</label>
        <input className={styles.input} value={clienteID} onChange={e => setClienteID(e.target.value)} />
        <button className={styles.boton} onClick={buscarCliente}>Ver datos</button>

        <label className={styles.label}>Vendedor:</label>
        <input className={styles.input} value={vendedor} onChange={e => setVendedor(e.target.value)} />
      </div>

      {clienteSeleccionado && (
        <div className={styles.previewCliente}>
          <p><strong>Nombre:</strong> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
          <p><strong>DNI/CUIT:</strong> {clienteSeleccionado.id}</p>
          <p><strong>Domicilio:</strong> {clienteSeleccionado.direccion}, {clienteSeleccionado.ciudad} ({clienteSeleccionado.cp})</p>
        </div>
      )}

      <div className={styles.formularioVentas}>
        <input
          className={styles.input}
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select className={styles.input} onChange={(e) => {
          const sku = e.target.value;
          const prod = stock.find(p => p.sku === sku);
          setProductoSeleccionado(prod);
        }}>
          <option>-- Seleccione producto --</option>
          {productosFiltrados.map((p, i) => (
            <option key={i} value={p.sku}>{p.nombre} ({p.sku})</option>
          ))}
        </select>

        <label className={styles.label}>Cantidad:</label>
        <input className={styles.input} type="number" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value))} />

        <label className={styles.label}>Descuento %:</label>
        <input className={styles.input} type="number" value={descuento} onChange={e => setDescuento(parseFloat(e.target.value))} />

        <button className={styles.boton} onClick={agregarLinea}>➕ Agregar Línea</button>
      </div>

      <h3>🧾 Detalle de la Venta</h3>
      <div className={styles.tablaVentas}>
        <table>
          <thead>
            <tr>
              <th>SKU</th><th>Producto</th><th>Cant</th><th>Precio</th><th>Desc%</th><th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalle.map((d, i) => (
              <tr key={i}>
                <td>{d.sku}</td><td>{d.producto}</td>
                <td>{d.cantidad}</td>
                <td>${d.precio}</td>
                <td>{d.descuento}%</td>
                <td>${d.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>💵 Total: ${totalFactura}</h3>

      <div className={styles.botonesVenta}>
        <button className={styles.boton} onClick={() => setMostrarPreview(true)}>🖨 Vista previa</button>
        <button className={styles.boton} onClick={registrarVenta}>💾 Confirmar venta</button>
        <ExportCSV ventas={ventas} />
        <NotaCredito ventas={ventas} stock={stock} setStock={setStock} setVentas={setVentas} emitirNotaCredito={emitirNotaCredito} />
      </div>

      {mostrarPreview && (
        <Modal
          venta={{ cliente: clienteSeleccionado, vendedor, detalle, total: totalFactura, nro: facturaNro }}
          onClose={() => setMostrarPreview(false)}
          onConfirm={registrarVenta}
        />
      )}

      {mostrarFacturaPDF && (
        <FacturaPDFPreview
          venta={facturaSeleccionada || { ...ventaConfirmada, cliente: clienteSeleccionado }}
          onClose={() => setMostrarFacturaPDF(false)}
        />
      )}

      <HistorialVentas ventas={ventas} onVerFactura={(venta) => {
        setFacturaSeleccionada(venta);
        setMostrarFacturaPDF(true);
      }} />
    </div>
  );
};

export default Ventas;
