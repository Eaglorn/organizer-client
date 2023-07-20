import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    vicos: [],
    selectId: 0,
    isSelect: false,
    vicoDialogView: false,
    vicoDialogAdd: false,
    vicoDialogEdit: false,
  }),
  getters: {
    getVicos: (state) => {
      return state.vicos;
    },
    getVicoById: (state) => {
      return (vicoId) => state.vicos.find((vico) => vico.id === vicoId);
    },
  },
  actions: {
    setVicos(vicos) {
      this.vicos = vicos;
    },
    addVico(vico, isToAddToStart = false) {
      if (isToAddToStart) {
        this.vicos.unshift(vico);
      } else {
        this.vicos.push(vico);
      }
    },
  },
});
