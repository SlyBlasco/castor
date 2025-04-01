import { useState } from 'react';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contrasena })
    })
      .then((res) => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 201) {
          setMensaje(data.message);
          setError('');
        } else {
          setError(data.error || 'Error en el registro');
          setMensaje('');
        }
      })
      .catch(err => setError('Error en la conexión'));
  };

  return (
    <div className="auth-container">
      <h2>Registro</h2>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
