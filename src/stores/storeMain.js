import { defineStore } from 'pinia';
import { _sort } from 'boot/radash';

export const useMainStore = defineStore('main', {
  state: () => ({
    vicos: [],
    selectId: 0,
    isSelect: false,
    vicoDialogView: false,
    vicoDialogAdd: false,
    vicoDialogEdit: false,
    vicoDialogArchive: false,
    vicoDialogDelete: false,
  }),
  getters: {
    getVicoById: (state) => {
      return (vicoId) => state.vicos.find((vico) => vico.id === vicoId);
    },
  },
  actions: {
    vicosSort() {
      this.vicos = _sort(this.vicos, (item) => item.dateTimeStart, false);
    },
    setVico(vico) {
      this.vicos.forEach((item, index) => {
        if (vico.id === item.id) {
          this.vicos.splice(index, 1, vico);
        }
      });
    },
    addVico(vico) {
      this.vicos.push(vico);
      this.vicosSort();
    },
    clear() {
      this.vicos = [];
      this.selectId = 0;
      this.isSelect = false;
      this.vicoDialogView = false;
      this.vicoDialogAdd = false;
      this.vicoDialogEdit = false;
      this.vicoDialogArchive = false;
      this.vicoDialogDelete = false;
    },
  },
});
