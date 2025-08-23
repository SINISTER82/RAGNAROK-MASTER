import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const NavigationMenu = () => {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuario'));
      setUsuario(user);
      setRol(user?.rol || '');
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    router.push('/');
  };

  if (!usuario) return null;

  return (
    <div className="menu">
      <h2>☠️ RAGNAROK</h2>
      <ul>
        {rol === 'admin' && (
          <>
            <li>📊 Dashboard</li>
            <li>⚙️ Producción</li>
            <li>💰 Costos</li>
            <li>📦 Stock</li>
            <li>📐 Fórmulas</li>
            <li>🧪 Control Calidad</li>
            <li>👤 Clientes</li>
            <li>🍾 Embotellado</li>
            <li>🗓️ Cronología</li>
            <li>🍾 Champenoise</li>
          </>
        )}
        <li>🛒 Ventas</li>
        <li>🔐 Cambiar Contraseña</li>
        <li onClick={cerrarSesion}>🚪 Cerrar Sesión</li>
      </ul>
    </div>
  );
};

export default NavigationMenu;
