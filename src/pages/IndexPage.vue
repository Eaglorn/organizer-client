<template>
  <div class="q-pa-md">
    <q-table selection="single" v-model:selected="selected" class="my-sticky-table no-select my-table-border" flat
      bordered row-key="id" :rows="rows" :hide-pagination="true" v-model:pagination="pagination" :columns="columns"
      :separator="separator" table-header-style="height: 0px;">
      <template v-slot:header-cell="props">
        <q-th :props="props" style="font-size: medium">
          {{ props.col.label }}
        </q-th>
      </template>
      <template v-slot:body="props">
        <q-tr class="my-table-border" :props="props" @click="
          props.selected = !props.selected;
        selectAction(props.row.id);
        ">
          <q-td class="my-table-border">
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="id" :props="props" class="my-table-border">
            {{ props.row.id }}
          </q-td>
          <q-td key="date" :props="props" class="my-table-border">
            {{ props.row.date }}
          </q-td>
          <q-td key="timeStart" :props="props" class="my-table-border">
            {{ props.row.timeStart }}
          </q-td>
          <q-td key="timeEnd" :props="props" class="my-table-border">
            {{ props.row.timeEnd }}
          </q-td>
          <q-td key="objectInitiator" :props="props" class="my-table-border">
            {{ props.row.objectInitiator }}
          </q-td>
          <q-td key="objectInvited" :props="props" class="my-table-border">
            <li v-for="item in props.row.objectInvited" v-bind:key="item">
              {{ item }}
            </li>
          </q-td>
          <q-td key="typeVico" :props="props" class="my-table-border">
            {{ props.row.typeVico }}
          </q-td>
          <q-td key="topic" :props="props" class="my-table-border">
            {{ props.row.topic }}
          </q-td>
          <q-td key="departamentInitiator" :props="props" class="my-table-border">
            {{ props.row.departamentInitiator }}
          </q-td>
          <q-td key="departamentInvited" :props="props" class="my-table-border">
            <li v-for="item in props.row.departamentInvited" v-bind:key="item">
              {{ item }}
            </li>
          </q-td>
          <q-td key="contactName" :props="props" class="my-table-border">
            {{ props.row.contactName }}
          </q-td>
          <q-td key="contactPhone" :props="props" class="my-table-border">
            {{ props.row.contactPhone }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="dialogVicoView" class="my-dialog">
    <q-card class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialogVicoView" />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input outlined v-model="vicoView.date" mask="##.##.####" label="Дата" style="max-width: 200px" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vicoView.timeStart" mask="time" label="Дата начала ВКС" style="max-width: 200px"
                readonly>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vicoView.timeEnd" mask="time" label="Дата окончания ВКС" style="max-width: 200px"
                readonly>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vicoView.objectInitiator" :options="optionsObject"
                label="Обособленное подразделение инцииатор ВКС" style="max-width: 500px" readonly />
            </div>
            <div class="col-7">
              <q-select outlined v-model="vicoView.objectInvited" multiple use-chips stack-label :options="optionsObject"
                label="Вызываемые обособленные подразделения" style="max-width: 750px" readonly />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vicoView.typeVico" :options="optionsTypeVico" label="Тип совещания"
                style="max-width: 250px" readonly />
            </div>
            <div class="col-5">
              <q-input outlined v-model="vicoView.topic" label="Тема совещания" style="max-width: 380px" readonly />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vicoView.departamentInitiator" :options="optionsDepartament"
                label="Отдел инициатор ВКС" style="max-width: 500px" readonly />
            </div>
            <div class="col-7">
              <q-select outlined v-model="vicoView.departamentInvited" multiple use-chips stack-label
                :options="optionsDepartament" label="Приглашенные отделы" style="max-width: 750px" readonly />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input outlined v-model="vicoView.contactName" label="ФИО инициатора ВКС" readonly />
            </div>
            <div class="col-4">
              <q-input outlined v-model="vicoView.contactPhone" label="Контактный номер телефона инициатора ВКС"
                readonly />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dialogVicoAdd" class="my-dialog" position="top" persistent>
    <q-card class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialogVicoAdd" />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input outlined v-model="vicoAdd.date" mask="##.##.####" label="Дата" style="max-width: 200px">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="vicoAdd.date" mask="DD.MM.YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vicoAdd.timeStart" mask="time" label="Дата начала ВКС" style="max-width: 200px">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="vicoAdd.timeStart">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vicoAdd.timeEnd" mask="time" label="Дата окончания ВКС" style="max-width: 200px">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="vicoAdd.timeEnd">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
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
              <q-select outlined v-model="vicoAdd.objectInitiator" :options="optionsObject"
                label="Обособленное подразделение инцииатор ВКС" style="max-width: 500px" />
            </div>
            <div class="col-5">
              <q-select outlined v-model="vicoAdd.objectInvited" multiple :options="optionsObject"
                label="Вызываемые обособленные подразделения" style="
                  max-width: 500px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                " />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vicoAdd.typeVico" :options="optionsTypeVico" label="Тип совещания"
                style="max-width: 250px" />
            </div>
            <div class="col-5">
              <q-input outlined v-model="vicoAdd.topic" label="Тема совещания" style="max-width: 380px" />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-5">
              <q-select outlined v-model="vicoAdd.departamentInitiator" :options="optionsDepartament"
                label="Отдел инициатор ВКС" style="max-width: 500px" />
            </div>
            <div class="col-5">
              <q-select outlined v-model="vicoAdd.departamentInvited" multiple :options="optionsDepartament"
                label="Приглашенные отделы" style="
                  max-width: 500px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                " />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input outlined v-model="vicoAdd.contactName" label="ФИО инициатора ВКС" />
            </div>
            <div class="col-4">
              <q-input outlined v-model="vicoAdd.contactPhone" label="Контактный номер телефона инициатора ВКС" />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Создать" @click="saveDialogVicoAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dialogVicoEdit" class="my-dialog" position="top" persistent>
    <q-card class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialogVicoEdit" />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row justify-evenly">
            <div class="col-3">
              <q-input outlined v-model="vicoEdit.date" mask="##.##.####" label="Дата" style="max-width: 200px">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="vicoEdit.date" mask="DD.MM.YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vicoEdit.timeStart" mask="time" label="Дата начала ВКС" style="max-width: 200px">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="vicoEdit.timeStart">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3">
              <q-input outlined v-model="vicoEdit.timeEnd" mask="time" label="Дата окончания ВКС"
                style="max-width: 200px">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="vicoEdit.timeEnd">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
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
              <q-select outlined v-model="vicoEdit.objectInitiator" :options="optionsObject"
                label="Обособленное подразделение инцииатор ВКС" style="max-width: 500px" />
            </div>
            <div class="col-5">
              <q-select outlined v-model="vicoEdit.objectInvited" multiple :options="optionsObject"
                label="Вызываемые обособленные подразделения" style="
                  max-width: 500px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                " />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-3">
              <q-select outlined v-model="vicoEdit.typeVico" :options="optionsTypeVico" label="Тип совещания"
                style="max-width: 250px" />
            </div>
            <div class="col-5">
              <q-input outlined v-model="vicoEdit.topic" label="Тема совещания" style="max-width: 380px" />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-5">
              <q-select outlined v-model="vicoEdit.departamentInitiator" :options="optionsDepartament"
                label="Отдел инициатор ВКС" style="max-width: 500px" />
            </div>
            <div class="col-5">
              <q-select outlined v-model="vicoEdit.departamentInvited" multiple :options="optionsDepartament"
                label="Приглашенные отделы" style="
                  max-width: 500px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                " />
            </div>
          </div>
          <div class="row justify-evenly">
            <div class="col-4">
              <q-input outlined v-model="vicoEdit.contactName" label="ФИО инициатора ВКС" />
            </div>
            <div class="col-4">
              <q-input outlined v-model="vicoEdit.contactPhone" label="Контактный номер телефона инициатора ВКС" />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Создать" @click="saveDialogVicoEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-page-sticky class="my-button" position="bottom-left" :offset="[18, 18]">
    <q-btn-group push class="my-button">
      <q-btn push color="brown-5" icon="visibility" padding="8px" size="24px" @click="openDialogVicoView" />
      <q-btn push color="green" icon="add" padding="8px" size="24px" @click="openDialogVicoAdd" />
      <q-btn push color="orange" icon="edit" padding="8px" size="24px" @click="openDialogVicoEdit" />
    </q-btn-group>
  </q-page-sticky>
  <q-page-sticky class="my-button" position="bottom-right" :offset="[18, 18]">
    <q-btn-group push class="my-button">
      <q-btn push color="green" icon="autorenew" padding="8px" size="24px" />
      <q-btn push color="blue" icon="archive" padding="8px" size="24px" />
      <q-btn push color="red" icon="delete" padding="8px" size="24px" />
    </q-btn-group>
  </q-page-sticky>
</template>

<script>
import { api } from 'boot/axios';
import { Loading, Notify } from 'quasar';
import { defineComponent, ref, computed } from 'vue';
import { DateTime } from 'boot/luxon';
import { io } from 'boot/socket';
import { useVicoStore } from 'stores/vico-store.js';

const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: (row) => row.id,
    format: (val) => `${val}`,
    style: 'display: none; font-size: 12px;',
  },
  {
    name: 'date',
    align: 'center',
    label: 'Дата',
    field: 'date',
  },
  {
    name: 'timeStart',
    align: 'center',
    label: 'Время начала ВКС',
    field: 'timeStart',
  },
  {
    name: 'timeEnd',
    align: 'center',
    label: 'Время окончания ВКС',
    field: 'timeEnd',
  },
  {
    name: 'objectInitiator',
    align: 'center',
    label: 'Обособленное подразделение инцииатор ВКС',
    field: 'objectInitiator',
  },
  {
    name: 'objectInvited',
    align: 'center',
    label: 'Вызываемые обособленные подразделения',
    field: 'objectInvited',
  },
  {
    name: 'typeVico',
    align: 'center',
    label: 'Тип совещания',
    field: 'typeVico',
  },
  {
    name: 'topic',
    align: 'center',
    label: 'Тема совещания',
    field: 'topic',
  },
  {
    name: 'departamentInitiator',
    align: 'center',
    label: 'Отдел инициатор ВКС',
    field: 'departamentInitiator',
  },
  {
    name: 'departamentInvited',
    align: 'center',
    label: 'Приглашенные отделы',
    field: 'departamentInvited',
  },
  {
    name: 'contactName',
    align: 'center',
    label: 'ФИО инициатора ВКС',
    field: 'contactName',
  },
  {
    name: 'contactPhone',
    align: 'center',
    label: 'Контактный номер телефона инициатора ВКС',
    field: 'contactPhone',
  },
];

