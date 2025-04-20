import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Menu from './components/Menu'
import Vista from "./components/Vista";
import Registro from "./components/Registro";
import Error from "./components/Error";
import "./App.css";
import 'bootstrap'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlantaProvider } from "./context/PlantaContext";

function App() {
  return (
    <PlantaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/plantas" element={<Vista />} />
          <Route path="/registrar" element={<Registro />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </Router>
    </PlantaProvider>
  );
}

export default App;
