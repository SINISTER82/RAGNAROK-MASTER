import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import { getUser, logout } from "../auth";
import styles from "../styles/layout.module.css";

const Layout = ({ children }) => {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    logout();
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;