const optionsObject = [
  {
    label: 'УФНС России по Хабаровскому краю, Дзержинского 41',
    value: 1,
  },
  {
    label: 'ЦА ФНС России',
    value: 2,
  },
  {
    label: 'ОП №1 УФНС России по Хабаровскому краю, ул.Ленина д.57',
    value: 3,
  },
  {
    label: 'ОП №2 УФНС России по Хабаровскому краю, Станционная д.18',
    value: 4,
  },
  {
    label: 'ОП №3 УФНС России по Хабаровскому краю, ул. Союзная 23д',
    value: 5,
  },
  {
    label: 'ОП №4 УФНС России по Хабаровскому краю, О.Кошевого 3',
    value: 6,
  },
  {
    label: 'ОП №5 УФНС России по Хабаровскому краю, Шмидта 40',
    value: 7,
  },
  {
    label: 'ОП №6 УФНС России по Хабаровскому краю, Островского 8а',
    value: 8,
  },
  {
    label:
      'ОП №7 УФНС России по Хабаровскому краю, г. Комсомольск-на-Амуре, ул. Кирова, д. 68',
    value: 9,
  },
  {
    label:
      'ОП №8 УФНС России по Хабаровскому краю, г. Комсомольск-на-Амуре, ул. Пионерская 64',
    value: 10,
  },
  {
    label:
      'ОП №9 УФНС России по Хабаровскому краю, г. Советская Гавань, пл. Победы, д. 7',
    value: 11,
  },
  {
    label:
      'ОП №10 УФНС России по Хабаровскому краю,  г. Николаевск-на-Амуре, ул. Орлова, 15',
    value: 12,
  },
  {
    label: 'Все обособленные подразделения',
    value: 13,
  },
  {
    label: 'Налогоплательщик',
    value: 14,
  },
  {
    label: 'Администрация',
    value: 15,
  },
];

