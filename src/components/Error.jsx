import React, { useEffect } from "react";
import zomboss from "../assets/zomboss.gif";
import "../css/error.css";

export default function Error() {
  useEffect(() => {
    document.body.classList.add("borde-cafe");
    document.title = "Error";

    // Limpieza cuando se desmonta
    return () => {
      document.body.classList.remove("borde-cafe");
    };
  }, []);
  return (
    <div className="min-bud">
      <img src={zomboss} alt="" />
      <h1>404</h1>
      <h3>Página no encontrada</h3>
      <button
        className="index-button"
        onClick={() => (window.location.href = "/")}
      >
        Volver a inicio
      </button>
    </div>
  );
}
