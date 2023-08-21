<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <q-icon name="laptop_chromebook" />
        <div>Органайзер (v{{ version }})</div>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>
      <q-toolbar class="bg-primary shadow-1 shadow-up-1">
        <q-space />
        <q-btn
          v-if="role > 1 && page != 'admin'"
          color="green-3"
          text-color="black"
          @click="onClickButtonAdmin"
        >
          <q-icon size="2rem" name="admin_panel_settings" />
          &nbsp;
          <b>Перейти на страницу администрирования</b>
        </q-btn>
        <q-btn
          v-if="page != 'archive'"
          color="green-3"
          text-color="black"
          @click="onClickButtonArchive"
        >
          <q-icon size="2rem" name="archive" />
          &nbsp;
          <b>Перейти в архив</b>
        </q-btn>
        <q-btn
          v-if="page != 'main'"
          color="green-3"
          text-color="black"
          @click="onClickButtonMain"
        >
          <q-icon size="2rem" name="web" />&nbsp;
          <b>Перейти на главную страницу</b>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { io } from 'boot/socket';
import { defineComponent, computed, ref } from 'vue';
import { Loading } from 'quasar';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/storeGlobal.js';
import { useUserStore } from '../stores/storeUser.js';
import { useMainStore } from '../stores/storeMain.js';
import { useArchiveStore } from '../stores/storeArchive.js';

const storeGlobal = useGlobalStore();
const storeUser = useUserStore();
const storeMain = useMainStore();
const storeArchive = useArchiveStore();

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const count = ref(0);

    const data = window.userAPI.getData;
    storeUser.login = data.login;
    storeUser.computerName = data.computerName;

    const socket = io(storeGlobal.server, {
      query: {
        login: storeUser.login,
        computerName: storeUser.computerName,
      },
    });
    storeGlobal.socket = socket;

    const page = computed(() => storeGlobal.page);

    storeGlobal.socket.on('load', (data) => {
      storeUser.role = data.role;
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

    storeGlobal.socket.on('vicoAll', (data) => {
      storeMain.vicos = data.vicos;
      storeMain.vicosSort();
    });

    storeGlobal.socket.on('vicoAdd', (data) => {
      storeMain.addVico(data);
    });

    storeGlobal.socket.on('vicoEdit', (data) => {
      storeMain.setVico(data.vico);
      storeMain.vicosSort();
    });

    storeGlobal.socket.on('vicoDelete', (data) => {
      storeMain.vicos = storeMain.vicos.filter((vico) => vico.id != data.id);
      if (storeMain.selectId === data.id) {
        storeMain.selectId = -1;
        storeMain.isSelect = false;
      }
    });

    storeGlobal.socket.on('archiveAll', (data) => {
      storeArchive.vicos = data.vicos;
      storeArchive.vicosSort();
    });

    const router = useRouter();
    const onClickButtonArchive = () => {
      Loading.show();
      storeGlobal.socket.emit('pageArchive');
      router.push('archive');
      if (storeGlobal.page === 'main') storeMain.clear();
      storeGlobal.page = 'archive';
      Loading.hide();
    };
    const onClickButtonMain = () => {
      Loading.show();
      storeGlobal.socket.emit('pageMain');
      router.push('main');
      if (storeGlobal.page === 'archive') storeArchive.clear();
      storeGlobal.page = 'main';
      Loading.hide();
    };
    const onClickButtonAdmin = () => {
      Loading.show();
      router.push('admin');
      if (storeGlobal.page === 'archive') storeArchive.clear();
      if (storeGlobal.page === 'main') storeMain.clear();
      storeGlobal.page = 'admin';
      Loading.hide();
    };

    function minimize() {
      if (process.env.MODE === 'electron') {
        window.windowAPI.minimize();
      }
    }

    function toggleMaximize() {
      if (process.env.MODE === 'electron') {
        window.windowAPI.toggleMaximize();
        count.value = count.value + 1;
      }
    }

    function closeApp() {
      if (process.env.MODE === 'electron') {
        window.windowAPI.close();
      }
    }

    const version = computed(() => storeGlobal.version);

    const role = computed(() => storeUser.role);

    return {
      role,
      count,
      version,
      onClickButtonArchive,
      onClickButtonMain,
      onClickButtonAdmin,
      page,
      minimize,
      toggleMaximize,
      closeApp,
    };
  },
});
</script>
