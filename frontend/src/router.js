import { createRouter, createWebHistory } from 'vue-router';
import TodoApp from './components/TodoApp.vue';
import UserLogin from './components/UserLogin.vue';
import UserRegister from './components/UserRegister.vue';

// Router beállítások
const routes = [
  {
    path: '/userlogin',
    name: 'UserLogin',
    component: UserLogin,
    meta: { guestOnly: true } // Csak vendégek (nem bejelentkezett felhasználók) férhetnek hozzá
  },
  {
    path: '/userregister',
    name: 'UserRegister',
    component: UserRegister,
    meta: { guestOnly: true } // Csak vendégek (nem bejelentkezett felhasználók) férhetnek hozzá
  },
  {
    path: '/todos',
    name: 'TodoApp',
    component: TodoApp,
    meta: { requiresAuth: true } // Csak bejelentkezett felhasználók férhetnek hozzá
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Globális útvonal őrök
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('jwt_token'); // Ellenőrizzük, van-e JWT token

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Ha az oldalhoz hitelesítés szükséges és a felhasználó nincs bejelentkezve
    next({ name: 'UserLogin' }); // Átirányítjuk a bejelentkezési oldalra
  } else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    // Ha az oldalhoz csak vendégek férhetnek hozzá és a felhasználó be van jelentkezve
    next({ name: 'TodoApp' }); // Átirányítjuk a feladatok oldalra (vagy más bejelentkezett oldalra)
  } else {
    next(); // Ellenkező esetben folytatjuk az útvonal betöltését
  }
});

export default router;
