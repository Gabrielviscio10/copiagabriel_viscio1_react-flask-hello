import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function Private() {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const validateUser = async () => {
            const valid = await actions.validateToken();
            if (!valid) {
                navigate('/login'); // Redirigir al login si no es válido
            }
        };
        validateUser();
    }, [actions, navigate]);

    return <h1>Página Privada: Solo usuarios autenticados pueden ver esto.</h1>;
}

export default Private;
