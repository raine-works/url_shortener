import { createApp } from 'vue';
import App from './App.vue';
import axios from './plugins/vue-axios';
import './style.css';

const app = createApp(App);
app.use(axios);
app.mount('#app');
