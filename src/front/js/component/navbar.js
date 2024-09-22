import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/navBar.css";

function Navbar() {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        actions.logout();
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup'); // Redirige a la página de registro
    };

    return (
        <div>
           
            {!store.isAuthenticated ? (
                <button onClick={handleLogin} className="login-button btn btn-success">
                    Iniciar sesión
                </button>
            ) : (
                <button onClick={handleLogout} className="logout-button btn btn-danger">
                    Cerrar sesión
                </button>
            )}

          
            {!store.isAuthenticated && (
                <button onClick={handleSignup} className="signup-button btn btn-primary">
                    Crear usuario
                </button>
            )}
        </div>
    );
}

export default Navbar;
