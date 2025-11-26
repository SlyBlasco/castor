import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { jsPDF } from "jspdf";
import "react-tooltip/dist/react-tooltip.css";
import "../assets/Cotizacion.css"; 

export default function Cotizacion() {
  const [costos, setCostos] = useState([]);
  const [factores, setFactores] = useState([]);
  const usuarioData = JSON.parse(localStorage.getItem("usuario_data") || "null");
  const usuarioNombre = usuarioData ? usuarioData.nombre : "Invitado";
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [metros, setMetros] = useState("");
  const [factorSeleccionado, setFactorSeleccionado] = useState(1);
  const [costoTotal, setCostoTotal] = useState(0);
  // NUEVO ESTADO: Nombre de la cotización (Requisito HU3)
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

  // Obtener usuarios
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`)
      .then((response) => response.json())
      .then((data) => setUsuario(data));
  }, []);

  // Calcular costo total
  const calcularCosto = () => {
    if (tipoSeleccionado !== null && metros > 0) {
      const costoM2 = costos.find((c) => c.id_tipo === tipoSeleccionado)?.costo || 0;
      setCostoTotal(costoM2 * metros * factorSeleccionado);
    }
  };

  // --- NUEVA FUNCIÓN: GUARDAR COTIZACIÓN (HU3 - Tarea 4) ---
  const guardarCotizacion = async () => {
    if (!usuarioData || !usuarioData.id_usuario) {
        alert("Error: No se ha identificado al usuario. Por favor inicie sesión nuevamente.");
        return;
    }
    if (costoTotal <= 0) {
        alert("Primero debes calcular el costo.");
        return;
    }
    if (!nombreCotizacion.trim()) {
        alert("Por favor asigna un nombre a tu cotización para identificarla después.");
        return;
    }

    const datosGuardar = {
        id_usuario: usuarioData.id_usuario,
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
            alert("¡Cotización guardada exitosamente en tu historial!");
            setNombreCotizacion("");
        } else {
            alert("Error al guardar: " + (data.error || "Desconocido"));
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar con el servidor.");
    }
  };


  const generarReporte = () => {
    if (!tipoSeleccionado || metros <= 0) {
      alert("Por favor, complete todos los datos antes de generar el reporte.");
      return;
    }
    
    // Recuperar el nombre del usuario del localStorage
    const usuario = localStorage.getItem("usuario") || "Invitado";
    const tipo = costos.find((c) => c.id_tipo === tipoSeleccionado);
    const descripcion = tipo ? tipo.descripcion : "No disponible";

    const doc = new jsPDF();

    // CONFIGURACIÓN DEL REPORTE
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título (centrado con acento naranja)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(242, 160, 7); // Color #F2A007
    const titulo = `Reporte de Cotización - ${usuarioNombre}`;
    doc.text(titulo, pageWidth / 2, 20, { align: "center" });

    // Línea divisoria debajo del título
    doc.setDrawColor(242, 160, 7);
    doc.setLineWidth(0.5);
    doc.line(10, 25, pageWidth - 10, 25);

    // Contenido
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51); // Gris oscuro (#333)

    let y = 35; // posición vertical inicial

    // Tipo de construcción
    doc.text(`Tipo de Construcción: ${tipo.id_tipo}`, 10, y);
    y += 10;

    // Descripción: envolvemos el texto para que no se corte
    const maxLineWidth = pageWidth - 20; // márgenes de 10 en ambos lados
    const descripcionTexto = `Descripción: ${descripcion}`;
    const descripcionEnvoltorio = doc.splitTextToSize(descripcionTexto, maxLineWidth);
    doc.text(descripcionEnvoltorio, 10, y);
    y += descripcionEnvoltorio.length * 7; // se incrementa según el número de líneas (ajusta 7 si es necesario)
    
    y += 5; // espacio adicional

    // Área Total
    doc.text(`Área Total: ${metros} m²`, 10, y);
    y += 10;

    // Factor Interciudad
    doc.text(`Factor Interciudad: ${factorSeleccionado}`, 10, y);
    y += 10;

    // Costo Total Estimado
    doc.text(`Costo Total Estimado: $${costoTotal.toFixed(2)}`, 10, y);
    y += 10;

    // Opción: agregar línea divisoria final
    doc.setDrawColor(224, 224, 224); // Gris claro
    doc.line(10, y, pageWidth - 10, y);

    // Guardar el archivo con el nombre que incluye el usuario
    doc.save(`reporte_cotizacion_${usuario}.pdf`);
  };


  return (
    <>
      <div className="navbar">
        <div className="logo">
          <img src="assets/LOGO-PNG-COMPLETO-METALIZADO.png" alt="Logo" />
        </div>
        <div className="menu">
          <a href="#">Cotización básica</a>
          <a href="#">Cotizaciones Anteriores</a>
        </div>
        <div className="user">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="User" />
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

        <h3>Costo total estimado: ${costoTotal.toFixed(2)}</h3>

        <div className="buttons">
          <button>Guardar</button>
          <button>Compartir</button>
          <button onClick={generarReporte}>Generar Reporte</button>
        </div>
      </div>
    </>
  );
}
