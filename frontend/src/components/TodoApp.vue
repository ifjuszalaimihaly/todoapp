<template>
  <div class="todo-app">
    <h1>Todo App</h1>

    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a new todo" />

    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        <label v-if="!todo.isEditing" :class="{ completed: todo.completed }">
          <input type="checkbox" v-model="todo.completed" />
          {{ todo.text }}
        </label>
        <input v-if="todo.isEditing" v-model="todo.text" @keyup.enter="doneEdit(todo)" @blur="doneEdit(todo)" />

        <button @click="editTodo(index)" v-if="!todo.isEditing">Edit</button>
        <button @click="doneEdit(todo)" v-if="todo.isEditing">Save</button>
        <button @click="removeTodo(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTodo: '',
      todos: []
    };
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim()) {
        this.todos.push({ text: this.newTodo, completed: false, isEditing: false });
        this.newTodo = '';
      }
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    editTodo(index) {
      this.todos[index].isEditing = true;
    },
    doneEdit(todo) {
      if (todo.text.trim()) {
        todo.isEditing = false;
      } else {
        this.removeTodo(this.todos.indexOf(todo));
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

label.completed {
  text-decoration: line-through;
}

button {
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
}

input[type="text"]:focus {
  outline: none;
  border: 1px solid #333;
}
</style>