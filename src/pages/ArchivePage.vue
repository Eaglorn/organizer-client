<template>
  <div class="q-pa-md">
    <ArchiveTable />
    <ArchiveVicoDialogView ref="archiveVicoDialogView" />
    <ArchiveVicoDialogFilter ref="archiveVicoDialogFilter" />
  </div>
  <q-page-sticky
    class="my-button-group"
    position="bottom-left"
    :offset="[18, 18]">
    <q-btn-group push>
      <q-btn
        push
        class="my-button"
        color="brown-5"
        @click="archiveVicoDialogView.dialogOpen()">
        <i class="fa-solid fa-eye">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Посмотреть
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
  <q-page-sticky
    class="my-button-group"
    position="bottom-right"
    :offset="[18, 18]">
    <q-btn-group push>
      <q-btn
        push
        class="my-button"
        color="green"
        @click="archiveVicoDialogFilter.dialogOpen()">
        <i class="fa-solid fa-arrows-rotate">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Обновить страницу
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
</template>

<script>
import { api } from 'boot/axios'
import { Loading, Notify } from 'quasar'
import { defineComponent, ref, computed } from 'vue'

import ArchiveTable from 'components/archive/Table.vue'
import ArchiveVicoDialogView from 'components/archive/vico/dialog/View.vue'

import { useGlobalStore } from '../stores/storeGlobal.js'
import { useUserStore } from '../stores/storeUser.js'
import { useArchiveStore } from '../stores/storeArchive.js'

export default defineComponent({
  name: 'ArchivePage',
  components: {
    ArchiveTable,
    ArchiveVicoDialogView,
  },
  setup() {
    const storeGlobal = useGlobalStore()
    const storeUser = useUserStore()
    const storeArchive = useArchiveStore()

    const archiveVicoDialogView = ref(null)

    const role = computed(() => storeUser.role)

    const updateTable = () => {
      Loading.show()
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
              timeout: storeGlobal.messagesErrorTime.low,
            })
          } else {
            if (
              response.data.vicos.find(
                (item) => item.id === storeArchive.selectId
              ) === undefined
            ) {
              storeArchive.selectId = -1
              storeArchive.isSelect = false
            }
            storeArchive.vicos = response.data.vicos
            storeArchive.vicosSort()
          }
          Loading.hide()
        })
        .catch(function () {
          Notify.create({
            color: 'negative',
            position: 'top',
            message: 'Нет соединения с сервером.',
            icon: 'report_problem',
            timeout: storeGlobal.messagesErrorTime.medium,
          })
          Loading.hide()
        })
    }

    return {
      role,
      storeArchive,
      updateTable,
      archiveVicoDialogView,
    }
  },
})
</script>

<style lang="sass">
.my-button-group
  z-index: 999
  opacity: 0.85

.my-button-group:hover
  opacity: 1

.my-button
  color: black !important
  padding-left: 14px
  padding-right: 14px
  font-size: 22px
</style>
