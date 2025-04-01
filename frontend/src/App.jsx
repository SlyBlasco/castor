import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import Cotizacion from './components/cotizacion'; // Tu componente original de cotización
import './assets/App.css';
import { useState } from 'react';

export default function Main() {
  const [usuario, setUsuario] = useState(null);

  return (
    <Router>
      <nav>
        <Link to="/">Cotización</Link> |{" "}
        <Link to="/login">Iniciar Sesión</Link> |{" "}
        <Link to="/register">Registro</Link>
      </nav>
      <Routes>
        <Route path="/" element={usuario ? <Cotizacion usuario={usuario} /> : <p>Por favor, inicia sesión.</p>} />
        <Route path="/login" element={<Login onLogin={setUsuario} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
