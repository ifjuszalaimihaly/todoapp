<template>
    <div class="container mt-5">
      <h1 class="mb-4">Register</h1>
  
      <!-- Hibaüzenet megjelenítése dismissible opcióval -->
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="clearErrorMessage" aria-label="Close"></button>
      </div>
  
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="form-control"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: '' // Hibaüzenet változó hozzáadása
      };
    },
    methods: {
      async register() {
        try {
          // Regisztrációs adatokat küldünk a backendnek
          const response = await axios.post('http://localhost:88/auth/register', {
            username: this.username,
            password: this.password
          });
  
          // Ha sikeres a regisztráció, JWT tokent kapunk
          const token = response.data.token;
  
          // JWT token mentése localStorage-ba
          localStorage.setItem('jwt_token', token);
  
          // A token elmentése után a router újratöltése, a Todo app komponens betöltése
          this.$router.push({ name: 'TodoApp' }).then(() => {
            this.$router.go(0); // Az oldal újratöltése a computed property frissítéséhez
          });
        } catch (error) {
          // Hiba esetén a hibaüzenet beállítása
          this.errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
          console.error('Registration failed', error);
        }
      },
      clearErrorMessage() {
        // Hibaüzenet törlése
        this.errorMessage = '';
      }
    }
  };
  </script>
  
  <style scoped>
  /* További stílusok, ha szükséges */
  </style>
  