import { defineStore } from 'pinia';
import { DateTime } from 'boot/luxon';
import { _sort } from 'boot/radash';

export const useArchiveStore = defineStore('archive', {
  state: () => ({
    vicos: [],
    selectId: 0,
    isSelect: false,
    vicoDialogView: false,
  }),
  getters: {
    getVicoById: (state) => {
      return (vicoId) => state.vicos.find((vico) => vico.id === vicoId);
    },
  },
  actions: {
    vicosSort() {
      this.vicos = _sort(this.vicos, (item) => item.fullTime);
    },
    addVico(vico) {
      this.vicos.push(vico);
      this.vicosSort();
    },
  },
});
