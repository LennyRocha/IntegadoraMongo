import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/menu.css";
import almanaque from "../assets/AnimatedAlmanac.webp";
import flor from "../assets/flor.gif";

export default function Menu() {
  useEffect(() => {
    document.body.classList.add("borde-gris");
    document.title = "Inicio"

    // Limpieza cuando se desmonta
    return () => {
      document.body.classList.remove("borde-gris");
    };
  }, []);
  return (
    <div id="indexDiv" className="w-100">
      <header className="w-100 d-flex align-items-center justify-content-center">
        <div id="indexHead" className="py-3 px-5">
          <p>ALMANAQUE SUBURBANO (ÍNDICE)</p>
        </div>
      </header>
      <br />
      <div className="row bordeao gap-3 d-flex align-items-center justify-content-center">
        <div className="col-md-4 container-index">
          <div className="index-child">
            <img src={flor} alt="Registrar planta" className="indexImg" />
            <button
              className="index-button"
              onClick={() => (window.location.href = "/plantas")}
            >
              Ver plantas
            </button>
          </div>
        </div>
        <div className="col-md-4 container-index">
          <div className="index-child">
            <img src={almanaque} alt="Registrar planta" className="indexImg" />
            <button
              className="index-button"
              onClick={() => (window.location.href = "/registrar")}
            >
              Registrar planta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
