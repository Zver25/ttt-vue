import { io } from 'socket.io-client';
import { reactive } from 'vue';

export const socket = io('', {
  path: '/ws/',
  autoConnect: false,
});

export const socketState = reactive({
  isConnected: false,
});

export default {
  async install(app) {
    app.provide('$socket', socket);
    app.provide('$socketState', socketState);

    await new Promise((resolve, reject) => {
      socket.on('connect', () => {
        console.log('✅ Подключено к Socket.IO');
        socketState.isConnected = true;
        resolve();
      });

      socket.on('disconnect', () => {
        console.log('❌ Отключено от Socket.IO');
        socketState.isConnected = false;
      });

      socket.on('connect_error', (err) => {
        console.error('Ошибка подключения:', err);
        socketState.isConnected = false;
        reject(err);
      });

      socket.connect();
    });
  },
};
