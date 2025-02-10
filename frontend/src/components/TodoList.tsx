import { useState, useEffect } from "react";
import axios from "axios";

interface TodoItem {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // TODO-k lekérése az API-ról
  const fetchTodos = async () => {
    try {
      const response = await axios.get<TodoItem[]>("http://127.0.0.1:88/todos");
      console.log(response);
      setTodos(response.data);
    } catch (error) {
      console.error("Hiba történt a TODO-k lekérése közben:", error);
    }
  };

  // useEffect, hogy az adatok betöltődjenek a komponens indulásakor
  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const newTask: TodoItem = {
      id: Date.now(),
      title: newTodo,
      dueDate: "",
      completed: false,
    };

    setTodos([...todos, newTask]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <button onClick={fetchTodos}>🔄 Frissítés</button>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.title} - {todo.dueDate}
            <button onClick={() => toggleTodo(todo.id)}>✔</button>
            <button onClick={() => removeTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
