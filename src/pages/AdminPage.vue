<template>
  <div class="q-pa-md items-start">
    <q-card>
      <q-form ref="form">
        <div class="row">
          <div class="col-1">
            <q-input
              v-model="login.loginFirst"
              filled
              mask="2700"
              fill-mask="#"
              readonly />
          </div>
          <div class="col-2">
            <q-input
              v-model="login.loginLast"
              filled
              label="Логин"
              mask="##-###"
              fill-mask="#"
              lazy-rules
              :rules="[
                () =>
                  !formValidate.loginLast.$invalid ||
                  'Не корректно введён логин',
              ]" />
          </div>
          <div class="col-1"></div>
          <div class="col-2">
            <q-select
              v-model="role"
              outlined
              :options="optionsRole"
              label="Роль" />
          </div>
          <div class="col-1"></div>
          <div class="col-5">
            <q-btn-group style="min-height: 75%; height: 75%; max-height: 75%">
              <q-btn
                push
                color="warning"
                class="my-button"
                @click="onClickButtonSelect">
                <i class="fa-solid fa-check fa-2x" />&nbsp;&nbsp;
                <b>Выбрать</b>
              </q-btn>
              <q-btn
                push
                color="primary"
                class="my-button"
                @click="onClickButtonCreate">
                <i class="fa-solid fa-plus fa-2x" />&nbsp;&nbsp;
                <b>Создать</b>
              </q-btn>
              <q-btn
                push
                color="positive"
                class="my-button"
                @click="onClickButtonSave">
                <i class="fa-solid fa-floppy-disk fa-2x" />&nbsp;&nbsp;
                <b>Сохранить</b>
              </q-btn>
              <q-btn
                push
                color="negative"
                class="my-button"
                @click="onClickButtonDelete">
                <i class="fa-solid fa-trash fa-2x" />&nbsp;&nbsp;
                <b>Удалить</b>
              </q-btn>
            </q-btn-group>
          </div>
        </div>
      </q-form>
    </q-card>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue'
import { useUserStore } from '../stores/storeUser.js'
import { useVuelidate, required, minLength } from 'boot/vuelidate'

export default defineComponent({
  name: 'AdminPage',
  setup() {
    const storeUser = useUserStore()

    const loginValidate = (value) => {
      const regex = /^\d{2}-\d{3}$/

      return regex.test(value)
    }

    const login = ref({
      loginFirst: '2700-',
      loginLast: '',
    })

    const rules = computed(() => ({
      loginLast: {
        required,
        min: minLength(ref(6)),
        loginValidate,
      },
    }))

    const form = ref()

    const formValidate = useVuelidate(rules, login)

    const role = ref(null)
    const optionsRole = ref(['Гость', 'Пользователь'])
    if (storeUser.role > 2) {
      optionsRole.value.push('Модератор')
    }
    if (storeUser.role > 3) {
      optionsRole.value.push('Администратор')
    }
    if (storeUser.role === 4) {
      optionsRole.value.push('Суперадминистратор')
    }

    const onClickButtonSelect = () => {
      console.log('admin')
      Loading.show()
      if (formValidate.value.$invalid) {
        form.value.submit()
        Notify.create({
          progress: true,
          color: 'warning',
          position: 'top',
          message: 'Неправильно заполнены поля в форме',
          icon: 'warning',
          timeout: storeGlobal.messagesErrorTime.low,
          textColor: 'black',
        })
        Loading.hide()
      } else {
        api({
          method: 'post',
          url: storeGlobal.getAjaxUri('admin/one'),
          data: {
            login: login.value.loginFirst + login.value.loginLast,
            user: {
              computer: storeUser.computer,
              login: storeUser.login,
            },
          },
          timeout: 10000,
          responseType: 'json',
        })
      }
    }
    const onClickButtonCreate = () => {}
    const onClickButtonSave = () => {
      Loading.show()
      if (formValidate.value.$invalid) {
        form.value.submit()
        Notify.create({
          progress: true,
          color: 'warning',
          position: 'top',
          message: 'Неправильно заполнены поля в форме',
          icon: 'warning',
          timeout: storeGlobal.messagesErrorTime.low,
          textColor: 'black',
        })
        Loading.hide()
      } else {
        api({
          method: 'post',
          url: storeGlobal.getAjaxUri('admin/add'),
          data: {
            login: login.value.loginFirst + login.value.loginLast,
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
              //
            } else {
              Notify.create({
                progress: true,
                color: 'warning',
                position: 'top',
                message: '<b>' + response.data.message + '</b>',
                icon: 'warning',
                textColor: 'black',
                html: true,
                timeout: storeGlobal.messagesErrorTime.medium,
              })
              Loading.hide()
            }
          })
          .catch(function () {
            Notify.create({
              color: 'negative',
              position: 'top',
              html: true,
              message: '<b>Нет соединения с сервером.</b>',
              icon: 'report_problem',
              timeout: storeGlobal.messagesErrorTime.low,
              textColor: 'black',
            })
            Loading.hide()
          })
      }
    }
    const onClickButtonDelete = () => {}

    return {
      form,
      formValidate,
      login,
      role,
      optionsRole,
      onClickButtonSelect,
      onClickButtonCreate,
      onClickButtonSave,
      onClickButtonDelete,
    }
  },
})
</script>

<style lang="sass">
.my-button
  color: black !important
</style>
