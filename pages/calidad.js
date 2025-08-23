import { useEffect, useState } from "react";
import styles from "../styles/calidad.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Calidad() {
  const STORAGE_KEY = "calidad_evaluaciones_v2";

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [fileObj, setFileObj] = useState(null);

  const [form, setForm] = useState({
    lote: "", fecha: "", evaluador: "", observaciones: "",
    sabor: "", aroma: "", claridad: "", gasificacion: "", cuerpo: "", espuma: "",
    ph: "", densidadFinal: "", abv: "", color: "", co2: "",
    pruebaRapida: false, resultadoMicro: "No aplica",
    cierreOK: false, envaseOK: false, etiquetaOK: false,
  });

  /* Carga/guardado */
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setEvaluaciones(JSON.parse(raw)); }
    catch (e) { console.error("localStorage read:", e); }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluaciones)); }
    catch (e) { console.error("localStorage write:", e); }
  }, [evaluaciones]);

  /* Handlers */
  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileObj({ nombre: file.name, data: reader.result });
    reader.readAsDataURL(file);
  };
  const limpiarForm = () => {
    setForm({
      lote: "", fecha: "", evaluador: "", observaciones: "",
      sabor: "", aroma: "", claridad: "", gasificacion: "", cuerpo: "", espuma: "",
      ph: "", densidadFinal: "", abv: "", color: "", co2: "",
      pruebaRapida: false, resultadoMicro: "No aplica",
      cierreOK: false, envaseOK: false, etiquetaOK: false,
    });
    setFileObj(null);
  };

  /* Validación + CRUD */
  const validar = () => {
    if (!form.lote.trim()) return "Ingresá el código de lote.";
    for (const c of ["sabor","aroma","claridad","gasificacion"]) {
      const v = Number(form[c]);
      if (Number.isNaN(v) || v < 1 || v > 10) return `El campo ${c} debe ser 1–10.`;
    }
    return null;
  };
  const guardar = () => {
    const error = validar(); if (error) return alert(error);
    const registro = {
      id: Date.now(),
      lote: form.lote.trim(),
      fecha: form.fecha || new Date().toISOString().split("T")[0],
      evaluador: form.evaluador.trim(),
      observaciones: form.observaciones.trim(),
      sabor: Number(form.sabor), aroma: Number(form.aroma),
      claridad: Number(form.claridad), gasificacion: Number(form.gasificacion),
      cuerpo: form.cuerpo ? Number(form.cuerpo) : null,
      espuma: form.espuma ? Number(form.espuma) : null,
      ph: form.ph || null, densidadFinal: form.densidadFinal || null,
      abv: form.abv || null, color: form.color || null, co2: form.co2 || null,
      pruebaRapida: !!form.pruebaRapida, resultadoMicro: form.resultadoMicro,
      cierreOK: !!form.cierreOK, envaseOK: !!form.envaseOK, etiquetaOK: !!form.etiquetaOK,
      adjunto: fileObj || null,
    };
    setEvaluaciones((l) => [...l, registro]);
    limpiarForm();
  };
  const eliminar = (id) => {
    if (!confirm("¿Eliminar esta evaluación?")) return;
    setEvaluaciones((l) => l.filter((e) => e.id !== id));
  };

  /* Export PDF (con anchos fijos) */
  const exportarPDF = () => {
    if (!evaluaciones.length) return alert("No hay evaluaciones para exportar.");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const fechaHoy = new Date().toLocaleString();

    doc.setFontSize(16); doc.text("Control de Calidad - SINISTER", 40, 40);
    doc.setFontSize(10); doc.text(`Exportado: ${fechaHoy}`, 40, 60);

    const columns = [
      { header: "Fecha", dataKey: "fecha" },
      { header: "Lote", dataKey: "lote" },
      { header: "S/A/C/G", dataKey: "sensorial" },
      { header: "pH", dataKey: "ph" },
      { header: "Micro", dataKey: "micro" },
      { header: "Empaque", dataKey: "empaque" },
      { header: "Obs.", dataKey: "obs" },
      { header: "Adjunto", dataKey: "adj" },
    ];

    const rows = evaluaciones.map((e) => ({
      fecha: e.fecha || "-",
      lote: e.lote || "-",
      sensorial: [e.sabor, e.aroma, e.claridad, e.gasificacion].map(v => v ?? "-").join("/"),
      ph: e.ph ?? "-",
      micro: e.resultadoMicro || "-",
      empaque: `${e.cierreOK ? "✔" : "✖"}${e.envaseOK ? "✔" : "✖"}${e.etiquetaOK ? "✔" : "✖"}`,
      obs: (e.observaciones || "").replace(/\s+/g," ").slice(0,120),
      adj: e.adjunto?.nombre || "-",
    }));

    autoTable(doc, {
      startY: 80,
      headStyles: { fillColor: [22,22,22], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 6, overflow: "linebreak" },
      columnStyles: {
        fecha: { cellWidth: 70 },
        lote: { cellWidth: 60 },
        sensorial: { cellWidth: 80 },
        ph: { cellWidth: 40 },
        micro: { cellWidth: 60 },
        empaque: { cellWidth: 70 },
        obs: { cellWidth: 180 },
        adj: { cellWidth: 120 },
      },
      columns, body: rows,
      didDrawPage: (data) => {
        const str = `Página ${doc.internal.getNumberOfPages()}`;
        doc.setFontSize(9);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    doc.save("control_calidad.pdf");
  };

  const total = evaluaciones.length;

  /* Helper visual para Micro */
  const MicroBadge = ({ estado }) => {
    if (estado === "OK") return <span className={`${styles.badge} ${styles.badgeOk}`}>OK</span>;
    if (estado === "Contaminado") return <span className={`${styles.badge} ${styles.badgeDanger}`}>Contaminado</span>;
    return <span className={`${styles.badge} ${styles.badgeWarn}`}>No aplica</span>;
  };

  return (
    <div className={styles.pageContent}>
      <h2 className={styles.title}>✅ Control de Calidad</h2>
      <p className={styles.counter}>Evaluaciones: {total}</p>

      {/* TRAZABILIDAD */}
      <div className={styles.formGrid}>
        <input className={styles.inputEstilo} type="text"  name="lote"      placeholder="Código de lote" value={form.lote} onChange={onChange} />
        <input className={styles.inputEstilo} type="date"  name="fecha"     value={form.fecha} onChange={onChange} />
        <input className={styles.inputEstilo} type="text"  name="evaluador" placeholder="Evaluador"      value={form.evaluador} onChange={onChange} />
      </div>

      {/* SENSORIAL */}
      <h3 style={{ marginTop: 8, marginBottom: 6 }}>Sensorial</h3>
      <div className={styles.formGrid}>
        <input className={styles.inputEstilo} type="number" name="sabor"        placeholder="Sabor (1-10)"        value={form.sabor} onChange={onChange} min={1} max={10} />
        <input className={styles.inputEstilo} type="number" name="aroma"        placeholder="Aroma (1-10)"        value={form.aroma} onChange={onChange} min={1} max={10} />
        <input className={styles.inputEstilo} type="number" name="claridad"     placeholder="Claridad (1-10)"     value={form.claridad} onChange={onChange} min={1} max={10} />
        <input className={styles.inputEstilo} type="number" name="gasificacion" placeholder="Gasificación (1-10)" value={form.gasificacion} onChange={onChange} min={1} max={10} />
        <input className={styles.inputEstilo} type="number" name="cuerpo"       placeholder="Cuerpo (1-10) opcional" value={form.cuerpo} onChange={onChange} min={1} max={10} />
        <input className={styles.inputEstilo} type="number" name="espuma"       placeholder="Espuma (1-10) opcional" value={form.espuma} onChange={onChange} min={1} max={10} />
      </div>

      {/* FÍSICO-QUÍMICO */}
      <h3 style={{ marginTop: 8, marginBottom: 6 }}>Físico-químico</h3>
      <div className={styles.formGrid}>
        <input className={styles.inputEstilo} type="text" name="ph"            placeholder="pH"                 value={form.ph} onChange={onChange} />
        <input className={styles.inputEstilo} type="text" name="densidadFinal" placeholder="Densidad final / Brix" value={form.densidadFinal} onChange={onChange} />
        <input className={styles.inputEstilo} type="text" name="abv"           placeholder="Alcohol %"          value={form.abv} onChange={onChange} />
        <input className={styles.inputEstilo} type="text" name="color"         placeholder="Color (SRM/EBC)"    value={form.color} onChange={onChange} />
        <input className={styles.inputEstilo} type="text" name="co2"           placeholder="CO₂ objetivo (vol)" value={form.co2} onChange={onChange} />
      </div>

      {/* MICROBIOLÓGICO */}
      <h3 style={{ marginTop: 8, marginBottom: 6 }}>Microbiológico</h3>
      <div className={styles.formGrid}>
        <label className={styles.inputEstilo} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="pruebaRapida" checked={form.pruebaRapida} onChange={onChange} />
          Prueba rápida realizada
        </label>
        <select name="resultadoMicro" className={styles.inputEstilo} value={form.resultadoMicro} onChange={onChange}>
          <option>No aplica</option><option>OK</option><option>Contaminado</option>
        </select>
      </div>

      {/* EMPAQUE */}
      <h3 style={{ marginTop: 8, marginBottom: 6 }}>Empaque / Presentación</h3>
      <div className={styles.formGrid}>
        <label className={styles.inputEstilo} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="cierreOK"   checked={form.cierreOK}   onChange={onChange} /> Integridad del cierre
        </label>
        <label className={styles.inputEstilo} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="envaseOK"   checked={form.envaseOK}   onChange={onChange} /> Estado del envase
        </label>
        <label className={styles.inputEstilo} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="etiquetaOK" checked={form.etiquetaOK} onChange={onChange} /> Etiquetado correcto
        </label>
      </div>

      {/* OBS + ADJUNTO + ACCIONES */}
      <div className={styles.formGrid}>
        <textarea className={`${styles.inputEstilo} ${styles.textarea}`} name="observaciones" placeholder="Observaciones / acciones tomadas" value={form.observaciones} onChange={onChange} />
        <input className={styles.inputEstilo} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
        <div className={styles.toolbar}>
          <button className={styles.boton} onClick={guardar}>Guardar evaluación</button>
          <button className={styles.boton} onClick={exportarPDF} title="Exporta todo el histórico a PDF">Exportar PDF</button>
        </div>
      </div>

      {/* TABLA */}
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Fecha</th><th>Lote</th><th>Sens. (S/A/C/G)</th><th>pH</th><th>Micro</th>
            <th>Empaque</th><th>Observaciones</th><th>Adjunto</th><th></th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map((e) => {
            const sensorial = [e.sabor, e.aroma, e.claridad, e.gasificacion].map(v => v ?? "-").join("/");
            const empaque = `${e.cierreOK ? "✔" : "✖"}${e.envaseOK ? "✔" : "✖"}${e.etiquetaOK ? "✔" : "✖"}`;
            return (
              <tr key={e.id}>
                <td>{e.fecha}</td>
                <td>{e.lote}</td>
                <td>{sensorial}</td>
                <td>{e.ph ?? "—"}</td>
                <td><MicroBadge estado={e.resultadoMicro} /></td>
                <td title="Cierre / Envase / Etiqueta">{empaque}</td>
                <td style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.observaciones}
                </td>
                <td>
                  {e.adjunto ? (
                    <a className={styles.linkAdj} href={e.adjunto.data} download={e.adjunto.nombre}>📎 {e.adjunto.nombre}</a>
                  ) : "—"}
                </td>
                <td>
                  <button className={styles.btnIcon} onClick={() => eliminar(e.id)} title="Eliminar">✖</button>
                </td>
              </tr>
            );
          })}
          {evaluaciones.length === 0 && (
            <tr><td colSpan={9} style={{ opacity: .7, padding: 16 }}>No hay evaluaciones cargadas.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
