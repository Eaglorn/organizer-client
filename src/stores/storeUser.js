import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    computerName: '',
    login: '',
    role: 'guest',
  }),
  getters: {},
  actions: {},
});
