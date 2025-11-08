//EXTERNAL LIBRARIES
import Cookies from "js-cookie";
import { useContext } from "react";

//CONTEXT
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    return context;
};
