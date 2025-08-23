import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styles from "../styles/cashflow.module.css";

export default function Cashflow() {
  const [transacciones, setTransacciones] = useState([]);
  const [tipo, setTipo] = useState("Ingreso");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [categoria, setCategoria] = useState("");

  // Filtros de rango de fechas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Cargar al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem("cashflow");
    if (datosGuardados) {
      setTransacciones(JSON.parse(datosGuardados));
    }
  }, []);

  // Guardar cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cashflow", JSON.stringify(transacciones));
  }, [transacciones]);

  // Subir archivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setArchivo({
        nombre: file.name,
        data: reader.result, // Base64
      });
    };
    reader.readAsDataURL(file);
  };

  // Agregar movimiento
  const agregarTransaccion = () => {
    if (!descripcion || !monto) return alert("Completa los campos");

    const nueva = {
      id: Date.now(),
      tipo,
      descripcion,
      monto: parseFloat(monto),
      fecha: fecha || new Date().toISOString().split("T")[0], // YYYY-MM-DD
      archivo,
      categoria: tipo === "Egreso" ? categoria : ""
    };

    const actualizadas = [...transacciones, nueva];
    setTransacciones(actualizadas);

    setDescripcion("");
    setMonto("");
    setFecha("");
    setArchivo(null);
    setCategoria("");
  };

  // Eliminar movimiento
  const eliminarTransaccion = (id) => {
    const actualizadas = transacciones.filter((t) => t.id !== id);
    setTransacciones(actualizadas);
  };

  // Filtro por rango de fechas
  const transaccionesFiltradas = transacciones.filter((t) => {
    if (fechaInicio && t.fecha < fechaInicio) return false;
    if (fechaFin && t.fecha > fechaFin) return false;
    return true;
  });

  // Calcular totales
  const ingresos = transaccionesFiltradas
    .filter((t) => t.tipo === "Ingreso")
    .reduce((a, b) => a + b.monto, 0);

  const egresos = transaccionesFiltradas
    .filter((t) => t.tipo === "Egreso")
    .reduce((a, b) => a + b.monto, 0);

  const balance = ingresos - egresos;

  // Exportar a Excel
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(transaccionesFiltradas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Cashflow");
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "cashflow.xlsx");
  };

  return (
    <div className={styles.contenidoAlineado}>
      <h2>📊 Cashflow</h2>

      {/* Formulario de carga */}
      <div className={styles.fila}>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={styles.select}
        >
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={styles.input}
        />

        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className={styles.input}
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={styles.input}
        />

        {tipo === "Egreso" && (
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={styles.select}
          >
            <option value="">Seleccionar categoría</option>
            <option>insumo</option>
            <option>merchandising</option>
            <option>producto terminado</option>
            <option>packaging</option>
            <option>etiqueta</option>
            <option>botella</option>
            <option>otro</option>
          </select>
        )}

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className={styles.input}
        />

        <button onClick={agregarTransaccion} className={styles.boton}>
          Agregar
        </button>
      </div>

      {/* Filtros de fecha */}
      <div className={styles.fila}>
        <label>Desde:</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className={styles.input}
        />
        <label>Hasta:</label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className={styles.input}
        />
        <button onClick={exportarExcel} className={styles.boton}>
          📥 Exportar a Excel
        </button>
      </div>

      {/* Tabla */}
      <h3>📑 Registros</h3>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Adjunto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transaccionesFiltradas.map((t) => (
            <tr key={t.id}>
              <td>{t.tipo}</td>
              <td>{t.descripcion}</td>
              <td>${t.monto.toFixed(2)}</td>
              <td>{t.fecha}</td>
              <td>{t.categoria || "—"}</td>
              <td>
                {t.archivo ? (
                  <a href={t.archivo.data} download={t.archivo.nombre}>
                    📎 {t.archivo.nombre}
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td>
                <button
                  onClick={() => eliminarTransaccion(t.id)}
                  className={styles.botonEliminar}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <h3 className={styles.total}>
        💰 Ingresos: ${ingresos.toFixed(2)} | 📉 Egresos: ${egresos.toFixed(
          2
        )} | ⚖️ Balance: ${balance.toFixed(2)}
      </h3>
    </div>
  );
}
