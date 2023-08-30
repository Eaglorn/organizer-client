<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar color="red" text-color="white">
          <i class="fa-duotone fa-trash" />
        </q-avatar>
        <span class="q-ml-sm"
          >Подтвердите действие удаления записи об ВКС.</span
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
          label="Удалить"
          color="negative"
          @click="dialogSave"
          text-color="white"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { api } from 'boot/axios';
import { defineComponent, ref, watch } from 'vue';
import { Loading, Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../../../../stores/storeGlobal.js';
import { useMainStore } from '../../../../stores/storeMain.js';

export default defineComponent({
  name: 'MainVicoDialogDelete',
  props: {},
  setup() {
    const storeGlobal = useGlobalStore();
    const storeMain = useMainStore();

    const dialog = ref(false);

    const { vicoDialogDelete } = storeToRefs(storeMain);

    watch(vicoDialogDelete, () => {
      Loading.show();
      if (storeMain.vicoDialogDelete === true) {
        if (storeMain.isSelect) {
          dialog.value = true;
          Loading.hide();
        } else {
          Notify.create({
            color: 'warning',
            position: 'top',
            message: '<b>Отсутствует выделение записи ВКС</b>',
            icon: 'warning',
            timeout: storeGlobal.messagesErrorTime.low,
            textColor: 'black',
            html: true,
          });
          storeMain.vicoDialogDelete = false;
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
        url: storeGlobal.getAjaxUri('vico/delete'),
        data: {
          id: storeMain.selectId,
          user: {
            computer: storeUser.computer,
            login: storeUser.login,
            role: storeUser.role,
          },
        },
        timeout: 10000,
        responseType: 'json',
      })
        .then((response) => {
          if (response.data.success) {
            dialog.value = false;
            storeMain.vicoDialogDelete = false;
            Loading.hide();
          } else {
            Notify.create({
              progress: true,
              color: 'negative',
              position: 'top',
              message: '<b>' + response.data.message + '</b>',
              icon: 'report_problem',
              timeout: storeGlobal.messagesErrorTime.low,
              textColor: 'black',
              html: true,
            });
            Loading.hide();
          }
        })
        .catch(function () {
          Notify.create({
            color: 'negative',
            position: 'top',
            message: '<b>Нет соединения с сервером.</b>',
            icon: 'report_problem',
            timeout: storeGlobal.messagesErrorTime.medium,
            textColor: 'black',
            html: true,
          });
          Loading.hide();
        });
    };

    const dialogClose = () => {
      storeMain.vicoDialogDelete = false;
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
