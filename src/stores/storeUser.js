import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    computerName: '',
    login: '',
    role: 0,
  }),
  getters: {},
  actions: {},
});
