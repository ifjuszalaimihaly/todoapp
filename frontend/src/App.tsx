import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import TodoList from "./components/TodoList";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/todos" element={<ProtectedRoute />}>
                    <Route index element={<TodoList />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
