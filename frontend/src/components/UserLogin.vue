<template>
  <div class="container mt-5">
    <h1 class="mb-4">Login</h1>

    <!-- Hibaüzenet megjelenítése dismissible opcióval -->
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="clearErrorMessage" aria-label="Close"></button>
    </div>

    <form @submit.prevent="login">
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
      <button type="submit" class="btn btn-primary">Login</button>
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
      errorMessage: '' // Hibaüzenet változó
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
        localStorage.setItem('username', this.username); // Username mentése localStorage-ba
        this.$router.push({ name: 'TodoApp' }).then(() => {
          this.$router.go(0); // Az oldal újratöltése a computed property frissítéséhez
        });
      } catch (error) {
        // Hiba esetén a hibaüzenet beállítása
        this.errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
        console.error('Login failed', error);
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
