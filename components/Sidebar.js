
import styles from "../styles/sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h1 className={styles.logo}>SINISTER</h1>
      <nav className={styles.nav}>
        <a href="/stock" className={`${styles.button} ${styles.buttonStock}`}>🧾 Stock</a>
        <a href="/formulas" className={`${styles.button} ${styles.buttonFormulas}`}>🧪 Fórmulas</a>
        <a href="/embotellado" className={`${styles.button} ${styles.buttonEmbotellado}`}>🍾 Embotellado</a>
        <a href="/clientes" className={`${styles.button} ${styles.buttonClientes}`}>🧍 Clientes</a>
        <a href="/ventas" className={`${styles.button} ${styles.buttonVentas}`}>💰 Ventas</a>
        <a href="/cashflow" className={`${styles.button} ${styles.buttonCashflow}`}>📊 Cashflow</a>
        <a href="/calidad" className={`${styles.button} ${styles.buttonControlCalidad}`}>✅ Control de Calidad</a>
      </nav>
    </div>
  );
}
