<template>
  <q-dialog v-model="dialog" class="my-dialog" transition-show="none" transition-hide="none">
    <q-card class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input outlined v-model="vico.date" mask="##.##.####" label="Дата" style="max-width: 200px" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vico.timeStart" mask="time" label="Дата начала ВКС" style="max-width: 200px"
                readonly>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vico.timeEnd" mask="time" label="Дата окончания ВКС" style="max-width: 200px"
                readonly>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vico.objectInitiator" :options="optionObject"
                label="Обособленное подразделение инцииатор ВКС" style="max-width: 500px" readonly />
            </div>
            <div class="col-7">
              <q-select outlined v-model="vico.objectInvited" multiple use-chips stack-label :options="optionObject"
                label="Вызываемые обособленные подразделения" style="max-width: 750px" readonly />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vico.typeVico" :options="optionTypeVico" label="Тип совещания"
                style="max-width: 250px" readonly />
            </div>
            <div class="col-5">
              <q-input outlined v-model="vico.topic" label="Тема совещания" style="max-width: 380px" readonly />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vico.departamentInitiator" :options="optionDepartament"
                label="Отдел инициатор ВКС" style="max-width: 500px" readonly />
            </div>
            <div class="col-7">
              <q-select outlined v-model="vico.departamentInvited" multiple use-chips stack-label
                :options="optionDepartament" label="Приглашенные отделы" style="max-width: 750px" readonly />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input outlined v-model="vico.contactName" label="ФИО инициатора ВКС" readonly />
            </div>
            <div class="col-4">
              <q-input outlined v-model="vico.contactPhone" label="Контактный номер телефона инициатора ВКС" readonly />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn label="Закрыть" @click="dialogClose" text-color="black" />
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
  name: 'MainDialogView',
  props: {},
  setup() {
    const storeGlobal = useGlobalStore();
    const storeMain = useMainStore();

    const dialog = ref(false);

    const optionObject = computed(() => storeGlobal.optionObject);
    const optionTypeVico = computed(() => storeGlobal.optionTypeVico);
    const optionDepartament = computed(() => storeGlobal.optionDepartament);

    const vico = ref(storeGlobal.templateVico);

    const { vicoDialogView } = storeToRefs(storeMain);

    watch(vicoDialogView, () => {
      if (storeMain.vicoDialogView === true) {
        if (storeMain.isSelect) {
          Loading.show();
          api({
            method: 'post',
            url: storeGlobal.getAjaxUri('vico/one'),
            data: { id: storeMain.selectId },
            timeout: 10000,
            responseType: 'json',
          })
            .then((response) => {
              if (response.data.success === false) {
                Notify.create({
                  progress: true,
                  color: 'negative',
                  position: 'top',
                  message: 'Ошибка обновления списка',
                  icon: 'report_problem',
                });
              } else {
                console.log(vico);
                vico.value = response.data.vico;
                storeMain.vicoDialogView = false;
                dialog.value = true;
              }
              Loading.hide();
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
        }
      }
    });

    const dialogClose = () => {
      dialog.value = false;
    };

    return {
      vico,
      dialog,
      dialogClose,
      optionObject,
      optionTypeVico,
      optionDepartament,
    };
  },
});
</script>
<style lang="sass">
.my-dialog
  width: 900px
.my-card
  min-width: 1400px
.modal, .modal-content
  transition: all 0.02s linear
</style>
