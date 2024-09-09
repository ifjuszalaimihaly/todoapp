<template>
  <div id="app">
    <router-view /> <!-- Itt töltődik be a megfelelő komponens -->

    <!-- Go to Login gomb csak akkor jelenik meg, ha nincs bejelentkezve és nem a login oldalon van -->
    <button v-if="!isAuthenticated && !isLoginPage" @click="goToLogin">Go to Login</button>
    
    <!-- Logout gomb akkor jelenik meg, ha be van jelentkezve -->
    <button v-if="isAuthenticated" @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      authenticated: !!localStorage.getItem('jwt_token')  // Kezdeti állapot a localStorage alapján
    };
  },
  computed: {
    isAuthenticated() {
      return this.authenticated;  // Az állapotból ellenőrizzük, hogy be van-e jelentkezve
    },
    isLoginPage() {
      return this.$route.path === '/userlogin';  // Ellenőrizzük, hogy a jelenlegi útvonal a /login
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/userlogin');  // Átirányítás a bejelentkezési oldalra
    },
    logout() {
      // Töröljük a JWT tokent a localStorage-ból
      localStorage.removeItem('jwt_token');

      // Frissítjük az állapotot, hogy a felhasználó kijelentkezett
      this.authenticated = false;

      // Átirányítjuk a felhasználót a bejelentkezési oldalra
      this.$router.push('/userlogin');
    }
  },
  watch: {
    // Ha az útvonal változik, mindig ellenőrizzük a bejelentkezési állapotot
    '$route.path': function() {
      this.authenticated = !!localStorage.getItem('jwt_token');
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
