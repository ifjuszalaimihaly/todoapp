import { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const newTask: TodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };

    setTodos([...todos, newTask]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            {todo.text}
            <button onClick={() => toggleTodo(todo.id)}>✔</button>
            <button onClick={() => removeTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TodoList;