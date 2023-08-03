<template>
  <q-dialog v-model="dialog" position="top" persistent>
    <q-card style="min-width: 95vw; top: 10px" flat bordered>
      <q-card-section>
        <q-form class="q-gutter-md" ref="form">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input
                outlined
                v-model="vico.date"
                mask="##.##.####"
                label="Дата"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.date.$invalid || 'Не корректно введена дата',
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
                label="Дата начала ВКС"
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.timeStart.$invalid ||
                    'Не корректно введено время',
                ]"
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
                lazy-rules
                :rules="[
                  () =>
                    !formValidate.timeEnd.$invalid ||
                    'Не корректно введено время',
                ]"
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
                outlined
                v-model="vico.departamentInitiator"
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
                outlined
                v-model="vico.typeVico"
                :options="optionTypeVico"
                label="Тип совещания"
                lazy-rules
                :rules="[
                  () => !formValidate.typeVico.$invalid || 'Не выбран тип ВКС',
                ]"
              />
            </div>
            <div class="col-4">
              <q-input
                outlined
                v-model="vico.topic"
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
                outlined
                v-model="vico.contactName"
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
                outlined
                v-model="vico.contactPhone"
                label="Контактный номер телефона инициатора ВКС"
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
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          label="Отмена"
          color="red-3"
          @click="dialogClose"
          text-color="black"
        />
        <q-btn
          label="Сохранить"
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
import { DateTime } from 'boot/luxon';
import { useVuelidate, required, minLength } from 'boot/vuelidate';
import { defineComponent, ref, computed, watch } from 'vue';
import { Loading, Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../../../../stores/storeGlobal.js';
import { useMainStore } from '../../../../stores/storeMain.js';

export default defineComponent({
  name: 'MainVicoDialogEdit',
  props: {},
  setup() {
    const storeGlobal = useGlobalStore();
    const storeMain = useMainStore();

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

    const { vicoDialogEdit } = storeToRefs(storeMain);

    watch(vicoDialogEdit, () => {
      Loading.show();
      if (storeMain.vicoDialogEdit === true) {
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

                vico.value.typeVico = storeGlobal.getOptionTypeVicoByName(
                  response.data.vico.typeVico,
                );

                vico.value.objectInitiator = storeGlobal.getOptionObjectByName(
                  response.data.vico.objectInitiator,
                );

                vico.value.objectInvited.forEach((item, index) => {
                  vico.value.objectInvited.splice(
                    index,
                    1,
                    storeGlobal.getOptionObjectByName(item),
                  );
                });

                vico.value.departamentInitiator =
                  storeGlobal.getOptionDepartamentByName(
                    response.data.vico.departamentInitiator,
                  );

                vico.value.departamentInvited.forEach((item, index) => {
                  vico.value.departamentInvited.splice(
                    index,
                    1,
                    storeGlobal.getOptionDepartamentByName(item),
                  );
                });

                dialog.value = true;
                storeMain.vicoDialogEdit = false;
                Loading.hide();
              } else {
                Notify.create({
                  progress: true,
                  color: 'negative',
                  position: 'top',
                  message: response.data.message,
                  icon: 'report_problem',
                });
                Loading.hide();
              }
            })
            .catch(function (err) {
              Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Нет соединения с сервером.',
                icon: 'report_problem',
              });
              Loading.hide();
            });
        } else {
          Notify.create({
            color: 'warning',
            position: 'top',
            message: 'Отсутствует выделение записи ВКС',
            icon: 'warning',
            timeout: 5,
          });
          storeMain.vicoDialogEdit = false;
          Loading.hide();
        }
      } else {
        Loading.hide();
      }
    });

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
          timeout: 5,
        });
        Loading.hide();
      } else {
        const vicoEdit = {
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
          vicoEdit.objectInvited.push(item.label);
        });

        vico.value.departamentInvited.forEach((item) => {
          vicoEdit.departamentInvited.push(item.label);
        });

        api({
          method: 'post',
          url: storeGlobal.getAjaxUri('vico/edit'),
          data: {
            id: storeMain.selectId,
            vico: vicoEdit,
          },
          timeout: 10000,
          responseType: 'json',
        })
          .then((response) => {
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
                storeMain.vicoDialogEdit = false;
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
      dialog.value = false;
      storeMain.vicoDialogEdit = false;
    };

    return {
      vico,
      dialog,
      form,
      formValidate,
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
