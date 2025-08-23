import React, { useRef } from 'react';
import styles from '../styles/factura.module.css';

const FacturaPDFPreview = ({ venta, onClose }) => {
  const facturaRef = useRef();

  if (!venta) return null;

  const { nro, fecha, cliente, vendedor, detalle, total } = venta;

  const handlePrint = () => {
    const contenido = facturaRef.current.innerHTML;
    const ventana = window.open('', '', 'width=800,height=1000');
    ventana.document.write(
      '<html><head><title>Factura SINISTER</title>' +
      '<style>' +
      'body { font-family: Arial, sans-serif; padding: 20px; color: #000; }' +
      '.header { display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 10px; }' +
      '.facturaInfo { text-align: right; }' +
      '.clienteDatos { margin-top: 20px; line-height: 1.6; }' +
      'table { width: 100%; border-collapse: collapse; margin-top: 20px; }' +
      'th, td { border: 1px solid #000; padding: 8px; text-align: left; }' +
      'th { background-color: #222; color: white; }' +
      'td:last-child, th:last-child { text-align: right; }' +
      '.totalFinal { text-align: right; font-size: 1.2rem; margin-top: 20px; }' +
      '.pie { margin-top: 40px; font-size: 0.85rem; text-align: center; color: #555; }' +
      '</style>' +
      '</head><body onload="window.print(); setTimeout(() => window.close(), 500);">' +
      contenido +
      '</body></html>'
    );
    ventana.document.close();
  };

  return (
    <div className={styles.facturaContainer}>
      <div className={styles.facturaA4} ref={facturaRef}>
        <header className={styles.header}>
          <div>
            <h1>SINISTER HIDROMIEL</h1>
            <p>CUIT: 20-12345678-9</p>
            <p>Calle Valhalla 123 – San Salvador de Jujuy</p>
            <p>Condición IVA: Responsable Inscripto</p>
          </div>
          <div className={styles.facturaInfo}>
            <h2>Factura Nº {nro}</h2>
            <p>{fecha}</p>
          </div>
        </header>

        <section className={styles.clienteDatos}>
          <p><strong>Cliente:</strong> {cliente?.nombre} {cliente?.apellido}</p>
          <p><strong>DNI / CUIT:</strong> {cliente?.id}</p>
          <p><strong>Domicilio:</strong> {cliente?.direccion}, {cliente?.ciudad} ({cliente?.cp})</p>
          <p><strong>Vendedor:</strong> {vendedor}</p>
        </section>

        <table className={styles.detalleTabla}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Desc%</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalle.map((item, index) => (
              <tr key={index}>
                <td>{item.sku}</td>
                <td>{item.producto}</td>
                <td>${item.precio}</td>
                <td>{item.descuento}%</td>
                <td>{item.cantidad}</td>
                <td>${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.totalFinal}>
          <strong>Total:</strong> ${total}
        </div>

        <footer className={styles.pie}>
          <p>Este comprobante no es válido como factura hasta su autorización por AFIP.</p>
        </footer>
      </div>

      <div className={styles.botones}>
        <button onClick={handlePrint}>🖨️ Imprimir</button>
        <button onClick={() => alert('Función de envío por email próximamente')}>📧 Enviar por mail</button>
        <button onClick={onClose}>❌ Cerrar</button>
      </div>
    </div>
  );
};

export default FacturaPDFPreview;
