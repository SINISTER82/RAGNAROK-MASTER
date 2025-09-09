import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { cambiarContrasena } from '../auth';

const CambiarContrasena = () => {
  const router = useRouter();
  const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleChange = () => {
    if (!nuevaContrasena) return;
    cambiarContrasena(usuarioActual.nombre, nuevaContrasena);
    setMensaje('Contraseña actualizada con éxito.');
    setNuevaContrasena('');
  };

  if (!usuarioActual) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Cambiar Contraseña</h2>
      <p>Usuario: <strong>{usuarioActual.nombre}</strong></p>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
      />
      <button onClick={handleChange}>Actualizar</button>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
    </div>
  );
};

export default CambiarContrasena;