<script setup>
defineOptions({
  name: 'IndexPage',
})

import { api } from 'boot/axios'
import { Loading, Notify } from 'quasar'
import { ref, computed } from 'vue'

import MainTable from 'components/main/Table.vue'
import MainVicoDialogView from 'components/main/vico/dialog/View.vue'
import MainVicoDialogAdd from 'components/main/vico/dialog/Add.vue'
import MainVicoDialogEdit from 'components/main/vico/dialog/Edit.vue'
import MainVicoDialogArchive from 'components/main/vico/dialog/Archive.vue'
import MainVicoDialogDelete from 'components/main/vico/dialog/Delete.vue'

import { useGlobalStore } from '../stores/storeGlobal.js'
import { useUserStore } from '../stores/storeUser.js'
import { useMainStore } from '../stores/storeMain.js'

const storeGlobal = useGlobalStore()
const storeUser = useUserStore()
const storeMain = useMainStore()

const mainVicoDialogView = ref(null)
const mainVicoDialogAdd = ref(null)
const mainVicoDialogEdit = ref(null)

const mainVicoDialogArchive = ref(null)
const mainVicoDialogDelete = ref(null)

const role = computed(() => storeUser.role)

const updateTable = () => {
  Loading.show()
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
        })
      } else {
        if (
          response.data.vicos.find((item) => item.id === storeMain.selectId) ===
          undefined
        ) {
          storeMain.selectId = -1
          storeMain.isSelect = false
        }
        storeMain.vicos = response.data.vicos
        storeMain.vicosSort()
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
</script>

<template>
  <div class="q-pa-md">
    <MainTable />
  </div>
  <MainVicoDialogView ref="mainVicoDialogView" />
  <MainVicoDialogAdd ref="mainVicoDialogAdd" />
  <MainVicoDialogEdit ref="mainVicoDialogEdit" />
  <MainVicoDialogArchive ref="mainVicoDialogArchive" />
  <MainVicoDialogDelete ref="mainVicoDialogDelete" />
  <q-page-sticky
    class="my-button-group"
    position="bottom-left"
    :offset="[18, 18]">
    <div v-show="role <= 0">
      <q-btn
        class="my-button"
        color="brown-5"
        @click="mainVicoDialogView.dialogOpen()">
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
    </div>
    <q-btn-group v-show="role > 0" push>
      <q-btn
        push
        class="my-button"
        color="brown-5"
        @click="mainVicoDialogView.dialogOpen()">
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
      <q-btn
        push
        class="my-button"
        color="green"
        @click="mainVicoDialogAdd.dialogOpen()">
        <i class="fa-solid fa-plus">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Создать
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        class="my-button"
        color="orange"
        @click="mainVicoDialogEdit.dialogOpen()">
        <i class="fa-solid fa-pen">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Редактировать
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
  <q-page-sticky
    class="my-button-group"
    position="bottom-right"
    :offset="[18, 18]">
    <div v-show="role <= 0">
      <q-btn push class="my-button" color="green" @click="updateTable">
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
    </div>
    <q-btn-group v-show="role > 0" push>
      <q-btn push class="my-button" color="green" @click="updateTable">
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
      <q-btn
        push
        class="my-button"
        color="blue"
        @click="mainVicoDialogArchive.dialogOpen()">
        <i class="fa-solid fa-box-archive">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Архивировать
          </q-tooltip>
        </i>
      </q-btn>
      <q-btn
        push
        class="my-button"
        color="red"
        @click="mainVicoDialogDelete.dialogOpen()">
        <i class="fa-solid fa-trash">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            class="text-body1"
            anchor="top middle"
            self="center middle">
            Удалить
          </q-tooltip>
        </i>
      </q-btn>
    </q-btn-group>
  </q-page-sticky>
</template>

<style lang="sass">
.my-button-group
  z-index: 999
  opacity: 0.78

.my-button-group:hover
  opacity: 1

.my-button
  color: black !important
  padding-left: 14px
  padding-right: 14px
  font-size: 22px
</style>
