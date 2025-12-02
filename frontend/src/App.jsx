import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Cotizacion from './components/cotizacion';
import Historial from './components/historial';
import Detalle from './components/detalle';
import './assets/App.css';
import { useState, useEffect } from 'react';

export default function Main() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Intentamos recuperar la sesión
    const usuarioGuardado = localStorage.getItem("usuario_data");
    
    if (usuarioGuardado) {
      try {
        // Intentamos convertir el texto a objeto JSON
        const usuarioParseado = JSON.parse(usuarioGuardado);
        setUsuario(usuarioParseado);
      } catch (error) {
        // SI FALLA (porque los datos son viejos o inválidos):
        console.error("Error al leer datos del usuario:", error);
        // Borramos los datos corruptos para que no vuelva a pasar
        localStorage.removeItem("usuario_data");
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario_data");
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            usuario ? (
              /* Pasamos handleLogout a Cotizacion para usarlo allá */
              <Cotizacion usuario={usuario} handleLogout={handleLogout} /> 
            ) : (
              /* Mensaje simple si no hay sesión */
              <div style={{textAlign: 'center', marginTop: '50px'}}>
                <h1>Bienvenido a Riva Construcciones</h1>
                <p>Por favor, <Link to="/login">inicia sesión</Link> o <Link to="/register">regístrate</Link> para continuar.</p>
              </div>
            )
          } 
        />
        <Route 
          path="/historial" 
          element={
            usuario ? (
              <Historial usuario={usuario} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/login" 
          element={!usuario ? <Login onLogin={setUsuario} /> : <Navigate to="/" />} 
        />
        <Route path="/register" element={<Register />} />
        {/* Ruta para el Detalle (HU4)*/}
        <Route 
          path="/detalle/:id" 
          element={
            usuario ? (
              <Detalle usuario={usuario} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
        } />
      </Routes>
    </Router>
  );
}