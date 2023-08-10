<template>
  <div class="q-pa-md">
    <q-table
      selection="single"
      v-model:selected="selected"
      class="my-sticky-table my-table-border"
      flat
      bordered
      row-key="id"
      :rows="rows"
      v-model:pagination="pagination"
      :columns="columns"
      :separator="separator"
      :wrap-cells="true"
    >
      <template v-slot:header-cell="props">
        <q-th :props="props" style="font-size: medium">
          {{ props.col.label }}
        </q-th>
      </template>
      <template v-slot:body="props">
        <q-tr
          class="my-table-border"
          :props="props"
          @click="
            props.selected = !props.selected;
            selectAction(props.row.id);
          "
        >
          <q-td class="my-table-border">
            <q-checkbox
              v-model="props.selected"
              @click="selectAction(props.row.id)"
            />
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
          <q-td
            key="objectInitiator"
            :props="props"
            class="my-table-border"
            style="min-width: 250px"
          >
            <div>
              {{ props.row.objectInitiator }}
            </div>
          </q-td>
          <q-td
            key="objectInvited"
            :props="props"
            class="my-table-border"
            style="min-width: 300px"
          >
            <li v-for="item in props.row.objectInvited" v-bind:key="item">
              <div style="border: 1px solid grey; padding: 2px">
                {{ item }}
              </div>
            </li>
          </q-td>
          <q-td key="typeVico" :props="props" class="my-table-border">
            {{ props.row.typeVico }}
          </q-td>
          <q-td key="topic" :props="props" class="my-table-border">
            {{ props.row.topic }}
          </q-td>
          <q-td
            key="departamentInitiator"
            :props="props"
            class="my-table-border"
            style="min-width: 250px"
          >
            {{ props.row.departamentInitiator }}
          </q-td>
          <q-td
            key="departamentInvited"
            :props="props"
            class="my-table-border"
            style="min-width: 300px"
          >
            <li v-for="item in props.row.departamentInvited" v-bind:key="item">
              <div style="border: 1px solid grey; padding: 2px">
                {{ item }}
              </div>
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
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useMainStore } from '../../stores/storeMain';

const storeMain = useMainStore();

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
export default defineComponent({
  name: 'MainVicoTable',
  setup() {
    const rows = computed(() => storeMain.vicos);

    const selected = ref([]);

    const selectAction = (rowId) => {
      if (storeMain.selectId === rowId && storeMain.isSelect == true) {
        storeMain.selectId = -1;
        storeMain.isSelect = false;
      } else {
        storeMain.selectId = rowId;
        storeMain.isSelect = true;
      }
    };

    return {
      rows,
      selected,
      selectAction,
      separator: 'cell',
      columns,
      pagination: ref({
        descending: false,
        page: 1,
        rowsPerPage: 999,
      }),
    };
  },
});
</script>

<style lang="sass">
.my-sticky-table
  max-height: 88vh
  tr th
    position: sticky
    z-index: 2
    background: #afc7be
  thead
    tr:last-child th
      top: 48px
      z-index: 3
    tr:first-child th
      top: 0
      z-index: 1
    tr:first-child th:first-child
      background-color: #afc7be
  tr:first-child th:first-child
    z-index: 3
  td:first-child, th:first-child
    position: sticky
    left: 0
    z-index: 1
    background-color: #afc7be
  tbody
    scroll-margin-top: 48px
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
  background-color: #DFEFD8
</style>
