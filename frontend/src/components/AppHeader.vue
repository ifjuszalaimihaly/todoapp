<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Todo App</a>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Csak akkor jelenik meg a Login és Register, ha nincs bejelentkezve -->
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/userlogin">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/userregister">Register</router-link>
          </li>
          
          <!-- Csak bejelentkezés esetén jelenik meg a Logout gomb -->
          <li class="nav-item" v-if="isAuthenticated">
            <button class="btn btn-outline-danger" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('jwt_token')  // Kezdeti állapot a localStorage alapján
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('jwt_token');  // Token eltávolítása
      this.isAuthenticated = false;  // Állapot frissítése
      this.$router.push('/userlogin');  // Átirányítás a bejelentkezési oldalra
    }
  },
  watch: {
    // Figyeljük az útvonal változását, hogy frissítsük az autentikációs állapotot bejelentkezéskor
    '$route'() {
      this.isAuthenticated = !!localStorage.getItem('jwt_token');
    }
  }
};
</script>

<style scoped>
/* További stílusok, ha szükséges */
</style>
