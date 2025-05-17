import { createContext, useContext, useState } from "react";

const PanelContext= createContext();

export const PanelProvider=({children})=>{
    const [isAIPanelOpen,setAiPanelOpen]=useState(false);

    const togglePanel=()=>setAiPanelOpen(prev=>!prev);

    return(
        <PanelContext.Provider value={{isAIPanelOpen,togglePanel}}>
            {children}
        </PanelContext.Provider>
    );
}

export const useAIPanel=()=>useContext(PanelContext);