<template>
  <div class="q-pa-md">
    <ArchiveTable />
    <ArchiveVicoDialogView />
  </div>
  <q-page-sticky class="my-button" position="bottom-left" :offset="[18, 18]">
    <q-btn-group push class="my-button">
      <q-btn
        push
        color="brown-5"
        icon="visibility"
        padding="8px"
        size="24px"
        @click="storeArchive.vicoDialogView = true"
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
    </q-btn-group>
  </q-page-sticky>
  <q-page-sticky class="my-button" position="bottom-right" :offset="[18, 18]">
    <q-btn-group push class="my-button">
      <q-btn
        push
        color="green"
        icon="autorenew"
        padding="8px"
        size="24px"
        @click="updateTable"
      >
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
    </q-btn-group>
  </q-page-sticky>
</template>

<script>
import { api } from 'boot/axios';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref } from 'vue';

import ArchiveTable from 'components/archive/Table.vue';
import ArchiveVicoDialogView from 'components/archive/vico/dialog/View.vue';

import { useGlobalStore } from '../stores/storeGlobal.js';
import { useArchiveStore } from '../stores/storeArchive.js';

const storeGlobal = useGlobalStore();
const storeArchive = useArchiveStore();

export default defineComponent({
  name: 'IndexPage',
  components: {
    ArchiveTable,
    ArchiveVicoDialogView,
  },
  setup() {
    Loading.show();
    storeGlobal.socket.on('archiveAdd', (data) => {
      storeArchive.addVico(data);
    });

    storeGlobal.socket.on('archiveAll', (data) => {
      storeArchive.vicos = data.vicos;
      storeArchive.vicosSort();
    });

    const updateTable = () => {
      Loading.show();
      api({
        method: 'post',
        url: storeGlobal.getAjaxUri('archive/all'),
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
            if (
              response.data.vicos.find(
                (item) => item.id === storeArchive.selectId,
              ) === undefined
            ) {
              storeArchive.selectId = -1;
              storeArchive.isSelect = false;
            }
            storeArchive.vicos = response.data.vicos;
            storeArchive.vicosSort();
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
    Loading.hide();

    return {
      storeArchive,
      updateTable,
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
