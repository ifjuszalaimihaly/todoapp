import { createRouter, createWebHistory } from 'vue-router';
import TodoApp from './components/TodoApp.vue';
import UserLogin from './components/UserLogin.vue'; // Bejelentkező oldal
import UserRegister from './components/UserRegister.vue'; // Regisztrációs oldal

const routes = [
  {
    path: '/userlogin',
    name: 'UserLogin',
    component: UserLogin,
  },
  {
    path: '/userregister', // Regisztrációs oldal útvonala
    name: 'UserRegister',
    component: UserRegister,
  },
  {
    path: '/todos',
    name: 'TodoApp',
    component: TodoApp,
    meta: { requiresAuth: true }, // Autentikáció szükséges
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token'); // JWT tárolva pl. localStorage-ban

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      // Ha nincs token, akkor irányítsd a bejelentkező oldalra
      next({ name: 'UserLogin' }); // Frissítve a 'Login' név 'UserLogin'-ra
    } else {
      // Ha van token, engedd tovább
      next();
    }
  } else {
    // Ha az oldalhoz nem szükséges autentikáció
    next();
  }
});

export default router;