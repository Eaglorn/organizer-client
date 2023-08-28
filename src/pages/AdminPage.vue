<template>
  <div class="q-pa-md items-start">
    <q-card>
      <q-form ref="form">
        <div class="row">
          <div class="col-1">
            <q-input
              filled
              v-model="login.loginFirst"
              mask="2700"
              fill-mask="#"
              readonly
            />
          </div>
          <div class="col-2">
            <q-input
              filled
              v-model="login.loginLast"
              label="Логин"
              mask="##-###"
              fill-mask="#"
              lazy-rules
              :rules="[
                () =>
                  !formValidate.loginLast.$invalid ||
                  'Не корректно введён логин',
              ]"
            />
          </div>
          <div class="col-1"></div>
          <div class="col-2">
            <q-select
              outlined
              v-model="role"
              :options="optionsRole"
              label="Роль"
            />
          </div>
          <div class="col-1"></div>
          <div class="col-5">
            <q-btn-group style="min-height: 75%; height: 75%; max-height: 75%">
              <q-btn
                push
                color="warning"
                class="my-button"
                on-click="onClickButtonSelect"
              >
                <i class="fa-solid fa-check fa-2x" />&nbsp;&nbsp;
                <b>Выбрать</b>
              </q-btn>
              <q-btn
                push
                color="primary"
                class="my-button"
                on-click="onClickButtonCreate"
              >
                <i class="fa-solid fa-plus fa-2x" />&nbsp;&nbsp;
                <b>Создать</b>
              </q-btn>
              <q-btn
                push
                color="positive"
                class="my-button"
                on-click="onClickButtonSave"
              >
                <i class="fa-solid fa-floppy-disk fa-2x" />&nbsp;&nbsp;
                <b>Сохранить</b>
              </q-btn>
              <q-btn
                push
                color="negative"
                class="my-button"
                on-click="onClickButtonDelete"
              >
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
import { defineComponent, ref, computed } from 'vue';
import { useUserStore } from '../stores/storeUser.js';
import { useVuelidate, required, minLength } from 'boot/vuelidate';

export default defineComponent({
  name: 'AdminPage',
  setup() {
    const storeUser = useUserStore();

    const loginValidate = (value) => {
      const regex = /^\d{2}-\d{3}$/;

      if (regex.test(value)) {
        return true;
      } else {
        return false;
      }
    };

    const login = ref({
      loginFirst: '2700-',
      loginLast: '',
    });

    const rules = computed(() => ({
      loginLast: {
        required,
        min: minLength(ref(6)),
        loginValidate,
      },
    }));

    const form = ref();

    const formValidate = useVuelidate(rules, login);

    const role = ref(null);
    const optionsRole = ref(['Гость', 'Пользователь']);
    if (storeUser.role > 2) {
      optionsRole.value.push('Модератор');
    }
    if (storeUser.role > 3) {
      optionsRole.value.push('Администратор');
    }
    if (storeUser.role === 4) {
      optionsRole.value.push('Суперадминистратор');
    }

    const onClickButtonSelect = () => {};
    const onClickButtonCreate = () => {};
    const onClickButtonSave = () => {};
    const onClickButtonDelete = () => {};

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
    };
  },
});
</script>

<style lang="sass">
.my-button
  color: black !important
</style>
