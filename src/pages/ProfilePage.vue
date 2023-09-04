<template>
  <div class="q-pa-md">
    <q-card style="min-width: 95vw; top: 10px" flat bordered>
      <q-card-section>
        <q-form ref="form" class="q-gutter-md">
          <div class="row justify-center">
            <div class="text-h4">
              Подписка на обособленные подразделения и отделы
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-5">
              <q-select
                v-model="objectInvited"
                outlined
                multiple
                :options="optionObject"
                label="Обособленные подразделения"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                class="my-select"
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="departamentInvited"
                outlined
                multiple
                :options="optionDepartament"
                label="Отделы"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                class="my-select"
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-5">
              <q-select
                v-model="objectInvited"
                outlined
                multiple
                use-chips
                stack-label
                :options="optionObject"
                readonly
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="departamentInvited"
                outlined
                multiple
                use-chips
                stack-label
                :options="optionObject"
                readonly
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { api } from 'boot/axios';
import { DateTime } from 'boot/luxon';
import { useVuelidate, required, minLength } from 'boot/vuelidate';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../stores/storeGlobal.js';
import { useUserStore } from '../stores/storeUser.js';
import { useMainStore } from '../stores/storeMain.js';

export default defineComponent({
  name: 'ProfilePage',
  setup() {
    const storeGlobal = useGlobalStore();
    const storeUser = useUserStore();
    const storeMain = useMainStore();

    const objectInvited = ref([]);
    const departamentInvited = ref([]);

    const optionObject = computed(() => storeGlobal.optionObject);
    const optionDepartament = computed(() => storeGlobal.optionDepartament);
    return {
      optionObject,
      optionDepartament,
      objectInvited,
      departamentInvited,
    };
  },
});
</script>

<style lang="sass">
.my-select
  span
    display: none
</style>
