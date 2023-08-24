<template>
  <div class="q-pa-md">
    <q-card>
      <q-form>
        <div class="row">
          <div class="col-1">
            <q-input
              filled
              v-model="loginFirst"
              mask="2700"
              fill-mask="#"
              readonly
            />
          </div>
          <div class="col-1">
            <q-input
              filled
              v-model="loginLast"
              label="Логин"
              mask="##-###"
              fill-mask="#"
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
          <div class="col-1">
            <q-btn-group
              push
              style="min-height: 100%; height: 100%; max-height: 100%"
            >
              <q-btn push color="warning" class="my-button">
                <i class="fa-solid fa-check fa-2x" />
                <b>Выбрать</b>
              </q-btn>
              <q-btn push color="primary" class="my-button">
                <i class="fa-solid fa-plus fa-2x" />
                <b>Создать</b>
              </q-btn>
              <q-btn push color="positive" class="my-button">
                <i class="fa-solid fa-floppy-disk fa-2x" />
                <b>Сохранить</b>
              </q-btn>
              <q-btn push color="negative" class="my-button">
                <i class="fa-solid fa-trash fa-2x" />
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
import { defineComponent, ref } from 'vue';
import { useUserStore } from '../stores/storeUser.js';

export default defineComponent({
  name: 'AdminPage',
  setup() {
    const storeUser = useUserStore();

    const loginFirst = ref('2700');
    const loginLast = ref(null);
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
    return { loginFirst, loginLast, role, optionsRole };
  },
});
</script>

<style lang="sass">
.my-button
  color: #C6C6C6 !important
</style>
