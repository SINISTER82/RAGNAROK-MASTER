import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLogin = router.pathname === "/login";

  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const publicPaths = ["/login"];
    // Si es ruta pública, permitir y terminar
    if (publicPaths.includes(router.pathname)) {
      setAllowed(true);
      setReady(true);
      return;
    }

    // Guardia simple de autenticación
    const authed =
      typeof window !== "undefined" && !!localStorage.getItem("rol");

    if (!authed) {
      setAllowed(false);
      setReady(true);
      router.replace("/login");
    } else {
      setAllowed(true);
      setReady(true);
    }
  }, [router.pathname]);

  // Evita parpadeos mientras chequea auth
  if (!ready) return null;

  const content = <Component {...pageProps} />;

  // En /login NO renderizamos el Layout (oculta sidebar)
  if (isLogin) return content;

  // En rutas protegidas, renderiza Layout sólo si está permitido
  return <Layout>{allowed ? content : null}</Layout>;
}
