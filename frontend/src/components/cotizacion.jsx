import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { jsPDF } from "jspdf";
import "react-tooltip/dist/react-tooltip.css";
import "../assets/Cotizacion.css"; 

export default function Cotizacion() {
  const [costos, setCostos] = useState([]);
  const [factores, setFactores] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [metros, setMetros] = useState("");
  const [factorSeleccionado, setFactorSeleccionado] = useState(1);
  const [costoTotal, setCostoTotal] = useState(0);

  // Obtener costos de construcción
  useEffect(() => {
    fetch("http://localhost:5000/api/costos")
      .then((response) => response.json())
      .then((data) => setCostos(data));
  }, []);

  // Obtener factores interciudad
  useEffect(() => {
    fetch("http://localhost:5000/api/factores")
      .then((response) => response.json())
      .then((data) => setFactores(data));
  }, []);

  // Obtener usuarios
  useEffect(() => {
    fetch("http://localhost:5000/api/usuarios")
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

  const generarReporte = () => {
    if (!tipoSeleccionado || metros <= 0) {
      alert("Por favor, complete todos los datos antes de generar el reporte.");
      return;
    }
  
    const doc = new jsPDF();
    doc.setFontSize(16);
  
    const tipo = costos.find((c) => c.id_tipo === tipoSeleccionado);
    const descripcion = tipo ? tipo.descripcion : "No disponible";
    const user = usuario.find((u) => u.nombre);
  
    doc.text(`Reporte de Cotización ${user.nombre}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Tipo de Construcción: ${tipo.id_tipo}`, 10, 30);
    doc.text(`Descripción: ${descripcion}`, 10, 40);
    doc.text(`Área Total: ${metros} m²`, 10, 50);
    doc.text(`Factor Interciudad: ${factorSeleccionado}`, 10, 60);
    doc.text(`Costo Total Estimado: $${costoTotal.toFixed(2)}`, 10, 70);
  
    doc.save("reporte_cotizacion.pdf");
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
