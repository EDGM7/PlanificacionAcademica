import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import Profile from '../views/Profile.vue';
import Horario from '../views/Horario.vue';
import MateriasDisponibles from '../views/MateriasDisponibles.vue';
import PlanificacionCronograma from '@/views/PlanificacionCronograma.vue';
import Registro from '../views/Registro.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage },
  { path: '/perfil', name: 'Profile', component: Profile },
  { path: '/horario', name: 'Horario', component: Horario },
  { path: '/materias-disponibles', name: 'MateriasDisponibles', component: MateriasDisponibles },
  {path:  '/planificacion', name: 'PlanificacionCronograma', component: PlanificacionCronograma },
  { path: '/register', name: 'Register', component: Registro },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
