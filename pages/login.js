import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Si ya está logueado, mandarlo directo a /stock (cambiá si querés otro inicio)
  useEffect(() => {
    const rol = typeof window !== "undefined" ? localStorage.getItem("rol") : null;
    if (rol) router.replace("/stock");
  }, []);

  const handleLogin = (e) => {
    e?.preventDefault?.();

    const ok =
      (usuario === "admin" && password === "1234") ||
      (usuario === "vendedor1" && password === "1234") ||
      (usuario === "vendedor2" && password === "1234");

    if (ok) {
      const rol = usuario === "admin" ? "admin" : "vendedor";
      localStorage.setItem("rol", rol);
      router.replace("/stock"); // o "/" si tenés home
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div
      style={{
        marginLeft: 180,
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#000",
        color: "#fff",
      }}
    >
      <form onSubmit={handleLogin} style={{ width: 320 }}>
        <h2 style={{ marginBottom: 16 }}>Acceso a SINISTER</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <div style={{ color: "#ff7b7b", marginBottom: 8 }}>{error}</div>
        )}

        <button type="submit" style={btnStyle}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: 10,
  padding: "10px 12px",
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 10,
  color: "#eaeaea",
  outline: "none",
};

const btnStyle = {
  width: "100%",
  background: "#e7b10a",
  border: "none",
  color: "#151515",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 800,
};
