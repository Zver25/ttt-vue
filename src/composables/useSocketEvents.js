import { onUnmounted, watch } from 'vue';

const useSocketEvents = (socket, socketState, events = {}) => {
  const listeners = [];

  watch(
    () => socketState?.isConnected,
    (isConnected) => {
      if (isConnected) {
        Object.entries(events).forEach(([eventName, handler]) => {
          socket.on(eventName, handler);
          listeners.push({ eventName, handler });
        });
      }
    }
  );

  onUnmounted(() => {
    listeners.forEach(({ eventName, handler }) => {
      socket.off(eventName, handler);
    });
  });

  return { socket, socketState };
};

export default useSocketEvents;
