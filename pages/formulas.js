import styles from "../styles/formulas.module.css";

import { useState, useEffect } from "react";

export default function Formulas() {
  const [formulas, setFormulas] = useState([]);
  const [tipoBebida, setTipoBebida] = useState("HIDROMIEL");
  const [nombre, setNombre] = useState("");
  const [abv, setAbv] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [litrosIniciales, setLitrosIniciales] = useState("");
  const [litrosFinales, setLitrosFinales] = useState("");
  const [etapas, setEtapas] = useState({
    inicio: "",
    fermentacion: "",
    decantacion: "",
    maduracion: ""
  });
  const [insumos, setInsumos] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [insumosDisponibles, setInsumosDisponibles] = useState([]);
  const [loteActivo, setLoteActivo] = useState(null);
  const [og, setOg] = useState("");
const [fg, setFg] = useState("");

  const [seguimiento, setSeguimiento] = useState({
    etapa: "",
    fecha: "",
    abv: "",
    densidad: "",
    temperatura: "",
    comentario: ""
  });

  useEffect(() => {
    const almacenadas = JSON.parse(localStorage.getItem("formulas")) || [];
    const stock = JSON.parse(localStorage.getItem("stock")) || [];
    const soloInsumos = stock.filter(item => item.tipo === "insumo");
    setFormulas(almacenadas);
    setInsumosDisponibles(soloInsumos);
  }, []);

  const generarLote = () => {
    const timestamp = Date.now().toString().slice(-5);
    return `FML${timestamp}`;
  };

  const agregarInsumo = () => {
    if (!nuevoInsumo || !cantidad) return;
    const insumoSeleccionado = insumosDisponibles.find(i => i.nombre === nuevoInsumo);
    if (!insumoSeleccionado) return;

    const item = {
      nombre: insumoSeleccionado.nombre,
      cantidad: parseFloat(cantidad),
      unidad: insumoSeleccionado.unidad,
      precioUnitario: insumoSeleccionado.precioUnitario,
      precioTotal: (parseFloat(cantidad) * parseFloat(insumoSeleccionado.precioUnitario)).toFixed(2)
    };

    setInsumos([...insumos, item]);
    setNuevoInsumo("");
    setCantidad("");
  };

  const guardarFormula = () => {
    
    const litrosEfectivos = parseFloat(litrosIniciales) * 0.9 || 1;
    const costoTotal = insumos.reduce((sum, i) => sum + parseFloat(i.precioTotal), 0);
    const costoTotalConExtra = parseFloat((costoTotal * 1.10).toFixed(2));
    const costoPorLitroEstimado = parseFloat((costoTotalConExtra / litrosEfectivos).toFixed(2));

    const nuevaFormula = {
      lote: generarLote(),
      og,
      fg,
      tipoBebida,
      nombre,
      abv,
      temperatura,
      litrosIniciales,
      litrosFinales,
      etapas,
      insumos,
      seguimiento: [],
      costoTotalConExtra,
      litrosEstimadosFinales: litrosEfectivos,
      costoPorLitroEstimado,

    };

    const actualizadas = [...formulas, nuevaFormula];
    setFormulas(actualizadas);
    localStorage.setItem("formulas", JSON.stringify(actualizadas));

    
    // Descontar stock
    const stockActual = JSON.parse(localStorage.getItem("stock")) || [];
    const stockActualizado = stockActual.map(item => {
      const usado = insumos.find(i => i.nombre === item.nombre);
      if (usado) {
        return {
          ...item,
          cantidad: parseFloat((parseFloat(item.cantidad) - parseFloat(usado.cantidad)).toFixed(2))
        };
      }
      return item;
    });
    localStorage.setItem("stock", JSON.stringify(stockActualizado));

    setNombre("");
    setAbv("");
    setOg("");
    setFg("");
    setTemperatura("");
    setLitrosIniciales("");
    setLitrosFinales("");
    setEtapas({ inicio: "", fermentacion: "", decantacion: "", maduracion: "" });
    setInsumos([]);
  };

  const guardarSeguimiento = (lote) => {
    const actualizadas = formulas.map(f => {
      if (f.lote === lote) {
        const nuevoSeguimiento = [...(f.seguimiento || []), seguimiento];
        return { ...f, seguimiento: nuevoSeguimiento };
      }
      return f;
    });
    setFormulas(actualizadas);
    localStorage.setItem("formulas", JSON.stringify(actualizadas));
    setSeguimiento({ fecha: "", abv: "", densidad: "", temperatura: "", comentario: "" });
  };

  return (
    <div className={styles.formulasContainer}>
      <h1 className="text-2xl font-bold mb-4">🧪 Módulo de Fórmulas Base</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <select className="text-black p-1" value={tipoBebida} onChange={(e) => setTipoBebida(e.target.value)}>
          <option>HIDROMIEL</option>
          <option>CERVEZA</option>
          <option>VINO</option>
          <option>LICOR</option>
        </select>
        <input className="text-black p-1" placeholder="Nombre fórmula" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        
        <input
          className="text-black p-1"
          type="number"
          step="0.001"
          placeholder="Densidad inicial (OG)"
          value={og}
          onChange={(e) => {
            setOg(e.target.value);
            if (fg) {
              const abvCalc = ((parseFloat(e.target.value) - parseFloat(fg)) * 131.25).toFixed(2);
              setAbv(abvCalc);
            }
          }}
        />
        
                <input className="text-black p-1" type="number" placeholder="Temp. media °C" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} />
        <input className="text-black p-1" type="number" placeholder="Litros iniciales" value={litrosIniciales} onChange={(e) => setLitrosIniciales(e.target.value)} />
        
      </div>

      
      <div className="flex flex-wrap gap-2 mb-4">
        <select className="text-black p-1" value={nuevoInsumo} onChange={(e) => setNuevoInsumo(e.target.value)}>
          <option value="">Seleccionar insumo</option>
          {insumosDisponibles.map((i, index) => (
            <option key={index} value={i.nombre}>{i.nombre}</option>
          ))}
        </select>
        <input className="text-black p-1" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        <button className="bg-green-700 px-2" onClick={agregarInsumo}>+ Agregar insumo</button>
      </div>

      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b border-gray-600">
            <th>Nombre</th><th>Cantidad</th><th>Unidad</th><th>Precio Unitario</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((i, idx) => (
            <tr key={idx} className="border-b border-gray-700">
              <td>{i.nombre}</td>
              <td>{i.cantidad}</td>
              <td>{i.unidad}</td>
              <td>${i.precioUnitario}</td>
              <td>${i.precioTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-blue-700 px-4 py-1 rounded" onClick={guardarFormula}>Guardar fórmula</button>

      <hr className="my-6 border-gray-700" />

      <h2 className="text-xl font-bold mb-2">📚 Fórmulas guardadas</h2>
      {formulas.map((f, idx) => (
        <div key={idx} className="mb-4 border border-gray-600 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="font-bold">{f.nombre} ({f.lote}) – {f.tipoBebida}</span>
            <button className="text-sm text-blue-400 underline" onClick={() => setLoteActivo(loteActivo === f.lote ? null : f.lote)}>
              {loteActivo === f.lote ? "Ocultar" : "Ver"}
            </button>
          </div>
          {loteActivo === f.lote && (
            <div className="mt-2">
              <p>ABV: {f.abv}% (OG: {f.og} | FG: {f.fg}) | Temp: {f.temperatura}°C</p>
              <p>Litros: {f.litrosIniciales} → {f.litrosFinales}</p>
              <p>Etapas: {Object.entries(f.etapas).map(([k, v]) => `${k}: ${v}`).join(" | ")}</p>
              <p className="text-green-400">💰 Costo total: ${f.costoTotalConExtra} | Litros estimados finales: {f.litrosEstimadosFinales} L | Costo por litro: ${f.costoPorLitroEstimado}</p>


              <h4 className="mt-2 font-semibold">📅 Seguimiento</h4>
              {(f.seguimiento || []).map((s, i) => (
                <div key={i} className="text-sm ml-2 mb-1 border-l pl-2 border-gray-600">
                  <strong>{s.fecha}</strong> – <em>{s.etapa}</em>: ABV {s.abv} | Densidad {s.densidad} | Temp {s.temperatura}°C – {s.comentario}
                </div>
              ))}

              <div className="flex flex-wrap gap-2 mt-2">
                <input className="text-black p-1" type="date" value={seguimiento.fecha} onChange={(e) => setSeguimiento({...seguimiento, fecha: e.target.value})} />
                <input className="text-black p-1" placeholder="ABV" value={seguimiento.abv} onChange={(e) => setSeguimiento({...seguimiento, abv: e.target.value})} />
                

<input className="text-black p-1" placeholder="Densidad" value={seguimiento.densidad} onChange={(e) => {
  const nuevaDensidad = e.target.value;
  setSeguimiento({...seguimiento, densidad: nuevaDensidad});

  // Obtener densidades previas del lote actual
  const lotePrevio = formulas.find(f => f.lote === loteActivo);
  const densidades = (lotePrevio?.seguimiento || []).map(s => parseFloat(s.densidad)).filter(d => !isNaN(d));
  const nueva = parseFloat(nuevaDensidad);

  if (densidades.length > 0 && !isNaN(nueva)) {
    const og = parseFloat((densidades[0] / 1000).toFixed(3));
    const fg = parseFloat((nueva / 1000).toFixed(3));
    const abvCalculado = ((og - fg) * 131.25).toFixed(2);
    setSeguimiento(prev => ({ ...prev, abv: abvCalculado }));
  }
}} />


                <input className="text-black p-1" placeholder="Temp °C" value={seguimiento.temperatura} onChange={(e) => setSeguimiento({...seguimiento, temperatura: e.target.value})} />
                
<select className="text-black p-1" value={seguimiento.etapa} onChange={(e) => setSeguimiento({...seguimiento, etapa: e.target.value})}>
  <option value="">Seleccionar etapa</option>
  <option value="Inicio de fermentación">Inicio de fermentación</option>
  <option value="Fermentación activa">Fermentación activa</option>
  <option value="Fortificación">Fortificación</option>
  <option value="Agregados especiales">Agregados especiales</option>
  <option value="Trasbase">Trasbase</option>
  <option value="Decantación / Clarificación">Decantación / Clarificación</option>
</select>
<input className="text-black p-1" placeholder="Comentario" value={seguimiento.comentario} onChange={(e) => setSeguimiento({...seguimiento, comentario: e.target.value})} />

                <button className="bg-purple-700 px-2" onClick={() => guardarSeguimiento(f.lote)}>+ Añadir</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
