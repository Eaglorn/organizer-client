import { defineStore } from 'pinia';
import { _sort } from 'boot/radash';

export const useArchiveStore = defineStore('archive', {
  state: () => ({
    vicos: [],
    selectId: 0,
    isSelect: false,
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
    clear() {
      this.vicos = [];
      this.selectId = 0;
      this.isSelect = false;
    },
  },
});
