
// /components/CashflowTable.js

import React from "react";
import styles from "@/styles/cashflow.module.css";

const CashflowTable = ({ data, setData, editable }) => {
  const handleChange = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Origen</th>
          <th>Detalle</th>
          <th>Monto ($)</th>
          {editable && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr key={index}>
            <td>
              {editable ? (
                <input
                  type="date"
                  value={entry.fecha}
                  onChange={(e) => handleChange(index, "fecha", e.target.value)}
                />
              ) : (
                entry.fecha
              )}
            </td>
            <td>
              {editable ? (
                <input
                  type="text"
                  value={entry.origen}
                  onChange={(e) => handleChange(index, "origen", e.target.value)}
                />
              ) : (
                entry.origen
              )}
            </td>
            <td>
              {editable ? (
                <input
                  type="text"
                  value={entry.detalle}
                  onChange={(e) => handleChange(index, "detalle", e.target.value)}
                />
              ) : (
                entry.detalle
              )}
            </td>
            <td>
              {editable ? (
                <input
                  type="number"
                  value={entry.monto}
                  onChange={(e) => handleChange(index, "monto", parseFloat(e.target.value))}
                />
              ) : (
                `$${entry.monto}`
              )}
            </td>
            {editable && (
              <td>
                <button onClick={() => handleDelete(index)}>Eliminar</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CashflowTable;
