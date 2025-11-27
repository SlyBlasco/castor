import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/Cotizacion.css"; 

export default function Historial({ usuario, handleLogout }) {
  const [cotizaciones, setCotizaciones] = useState([]);

  // TAREA 2: Integrar con el endpoint y renderizar datos dinámicamente
  useEffect(() => {
    if (usuario && usuario.id_usuario) {
      fetch(`${import.meta.env.VITE_API_URL}/api/cotizaciones/${usuario.id_usuario}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setCotizaciones(data);
            } else {
                setCotizaciones([]);
            }
        })
        .catch(err => console.error("Error al cargar historial:", err));
    }
  }, [usuario]);

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <img src="assets/LOGO-PNG-COMPLETO-METALIZADO.png" alt="Logo" />
        </div>
        <div className="menu">
          <Link to="/">Cotización básica</Link>
          <Link to="/historial" style={{fontWeight: 'bold', textDecoration: 'underline'}}>Cotizaciones Anteriores</Link>
        </div>
        <div className="user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontWeight: 'bold', color: 'white' }}>{usuario ? usuario.nombre : "Invitado"}</span>
             <button onClick={handleLogout} style={{ fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}>Salir</button>
             <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </div>
      </div>

      <div className="container">
        <h1>Historial de Cotizaciones</h1>
        
        {/* TAREA 2: Estructura de la Tabla */}
        <div className="tabla-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#424242', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Fecha</th>
                        <th style={{ padding: '12px' }}>Proyecto</th>
                        <th style={{ padding: '12px' }}>Tipo</th>
                        <th style={{ padding: '12px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Renderizado dinámico de filas */}
                    {/* FALTANTE TAREA 3 */}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
}