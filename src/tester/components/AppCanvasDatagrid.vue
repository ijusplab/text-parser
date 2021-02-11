<template>
  <div class="flex flex-row items-center justify-start pb-2">
    <app-icon-button
      class="mr-1"
      title="Baixar CSV" 
      @click="$emit('downloadcsv')"
    >
      <svg style="width:20px;height:20px" class="text-gray-500" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M10 19L12 15H9V10H15V15L13 19H10" />
      </svg>    
    </app-icon-button>
    <app-icon-button
      class="mr-1"
      title="Ver no console" 
      @click="$emit('toconsole')"
    >
      <svg style="width:20px;height:20px" class="text-gray-500" viewBox="0 0 24 24">
        <path fill="currentColor" d="M13,19V16H21V19H13M8.5,13L2.47,7H6.71L11.67,11.95C12.25,12.54 12.25,13.5 11.67,14.07L6.74,19H2.5L8.5,13Z" />
      </svg>    
    </app-icon-button>
  </div>
  <div ref="table" class="border-2 border-gray-300 bg-gray-200" style="width: 100%; overflow: scroll;"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import canvasDatagrid from 'canvas-datagrid';

import AppIconButton from '../components/AppIconButton.vue';

export default defineComponent({
  name: 'AppCanvasDatagrid',
  components: {
    AppIconButton
  },
  emits: ['downloadcsv', 'toconsole'],
  props: {
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Array as PropType<[] | Record<string, string | number | boolean | Date | null | undefined>[]>,
      default: () => []
    }
  },
  setup() {
    const grid = {} as any;
    return { grid };
  },
  watch: {
    data: {
      handler(val) {
        this.grid.data = val;
      },
      deep: true
    },
    height: {
      handler(val) {
        const tableEl = this.$refs.table as HTMLElement;
        tableEl.style.height = val;
      }
    }
  },
  mounted() {
    const tableEl = this.$refs.table as HTMLElement;
    tableEl.style.height = this.height;
    this.grid = canvasDatagrid();
    this.grid.attributes.columnHeaderClickBehavior = 'select';
    this.grid.attributes.editable = false;
    this.grid.attributes.allowSorting = false;
    this.grid.style.columnHeaderCellHorizontalAlignment = 'center';
    this.grid.style.activeCellFont = '14px monospace';
    this.grid.style.cellFont = '14px monospace';
    this.grid.style.columnHeaderCellFont = '14px arial';
    this.grid.style.rowHeaderCellFont = '14px arial';
    this.grid.data = this.data;
    this.grid.addEventListener('contextmenu', (e: any) => e.preventDefault());
    tableEl.appendChild(this.grid);
  }
})
</script>
