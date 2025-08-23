import { useRouter } from "next/router";
import styles from "../styles/topbar.module.css";

export default function Topbar() {
  const router = useRouter();
  const path = router.pathname.replace("/", "");
  const nombreModulo = path.charAt(0).toUpperCase() + path.slice(1) || "Dashboard";

  return (
    <div className={styles.topbar}>
      <span className={styles.text}>🔸 {nombreModulo.toUpperCase()}</span>
    </div>
  );
}