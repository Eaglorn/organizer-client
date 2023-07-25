<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 95vw" flat bordered>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.date"
                mask="##.##.####"
                label="Дата"
                readonly
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.timeStart"
                mask="time"
                label="Дата начала ВКС"
                readonly
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.timeEnd"
                mask="time"
                label="Дата окончания ВКС"
                readonly
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-6">
              <q-select
                outlined
                v-model="vico.objectInitiator"
                :options="optionObject"
                label="Обособленное подразделение инцииатор ВКС"
                readonly
              />
            </div>
            <div class="col-6">
              <q-select
                outlined
                v-model="vico.objectInvited"
                multiple
                use-chips
                stack-label
                :options="optionObject"
                label="Вызываемые обособленные подразделения"
                readonly
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-6">
              <q-select
                outlined
                v-model="vico.departamentInitiator"
                :options="optionDepartament"
                label="Отдел инициатор ВКС"
                readonly
              />
            </div>
            <div class="col-6">
              <q-select
                outlined
                v-model="vico.departamentInvited"
                multiple
                use-chips
                stack-label
                :options="optionDepartament"
                label="Приглашенные отделы"
                readonly
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-select
                outlined
                v-model="vico.typeVico"
                :options="optionTypeVico"
                label="Тип совещания"
                readonly
              />
            </div>
            <div class="col-4">
              <q-input
                outlined
                v-model="vico.topic"
                label="Тема совещания"
                readonly
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input
                outlined
                v-model="vico.contactName"
                label="ФИО инициатора ВКС"
                readonly
              />
            </div>
            <div class="col-4">
              <q-input
                outlined
                v-model="vico.contactPhone"
                label="Контактный номер телефона инициатора ВКС"
                readonly
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          label="Закрыть"
          color="blue-2"
          @click="dialogClose"
          text-color="black"
        />
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

    const vico = ref();

    const { vicoDialogView } = storeToRefs(storeMain);

    watch(vicoDialogView, () => {
      Loading.show();
      if (storeMain.vicoDialogView === true) {
        if (storeMain.isSelect) {
          api({
            method: 'post',
            url: storeGlobal.getAjaxUri('vico/one'),
            data: { id: storeMain.selectId },
            timeout: 10000,
            responseType: 'json',
          })
            .then((response) => {
              if (response.data.success) {
                vico.value = response.data.vico;
                dialog.value = true;
                storeMain.vicoDialogView = false;
                Loading.hide();
              } else {
                Notify.create({
                  progress: true,
                  color: 'negative',
                  position: 'top',
                  message: response.data.message,
                  icon: 'report_problem',
                });
                storeMain.vicoDialogView = false;
                Loading.hide();
              }
            })
            .catch(function () {
              Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Нет соединения с сервером.',
                icon: 'report_problem',
              });
              storeMain.vicoDialogView = false;
              Loading.hide();
            });
        } else {
          Notify.create({
            color: 'warning',
            position: 'top',
            message: 'Отсутствует выделение записи ВКС',
            icon: 'warning',
          });
          storeMain.vicoDialogView = false;
          Loading.hide();
        }
      } else {
        Loading.hide();
      }
    });

    const dialogClose = () => {
      dialog.value = false;
      storeMain.vicoDialogView = false;
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
.q-item--active
  color: $green-6
  font-weight: 600
.q-field__label
  color: $red-4
</style>
