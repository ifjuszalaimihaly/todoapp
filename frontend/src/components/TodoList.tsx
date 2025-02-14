import { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {InputGroup } from 'react-bootstrap';

interface TodoItem {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const TodoList = ({}) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

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

  const addTodo = async () => {
    if (newTodo.trim() === "") return;
  
    const newTask: Omit<TodoItem, "id"> = {
      title: newTodo,
      dueDate: newDueDate,
      completed: false,
    };
  
    try {
      // TODO hozzáadása az API-hoz
      const response = await axios.post<TodoItem>("http://localhost:88/todos", newTask);
  
      // Sikeres válasz esetén frissítjük a lokális állapotot
      setTodos([...todos, response.data]);
      setNewTodo(""); // Input mező törlése
      setNewDueDate(""); // Dátum mező törlése
    } catch (error) {
      console.error("Hiba történt a TODO hozzáadása közben:", error);
    }
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

  const removeTodo = async (id: number) => {
    try {
      // API hívás a TODO törlésére
      await axios.delete(`http://127.0.0.1:88/todos/${id}`);
  
      console.log(`TODO (id: ${id}) törölve.`);
  
      // Lokális állapot frissítése: kiszűrjük a törölt elemet
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(`Hiba történt a TODO törlése közben (id: ${id}):`, error);
    }
  };

  return (
    <div>
          
          <div className="mb-3">
      <h1 className="mb-4">Todo List</h1>

      <InputGroup>
        <Form.Control
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new todo"
        />
        <Form.Control
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <Button onClick={addTodo} variant="primary">
          Add
        </Button>
      </InputGroup>
    </div>

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
    </div>
  );
}

export default TodoList;
