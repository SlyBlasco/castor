import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../assets/Cotizacion.css";

export default function Detalle({ usuario, handleLogout }) {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [cotizacion, setCotizacion] = useState(null);
  const [error, setError] = useState("");

  // Cargar los datos al abrir la página
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cotizacion/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar la cotización");
        return res.json();
      })
      .then(data => setCotizacion(data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <div className="container"><p style={{color: 'red'}}>{error}</p><Link to="/historial">Volver</Link></div>;
  if (!cotizacion) return <div className="container"><p>Cargando...</p></div>;

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <img src="/assets/LOGO-PNG-COMPLETO-METALIZADO.png" alt="Logo" />
        </div>
        <div className="menu">
          <Link to="/">Cotización básica</Link>
          <Link to="/historial">Cotizaciones Anteriores</Link>
        </div>
        <div className="user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontWeight: 'bold', color: 'white' }}>{usuario ? usuario.nombre : "Invitado"}</span>
             <button onClick={handleLogout} style={{ fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}>Salir</button>
             <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </div>
      </div>

      <div className="container">
        <h1>Detalle de Cotización</h1>
        
        {/* Tarjeta de Detalle (Read-only) */}
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left', backgroundColor: '#f9f9f9' }}>
            
            <h2 style={{ borderBottom: '2px solid #F2A007', paddingBottom: '10px', color: '#424242' }}>
                {cotizacion.nombre_proyecto}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div>
                    <strong>Fecha:</strong>
                    <p>{new Date(cotizacion.fecha).toLocaleDateString()}</p>
                </div>
                <div>
                    <strong>Total Estimado:</strong>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#F2A007' }}>
                        ${Number(cotizacion.total).toFixed(2)}
                    </p>
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Tipo de Construcción:</strong>
                    <p>{cotizacion.tipo_nombre}</p>
                    <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>{cotizacion.tipo_descripcion}</p>
                </div>

                <div>
                    <strong>Metros Cuadrados:</strong>
                    <p>{cotizacion.metros} m²</p>
                </div>
                <div>
                    <strong>Factor Interciudad:</strong>
                    <p>x {cotizacion.factor}</p>
                </div>
            </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/historial">
                <button style={{ backgroundColor: '#666' }}>Volver al Historial</button>
            </Link>
             {/* FUTURO FEATURE HU2 */}
            <button style={{ marginLeft: '10px' }}>Descargar PDF</button>
        </div>

      </div>
    </>
  );
}