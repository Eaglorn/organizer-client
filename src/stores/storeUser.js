import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    computer: '',
    login: '',
    role: 0,
  }),
  getters: {},
  actions: {},
})
