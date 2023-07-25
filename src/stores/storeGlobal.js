import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    server: 'http://10.27.0.243:3000/',
    //server: 'http://localhost:3000/',
    //server: 'http://192.168.0.10:3000/',
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
    getServer: (state) => {
      return state.server;
    },
    getAjaxUri(state) {
      return (response) => state.server + 'api/' + response;
    },
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
    getVicoTemplate() {
      return Object.assign({}, this.templateVico);
    },
    setServer(server) {
      this.server = server;
    },
    setOptions(optionObject, optionTypeVico, optionDepartament) {
      this.optionObject = optionObject;
      this.optionTypeVico = optionTypeVico;
      this.optionDepartament = optionDepartament;
    },
  },
});
