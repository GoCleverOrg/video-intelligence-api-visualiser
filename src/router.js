import { createRouter, createWebHistory } from 'vue-router';
// Import other components as routes when you have them
// import TestComponent from './components/TestComponent.vue';

const routes = [
  // { path: '/match/:id', component: TestComponent }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
