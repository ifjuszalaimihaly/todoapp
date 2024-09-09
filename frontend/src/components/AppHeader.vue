<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Todo App</a>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Ha bejelentkezett, üdvözöljük a felhasználót -->
          <li class="nav-item" v-if="isAuthenticated">
            <span class="navbar-text">Welcome, {{ username }}!</span>
          </li>
          <!-- Csak akkor jelenik meg a Login és Register, ha nincs bejelentkezve -->
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/userlogin">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/userregister">Register</router-link>
          </li>

          <!-- Csak bejelentkezés esetén jelenik meg Todo-s és a Logout gomb -->
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/todos">Todos</router-link>
          </li>
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
      isAuthenticated: !!localStorage.getItem('jwt_token'),  // Kezdeti állapot a localStorage alapján
      username: ''  // Felhasználónév tárolása
    };
  },
  mounted() {
    if (this.isAuthenticated) {
      this.username = localStorage.getItem('username');  // Felhasználónév beállítása, ha van bejelentkezés
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('jwt_token');  // Token eltávolítása
      localStorage.removeItem('username');  // Felhasználónév eltávolítása
      this.isAuthenticated = false;  // Állapot frissítése
      this.username = '';  // Felhasználónév törlése
      this.$router.push('/userlogin');  // Átirányítás a bejelentkezési oldalra
    }
  },
  watch: {
    // Figyeljük az útvonal változását, hogy frissítsük az autentikációs állapotot bejelentkezéskor
    '$route'() {
      this.isAuthenticated = !!localStorage.getItem('jwt_token');
      if (this.isAuthenticated) {
        this.username = localStorage.getItem('username');  // Felhasználónév frissítése bejelentkezéskor
      }
    }
  }
};
</script>

<style scoped>
/* További stílusok, ha szükséges */
.navbar-text {
  margin-right: 20px;
  font-weight: bold;
  display: flex;
  align-items: center; /* Függőlegesen középre igazítja a szöveget */
  height: 100%; /* Győződjünk meg róla, hogy a szülő elem magasságához igazítjuk */
}
</style>
