import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";

const Private = () => {
    const { store } = useContext(Context); // Asegúrate de obtener el contexto

    // Suponiendo que tienes una forma de verificar si el usuario está autenticado
    const userIsAuthenticated = store.token ? true : false; 

    if (!userIsAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h2>Bienvenido a la página privada</h2>
        </div>
    );
};

export default Private;
