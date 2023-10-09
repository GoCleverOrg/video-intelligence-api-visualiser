import Vue from 'vue';
import VueRouter from 'vue-router';
// Import other components as routes when you have them
// import TestComponent from './components/TestComponent.vue';

Vue.use(VueRouter);

const routes = [
  // { path: '/match/:id', component: TestComponent }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
