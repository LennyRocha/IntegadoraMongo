import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/vista.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import nuez from "../assets/nuez.gif";
import patio from "../assets/patio.png";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { PlantaContext } from "../context/PlantaContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const api_url = import.meta.env.VITE_API_URL;

export default function Vista() {
  const { plant, setPlant } = useContext(PlantaContext);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [fallo, setFallo] = useState("");
  const [plantas, setPlantas] = useState([]);
  const [plantaElegida, setPlantaElegida] = useState(null);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    document.body.classList.add("borde-cafe");

    setLoadingPlants(true);

    axios
      .get(`${api_url}/api/plantas`)
      .then((res) => {
        console.log(res.data);
        if (res.data.length === 0) {
          setFallo("No hay plantas disponibles");
          return;
        }
        setPlantas(res.data);
      })
      .catch((err) => console.log(err, err.response.data))
      .finally(() => setLoadingPlants(false));
    document.title = "Ver plantas";

    // Limpieza cuando se desmonta
    return () => {
      document.body.classList.remove("borde-cafe");
    };
  }, [reload]);
  const quitarPlanta = async () => {
    axios
      .delete(`${api_url}/api/plantas/${plantaElegida._id}`)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "¡Muy bien!",
          text: res.data.message || "Planta eliminada",
          confirmButtonText: "Aceptar",
          customClass: {
            cancelButton: "red-btn",
            confirmButton: "green-btn",
            container: "text-sweet",
          },
        });
        setReload(!reload);
        setPlantaElegida(null);
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "¡Oh no!",
          text: err.response.message || "Error al eliminar la planta",
          confirmButtonText: "Aceptar",
          customClass: {
            cancelButton: "red-btn",
            confirmButton: "green-btn",
            container: "text-sweet",
          },
        })
      );
  };
  function confirmarEliminacion() {
    Swal.fire({
      icon: "question",
      title: "Confirmación",
      text: "¿Deseas eliminar esta planta?",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Si",
      customClass: {
        cancelButton: "red-btn",
        confirmButton: "green-btn",
        container: "text-sweet",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await quitarPlanta();
      }
    });
  }
  const navigate = useNavigate();
  return (
    <div className="mainDiv">
      <header className="vistaHeader">
        <div className="borde">
          <h1>Ver Plantas</h1>
        </div>
      </header>
      <div className="row p-1 py-5 mb-4">
        <div className="col-md-8 grid-col quitarScroll">
          {loadingPlants ? (
            <div className="w-100 h-100 align-items-center justify-content-center d-flex">
              <div className="my-spinner"></div>
            </div>
          ) : fallo !== "" ? (
            <div className="w-100 h-100 flex-column align-items-center justify-content-center d-flex">
              <img
                src={nuez}
                alt="placeholder_nuez"
                width={200}
                height={200}
                id="papa"
              />
              <h1 className="err-h mt-2">{fallo}</h1>
            </div>
          ) : (
            <div className="grid">
              {plantas.map((planta) => {
                return (
                  <Tooltip
                    title={planta.nombre}
                    key={planta._id}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "120px",
                    }}
                  >
                    <img
                      className="p"
                      src={planta.imagenUrl}
                      onClick={() => {
                        console.log(planta);
                        setPlantaElegida(planta);
                      }}
                    />
                  </Tooltip>
                );
              })}
              {/* <img
                class="paquete8 p"
                src="https://th.bing.com/th/id/R.9f7e8f1d8219960364a55c9c401f2e07?rik=CVCCBM43LqhM5w&riu=http%3a%2f%2fimg1.wikia.nocookie.net%2f__cb20111204141914%2fplantsvszombies%2fimages%2f4%2f4b%2fSeeds.png&ehk=34sBR819AvDmFe%2f3llJen6I7NVAbEE%2bhshLJp26Xg6A%3d&risl=&pid=ImgRaw&r=0"
              /> */}
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="desc">
            <div className="place">
              <img
                src={plantaElegida === null ? patio : plantaElegida.imagenUrl}
              />
            </div>
            <h3>
              {plantaElegida === null
                ? "Selecciona una planta"
                : plantaElegida.nombre}
            </h3>
            <div className="planta-desc quitarScroll">
              {plantaElegida !== null && (
                <div className="plantaData mx-2">
                  <p className="my-0">
                    Tipo: <b className="blueTxt">{plantaElegida.tipo}</b>
                  </p>
                  <p className="my-0">
                    Alcance: <b className="blueTxt">{plantaElegida.rango}</b>
                  </p>
                  <p className="my-0">
                    Vel. ataque:{" "}
                    <b className="blueTxt">{plantaElegida.velocidad_ataque}</b>
                  </p>
                  <p className="my-0">
                    Resistencia:{" "}
                    <b className="blueTxt">{plantaElegida.resistencia}</b>
                  </p>
                  <p className="my-0">
                    Daño:{" "}
                    <b className="blueTxt">
                      {plantaElegida.dano === 0
                        ? "N/A"
                        : `${plantaElegida.dano} pts`}{" "}
                    </b>
                  </p>
                  <p className="my-2">{plantaElegida.descripcion}</p>
                  <div className="d-flex flex-row justify-content-between">
                    <p className="my-0">
                      Precio:{" "}
                      <b className="redTxt">{plantaElegida.costo_soles}</b>
                    </p>
                    <p className="my-0">
                      Recarga:{" "}
                      <b className="redTxt">{plantaElegida.recarga}s</b>
                    </p>
                  </div>
                  <div className="flex-row d-flex gap-1 mx-1 my-3 button-col ">
                    <button
                      className="btn-vista"
                      onClick={() => {
                        setPlant(plantaElegida);
                        navigate("/registrar");
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-vista"
                      onClick={() => confirmarEliminacion()}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="d-flex flex-wrap justify-content-md-between justify-content-center align-items-center gap-3 py-3 my-4">
        <div className="col-md-4 d-flex align-items-center">
          <button
            className="btn-vista"
            onClick={() => (window.location.href = "/registrar")}
          >
            Registrar planta
            <AddIcon color="success" />
          </button>
        </div>

        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <button
              className="btn-vista"
              onClick={() => (window.location.href = "/")}
            >
              Cerrar <CloseIcon color="error" />
            </button>
          </li>
        </ul>
      </footer>
    </div>
  );
}
