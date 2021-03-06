import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

const app = createApp(App);
app.config.isCustomElement = tag => tag === 'canvas-datagrid';
app.mount('#app');
