import { boot } from 'quasar/wrappers';
import { io, Manager } from 'socket.io-client';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.config.globalProperties.$io = io;
  app.config.globalProperties.$ioManager = Manager;
});

export { io, Manager };
