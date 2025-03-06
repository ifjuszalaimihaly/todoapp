import axios from 'axios';

const API_URL = "http://127.0.0.1:88/auth"; // Mock API

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        if (response.data.token) {
            localStorage.setItem("jwt_token", response.data.token);
            localStorage.setItem("username",username);
        }
        console.log(isAuthenticated())
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error("Hibás bejelentkezés!");
    }
};


export const register = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, password });
        if (response.data.token) {
            localStorage.setItem("jwt_token", response.data.token);
            localStorage.setItem("username",username);
        }
        return response.data; // Feltételezzük, hogy a szerver sikeres választ ad vissza
    } catch (error) {
        console.error(error);
        throw new Error("Hiba történt a regisztráció során!");
    }
};



export const logout = () => {
    localStorage.removeItem("token");
};

export const getToken = () => {
    return localStorage.getItem("jwt_token");
};

export const isAuthenticated = () => {
    return !!getToken();
};
