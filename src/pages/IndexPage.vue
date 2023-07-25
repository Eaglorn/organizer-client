<template>
  <div class="q-pa-md">
    <MainTable />
  </div>
  <MainVicoDialogView />
  <MainVicoDialogAdd />
  <MainVicoDialogEdit />
  <MainVicoDialogArchive />
  <MainVicoDialogDelete />
  <q-page-sticky class="my-button" position="bottom-left" :offset="[18, 18]">
    <q-btn-group push class="my-button">
      <q-btn
        push
        color="brown-5"
        icon="visibility"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogView = true"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          class="text-body1"
          anchor="top middle"
          self="center middle"
        >
          Посмотреть
        </q-tooltip>
      </q-btn>
      <q-btn
        push
        color="green"
        icon="add"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogAdd = true"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          class="text-body1"
          anchor="top middle"
          self="center middle"
        >
          Создать
        </q-tooltip>
      </q-btn>
      <q-btn
        push
        color="orange"
        icon="edit"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogEdit = true"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          class="text-body1"
          anchor="top middle"
          self="center middle"
        >
          Редактировать
        </q-tooltip>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
  <q-page-sticky
    class="my-button"
    position="bottom-right"
    :offset="[18, 18]"
    @click="updatePage"
  >
    <q-btn-group push class="my-button">
      <q-btn push color="green" icon="autorenew" padding="8px" size="24px">
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          class="text-body1"
          anchor="top middle"
          self="center middle"
        >
          Обновить страницу
        </q-tooltip>
      </q-btn>
      <q-btn
        push
        color="blue"
        icon="archive"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogArchive = true"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          class="text-body1"
          anchor="top middle"
          self="center middle"
        >
          Архивировать
        </q-tooltip>
      </q-btn>
      <q-btn
        push
        color="red"
        icon="delete"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogDelete = true"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          class="text-body1"
          anchor="top middle"
          self="center middle"
        >
          Удалить
        </q-tooltip>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
</template>

<script>
import { api } from 'boot/axios';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref } from 'vue';
import { io } from 'boot/socket';

import MainTable from 'components/main/Table.vue';
import MainVicoDialogView from 'components/main/vico/dialog/View.vue';
import MainVicoDialogAdd from 'components/main/vico/dialog/Add.vue';
import MainVicoDialogEdit from 'components/main/vico/dialog/Edit.vue';
import MainVicoDialogArchive from 'components/main/vico/dialog/Archive.vue';
import MainVicoDialogDelete from 'components/main/vico/dialog/Delete.vue';

import { useGlobalStore } from '../stores/storeGlobal.js';
import { useMainStore } from '../stores/storeMain.js';

const storeGlobal = useGlobalStore();
const storeMain = useMainStore();

export default defineComponent({
  name: 'IndexPage',
  components: {
    MainTable,
    MainVicoDialogView,
    MainVicoDialogAdd,
    MainVicoDialogEdit,
    MainVicoDialogArchive,
    MainVicoDialogDelete,
  },
  setup() {
    const socket = io(storeGlobal.getServer);
    const dialogVicoDelete = ref(false);

    socket.on('vicoAdd', (data) => {
      storeMain.addVico(data, true);
    });

    socket.on('vicoEdit', (data) => {
      storeMain.setVico(data.vico);
    });

    socket.on('vicoAll', (data) => {
      storeGlobal.setOptions(
        data.optionObject,
        data.optionTypeVico,
        data.optionDepartament,
      );
      storeMain.setVicos(data.vicos);
    });

    socket.on('vicoArchive', (data) => {
      const vicos = storeMain.vicos.filter((vico) => vico.id != data.id);
      storeMain.setVicos(vicos);
      if (storeMain.selectId === data.id) {
        storeMain.selectId = -1;
        storeMain.isSelect = false;
      }
    });

    socket.on('vicoDelete', (data) => {
      const vicos = storeMain.vicos.filter((vico) => vico.id != data.id);
      storeMain.setVicos(vicos);
      if (storeMain.selectId === data.id) {
        storeMain.selectId = -1;
        storeMain.isSelect = false;
      }
    });

    const updatePage = () => {
      Loading.show();
      api({
        method: 'post',
        url: storeGlobal.getAjaxUri('vico/all'),
        data: {},
        timeout: 10000,
        responseType: 'json',
      })
        .then((response) => {
          if (response.data.success === false) {
            Notify.create({
              progress: true,
              color: 'negative',
              position: 'top',
              message: response.data.message,
              icon: 'report_problem',
            });
          } else {
            storeMain.setVicos(response.data.vicos);
          }
          Loading.hide();
        })
        .catch(function () {
          Notify.create({
            color: 'negative',
            position: 'top',
            message: 'Нет соединения с сервером.',
            icon: 'report_problem',
          });
          Loading.hide();
        });
    };

    return {
      storeMain,
      updatePage,
    };
  },
});
</script>

<style lang="sass">
.my-button
  z-index: 999
  opacity: 0.7

.my-button:hover
  opacity: 1
</style>
