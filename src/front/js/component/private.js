import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";

const Private = () => {
    const { store } = useContext(Context); 

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
