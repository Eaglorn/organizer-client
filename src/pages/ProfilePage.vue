<template>
  <div class="q-pa-md">
    <div class="col-6">
      <q-select
        outlined
        v-model="objectInvited"
        multiple
        :options="optionObject"
        label="Подписка на обособленные подразделения"
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      />
    </div>
    <div class="col-6">
      <q-select
        outlined
        v-model="departamentInvited"
        multiple
        :options="optionDepartament"
        label="Приглашенные отделы"
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      />
    </div>
  </div>
</template>

<script>
import { api } from 'boot/axios';
import { DateTime } from 'boot/luxon';
import { useVuelidate, required, minLength } from 'boot/vuelidate';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../../../../stores/storeGlobal.js';
import { useUserStore } from '../../../../stores/storeUser.js';
import { useMainStore } from '../../../../stores/storeMain.js';

export default defineComponent({
  name: 'ProfilePage',
  setup() {
    const storeGlobal = useGlobalStore();
    const storeUser = useUserStore();
    const storeMain = useMainStore();

    const optionObject = computed(() => storeGlobal.optionObject);
    const optionDepartament = computed(() => storeGlobal.optionDepartament);
    return { optionObject, optionDepartament };
  },
});
</script>

<style lang="sass"></style>
