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
    addVico: (vico) => {
      this.vicos.push(vico);
    },
    setServer(arg) {
      this.server = arg;
    },
    getServer(arg) {
      return this.server;
    },
    getAjaxUri(response) {
      return this.server + 'api/' + response;
    },
  },
});
