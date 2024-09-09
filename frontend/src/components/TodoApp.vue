<template>
  <div class="todo-app">
    <h1>Todo App</h1>

    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a new todo" />

    <ul>
      <li v-for="(todo, index) in todos" :key="todo.id">
        <label v-if="!todo.isEditing" :class="{ completed: todo.completed }">
          <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)" />
          {{ todo.title }}
        </label>
        <input v-if="todo.isEditing" v-model="todo.title" @keyup.enter="doneEdit(todo)" @blur="doneEdit(todo)" />

        <button @click="editTodo(index)" v-if="!todo.isEditing">Edit</button>
        <button @click="doneEdit(todo)" v-if="todo.isEditing">Save</button>
        <button @click="removeTodo(index, todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newTodo: '',
      todos: []
    };
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('http://127.0.0.1:88/todos');
        this.todos = response.data.map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed || false,
          isEditing: false
        }));
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    async addTodo() {
      if (this.newTodo.trim()) {
        try {
          const response = await axios.post('http://127.0.0.1:88/todos', {
            title: this.newTodo,
            completed: false
          });

          // Push the new todo returned from the server
          this.todos.push({
            id: response.data.id, // Get the real ID from the backend
            title: response.data.title,
            completed: response.data.completed,
            isEditing: false
          });

          this.newTodo = ''; // Reset the input field
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      }
    },
    async removeTodo(index, id) {
      try {
        // Send a DELETE request to the backend
        await axios.delete(`http://127.0.0.1:88/todos/${id}`);

        // If successful, remove the todo from the list
        this.todos.splice(index, 1);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
    editTodo(index) {
      this.todos[index].isEditing = true;
    },
    async doneEdit(todo) {
      if (todo.title.trim()) {
        try {
          // Send a PUT request to update the todo on the server
          await axios.put(`http://127.0.0.1:88/todos/${todo.id}`, {
            title: todo.title,
            completed: todo.completed
          });

          todo.isEditing = false;
        } catch (error) {
          console.error('Error updating todo:', error);
        }
      } else {
        this.removeTodo(this.todos.indexOf(todo), todo.id);
      }
    },
    async updateTodo(todo) {
      try {
        // Send a PUT request to update the todo's completed status
        await axios.put(`http://127.0.0.1:88/todos/${todo.id}`, {
          title: todo.title,
          completed: todo.completed
        });
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  }
};
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

input[type="text"] {
  padding: 10px;
  font-size: 16px;
  width: 80%;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.completed {
  text-decoration: line-through;
}
</style>