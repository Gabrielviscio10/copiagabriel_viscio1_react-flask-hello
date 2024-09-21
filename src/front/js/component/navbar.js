import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function Navbar() {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate('/login'); // Redirigir al login
    };

    return <button onClick={handleLogout}>Cerrar Sesión</button>;
}

export default Navbar;
