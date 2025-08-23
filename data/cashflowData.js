
// /data/cashflowData.js

export function loadCashflowData() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cashflowData");
    return data ? JSON.parse(data) : [];
  }
  return [];
}

export function saveCashflowData(data) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cashflowData", JSON.stringify(data));
  }
}
