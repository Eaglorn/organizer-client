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
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogView = true"
      >
        <i class="fa-duotone fa-eye">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle"
          >
            Посмотреть
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        color="green"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogAdd = true"
        v-show="role > 0"
      >
        <i class="fa-solid fa-plus">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle"
          >
            Создать
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        color="orange"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogEdit = true"
        v-show="role > 0"
      >
        <i class="fa-duotone fa-pen">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle"
          >
            Редактировать
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
  <q-page-sticky class="my-button" position="bottom-right" :offset="[18, 18]">
    <q-btn-group push class="my-button">
      <q-btn push color="green" padding="8px" size="24px" @click="updateTable">
        <i class="fa-duotone fa-arrows-rotate">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle"
          >
            Обновить страницу
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        color="blue"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogArchive = true"
        v-show="role > 0"
      >
        <i class="fa-duotone fa-box-archive">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle"
          >
            Архивировать
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        color="red"
        padding="8px"
        size="24px"
        @click="storeMain.vicoDialogDelete = true"
        v-show="role > 0"
      >
        <i class="fa-duotone fa-trash">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle"
          >
            Удалить
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
</template>

<script>
import { api } from 'boot/axios';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref, computed } from 'vue';

import MainTable from 'components/main/Table.vue';
import MainVicoDialogView from 'components/main/vico/dialog/View.vue';
import MainVicoDialogAdd from 'components/main/vico/dialog/Add.vue';
import MainVicoDialogEdit from 'components/main/vico/dialog/Edit.vue';
import MainVicoDialogArchive from 'components/main/vico/dialog/Archive.vue';
import MainVicoDialogDelete from 'components/main/vico/dialog/Delete.vue';

import { useGlobalStore } from '../stores/storeGlobal.js';
import { useUserStore } from '../stores/storeUser.js';
import { useMainStore } from '../stores/storeMain.js';

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
    const storeGlobal = useGlobalStore();
    const storeUser = useUserStore();
    const storeMain = useMainStore();

    const role = computed(() => storeUser.role);

    const updateTable = () => {
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
              timeout: storeGlobal.messagesErrorTime.low,
            });
          } else {
            if (
              response.data.vicos.find(
                (item) => item.id === storeMain.selectId,
              ) === undefined
            ) {
              storeMain.selectId = -1;
              storeMain.isSelect = false;
            }
            storeMain.vicos = response.data.vicos;
            storeMain.vicosSort();
          }
          Loading.hide();
        })
        .catch(function () {
          Notify.create({
            color: 'negative',
            position: 'top',
            message: 'Нет соединения с сервером.',
            icon: 'report_problem',
            timeout: storeGlobal.messagesErrorTime.medium,
          });
          Loading.hide();
        });
    };

    return {
      role,
      storeMain,
      updateTable,
    };
  },
});
</script>

<style lang="sass">
.my-button
  z-index: 999
  opacity: 0.85

.my-button:hover
  opacity: 1
</style>
