import React, { useEffect, useState, useContext } from "react";
import { TextField } from "@mui/material";
import "../css/registro.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Autocomplete from "@mui/material/Autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { PlantaContext } from "../context/PlantaContext";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
const api_url = import.meta.env.VITE_API_URL;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Registro() {
  const { plant, setPlant } = useContext(PlantaContext);
  const options = [
   0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 500,
  ];
  const velocidades = ["Ninguna", "Lenta", "Normal", "Rápida"];
  const durezas = ["Baja", "Media", "Alta"];
  const [warning, setWarning] = useState("");
  const planta = yup.object().shape({
    id: yup.string(),
    nombre: yup.string("Tipo no válido").required("El nombre es requerido"),
    tipo: yup
      .string("Tipo no válido")
      .required("El tipo de la planta es requerido"),
    costo: yup
      .number("Tipo no válido")
      .required("El costo es requerido")
      .oneOf(options, "Selecciona una opción válida")
      .typeError("Debes ingresar un número")
      .min(0,"No válido"),
    rango: yup.string("Tipo no válido").required("El alcance es requerido"),
    descripcion: yup
      .string("Tipo no válido")
      .required("La descripción es requerida"),
    velocidad: yup
      .string("Tipo no válido")
      .required("La velocidad de ataque es requerida")
      .oneOf(velocidades, "Selecciona una opción válida"),
    recarga: yup
      .number()
      .typeError("Debes ingresar un número")
      .required("El tiempo de recarga es requerido")
      .positive("Debe ser un número positivo"),
    daño: yup
      .number("Tipo no válido")
      .required("El daño es requerido")
      .typeError("Debes ingresar un número")
      .positive("Debe ser un número positivo")
      .min(0, "No válido"),
    resistencia: yup
      .string("Tipo no válido")
      .required("La resistencia es requerida")
      .oneOf(durezas, "Selecciona una opción válida"),
  });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    setFieldValue,
    reset,
    trigger,
    resetField,
    clearErrors, // ✅ Extraído correctamente desde useForm()
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(planta),
    mode: "onChange",
  });
  const setData = () => {
    setValue("id", plant._id);
    setValue("nombre", plant.nombre);
    setValue("descripcion", plant.descripcion);
    setValue("costo", plant.costo_soles);
    setValue("tipo", plant.tipo);
    setValue("recarga", plant.recarga);
    setValue("daño", plant.dano);
    setValue("velocidad", plant.velocidad_ataque);
    setValue("resistencia", plant.resistencia);
    setValue("rango", plant.rango);
    trigger();
  };
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  function handleClick() {
    setLoading(true);
  }
  useEffect(() => {
    document.body.classList.add("borde-azul");

    if (plant) {
      Swal.fire({
        titleText: plant.nombre,
        customClass: {
          cancelButton: "red-btn",
          confirmButton: "green-btn",
          container: "text-sweet",
        },
      });
      setData();
      setEdit(true);
    }

    if(plant){
            document.title = "Actualizar planta"
    }else{
            document.title = "Registrar planta"
    }


    // Limpieza cuando se desmonta
    return () => {
      document.body.classList.remove("borde-azul");
    };
  }, []);

  const registrarPlanta = async (data) => {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("costo_soles", data.costo);
    formData.append("tipo", data.tipo);
    formData.append("recarga", data.recarga);
    formData.append("dano", data.daño);
    formData.append("velocidad_ataque", data.velocidad);
    formData.append("resistencia", data.resistencia);
    formData.append("rango", data.rango);
    formData.append("imagen", selectedFile);

    await axios
      .post(`${api_url}/api/plantas`, formData)
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Planta registrada",
          customClass: {
            cancelButton: "red-btn",
            confirmButton: "green-btn",
            container: "text-sweet",
          },
        });
        reset();
        clearErrors();
        setSelectedFile(null);
        setPreview("");
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: err.response.message || "Error al registrar la planta",
          customClass: {
            cancelButton: "red-btn",
            confirmButton: "green-btn",
            container: "text-sweet",
          },
        })
      )
      .finally(() => setLoading(false));
  };

  const editarPlanta = async (data) => {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("costo_soles", data.costo);
    formData.append("tipo", data.tipo);
    formData.append("recarga", data.recarga);
    formData.append("dano", data.daño);
    formData.append("velocidad_ataque", data.velocidad);
    formData.append("resistencia", data.resistencia);
    formData.append("rango", data.rango);
    if (selectedFile) formData.append("imagen", selectedFile);

    await axios
      .put(`${api_url}/api/plantas/${data.id}`, formData)
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Planta actualizada",
          customClass: {
            cancelButton: "red-btn",
            confirmButton: "green-btn",
            container: "text-sweet",
          },
        });
        reset();
        clearErrors();
        setSelectedFile(null);
        setEdit(false);
        setPreview("");
        setPlant(null);
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: err.response.message || "Error al modificar la planta",
          customClass: {
            cancelButton: "red-btn",
            confirmButton: "green-btn",
            container: "text-sweet",
          },
        })
      )
      .finally(() => setLoading(false));
  };

  const [preview, setPreview] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Guarda el archivo seleccionado
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result); // Crea la vista previa
      reader.readAsDataURL(file);
      setWarning("");
      trigger();
    }
  };
  const onSubmit = (data) => {
    handleClick();
    console.log(data);
    if (!selectedFile && !edit) {
      setLoading(false);
      setWarning("No has seleccionado una imagen");
      return;
    } else {
      setWarning("");
    }
    edit ? editarPlanta(data) : registrarPlanta(data);
  };
  return (
    <div>
      <header className="vistaHeaderReg mb-5 mb-md-3">
        <div className="bordeReg">
          <h1>{edit ? "Modificar planta" : "Registrar Planta"}</h1>
        </div>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-3 flex-column justify-content-end gap-3 p-2 d-flex">
            {(preview !== "" ||
              plant !== null ) && (
                <img
                  src={plant !== null ? plant.imagenUrl : preview}
                  className="img-prev"
                />
              )}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              className="botonFile"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Subir imagen
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                  console.log(event.target.files);
                  handleFileChange(event);
                }}
                multiple
              />
            </Button>
            {warning !== "" && <p className="err-p">{warning}</p>}
          </div>
          <div className="col-md-3 flex-column gap-3 p-2 d-flex">
            <TextField
              label="Nombre"
              fullWidth
              className="txtAr"
              {...register("nombre")}
              focused={plant !== null}
            />
            {errors.nombre && <p className="err-p">{errors.nombre.message}</p>}
            <TextField
              label="Tipo"
              fullWidth
              className="txtAr"
              {...register("tipo")}
              focused={plant !== null}
            />
            {errors.tipo && <p className="err-p">{errors.tipo.message}</p>}
            <Autocomplete
              disablePortal
              options={options}
              fullWidth
              value={getValues("costo") || null}
              onChange={(e, value) => setValue("costo", value)}
              className="txtAr"
              focused={plant !== null}
              getOptionLabel={(option) => option?.toString() ?? ""}
              renderInput={(params) => (
                <TextField {...params} label="Costo en soles" />
              )}
            />

            {errors.costo && <p className="err-p">{errors.costo.message}</p>}
          </div>
          <div className="col-md-3 flex-column gap-3 p-2 d-flex">
            <TextField
              label="Alcance"
              fullWidth
              className="txtAr"
              {...register("rango")}
              focused={plant !== null}
            />
            {errors.rango && <p className="err-p">{errors.rango.message}</p>}
            <TextField
              label="Descripción"
              fullWidth
              className="txtAr"
              {...register("descripcion")}
              focused={plant !== null}
            />
            {errors.descripcion && (
              <p className="err-p">{errors.descripcion.message}</p>
            )}
            <Autocomplete
              disablePortal
              options={velocidades}
              fullWidth
              value={getValues("velocidad") || null}
              onChange={(e, value) => setValue("velocidad", value)}
              className="txtAr"
              focused={plant !== null}
              getOptionLabel={(option) => option?.toString() ?? ""}
              renderInput={(params) => (
                <TextField {...params} label="Velocidad de ataque" />
              )}
            />
            {errors.velocidad && (
              <p className="err-p">{errors.velocidad.message}</p>
            )}
          </div>
          <div className="col-md-3 flex-column gap-3 p-2 d-flex">
            <TextField
              label="Recarga (segundos)"
              fullWidth
              className="txtAr"
              type="number"
              inputProps={{ min: 0 }}
              {...register("recarga")}
              focused={plant !== null}
            />
            {errors.recarga && (
              <p className="err-p">{errors.recarga.message}</p>
            )}
            <TextField
              label="Daño"
              fullWidth
              className="txtAr"
              type="number"
              inputProps={{ min: 0 }}
              {...register("daño")}
              focused={plant !== null}
            />
            {errors.daño && <p className="err-p">{errors.daño.message}</p>}
            <Autocomplete
              disablePortal
              options={durezas}
              fullWidth
              value={getValues("resistencia") || null}
              onChange={(e, value) => setValue("resistencia", value)}
              className="txtAr"
              focused={plant !== null}
              getOptionLabel={(option) => option?.toString() ?? ""}
              renderInput={(params) => (
                <TextField {...params} label="Resistencia" />
              )}
            />
            {errors.resistencia && (
              <p className="err-p">{errors.resistencia.message}</p>
            )}
          </div>
        </div>
        <Button
          size="small"
          className="botonFile mx-1"
          style={{
            opacity: loading || !isValid ? 0.5 : 1,
          }}
          loading={loading}
          type="submit"
          loadingPosition="start"
          disabled={!isValid && !selectedFile}
          startIcon={<SaveIcon />}
          variant="contained"
        >
          {edit ? "Actualizar" : "Registrar"}
        </Button>
        <Button
          size="small"
          className="botonFile mx-1"
          style={{
            opacity: loading ? 0.5 : 1,
          }}
          onClick={() => (window.location.href = "/")}
          loading={loading}
          loadingPosition="start"
          startIcon={<CloseIcon />}
          variant="contained"
        >
          Volver
        </Button>
      </form>
    </div>
  );
}
