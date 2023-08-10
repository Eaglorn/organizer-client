import { defineStore } from 'pinia';
import { _clone } from 'boot/radash';
import { DateTime } from 'boot/luxon';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    //server: 'http://26.136.207.192:3000/',
    //server: 'http://10.27.0.243:3000/',
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
    socket: null,
    page: 'main',
    messagesErrorTime: {
      low: 2000,
      medium: 3000,
      high: 3500,
    },
  }),
  getters: {
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
      return _clone(this.templateVico);
    },
    getDate(seconds) {
      return DateTime.fromSeconds(seconds).toFormat('dd.LL.yyyy');
    },
    getTime(seconds) {
      return DateTime.fromSeconds(seconds).toFormat('HH:mm');
    },
    getSeconds(date, time) {
      return DateTime.fromFormat(date + '-' + time, 'dd.LL.yyyy-HH:mm', {
        numberingSystem: '',
      }).toSeconds();
    },
  },
});
