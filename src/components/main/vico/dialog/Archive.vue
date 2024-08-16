<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar color="blue" text-color="white">
          <i class="fa-duotone fa-box-archive" />
        </q-avatar>
        <span class="q-ml-sm"
          >Подтвердите действие переноса записи об ВКС в архив.</span
        >
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Отмена"
          color="primary"
          text-color="white"
          @click="dialogClose" />
        <q-btn
          label="Перенести"
          color="warning"
          text-color="black"
          @click="dialogSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'boot/axios'
import { defineComponent, ref } from 'vue'
import { Loading, Notify } from 'quasar'
import { useGlobalStore } from '../../../../stores/storeGlobal.js'
import { useMainStore } from '../../../../stores/storeMain.js'
import { useUserStore } from '../../../../stores/storeUser.js'

export default defineComponent({
  name: 'MainVicoDialogArchive',
  props: {},
  setup() {
    const storeGlobal = useGlobalStore()
    const storeMain = useMainStore()
    const storeUser = useUserStore()

    const dialog = ref(false)

    const dialogOpen = () => {
      Loading.show()
      if (storeMain.isSelect) {
        dialog.value = true
        Loading.hide()
      } else {
        Notify.create({
          color: 'warning',
          position: 'top',
          message: '<b>Отсутствует выделение записи ВКС</b>',
          icon: 'warning',
          timeout: storeGlobal.messagesErrorTime.low,
          textColor: 'black',
          html: true,
        })
        Loading.hide()
      }
    }

    const dialogSave = () => {
      Loading.show()
      api({
        method: 'post',
        url: storeGlobal.getAjaxUri('vico/moved'),
        data: {
          id: storeMain.selectId,
          user: {
            computer: storeUser.computer,
            login: storeUser.login,
          },
        },
        timeout: 10000,
        responseType: 'json',
      })
        .then((response) => {
          if (response.data.success) {
            dialog.value = false
            Loading.hide()
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
            })
            Loading.hide()
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
          })
          Loading.hide()
        })
    }

    const dialogClose = () => {
      dialog.value = false
    }

    return {
      dialog,
      dialogOpen,
      dialogSave,
      dialogClose,
    }
  },
})
</script>

<style lang="sass"></style>
