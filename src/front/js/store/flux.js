const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            token: sessionStorage.getItem('token') || null,
            isAuthenticated: !!sessionStorage.getItem('token') // Si hay token, el usuario está autenticado
        },
        actions: {
            signup: async (email, password) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    if (resp.ok) {
                        const data = await resp.json();
                        console.log('Usuario registrado con éxito:', data);
                        
                        // Después del registro exitoso, intenta iniciar sesión automáticamente
                        const loginSuccess = await getActions().login(email, password);
                        if (loginSuccess) {
                            // El usuario ha sido registrado e inició sesión automáticamente
                            window.location.href = "/private"; // Redirige a la página privada
                        }
        
                        return true;
                    } else {
                        const errorData = await resp.json();
                        console.error('Error al registrar usuario:', errorData);
                        return false;
                    }
                } catch (error) {
                    console.error('Error en la solicitud de registro:', error);
                    return false;
                }
            },
            login: async (email, password) => {
                const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (resp.ok) {
                    const data = await resp.json();
                    sessionStorage.setItem('token', data.token);
                    setStore({ token: data.token, isAuthenticated: true }); // Actualiza isAuthenticated
                    window.location.href = "/private";
                    return true;
                } else {
                    console.error('Error al iniciar sesión');
                    return false;
                }
            },
            validateToken: async () => {
                const token = getStore().token;
                // Código de validación...
            },
            logout: () => {
                sessionStorage.removeItem('token');
                setStore({ token: null, user: null, isAuthenticated: false }); // Cierra sesión y actualiza isAuthenticated
            }
        }
    };
};
export default getState;