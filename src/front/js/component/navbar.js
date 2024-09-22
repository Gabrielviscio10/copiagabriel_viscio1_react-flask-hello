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
            {/* Botón de iniciar/cerrar sesión */}
            {!store.isAuthenticated ? (
                <button onClick={handleLogin} className="login-button">
                    Iniciar sesión
                </button>
            ) : (
                <button onClick={handleLogout} className="logout-button">
                    Cerrar sesión
                </button>
            )}

            {/* Mostrar botón "Crear usuario" solo si NO hay una sesión iniciada */}
            {!store.isAuthenticated && (
                <button onClick={handleSignup} className="signup-button">
                    Crear usuario
                </button>
            )}
        </div>
    );
}

export default Navbar;
