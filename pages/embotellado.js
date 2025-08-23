import React, { useState, useEffect } from 'react';
import styles from '../styles/embotellado.module.css'; // ← vínculo al CSS modular

const Embotellado = () => {
  const [lote, setLote] = useState('');
  const [fecha, setFecha] = useState('');
  const [presentacion, setPresentacion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [litrosReales, setLitrosReales] = useState('');
  const [variante, setVariante] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [packaging, setPackaging] = useState('');
  const [bijou, setBijou] = useState('');
  const [bolsa, setBolsa] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [registros, setRegistros] = useState([]);
  const [fórmulas, setFórmulas] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('embotellado')) || [];
    setRegistros(guardados);

    const formulasGuardadas = JSON.parse(localStorage.getItem('formulas')) || [];
    setFórmulas(formulasGuardadas);

    const stockGeneral = JSON.parse(localStorage.getItem('stock')) || [];
    setStock(stockGeneral);
  }, []);

  useEffect(() => {
    const formulaSeleccionada = fórmulas.find(f => f.lote === lote);
    if (formulaSeleccionada) {
      const litros = parseFloat(formulaSeleccionada.litrosIniciales) * 0.9;
      setLitrosReales(litros.toFixed(2));
      if (presentacion) {
        const ml = presentacion.includes("750") ? 750 : 330;
        const cantBotellas = Math.floor((litros * 1000) / ml);
        setCantidad(cantBotellas);
      }
    }
  }, [lote, presentacion]);

  const calcularCostoUnitario = () => {
    const formulaSeleccionada = fórmulas.find(f => f.lote === lote);
    if (!formulaSeleccionada) return 0;

    const costoPorLitro = parseFloat(formulaSeleccionada.costoPorLitroEstimado) || 0;
    const volumenBotella = presentacion.includes("750") ? 750 : 330;

    const etiquetaStock = stock.find(s => s.nombre === etiqueta);
    const packagingStock = stock.find(s => s.nombre === packaging);
    const bijouStock = stock.find(s => s.nombre === bijou);
    const bolsaStock = stock.find(s => s.nombre === bolsa);

    const costoEtiqueta = etiquetaStock ? parseFloat(etiquetaStock.precioUnitario) : 0;
    const costoPackaging = packagingStock ? parseFloat(packagingStock.precioUnitario) : 0;
    const costoBijou = bijouStock ? parseFloat(bijouStock.precioUnitario) : 0;
    const costoBolsa = bolsaStock ? parseFloat(bolsaStock.precioUnitario) : 0;

    const costoBotella = (costoPorLitro * (volumenBotella / 1000)) + costoEtiqueta + costoPackaging + costoBijou + costoBolsa;
    return costoBotella.toFixed(2);
  };

  const guardarRegistro = () => {
    if (!lote || !fecha || !presentacion || !cantidad || !variante || !litrosReales || !etiqueta || !packaging || !bijou || !bolsa) {
      alert("Por favor, completá todos los campos obligatorios.");
      return;
    }

    const nuevo = {
      lote, fecha, presentacion, cantidad: parseInt(cantidad), litrosReales: parseFloat(litrosReales),
      variante, etiqueta, packaging, bijou, bolsa,
      costoUnitario: calcularCostoUnitario(),
      observaciones
    };

    const actualizados = [...registros, nuevo];
    setRegistros(actualizados);
    localStorage.setItem("embotellado", JSON.stringify(actualizados));
    limpiar();
  };

  const limpiar = () => {
    setLote(''); setFecha(''); setPresentacion(''); setCantidad(''); setLitrosReales('');
    setVariante(''); setEtiqueta(''); setPackaging(''); setBijou(''); setBolsa('');
    setObservaciones('');
  };

  const lotesDisponibles = fórmulas.map(f => f.lote);
  const variantesDisponibles = fórmulas.map(f => f.nombre);
  const etiquetas = stock.filter(i => i.tipo === "etiqueta");
  const packagings = stock.filter(i => i.tipo === "botella");
  const bolsas = stock.filter(i => i.tipo === "packaging");
  const bijouList = stock.filter(i => i.tipo === "merchandising");

  return (
    <div className={styles.container}>
      <h1 className="text-2xl font-bold mb-4 text-white">🧪 Embotellado Final</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-col items-start">
          <select className="text-black p-1 mb-1" value={lote} onChange={(e) => setLote(e.target.value)}>
            <option value="">Seleccionar lote</option>
            {lotesDisponibles.map((cod, i) => (<option key={i} value={cod}>{cod}</option>))}
          </select>
          <button className="bg-green-700 px-4 py-1 rounded text-white" onClick={guardarRegistro}>Guardar</button>
        </div>
        <input className="text-black p-1" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <select className="text-black p-1" value={presentacion} onChange={(e) => setPresentacion(e.target.value)}>
          <option value="">Seleccionar presentación</option>
          <option value="Barrica 750cc">Barrica 750cc</option>
          <option value="Porrón 330cc">Porrón 330cc</option>
          <option value="Guarda 750cc">Guarda 750cc</option>
        </select>
        <input className="text-black p-1" type="number" placeholder="Cantidad botellas" value={cantidad} readOnly />
        <input className="text-black p-1" type="number" placeholder="Litros reales" value={litrosReales} readOnly />
        <select className="text-black p-1" value={variante} onChange={(e) => setVariante(e.target.value)}>
          <option value="">Seleccionar variante</option>
          {variantesDisponibles.map((v, i) => (<option key={i} value={v}>{v}</option>))}
        </select>
        <select className="text-black p-1" value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)}>
          <option value="">Etiqueta</option>
          {etiquetas.map((e, i) => (<option key={i} value={e.nombre}>{e.nombre}</option>))}
        </select>
        <select className="text-black p-1" value={packaging} onChange={(e) => setPackaging(e.target.value)}>
          <option value="">Botella</option>
          {packagings.map((p, i) => (<option key={i} value={p.nombre}>{p.nombre}</option>))}
        </select>
        <select className="text-black p-1" value={bolsa} onChange={(e) => setBolsa(e.target.value)}>
          <option value="">Bolsa</option>
          {bolsas.map((p, i) => (<option key={i} value={p.nombre}>{p.nombre}</option>))}
        </select>
        <select className="text-black p-1" value={bijou} onChange={(e) => setBijou(e.target.value)}>
          <option value="">Dije</option>
          {bijouList.map((b, i) => (<option key={i} value={b.nombre}>{b.nombre}</option>))}
        </select>
        <input className="text-black p-1" placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
      </div>

      <h2 className="text-xl font-bold mb-2 text-white">📦 Registros de Embotellado</h2>
      <div className={styles.scrollHorizontal}>
        <table className="text-sm w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th>Lote</th><th>Fecha</th><th>Presentación</th><th>Cant.</th><th>Litros</th><th>Variante</th>
              <th>Etiqueta</th><th>Botella</th><th>Bolsa</th><th>Dije</th><th>$ Botella</th><th>Obs.</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td>{r.lote}</td><td>{r.fecha}</td><td>{r.presentacion}</td><td>{r.cantidad}</td>
                <td>{r.litrosReales}</td><td>{r.variante}</td><td>{r.etiqueta}</td><td>{r.packaging}</td>
                <td>{r.bolsa}</td><td>{r.bijou}</td><td>${r.costoUnitario}</td><td>{r.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Embotellado;
