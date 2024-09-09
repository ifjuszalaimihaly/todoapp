import { createRouter, createWebHistory } from 'vue-router';
import TodoApp from './components/TodoApp.vue';
import UserLogin from './components/UserLogin.vue'; // Tegyük fel, hogy van egy bejelentkező oldal

const routes = [
  {
    path: '/userlogin',
    name: 'UserLogin',
    component: UserLogin,
  },
  {
    path: '/todos',
    name: 'TodoApp',
    component: TodoApp,
    meta: { requiresAuth: true } // Meta flag, hogy autentikáció szükséges
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token'); // JWT tárolva pl. localStorage-ban

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      // Ha nincs token, akkor irányítsd a bejelentkező oldalra
      next({ name: 'Login' });
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
