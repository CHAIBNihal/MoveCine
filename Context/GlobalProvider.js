import { useContext, createContext, useState, useEffect } from "react";
import { router } from "expo-router";

const ContextProvider = createContext();

export const useGlobalProvider = () => {

  const context = useContext(ContextProvider);
  if (!context) {
    throw new Error("useGlobalProvider must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }) => {
 
  const [logged, setLogged] = useState(false);
  const [id, setId] = useState("")
  const [token, setToken] = useState("")
  const [emailProvider, setEmailProvider] = useState("")
  
  if (!children) {
    throw new Error("GlobalProvider must have children components!");
  }
  useEffect(() => {
    // Éviter une boucle infinie si `loading` change
    if(token ){
      console.log("id stored at GlobalProvider", id )
    }
    else{
       console.log("No session is Present")
    }
   
  
  }, [token]);

  return (
    <ContextProvider.Provider value={{logged, setLogged, token, setToken, emailProvider, setEmailProvider, id, setId}}>
      {children}
    </ContextProvider.Provider>
  );
};

export default GlobalProvider;
