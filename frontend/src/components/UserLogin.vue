<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:88/auth/login', {
            username: this.username,
            password: this.password
          });
  
          const token = response.data.token;
          localStorage.setItem('jwt_token', token); // Token mentése localStorage-ba
          // A token elmentése után a router újratöltése, a Todo app komponens betöltése
          this.$router.push({ name: 'TodoApp' }).then(() => {
            this.$router.go(0); // Az oldal újratöltése a computed property frissítéséhez
          });
        } catch (error) {
          console.error('Login failed', error);
        }
      }
    }
  };
  </script>