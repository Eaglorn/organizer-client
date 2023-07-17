import { defineStore } from "pinia";

export const useVicoStore = defineStore("vico", {
  state: () => ({
    vicos: [],
  }),
  getters: {
    getVicoById: (state) => {
      return (vicoId) => state.vicos.find((vico) => vico.id === vicoId);
    },
  },
});
