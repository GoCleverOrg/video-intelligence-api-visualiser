import { createRouter, createWebHistory } from 'vue-router';
// Import your App component
import App from './App.vue';

const routes = [
    { path: '/', component: App },
    // ... other routes
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
