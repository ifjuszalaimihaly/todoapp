import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div>
            <h1>Vezérlőpult</h1>
            <button onClick={handleLogout}>Kijelentkezés</button>
        </div>
    );
};

export default Dashboard;
