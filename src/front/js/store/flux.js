const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: sessionStorage.getItem('token') || null,
            user: null,
            message: null // Agregar una propiedad 'message' al store
        },
        actions: {
            // Función de registro de usuario
            signup: async (email, password) => {
                const response = await fetch('URL_DEL_BACKEND/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                if (response.ok) {
                    return true;
                } else {
                    return false;
                }
            },

            // Función de inicio de sesión
            login: async (email, password) => {
                const response = await fetch('URL_DEL_BACKEND/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('token', data.token);
                    setStore({ token: data.token });
                    return true;
                } else {
                    return false;
                }
            },

            // Función para validar el token
            validateToken: async () => {
                const store = getStore();
                const token = store.token;
                if (!token) return false;

                const response = await fetch('URL_DEL_BACKEND/validate', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    return true;
                } else {
                    sessionStorage.removeItem('token');
                    setStore({ token: null });
                    return false;
                }
            },

            // Función de cierre de sesión
            logout: () => {
                sessionStorage.removeItem('token');
                setStore({ token: null });
            },

            // Nueva función getMessage
            getMessage: () => {
                // Aquí puedes definir la lógica para obtener un mensaje o cualquier otro dato
                console.log("getMessage llamada desde flux");
                setStore({ message: "Mensaje obtenido desde Flux" });
            },
        },
    };
};

export default getState;
