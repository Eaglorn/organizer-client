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
    getVicos: () => {
      return vicos;
    },
    getVicoById: (state) => {
      return (vicoId) => state.vicos.find((vico) => vico.id === vicoId);
    },
  },
  actions: {
    setVico(vico) {
      console.log(vico);
      console.log(this.getVicoById(vico.id));
    },
    setVicos(vicos) {
      this.vicos = vicos;
    },
    addVicoFirst(vico) {
      this.vicos.unshift(vico);
    },
    addVico(vico) {
      this.vicos.push(vico);
    },
  },
});
