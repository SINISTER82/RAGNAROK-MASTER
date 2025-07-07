
// utils.js - Funciones auxiliares del sistema RAGNAROK

// Cálculo de ABV
export const calcularABV = (og, fg) => {
  return ((og - fg) * 131.25).toFixed(2);
};

// Cálculo de rendimiento
export const calcularRendimiento = (inicial, final) => {
  return ((final / inicial) * 100).toFixed(1);
};

// Generar ID único por timestamp
export const generarID = (prefix = "") => {
  return prefix + "_" + Date.now();
};

// Exportador a CSV (simple)
export const exportarCSV = (filename, dataArray) => {
  const keys = Object.keys(dataArray[0]);
  const csvRows = [
    keys.join(","), 
    ...dataArray.map(row => keys.map(k => `"${row[k]}"`).join(","))
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
