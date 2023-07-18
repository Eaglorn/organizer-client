import { defineStore } from "pinia";

export const useVicoStore = defineStore("vico", {
  state: () => ({
    vicos: [],
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
  }
});
