<template>
  <q-dialog v-model="dialog" position="top" persistent>
    <q-card style="min-width: 95vw; top: 10px" flat bordered>
      <q-card-section>
        <q-form ref="form" class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input
                v-model="vico.date"
                outlined
                mask="##.##.####"
                label="Дата"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.date.$invalid || 'Не корректно введена дата',
                ]"
              >
                <template #append>
                  <i class="fa-duotone fa-calendar-days cursor-pointer">
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
                  </i>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                v-model="vico.timeStart"
                outlined
                mask="time"
                label="Время начала ВКС"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.timeStart.$invalid ||
                    'Не корректно введено время',
                ]"
              >
                <template #append>
                  <i class="fa-duotone fa-alarm-clock cursor-pointer">
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
                  </i>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                v-model="vico.timeEnd"
                outlined
                mask="time"
                label="Время окончания ВКС"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.timeEnd.$invalid ||
                    'Не корректно введено время',
                ]"
              >
                <template #append>
                  <i class="fa-duotone fa-alarm-clock cursor-pointer">
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
                  </i>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-6">
              <q-select
                v-model="vico.objectInitiator"
                outlined
                :options="optionObject"
                label="Обособленное подразделение инцииатор ВКС"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.objectInitiator.$invalid ||
                    'Не выбрано подразделение инициатор',
                ]"
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="vico.objectInvited"
                outlined
                multiple
                :options="optionObject"
                label="Вызываемые обособленные подразделения"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.objectInvited.$invalid ||
                    'Не выбраны вызываемые обособленные подразделения',
                ]"
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-6">
              <q-select
                v-model="vico.departamentInitiator"
                outlined
                :options="optionDepartament"
                label="Отдел инициатор ВКС"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.departamentInitiator.$invalid ||
                    'Не выбран отдел инициатор',
                ]"
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="vico.departamentInvited"
                outlined
                multiple
                :options="optionDepartament"
                label="Приглашенные отделы"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.departamentInvited.$invalid ||
                    'Не выбраны приглашённые отделы',
                ]"
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-select
                v-model="vico.typeVico"
                outlined
                :options="optionTypeVico"
                label="Тип ВКС"
                lazy-rules
                :rules="[
                  () => !formValidate.typeVico.$invalid || 'Не выбран тип ВКС',
                ]"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="vico.topic"
                outlined
                label="Тема совещания"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.topic.$invalid ||
                    'Не заполнена тема совещания',
                ]"
              />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input
                v-model="vico.contactName"
                outlined
                label="ФИО инициатора ВКС"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.contactName.$invalid ||
                    'Не заполнено ФИО инициатора',
                ]"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="vico.contactPhone"
                outlined
                label="Контактный номер"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.contactPhone.$invalid ||
                    'Не заполнен контактный номер',
                ]"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Отмена"
          color="red-3"
          text-color="black"
          @click="dialogClose"
        />
        <q-btn
          label="Создать"
          color="positive"
          text-color="black"
          @click="dialogSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'boot/axios';
import { DateTime } from 'boot/luxon';
import { useVuelidate, required, minLength } from 'boot/vuelidate';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref, computed } from 'vue';
import { useGlobalStore } from '../../../../stores/storeGlobal.js';
import { useUserStore } from '../../../../stores/storeUser.js';

export default defineComponent({
  name: 'MainVicoDialogAdd',
  props: {},
  setup() {
    const storeGlobal = useGlobalStore();
    const storeUser = useUserStore();

    const dialog = ref(false);

    const optionObject = computed(() => storeGlobal.optionObject);
    const optionTypeVico = computed(() => storeGlobal.optionTypeVico);
    const optionDepartament = computed(() => storeGlobal.optionDepartament);

    const vico = ref();

    const dateValidate = (value) => {
      const date = DateTime.fromFormat(value, 'dd.LL.yyyy');
      if (date.invalid != null) {
        return false;
      }
      return true;
    };

    const timeValidate = (value) => {
      const date = DateTime.fromFormat(value, 'hh:mm');
      if (date.invalid != null) {
        return false;
      }
      return true;
    };

    const rules = computed(() => ({
      date: {
        required,
        min: minLength(ref(10)),
        dateValidate,
      },
      timeStart: { required, min: minLength(ref(5)), timeValidate },
      timeEnd: { required, min: minLength(ref(5)), timeValidate },
      objectInitiator: { required },
      objectInvited: { required },
      typeVico: { required },
      topic: { required },
      departamentInitiator: { required },
      departamentInvited: { required },
      contactName: { required },
      contactPhone: { required },
    }));

    const form = ref();

    const formValidate = useVuelidate(rules, vico);

    const dialogOpen = () => {
      Loading.show();
      const d = DateTime.now();
      vico.value = storeGlobal.getVicoTemplate();
      vico.value.date = d.toLocaleString();
      vico.value.timeStart = d.toLocaleString(DateTime.TIME_24_SIMPLE);
      vico.value.timeEnd = d.toLocaleString(DateTime.TIME_24_SIMPLE);
      dialog.value = true;
      Loading.hide();
    };

    const dialogSave = () => {
      Loading.show();
      if (formValidate.value.$invalid) {
        form.value.submit();
        Notify.create({
          progress: true,
          color: 'warning',
          position: 'top',
          message: 'Неправильно заполнены поля в форме',
          icon: 'warning',
          timeout: storeGlobal.messagesErrorTime.low,
          textColor: 'black',
        });
        Loading.hide();
      } else {
        const newVico = {
          dateTimeStart: storeGlobal.getSeconds(
            vico.value.date,
            vico.value.timeStart,
          ),
          dateTimeEnd: storeGlobal.getSeconds(
            vico.value.date,
            vico.value.timeEnd,
          ),
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
            // TODO: Изменить отправляемые параметры
            vico: newVico,
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
              if (response.data.collision) {
                var textMessage = '';
                for (const item of response.data.message) {
                  textMessage +=
                    '<br />' +
                    '<li>' +
                    item.object +
                    '&nbsp&nbsp&nbsp(<b>' +
                    storeGlobal.getTime(item.timeStart) +
                    '</b>--<b>' +
                    storeGlobal.getTime(item.timeEnd) +
                    '</b>)</li>';
                }
                Notify.create({
                  progress: true,
                  color: 'warning',
                  position: 'top',
                  message:
                    '<b>На данное время ВКС уже занято.</b>' +
                    '<ul>' +
                    textMessage +
                    '</ul>',
                  icon: 'warning',
                  html: true,
                  timeout: storeGlobal.messagesErrorTime.high,
                  textColor: 'black',
                });
                Loading.hide();
              } else {
                dialog.value = false;
                Loading.hide();
              }
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
              });
              Loading.hide();
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
            });
            Loading.hide();
          });
      }
    };

    const dialogClose = () => {
      dialog.value = false;
    };

    return {
      vico,
      dialog,
      form,
      formValidate,
      dialogOpen,
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
