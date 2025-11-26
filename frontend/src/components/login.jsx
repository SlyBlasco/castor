import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    })
      .then((res) => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200) {
          // Guarda el nombre del usuario en localStorage
          localStorage.setItem("usuario", data.usuario.nombre);
          // Puedes también llamar a onLogin para actualizar el estado global si lo usas
          localStorage.setItem("usuario", data.usuario.nombre);
          onLogin(data.usuario);
          // Redirige al componente principal (p.ej., Cotizacion)
          navigate('/');
        } else {
          setError(data.error || 'Error en el inicio de sesión');
        }
      })
      .catch(err => setError('Error en la conexión'));
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Correo:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <label>Contraseña:</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
