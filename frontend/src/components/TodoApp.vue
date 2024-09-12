<template>
  <div class="todo-app container mt-5">
    <h1 class="mb-4">Todo List</h1>

    <!-- Input for adding new todo -->
    <div class="input-group mb-3">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        class="form-control"
        placeholder="Add a new todo"
      />
      <!-- Date input -->
      <input type="date" v-model="dueDate" class="form-control me-2" placeholder="Select due date" />
      <button @click="addTodo" class="btn btn-primary">Add</button>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>Todo</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(todo, index) in todos"
          :key="todo.id"
          :class="index % 2 === 0 ? 'table-light' : 'table-secondary'">
          <td>
            <div v-if="!todo.isEditing" :class="{ completed: todo.completed }">
              <input
                type="checkbox"
                v-model="todo.completed"
                @change="updateTodo(todo)"
                class="form-check-input me-2"
              />
              {{ todo.title }}
            </div>
            <div v-if="todo.isEditing">
              <input
                v-model="todo.title"
                @keyup.enter="doneEdit(todo)"
                @blur="doneEdit(todo)"
                class="form-control"
              />
            </div>
          </td>
          <td>
            <div v-if="!todo.isEditing">
              <!-- Show due date when not editing -->
              {{ todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date' }}
            </div>
            <div v-if="todo.isEditing">
              <input type="date" v-model="todo.dueDate" class="form-control" />
            </div>
          </td>
          <td>
            <div v-if="!todo.isEditing">
              <button
                @click="editTodo(index)"
                class="btn btn-outline-primary me-2"
              >
                Edit
              </button>
              <button
                @click="removeTodo(index, todo.id)"
                class="btn btn-outline-danger"
              >
                Delete
              </button>
            </div>
            <div v-if="todo.isEditing">
              <button @click="doneEdit(todo)" class="btn btn-success">Save</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newTodo: '',
      dueDate: null, // Store the selected due date
      todos: []
    };
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    getAuthHeader() {
      const token = localStorage.getItem('jwt_token');
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    },

    async fetchTodos() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/todos`, this.getAuthHeader());
        this.todos = response.data.map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed || false,
          isEditing: false,
          dueDate: todo.dueDate || null // Handle due date
        }));
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    async addTodo() {
      if (this.newTodo.trim()) {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/todos`, {
            title: this.newTodo,
            completed: false,
            dueDate: this.dueDate // Add the due date to the request
          }, this.getAuthHeader());
          console.log(this.dueDate)
          this.todos.push({
            id: response.data.id,
            title: response.data.title,
            completed: response.data.completed,
            isEditing: false,
            dueDate: response.data.dueDate // Add due date to the new todo
          });

          this.newTodo = '';
          this.dueDate = null; // Reset the due date
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      }
    },
    async removeTodo(index, id) {
      try {
        await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/todos/${id}`, this.getAuthHeader());
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
          await axios.put(`${process.env.VUE_APP_API_BASE_URL}/todos/${todo.id}`, {
            title: todo.title,
            completed: todo.completed,
            dueDate: todo.dueDate // Add due date to the update
          }, this.getAuthHeader());

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
        await axios.put(`${process.env.VUE_APP_API_BASE_URL}/todos/${todo.id}`, {
          title: todo.title,
          completed: todo.completed,
          dueDate: todo.dueDate // Update due date
        }, this.getAuthHeader());
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  }
};
</script>

<style scoped>
.todo-app {
  max-width: 800px;
}

.completed {
  text-decoration: line-through;
}

.table-hover tbody tr:hover {
  background-color: #f0f0f0;
}
</style>
