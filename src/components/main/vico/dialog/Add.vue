<template>
  <q-dialog
    v-model="dialog"
    class="my-dialog"
    position="top"
    persistent
    transition-show="none"
    transition-hide="none"
  >
    <q-card class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.date"
                mask="##.##.####"
                label="Дата"
                style="max-width: 200px"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="vico.date" mask="DD.MM.YYYY">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Закрыть"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.timeStart"
                mask="time"
                label="Дата начала ВКС"
                style="max-width: 200px"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="vico.timeStart">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Закрыть"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.timeEnd"
                mask="time"
                label="Дата окончания ВКС"
                style="max-width: 200px"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="vico.timeEnd">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Закрыть"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-5">
              <q-select
                outlined
                v-model="vico.objectInitiator"
                :options="optionObject"
                label="Обособленное подразделение инцииатор ВКС"
                style="max-width: 500px"
              />
            </div>
            <div class="col-5">
              <q-select
                outlined
                v-model="vico.objectInvited"
                multiple
                :options="optionObject"
                label="Вызываемые обособленные подразделения"
                style="
                  max-width: 500px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select
                outlined
                v-model="vico.typeVico"
                :options="optionTypeVico"
                label="Тип совещания"
                style="max-width: 250px"
              />
            </div>
            <div class="col-5">
              <q-input
                outlined
                v-model="vico.topic"
                label="Тема совещания"
                style="max-width: 380px"
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-5">
              <q-select
                outlined
                v-model="vico.departamentInitiator"
                :options="optionDepartament"
                label="Отдел инициатор ВКС"
                style="max-width: 500px"
              />
            </div>
            <div class="col-5">
              <q-select
                outlined
                v-model="vico.departamentInvited"
                multiple
                :options="optionDepartament"
                label="Приглашенные отделы"
                style="
                  max-width: 500px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input
                outlined
                v-model="vico.contactName"
                label="ФИО инициатора ВКС"
              />
            </div>
            <div class="col-4">
              <q-input
                outlined
                v-model="vico.contactPhone"
                label="Контактный номер телефона инициатора ВКС"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn label="Отмена" @click="dialogClose" text-color="black" />
        <q-btn
          label="Создать"
          color="positive"
          @click="dialogSave"
          text-color="black"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'boot/axios';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref, computed, watch } from 'vue';
import { DateTime } from 'boot/luxon';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../../../../stores/storeGlobal.js';
import { useMainStore } from '../../../../stores/storeMain.js';

export default defineComponent({
  name: 'MainVicoDialogAdd',
  props: {},
  setup() {
    const storeGlobal = useGlobalStore();
    const storeMain = useMainStore();

    const dialog = ref(false);

    const optionObject = computed(() => storeGlobal.optionObject);
    const optionTypeVico = computed(() => storeGlobal.optionTypeVico);
    const optionDepartament = computed(() => storeGlobal.optionDepartament);

    const vico = ref(storeGlobal.templateVico);

    const { vicoDialogAdd } = storeToRefs(storeMain);

    watch(vicoDialogAdd, () => {
      if (storeMain.vicoDialogAdd === true) {
        const d = DateTime.now();
        vico.value = storeGlobal.templateVico;
        vico.value.date = d.toLocaleString();
        vico.value.timeStart = d.toLocaleString(DateTime.TIME_24_SIMPLE);
        vico.value.timeEnd = d.toLocaleString(DateTime.TIME_24_SIMPLE);
        storeMain.vicoDialogAdd = false;
        dialog.value = true;
      }
    });

    const dialogSave = () => {
      Loading.show();
      const newVico = {
        date: vico.value.date,
        timeStart: vico.value.timeStart,
        timeEnd: vico.value.timeEnd,
        objectInitiator: vico.value.objectInitiator.label,
        objectInvited: [],
        typeVico: vico.value.typeVico.label,
        topic: vico.value.topic,
        departamentInitiator: vico.value.departamentInitiator.label,
        departamentInvited: [],
        contactName: vico.value.contactName,
        contactPhone: vico.value.contactPhone,
      };

      console.log(vico.value);

      vico.value.objectInvited.forEach((item) => {
        newVico.objectInvited.push(item.label);
      });

      vico.value.departamentInvited.forEach((item) => {
        newVico.departamentInvited.push(item.label);
      });

      api({
        method: 'post',
        url: storeGlobal.getAjaxUri('vico/add'),
        data: {
          vico: newVico,
        },
        timeout: 10000,
        responseType: 'json',
      })
        .then((response) => {
          if (response.data.success === false) {
            Notify.create({
              progress: true,
              color: 'negative',
              position: 'top',
              message: 'Ошибка создания ВКС.',
              icon: 'report_problem',
            });
          } else {
            dialog.value = false;
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
    };

    const dialogClose = () => {
      dialog.value = false;
    };

    return {
      vico,
      dialog,
      dialogSave,
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
