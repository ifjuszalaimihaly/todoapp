<template>
  <div id="app">
    <!-- Header beillesztése -->
    <AppHeader />
    
    <router-view /> <!-- Itt töltődik be a megfelelő komponens -->
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'; // Header importálása

export default {
  name: 'App',
  components: {
    AppHeader // AppHeader regisztrálása
  },
  data() {
    return {
      authenticated: !!localStorage.getItem('jwt_token')  // Kezdeti állapot a localStorage alapján
    };
  },
  computed: {
    isAuthenticated() {
      return this.authenticated;  // Az állapotból ellenőrizzük, hogy be van-e jelentkezve
    }
  },
  methods: {
    // Nincs szükség logout metódusra itt, mivel a Header-ben van kezelve
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
}
</style>