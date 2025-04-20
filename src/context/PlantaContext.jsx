import { createContext, useState } from "react";
// Exporta PlantaContext
export const PlantaContext = createContext();

// Exporta PlantaProvider de forma nombrada
export const PlantaProvider = ({ children }) => {
    const [plant, setPlant] = useState(null);
    return(
        <PlantaContext.Provider value={{plant, setPlant}}>
            {children}
        </PlantaContext.Provider>
    )
}