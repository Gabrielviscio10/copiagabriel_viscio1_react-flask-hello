import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

const Login = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.login(email, password);
        if (success) {
            alert("Inicio de sesión exitoso");
        } else {
            alert("Error al iniciar sesión");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-info">Iniciar sesión</button>
            </form>
        </div>
    );
};

export default Login;
