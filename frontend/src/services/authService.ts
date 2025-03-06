import axios from 'axios';

const API_URL = "http://127.0.0.1:88/auth"; // Mock API

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        console.log("SUCCESS")
        console.log(response)
        if (response.data.token) {
            localStorage.setItem("jwt_token", response.data.token);
        }
        console.log("AUTHENTICATED")
        console.log(isAuthenticated())
        return response.data;
    } catch (error) {
        console.log("HIBA")
        console.log(error)
            localStorage.setItem("kutya","cica")
        throw new Error("Hibás bejelentkezés!");
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
