import { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface TodoItem {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const TodoList = ({}) => {
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

  const toggleTodo = async (id: number) => {
    try {
      // Megkeressük az adott id-jú todo-t a jelenlegi állapotban
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) {
        console.error(`Nem található TODO az adott id-val: ${id}`);
        return;
      }
  
      // Az új completed érték az ellenkezője lesz a jelenleginek
      const updatedCompleted = !todoToUpdate.completed;
  
      // API hívás a módosított értékkel
      const response = await axios.put(`http://127.0.0.1:88/todos/${id}`, {
        completed: updatedCompleted,
      });
  
      console.log("TODO frissítve:", response.data);
  
      // Lokális state frissítés
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedCompleted } : todo
        )
      );
    } catch (error) {
      console.error(`Hiba történt a TODO frissítése közben (id: ${id}):`, error);
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Todo</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr key={todo.id}>
            <td>
              <Form.Check 
                type="checkbox"
                checked={todo.completed}
                label={todo.title}
                onChange={() => toggleTodo(todo.id)}
              />
            </td>
            <td>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'}</td>
            <td>
              <Button variant="outline-primary">Edit</Button>{' '}
              <Button variant="outline-danger" onClick={() => removeTodo(todo.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TodoList;
