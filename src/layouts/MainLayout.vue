<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Органайзер ВКС </q-toolbar-title>
        <q-space />
        <q-btn
          v-if="page === 'main'"
          color="green-2"
          text-color="black"
          icon="archive"
          @click="onClickButtonArchive"
          >Архив</q-btn
        >
        <q-btn
          v-if="page === 'archive'"
          color="green-2"
          text-color="black"
          icon="web"
          @click="onClickButtonMain"
          >Главная страница</q-btn
        >
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { io } from 'boot/socket';
import { defineComponent, computed, ref } from 'vue';
import { Loading } from 'quasar';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/storeGlobal.js';

const storeGlobal = useGlobalStore();

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const socket = io(storeGlobal.server);
    storeGlobal.socket = socket;

    const page = computed(() => storeGlobal.page);

    storeGlobal.socket.on('load', (data) => {
      storeGlobal.optionObject = [];
      storeGlobal.optionTypeVico = [];
      storeGlobal.optionDepartament = [];

      var i = 0;
      data.optionObject.forEach((item) => {
        storeGlobal.optionObject.push({
          label: item,
          value: i,
        });
        i++;
      });

      i = 0;
      data.optionTypeVico.forEach((item) => {
        storeGlobal.optionTypeVico.push({
          label: item,
          value: i,
        });
        i++;
      });

      i = 0;
      data.optionDepartament.forEach((item) => {
        storeGlobal.optionDepartament.push({
          label: item,
          value: i,
        });
        i++;
      });
    });

    const router = useRouter();
    const onClickButtonArchive = () => {
      Loading.show();
      router.push('archive');
      storeGlobal.page = 'archive';
      Loading.hide();
    };
    const onClickButtonMain = () => {
      Loading.show();
      router.push('main');
      storeGlobal.page = 'main';
      Loading.hide();
    };

    return { onClickButtonArchive, onClickButtonMain, page };
  },
});
</script>
