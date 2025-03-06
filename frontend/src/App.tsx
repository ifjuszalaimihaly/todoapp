import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import TodoList from "./components/TodoList";
import './App.css'
import Header from "./components/Header";
import Register from "./components/Register";


const App = () => {
    return (
        <>
        
        <Router>
        <Header/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/todos" element={<ProtectedRoute />}>
                    <Route index element={<TodoList />} />
                </Route>
            </Routes>
        </Router>
        </>
    );
};

export default App;
