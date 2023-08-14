import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    ip: '10.127.*.*',
    login: '27000',
    computer: '27000-W',
    role: 'guest',
  }),
  getters: {},
  actions: {
    getData() {
      this.ip = '10.127.*.*';
      this.login = '27000';
      this.computer = '27000-W';
      this.role = 'guest';
    },
  },
});
