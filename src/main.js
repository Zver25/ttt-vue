import { createApp } from 'vue'
import App from './App.vue'
import SocketPlugin from './plugins/socket';

const app = createApp(App);

app.use(SocketPlugin);

app.mount('#app');
