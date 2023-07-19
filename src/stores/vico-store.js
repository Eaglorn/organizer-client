import { defineStore } from 'pinia';

export const useVicoStore = defineStore('vico', {
  state: () => ({
    vicos: [],
    server: '',
  }),
  getters: {
    getVicos: () => {
      return vicos;
    },
    getVicoById: (state) => {
      return (vicoId) => state.vicos.find((vico) => vico.id === vicoId);
    },
  },
  actions: {
    setVicos(vicos) {
      this.vicos = vicos;
    },
    addVicoFirst(vico) {
      this.vicos.unshift(vico);
    },
    addVico(vico) {
      this.vicos.push(vico);
    },
    setServer(server) {
      this.server = server;
    },
    getServer() {
      return this.server;
    },
    getAjaxUri(response) {
      return this.server + 'api/' + response;
    },
  },
});
