<template>
  <div class="q-pa-md">
    <MainTable />
  </div>
  <MainVicoDialogView />
  <MainVicoDialogAdd />
  <MainVicoDialogEdit />
  <q-dialog v-model="dialogVicoArchive" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="archive" color="blue" text-color="white" />
        <span class="q-ml-sm"
          >Подтвердите действие переноса записи об ВКС в архив.</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Отмена"
          color="primary"
          @click="closeDialogVicoArchive"
          text-color="white"
        />
        <q-btn
          label="Перенести"
          color="warning"
          @click="saveDialogVicoArchive"
          text-color="black"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dialogVicoDelete" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="red" text-color="white" />
        <span class="q-ml-sm"
          >Подтвердите действие удаления записи об ВКС.</span
        >
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Отмена"
          color="primary"
          @click="closeDialogVicoArchive"
          text-color="white"
        />
        <q-btn
          label="Удалить"
          color="negative"
          @click="saveDialogVicoDelete"
          text-color="white"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
        @click="openDialogVicoArchive"
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
        @click="openDialogVicoDelete"
      >
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          class="text-body1"
          anchor="top middle"
          self="center middle"
          @click="closeDialogVicoDelete"
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
  },
  setup() {
    storeGlobal.setServer('http://10.27.0.243:3000/');

    const socket = io(storeGlobal.getServer);

    const dialogVicoArchive = ref(false);
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
      dialogVicoArchive.value = false;
      const vicos = storeMain.vicos.filter((vico) => vico.id != data.id);
      storeMain.setVicos(vicos);
    });

    socket.on('vicoDelete', (data) => {
      dialogVicoDelete.value = false;
      const vicos = storeMain.vicos.filter((vico) => vico.id != data.id);
      storeMain.setVicos(vicos);
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

    const openDialogVicoArchive = () => {
      if (storeMain.isSelect) {
        dialogVicoArchive.value = true;
      }
    };

    const saveDialogVicoArchive = () => {
      Loading.show();
      api({
        method: 'post',
        url: storeGlobal.getAjaxUri('vico/archive'),
        data: {
          id: storeMain.selectId,
        },
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
            dialogVicoArchive.value = false;
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

    const closeDialogVicoArchive = () => {
      dialogVicoArchive.value = false;
    };

    const openDialogVicoDelete = () => {
      if (storeMain.isSelect) {
        dialogVicoDelete.value = true;
      }
    };

    const saveDialogVicoDelete = () => {
      api({
        method: 'post',
        url: storeGlobal.getAjaxUri('vico/delete'),
        data: {
          id: storeMain.selectId,
        },
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

    const closeDialogVicoDelete = () => {
      dialogVicoDelete.value = false;
    };

    return {
      storeMain,
      updatePage,
      dialogVicoArchive,
      dialogVicoDelete,
      openDialogVicoArchive,
      saveDialogVicoArchive,
      closeDialogVicoArchive,
      openDialogVicoDelete,
      saveDialogVicoDelete,
      closeDialogVicoDelete,
    };
  },
});
</script>

<style lang="sass">
.my-button
  z-index: 999
  opacity: 0.5

.my-button:hover
  opacity: 1
</style>
