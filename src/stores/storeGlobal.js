import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    server: '',
    optionObject: [],
    optionTypeVico: [],
    optionDepartament: [],
    templateVico: {
      date: '',
      timeStart: '',
      timeEnd: '',
      objectInitiator: [],
      objectInvited: [],
      typeVico: '',
      topic: '',
      departamentInitiator: [],
      departamentInvited: [],
      contactName: '',
      contactPhone: '',
    },
  }),
  getters: {},
  actions: {
    setServer(server) {
      this.server = server;
    },
    getServer() {
      return this.server;
    },
    getAjaxUri(response) {
      return this.server + 'api/' + response;
    },
    setOptions(optionObject, optionTypeVico, optionDepartament) {
      this.optionObject = optionObject;
      this.optionTypeVico = optionTypeVico;
      this.optionDepartament = optionDepartament;
    },
  },
});
