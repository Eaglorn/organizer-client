<template>
  <q-dialog v-model="dialog" position="top" persistent>
    <q-card style="min-width: 95vw; top: 10px" flat bordered>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.stop="dialogSave">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.date"
                mask="##.##.####"
                label="Дата"
                :rules="[
                  (val) => formAdd.date.required || 'Не корректно введена дата',
                ]"
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
                label="Время начала ВКС"
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
                label="Время окончания ВКС"
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
            <div class="col-6">
              <q-select
                outlined
                v-model="vico.objectInitiator"
                :options="optionObject"
                label="Обособленное подразделение инцииатор ВКС"
              />
            </div>
            <div class="col-6">
              <q-select
                outlined
                v-model="vico.objectInvited"
                multiple
                :options="optionObject"
                label="Вызываемые обособленные подразделения"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
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
              />
            </div>
            <div class="col-6">
              <q-select
                outlined
                v-model="vico.departamentInvited"
                multiple
                :options="optionDepartament"
                label="Приглашенные отделы"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-select
                outlined
                v-model="vico.typeVico"
                :options="optionTypeVico"
                label="Тип ВКС"
              />
            </div>
            <div class="col-4">
              <q-input outlined v-model="vico.topic" label="Тема совещания" />
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
                label="Контактный номер"
              />
            </div>
          </div>
          <q-card-actions align="right">
            <q-btn
              label="Отмена"
              color="red-3"
              @click="dialogClose"
              text-color="black"
            />
            <q-btn
              label="Создать"
              color="positive"
              type="submit"
              text-color="black"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'boot/axios';
import { DateTime } from 'boot/luxon';
import { useVuelidate, required, minLength } from 'boot/vuelidate';

import { Loading, Notify } from 'quasar';
import { defineComponent, ref, computed, watch } from 'vue';
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

    const vico = ref();

    const rulesAdd = {
      date: { required, min: minLength(9) },
      timeEnd: { required },
      objectInitiator: { required },
      objectInvited: { required },
      typeVico: { required },
      topic: { required },
      departamentInitiator: { required },
      departamentInvited: { required },
      contactName: { required },
      contactPhone: { required },
    };

    const formAdd = useVuelidate(rulesAdd, vico);

    const vicoDateOptionFn = (date) => {
      return date <= DateTime.now().toLocaleString();
    };

    const { vicoDialogAdd } = storeToRefs(storeMain);

    watch(vicoDialogAdd, () => {
      if (storeMain.vicoDialogAdd === true) {
        Loading.show();
        const d = DateTime.now();
        vico.value = storeGlobal.getVicoTemplate();
        vico.value.date = d.toLocaleString();
        vico.value.timeStart = d.toLocaleString(DateTime.TIME_24_SIMPLE);
        vico.value.timeEnd = d.toLocaleString(DateTime.TIME_24_SIMPLE);
        dialog.value = true;
        Loading.hide();
      }
    });

    const dialogSave = () => {
      console.log(formAdd.value);
      if (formAdd.value.$anyError) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'warning',
          message: 'Form not valid',
        });
      } else {
        Loading.show();
        const newVico = {
          date: vico.value.date,
          timeStart: vico.value.timeStart,
          timeEnd: vico.value.timeEnd,
          objectInitiator: vico.value.objectInitiator?.label ?? '',
          objectInvited: [],
          typeVico: vico.value.typeVico?.label ?? '',
          topic: vico.value.topic,
          departamentInitiator: vico.value.departamentInitiator?.label ?? '',
          departamentInvited: [],
          contactName: vico.value.contactName,
          contactPhone: vico.value.contactPhone,
        };

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
            console.log(response);
            if (response.data.success) {
              if (response.data.collision) {
                var textMessage = '';
                for (const item of response.data.message) {
                  textMessage += '<br />' + item;
                }
                Notify.create({
                  progress: true,
                  color: 'warning',
                  position: 'top',
                  message: 'На данное время ВКС уже занято.' + textMessage,
                  icon: 'warning',
                  html: true,
                });
                Loading.hide();
              } else {
                dialog.value = false;
                storeMain.vicoDialogAdd = false;
                Loading.hide();
              }
            } else {
              Notify.create({
                progress: true,
                color: 'warning',
                position: 'top',
                message: response.data.message,
                icon: 'warning',
              });
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
            Loading.hide();
          });
      }
    };

    const dialogClose = () => {
      storeMain.vicoDialogAdd = false;
      dialog.value = false;
    };

    return {
      vico,
      vicoDateOptionFn,
      dialog,
      formAdd,
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
.q-item--active
  color: $green-6
  font-weight: 600
.q-field__label
  color: $red-4
</style>
