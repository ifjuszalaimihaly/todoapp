import { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";

interface TodoItem {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get<TodoItem[]>("http://127.0.0.1:88/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Hiba történt a TODO-k lekérése közben:", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    const newTask: Omit<TodoItem, "id"> = {
      title: newTodo,
      dueDate: newDueDate,
      completed: false,
    };

    try {
      const response = await axios.post<TodoItem>("http://localhost:88/todos", newTask);
      setTodos([...todos, response.data]);
      setNewTodo("");
      setNewDueDate("");
    } catch (error) {
      console.error("Hiba történt a TODO hozzáadása közben:", error);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      const updatedCompleted = !todoToUpdate.completed;
      await axios.put(`http://127.0.0.1:88/todos/${id}`, { completed: updatedCompleted });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: updatedCompleted } : todo))
      );
    } catch (error) {
      console.error(`Hiba történt a TODO frissítése közben (id: ${id}):`, error);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:88/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(`Hiba történt a TODO törlése közben (id: ${id}):`, error);
    }
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate);
  };

  const saveEdit = async (id: number) => {
    try {
      await axios.put(`http://127.0.0.1:88/todos/${id}`, {
        title: editTitle,
        dueDate: editDueDate,
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, title: editTitle, dueDate: editDueDate } : todo))
      );

      setEditingId(null);
    } catch (error) {
      console.error(`Hiba történt a TODO mentése közben (id: ${id}):`, error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
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
          <Form.Control type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
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
                {editingId === todo.id ? (
                  <Form.Control type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                ) : (
                  <Form.Check
                    type="checkbox"
                    checked={todo.completed}
                    label={todo.title}
                    onChange={() => toggleTodo(todo.id)}
                  />
                )}
              </td>
              <td>
                {editingId === todo.id ? (
                  <Form.Control type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                ) : (
                  todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No due date"
                )}
              </td>
              <td>
                {editingId === todo.id ? (
                  <>
                    <Button variant="success" onClick={() => saveEdit(todo.id)}>
                      Save
                    </Button>{" "}
                    <Button variant="secondary" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline-primary" onClick={() => startEditing(todo)}>
                      Edit
                    </Button>{" "}
                    <Button variant="outline-danger" onClick={() => removeTodo(todo.id)}>
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TodoList;