const optionsTypeVico = [
  {
    label: 'ВКС',
    value: 1,
  },
  {
    label: 'Допрос',
    value: 2,
  },
  {
    label: 'Федеральный ВКС',
    value: 3,
  },
  {
    label: 'Совещание',
    value: 4,
  },
];

const optionsDepartament = [
  {
    label: 'Налогоплательщик',
    value: 1,
  },
  {
    label: 'Руководство',
    value: 2,
  },
  {
    label: 'ЦА ФНС России',
    value: 3,
  },
  {
    label: '01 - Общий отдел',
    value: 4,
  },
  {
    label: '02 - Отдел кадров',
    value: 5,
  },
  {
    label: '03 - Отдел безопасности',
    value: 6,
  },
  {
    label: '04 - Отдел финансового и хозяйственного обеспечения',
    value: 7,
  },
  {
    label:
      '06 - Отдел контроля выполнения технологических процессов и информационных технологий',
    value: 8,
  },
  {
    label: '05 - Отдел информационной безопасности',
    value: 9,
  },
  {
    label: '07 - Отдел внутреннего аудита',
    value: 10,
  },
  {
    label: '08 - Отдел оказания государственных услуг №1',
    value: 11,
  },
  {
    label: '09 - Отдел оказания государственных услуг №2',
    value: 12,
  },
  {
    label: '10 - Отдел регистрации и учета налогоплательщиков №1',
    value: 13,
  },
  {
    label: '11 - Отдел регистрации и учета налогоплательщиков №2',
    value: 14,
  },
  {
    label: '12 - Отдел регистрации и учета налогоплательщиков №3',
    value: 15,
  },
  {
    label: '13 - Отдел камерального контроля специальных налоговых режимов',
    value: 16,
  },
  {
    label:
      '14 - Отдел камерального контроля в сфере налогообложения имущества №1',
    value: 17,
  },
  {
    label:
      '15 - Отдел камерального контроля в сфере налогообложения имущества №2',
    value: 18,
  },
  {
    label: '16 - Отдел камерального контроля НДФЛ и СВ №1',
    value: 19,
  },
  {
    label: '17 - Отдел камерального контроля НДФЛ и СВ №2',
    value: 20,
  },
  {
    label: '18 - Отдел камерального контроля НДФЛ и СВ №3',
    value: 21,
  },
  {
    label: '19 - Отдел камерального контроля НДФЛ и СВ №4',
    value: 22,
  },
  {
    label: '20 - Отдел камерального контроля №1',
    value: 23,
  },
  {
    label: '21 - Отдел камерального контроля №2',
    value: 24,
  },
  {
    label: '22 - Отдел камерального контроля НДС №1',
    value: 25,
  },
  {
    label: '23 - Отдел камерального контроля НДС №2',
    value: 26,
  },
  {
    label: '24 - Отдел камерального контроля НДС №3',
    value: 27,
  },
  {
    label: '25 - Отдел камерального контроля НДС №4',
    value: 28,
  },
  {
    label: '26 - Контрольно-аналитический отдел',
    value: 29,
  },
  {
    label: '27 - Отдел предпроверочного анализа и план. налоговых проверок №1',
    value: 30,
  },
  {
    label: '28 - Отдел предпроверочного анализа и план. налоговых проверок №2',
    value: 31,
  },
  {
    label: '29 - Отдел предпроверочного анализа и план. налоговых проверок №3',
    value: 32,
  },
  {
    label: '30 - Отдел предпроверочного анализа и план. налоговых проверок №4',
    value: 33,
  },
  {
    label: '31 - Отдел выездных налоговых проверок №1',
    value: 34,
  },
  {
    label: '32 - Отдел выездных налоговых проверок №2',
    value: 35,
  },
  {
    label: '33 - Отдел выездных налоговых проверок №3',
    value: 36,
  },
  {
    label: '34 - Отдел выездных налоговых проверок №4',
    value: 37,
  },
  {
    label: '35 - Отдел выездных налоговых проверок №5',
    value: 38,
  },
  {
    label: '36 - Отдел оперативного контроля №1',
    value: 39,
  },
  {
    label: '37 - Отдел оперативного контроля №2',
    value: 40,
  },
  {
    label: '38 - Аналитический отдел',
    value: 41,
  },
  {
    label: '39 - Отдел урегулирования состояния расчетов с бюджетом',
    value: 42,
  },
  {
    label: '40 - Отдел процессного взыскания задолженности',
    value: 43,
  },
  {
    label: '41 - Отдел проектного управления долгом',
    value: 44,
  },
  {
    label: '42 - Отдел урегулирования задолженности физических лиц',
    value: 45,
  },
  {
    label: '43 - Отдел обеспечения процедур банкротства №1',
    value: 46,
  },
  {
    label: '44 - Отдел обеспечения процедур банкротства №2',
    value: 47,
  },
  {
    label: '45 - Правовой отдел №1',
    value: 48,
  },
  {
    label: '46 - Правовой отдел №2',
    value: 49,
  },
  {
    label: '47 - Правовой отдел №3',
    value: 50,
  },
  {
    label: '48 - Правовой отдел №4',
    value: 51,
  },
];

const getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    const store = useVicoStore();

    store.setServer('http://127.0.0.1:3000/');

    const socket = io(store.getServer());

    const rows = computed(() => store.vicos);

    const selected = ref([]);
    const selectedId = ref({
      id: 0,
      isSelect: false,
    });
    const vicoAdd = ref({
      date: '',
      timeStart: '',
      timeEnd: '',
      objectInitiator: [],
      objectInvited: [],
      Vico: '',
      topic: '',
      departamentInitiator: [],
      departamentInvited: [],
      contactName: '',
      contactPhone: '',
    });
    const vicoView = ref({
      date: '',
      timeStart: '',
      timeEnd: '',
      objectInitiator: [],
      objectInvited: [],
      typeVico: '',
      topic: '',
      departamentInitiator: [],
      departamentInvited: [],
      contactName: '',
      contactPhone: '',
    });
    const vicoEdit = ref({
      date: '',
      timeStart: '',
      timeEnd: '',
      objectInitiator: [],
      objectInvited: [],
      typeVico: '',
      topic: '',
      departamentInitiator: [],
      departamentInvited: [],
      contactName: '',
      contactPhone: '',
    });

    const dialogVicoView = ref(false);
    const dialogVicoAdd = ref(false);
    const dialogVicoEdit = ref(false);

    socket.on('vicoAdd', (data) => {
      rows.value.push(data);
    });

    socket.on('vicoAll', (data) => {
      data.forEach((vico) => {
        rows.value.push(vico);
      });
    });

    const update = () => {
      var recieve = [];
      rows.value.push(recieve.at(0));
    };

    //update();

    const clearDialogVicoAdd = () => {
      const d = DateTime.now();
      vicoAdd.value = {
        date: d.toLocaleString(),
        timeStart: d.toLocaleString(DateTime.TIME_24_SIMPLE),
        timeEnd: d.toLocaleString(DateTime.TIME_24_SIMPLE),
        objectInitiator: [],
        objectInvited: [],
        typeVico: '',
        topic: '',
        departamentInitiator: [],
        departamentInvited: [],
        contactName: '',
        contactPhone: '',
      };
    };

    const selectAction = (rowId) => {
      if (selectedId.value.id === rowId && selectedId.value.isSelect == true) {
        selectedId.value.isSelect = false;
      } else {
        selectedId.value.id = rowId;
        selectedId.value.isSelect = true;
      }
    };

    const openDialogVicoView = () => {
      if (selectedId.value.isSelect) {
        vicoView.value = store.getVicoById(selectedId.value.id);
        dialogVicoView.value = true;
      }
    };

    const closeDialogVicoView = () => {
      dialogVicoView.value = false;
    };

    const openDialogVicoAdd = () => {
      clearDialogVicoAdd();
      dialogVicoAdd.value = true;
    };

    const saveDialogVicoAdd = () => {
      Loading.show();
      dialogVicoAdd.value = false;
      const vico = {
        date: vicoAdd.value.date,
        timeStart: vicoAdd.value.timeStart,
        timeEnd: vicoAdd.value.timeEnd,
        objectInitiator: vicoAdd.value.objectInitiator.label,
        objectInvited: vicoAdd.value.objectInvited,
        typeVico: vicoAdd.value.typeVico.label,
        topic: vicoAdd.value.topic,
        departamentInitiator: vicoAdd.value.departamentInitiator.label,
        departamentInvited: vicoAdd.value.departamentInvited,
        contactName: vicoAdd.value.contactName,
        contactPhone: vicoAdd.value.contactPhone,
      };

      const vicoObjectInvited = [];
      vico.objectInvited.forEach((item) => {
        vicoObjectInvited.push(item.label);
      });
      vico.objectInvited = vicoObjectInvited;

      const vicoDepartamentInvited = [];
      vico.departamentInvited.forEach((item) => {
        vicoDepartamentInvited.push(item.label);
      });
      vico.departamentInvited = vicoDepartamentInvited;

      api({
        method: 'post',
        url: store.getAjaxUri('vico/add'),
        data: {
          vico: vico,
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

    const closeDialogVicoAdd = () => {
      dialogVicoAdd.value = false;
    };

    const openDialogVicoEdit = () => {
      if (selectedId.value.isSelect) {
        vicoEdit.value = Object.assign(
          {},
          store.getVicoById(selectedId.value.id),
        );
        dialogVicoEdit.value = true;
      }
    };

    const saveDialogVicoEdit = () => {
      dialogVicoEdit.value = false;
      const vico = {
        id: selectedId.value.id,
        date: vicoEdit.value.date,
        timeStart: vicoEdit.value.timeStart,
        timeEnd: vicoEdit.value.timeEnd,
        objectInitiator: vicoEdit.value.objectInitiator.label,
        objectInvited: vicoEdit.value.objectInvited,
        typeVico: vicoEdit.value.typeVico.label,
        topic: vicoEdit.value.topic,
        departamentInitiator: vicoEdit.value.departamentInitiator.label,
        departamentInvited: vicoEdit.value.departamentInvited,
        contactName: vicoEdit.value.contactName,
        contactPhone: vicoEdit.value.contactPhone,
      };

      const vicoObjectInvited = [];
      vico.objectInvited.forEach((item) => {
        vicoObjectInvited.push(item.label);
      });
      vico.objectInvited = vicoObjectInvited;

      const vicoDepartamentInvited = [];
      vico.departamentInvited.forEach((item) => {
        vicoDepartamentInvited.push(item.label);
      });
      vico.departamentInvited = vicoDepartamentInvited;

      rows.value.push(vico);
    };

    const closeDialogVicoEdit = () => {
      dialogVicoEdit.value = false;
    };

    return {
      rows,
      selected,
      selectAction,
      separator: 'cell',
      columns,
      pagination: ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 100,
      }),
      dialogVicoAdd,
      dialogVicoView,
      dialogVicoEdit,
      openDialogVicoView,
      closeDialogVicoView,
      openDialogVicoAdd,
      saveDialogVicoAdd,
      closeDialogVicoAdd,
      openDialogVicoEdit,
      saveDialogVicoEdit,
      closeDialogVicoEdit,
      vicoView,
      vicoAdd,
      vicoEdit,
      optionsObject,
      optionsTypeVico,
      optionsDepartament,
    };
  },
});
</script>

<style lang="sass">
.my-sticky-table
  max-height: 92vh

  tr th
    position: sticky
    z-index: 2
    background: #afc7be

  thead tr:last-child th
    top: 48px
    z-index: 3

  thead tr:first-child th
    top: 0
    z-index: 1

  tr:first-child th:first-child
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0

  tbody
    scroll-margin-top: 48px

  thead tr:first-child th:first-child
    background-color: #afc7be

  td:first-child
    background-color: #afc7be

  th:first-child, td:first-child
    position: sticky
    left: 0
    z-index: 1

  li
   list-style-type: none

  td, tr, th
    padding: 3px
    margin: 3px
    border: solid black 1px

.q-item--active
  color: #21BA45

.text-left
  display: none

.q-table__bottom
  display: none

.my-table-border
  border: solid black 1px

.selected
  background-color: lightgreen

.no-select
  -webkit-touch-callout: none
  -webkit-user-select: none
  -khtml-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

.my-button
  z-index: 999
  opacity: 0.5

.my-button:hover
  opacity: 1

.my-dialog
  width: 900px

.my-card
  min-width: 1400px
</style>
