<template>
  <q-dialog v-model="dialog" persistent>
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
          @click="dialogClose"
          text-color="white"
        />
        <q-btn
          label="Перенести"
          color="warning"
          @click="dialogSave"
          text-color="black"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { api } from 'boot/axios';
import { defineComponent, ref, computed, watch } from 'vue';
import { Loading, Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../../../../stores/storeGlobal.js';
import { useMainStore } from '../../../../stores/storeMain.js';

export default defineComponent({
  name: 'MainDialogArchive',
  props: {},
  setup() {
    const storeGlobal = useGlobalStore();
    const storeMain = useMainStore();

    const dialog = ref(false);

    const { vicoDialogArchive } = storeToRefs(storeMain);

    watch(vicoDialogArchive, () => {
      Loading.show();
      if (storeMain.vicoDialogArchive === true) {
        if (storeMain.isSelect) {
          dialog.value = true;
          Loading.hide();
        } else {
          Notify.create({
            color: 'warning',
            position: 'top',
            message: 'Отсутствует выделение записи ВКС',
            icon: 'warning',
          });
          storeMain.vicoDialogArchive = false;
          Loading.hide();
        }
      } else {
        Loading.hide();
      }
    });

    const dialogSave = () => {
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
          if (response.data.success) {
            dialog.value = false;
            storeMain.vicoDialogArchive = false;
            Loading.hide();
          } else {
            Notify.create({
              progress: true,
              color: 'negative',
              position: 'top',
              message: response.data.message,
              icon: 'report_problem',
            });
            Loading.hide();
          }
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

    const dialogClose = () => {
      storeMain.vicoDialogArchive = false;
      dialog.value = false;
    };

    return {
      dialog,
      dialogSave,
      dialogClose,
    };
  },
});
</script>
<style lang="sass"></style>
