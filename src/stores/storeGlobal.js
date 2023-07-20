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
  getters: {
    getOptionObjectByName: (state) => {
      return (objectName) =>
        state.optionObject.find((item) => item.label === objectName);
    },
    getOptionTypeVicoByName: (state) => {
      return (typeVicoName) =>
        state.optionTypeVico.find((item) => item.label === typeVicoName);
    },
    getOptionDepartamentByName: (state) => {
      return (departamentName) =>
        state.optionDepartament.find((item) => item.label === departamentName);
    },
  },
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
