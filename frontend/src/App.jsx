import React from "react";
import "./assets/App.css"; // Importa los estilos

export default function App() {
  return (
    <>
      <div className="navbar">
        <div className="logo"><img src="../public/LOGO-PNG-COMPLETO-METALIZADO.png"></img></div>
        <div className="menu">
          <a href="#">Cotización básica</a>
          <a href="#">Cotizaciones Anteriores</a>
        </div>
        <div className="user"><img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"></img></div>
      </div>
      
      <div className="container">
        <h1>Cotización Básica</h1>
        <h2>Tipo de Construcción</h2>
        <div className="options">
          <div className="option">
            <img src="https://definicion.de/wp-content/uploads/2010/10/residencia-1.jpg"></img>
            <p>Residencia</p>
          </div>
          <div className="option">
            <img src="https://lirp.cdn-website.com/78ac76fe/dms3rep/multi/opt/970-640w.jpg"></img>
            <p>Naves industriales</p>
          </div>
          <div className="option">
            <img src="https://i0.wp.com/foodandpleasure.com/wp-content/uploads/2020/10/65345792-h1-facb_angular_pool_view_300dpi.jpg?fit=2800%2C1867&ssl=1"></img>
            <p>Hoteles</p>
          </div>
          <div className="option">
            <img src="https://blogposgrados.tijuana.ibero.mx/wp-content/uploads/2022/06/viviendanueva180918.jpeg"></img>
            <p>Casa interés social</p>
          </div>
          <div className="option">
            <img src="https://locurainmobiliaria.com/wp-content/uploads/2024/09/condominios.jpg"></img>
            <p>Condominios</p>
          </div>
          <div className="option">
            <img src="https://s7d1.scene7.com/is/image/mcdonalds/crown_point_mcdonalds-RR-EDIT_001:hero-desktop?resmode=sharp2"></img>
            <p>Comercio</p>
          </div>
        </div>
        
        <div className="area-section">
          <label>Ingresa el área total en m²: </label>
          <input type="text" placeholder="Ingrese metros cuadrados" />
        </div>
        
        <div className="ciudad-section">
          <label>Seleccione factor interciudad: </label>
          <select name="ciudades" id="ciudades">
            <option value="hermosillo">Hermosillo</option>
            <option value="nogales">Nogales</option>
            <option value="ciudad_obregon">Ciudad Obregon</option>
            <option value="guaymas">Guaymas</option>
            <option value="san_luis">San Luis Río Colorado</option>
            <option value="navojoa">Navojoa</option>
            <option value="agua_prieta">Agua Prieta</option>
            <option value="empalme">Empalme</option>
            <option value="mazatlan">Mazatlan</option>
            <option value="culiacan">Culiacan</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="monterrey">Monterrey</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="puebla">Puebla</option>
            <option value="toluca">Toluca</option>
          </select>
          <button>Calcular</button>
        </div>

        <h3>Costo total estimado:</h3>
        
        <div className="buttons">
          <button>Guardar</button>
          <button>Compartir</button>
        </div>
      </div>
    </>
  );
}
