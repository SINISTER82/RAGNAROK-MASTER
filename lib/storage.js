
// storage.js - Módulo para manejar localStorage de manera segura
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Error guardando en localStorage", err);
  }
};

export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Error cargando de localStorage", err);
    return null;
  }
};
