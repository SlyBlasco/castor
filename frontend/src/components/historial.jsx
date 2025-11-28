import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/Cotizacion.css"; 

export default function Historial({ usuario, handleLogout }) {
  const [cotizaciones, setCotizaciones] = useState([]);

  // TAREA 4: Estados para los filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

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

  // TAREA 4: Lógica de filtrado
  const cotizacionesFiltradas = cotizaciones.filter((c) => {
    // 1. Filtro por nombre (insensible a mayúsculas/minúsculas)
    const coincideNombre = c.nombre_proyecto.toLowerCase().includes(filtroNombre.toLowerCase());
    // 2. Filtro por fecha (si el usuario seleccionó una fecha)
    let coincideFecha = true;
    if (filtroFecha) {
      try {
        const fechaObj = new Date(c.fecha);
        const fechaSoloDia = fechaObj.toISOString().split('T')[0];
        
        coincideFecha = fechaSoloDia === filtroFecha;
      } catch (error) {
        coincideFecha = false;
      }
    }

    return coincideNombre && coincideFecha;
  });

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

        {/* TAREA 4: UI de Filtros */}
        <div className="filtros-container" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
                type="text" 
                placeholder="🔍 Buscar por nombre..." 
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
            />
            <input 
                type="date" 
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {(filtroNombre || filtroFecha) && (
                <button 
                    onClick={() => {setFiltroNombre(''); setFiltroFecha('');}}
                    style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Limpiar
                </button>
            )}
        </div>
        
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
                    {/* TAREA 3: Renderizado dinámico de filas Mostrar nombre, fecha, tipo y total*/}
                    {cotizacionesFiltradas.length > 0 ? (
                        cotizacionesFiltradas.map((c) => (
                            <tr key={c.id_cotizacion} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{new Date(c.fecha).toLocaleDateString()}</td>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{c.nombre_proyecto}</td>
                                <td style={{ padding: '10px' }}>{c.tipo_construccion}</td>
                                <td style={{ padding: '10px', color: '#F2A007', fontWeight: 'bold' }}>
                                    ${Number(c.total).toFixed(2)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                                {cotizaciones.length === 0 ? "Aún no tienes cotizaciones guardadas." : "No se encontraron resultados con esos filtros."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div style={{textAlign: 'center', marginTop: '20px'}}>
             <Link to="/">
                <button style={{ backgroundColor: '#424242' }}>Nueva Cotización</button>
             </Link>
        </div>
      </div>
    </>
  );
}