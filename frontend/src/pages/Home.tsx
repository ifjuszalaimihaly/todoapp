import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Üdvözöllek!</h1>
            <Link to="/login">Bejelentkezés</Link>
        </div>
    );
};

export default Home;
