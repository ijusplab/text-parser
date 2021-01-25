<template>
  <div class="container mx-auto">
    <div class="mb-1 flex flex-row justify-end">
      <app-icon-button
        :disabled="targets.length === 0"
        title="Ver no console" 
        @click="toConsole"
      >
        <svg class="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </app-icon-button>
      <app-download-icon-button
        :href="csvUrl" 
        :file-name="fileName + '.csv'"
        :disabled="targets.length === 0" 
        title="Baixar em formato CSV" 
      >
        <svg class="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </app-download-icon-button>
    </div>
    <div class="border-2 w-full h-96 flex flex-col content-center justify-center border-1 border-solid border-gray-200"
    >
      <div v-if="targets.length > 0" class="text-gray-500 overflow-y-auto overflow-x-auto w-full h-full text-left text-xs font-mono px-2 pb-2">
        <template v-for="(target, index) in targets" :key="`t-${index}`">
          <table  class="table-auto border-collapse text-xs">
            <caption>
              <h1 class="flex-grow text-base antialiased text-left my-4 px-2 bg-blue-200">Intervalo:&nbsp;<span class="font-bold text-blue-700">{{ (target.name || '--') }}</span></h1>
            </caption>
            <tbody>
              <tr v-for="(row, index) in target.data" :key="`r-${index}`" class="border-solid border-2 border-gray-300">
                <td v-for="(col, index) in row" :key="`c-${index}`" class="p-1 border-solid border-2 border-gray-300">
                  {{ row[index] }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
      <div v-else class="text-center text-gray-500">
        Nenhum dado para exibir
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import AppIconButton from './AppIconButton.vue';
import AppDownloadIconButton from './AppDownloadIconButton.vue';
import type { DataTable } from '../../types';

export default defineComponent({
  name: 'AppTable',
  components: {
    AppIconButton,
    AppDownloadIconButton    
  },
  props: {
    fileName: {
      type: String,
      default: 'download'
    },    
    targets: {
      type: Array as PropType<[] | { name: string, data: DataTable }[]>,
      default: () => []
    }
  },
  computed: {
    csvUrl() {
      if (this.targets.length > 0) {
        const csv = escape(this.targets[0].data.map((row) => row.join(',')).join('\n'));
        return `data:text/csv;charset=utf-8,${csv}`;
      }
      return '';
    }
  },
  methods: {
    toConsole() {
      console.log(this.targets);
    }
  }
})
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-button {
  background: #eee;
  display: none;
}
::-webkit-scrollbar-track-piece {
  background: #eee;
}
::-webkit-scrollbar-thumb {
  background:#888;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:horizontal {
  background: #888;
  border-radius: 8px;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>