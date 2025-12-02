import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Tooltip } from "react-tooltip";
import { jsPDF } from "jspdf";
import "react-tooltip/dist/react-tooltip.css";
import "../assets/Cotizacion.css"; 

export default function Cotizacion({ usuario, handleLogout }) {
  const [costos, setCostos] = useState([]);
  const [factores, setFactores] = useState([]);
  const usuarioNombre = usuario ? usuario.nombre : "Invitado";
  const idUsuario = usuario ? usuario.id_usuario : null;

  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [metros, setMetros] = useState("");
  const [factorSeleccionado, setFactorSeleccionado] = useState(1);
  const [costoTotal, setCostoTotal] = useState(0);
  const [totalFormateado, setTotalFormateado] = useState("");
  // Estado para el nombre de la cotización (HU3)
  const [nombreCotizacion, setNombreCotizacion] = useState("");

  // Obtener costos de construcción
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/costos`)
      .then((response) => response.json())
      .then((data) => setCostos(data));
  }, []);

  // Obtener factores interciudad
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/factores`)
      .then((response) => response.json())
      .then((data) => setFactores(data));
  }, []);

  // Actualizar costo total
  useEffect(() => {
    setTotalFormateado(costoTotal.toLocaleString('en-US')); 
  } , [costoTotal]);

  const calcularCosto = () => {
    if (tipoSeleccionado !== null && metros > 0) {
      const costoM2 = costos.find((c) => c.id_tipo === tipoSeleccionado)?.costo || 0;
      setCostoTotal(costoM2 * metros * factorSeleccionado);
    }
  };


  // --- NUEVA FUNCIÓN: GUARDAR COTIZACIÓN (HU3 - Tarea 4) ---
  const guardarCotizacion = async () => {
    if (!idUsuario) {
        alert("Error: No se ha identificado al usuario. Por favor inicie sesión nuevamente.");
        return;
    }
    if (costoTotal <= 0) {
        alert("Primero debes calcular el costo.");
        return;
    }
    if (!nombreCotizacion.trim()) {
        alert("Por favor asigna un nombre a tu cotización.");
        return;
    }

    const datosGuardar = {
        id_usuario: idUsuario,
        nombre: nombreCotizacion,
        metros: parseFloat(metros),
        tipo: tipoSeleccionado,
        factor: factorSeleccionado,
        total: costoTotal
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guardar_cotizacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosGuardar)
        });

        const data = await response.json();

        if (response.ok) {
            alert("¡Cotización guardada exitosamente!");
            setNombreCotizacion(""); 
        } else {
            alert("Error al guardar: " + (data.error || "Desconocido"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <img src="assets/LOGO-PNG-COMPLETO-METALIZADO.png" alt="Logo" />
        </div>
        <div className="menu">
          <Link to="/" style={{fontWeight: 'bold', textDecoration: 'underline'}}>Cotización básica</Link>
          <Link to="/historial" style={{fontWeight: 'bold'}}>Cotizaciones Anteriores</Link>
        </div>
        <div className="user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 'bold', color: 'white' }}>{usuario ? usuario.nombre : "Invitado"}</span>
             <button onClick={handleLogout} style={{ fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}>Salir</button>
             <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </div>
      </div>

      <div className="container">
        <h1>Cotización Básica</h1>
        <h2>Tipo de Construcción</h2>

        <div className="options">
          {costos.map((c) => (
            <div
              key={c.id_tipo}
              className={`option ${tipoSeleccionado === c.id_tipo ? "selected" : ""}`}
              onClick={() => setTipoSeleccionado(c.id_tipo)}
              data-tooltip-id={`tooltip-${c.id_tipo}`}
              data-tooltip-content={c.descripcion} 
            >
              <img src={`/assets/tipo${c.id_tipo}.jpg`} alt={`Tipo ${c.id_tipo}`} />
              <p>Tipo {c.id_tipo}</p>
            </div>
          ))}
        </div>

        {costos.map((c) => (
          <Tooltip key={c.id_tipo} id={`tooltip-${c.id_tipo}`} place="top" />
        ))}

        <div className="area-section">
          <label>Ingresa el área total en m²: </label>
          <input
            type="number"
            value={metros}
            onChange={(e) => setMetros(Number(e.target.value))}
            placeholder="Ingrese metros cuadrados"
          />
        </div>

        <div className="ciudad-section">
          <label>Seleccione factor interciudad: </label>
          <select onChange={(e) => setFactorSeleccionado(Number(e.target.value))}>
            {factores.map((f) => (
              <option key={f.id_factor} value={f.factor}>
                {f.ciudad} (x{f.factor})
              </option>
            ))}
          </select>
          <button onClick={calcularCosto}>Calcular</button>
        </div>

        <h3>Costo total estimado: ${totalFormateado}</h3>

        {/* --- SECCIÓN NUEVA: GUARDAR COTIZACIÓN (HU3 - Tarea 4) --- */}
        <div className="buttons-section" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <input 
                    type="text" 
                    placeholder="Nombre para guardar (ej. Casa Centro)" 
                    value={nombreCotizacion}
                    onChange={(e) => setNombreCotizacion(e.target.value)}
                    style={{padding: '10px', width: '250px'}}
                />
                <button onClick={guardarCotizacion} style={{backgroundColor: '#4CAF50'}}>
                    Guardar Cotización
                </button>
            </div>
        </div>
      </div>
    </>
  );
}