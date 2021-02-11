<template>
    <div class="h-full flex flex-col content-center justify-start pb-4" ref="container">
      <app-splitter aside="300px">
        <template #aside>
          <app-tree-view 
            :root="dataTree" 
            :height="styleHeight"
            @downloadjson="downloadJSON()"
            @downloadtxt="downloadTXT()"
            @toconsole="toConsole('tree')"
          ></app-tree-view>
        </template>
        <template #main>
          <div v-if="dataOutputItems.length > 0" class="pl-4">
            <app-canvas-datagrid 
              :data="cache" 
              :height="styleHeight" 
              @downloadcsv="downloadCSV()"
              @toconsole="toConsole()"
            ></app-canvas-datagrid>
          </div>
          <div v-else>
            Selecione uma das abas acima
          </div>
        </template>
      </app-splitter>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue';
import { concatTables, TCell, TTable } from '@ijusplab/helpers';
import type { IDataOutput, Node } from '../../parser';

import AppIconButton from './AppIconButton.vue';
import AppDownloadIconButton from './AppDownloadIconButton.vue';
import AppCanvasDatagrid from './AppCanvasDatagrid.vue';
import AppSplitter from './AppSplitter.vue';
import AppTreeView from './AppTreeView.vue';

export default defineComponent({
  name: 'AppTable',
  components: {
    AppIconButton,
    AppDownloadIconButton,
    AppCanvasDatagrid,
    AppSplitter,
    AppTreeView
  },
  props: {
    docName: {
      type: String,
      default: 'download'
    },
    targetName: {
      type: String,
      default: 'download'
    },
    dataOutputItems: {
      type: Array as PropType<[] | IDataOutput[]>,
      default: () => []
    },
    dataTree: {
      type: Object as PropType<Node<any, any, any>>,
      required: true
    },
    text: {
      type: String,
      default: ''
    }
  },
  setup() {
    const bodyHeight = ref(0);
    const containerHeight = ref(0);
    const contentHeight = ref(0);
    const styleHeight = ref('');
    const cache = reactive({}) as Record<string, string | number | boolean | Date | null | undefined>[]
    return { bodyHeight, containerHeight, contentHeight, styleHeight, cache };
  },
  watch: {
    dataOutputItems: {
      handler(items: IDataOutput[]) {
        let max = 0;
        const data = items.reduce((reduced: Record<string, string | number | boolean | Date | null | undefined>[], item) => {
          const firstRow = item.data[0];
          max = Math.max(max, Array.isArray(firstRow) ? firstRow.length : 0);
          this.tableToTabular(item.data).forEach((row) => reduced.push(row));
          return reduced;
        }, []);
        this.cache = data;
      },
      deep: true
    }
  },
  methods: {
    downloadCSV(): void {
      if (this.dataOutputItems.length > 0) {
        let data: TTable<TCell> = [];
        this.dataOutputItems.forEach((item: IDataOutput) => {
          data = concatTables(data, item.data);
        });
        const csv = escape(data.map((row) => row.join(',')).join('\n'));
        const url = `data:text/csv;charset=utf-8,${csv}`;
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${this.docName}_${this.targetName}.csv`);
        link.click();
      }
    },
    downloadJSON() {
      const json = this.dataTree.toString();
      const url = `data:application/json;charset=utf-8,${json}`;
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.docName}.json`);
      link.click();
    },
    downloadTXT() {
      const url = `data:text/plain;charset=utf-8,${this.text}`;
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.docName}.txt`);
      link.click();
    },
    toConsole(what: string) {
      if (what === 'tree') {
        console.log('Formato original:\n', this.dataTree.toObject());
        console.log('Formato compacto:\n', this.dataTree.toCompactObject());
      } else {
        console.log('Fonte dos dados para planilha:\n', this.dataOutputItems);
      }
    },
    getHeaders(n: number): string[] {
      if (n < 1) return [];
      const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      if (n <= base.length) return base.slice(0, n);
      const headers = base.slice();
      let counter = base.length;
      while (counter < n) {
        const first = Math.floor(counter / base.length) - 1;
        const second = counter % base.length;
        headers.push(base[first] + base[second]);
        counter++;
      }
      return headers;
    },
    tableToTabular(data: TTable<TCell>): Record<string, TCell>[] {
      if (!Array.isArray(data) || data.length === 0) return [];
      const headers = this.getHeaders(data[0].length);
      return data.map((row) => {
        return headers.reduce(
          (reduced, header, colIndex) => {
            reduced[header] = row[colIndex];
            return reduced;
          }, {} as Record<string, TCell>
        );
      });
    },
    resizeHandler(): void {
      if (this.bodyHeight === 0) this.bodyHeight = document.body.clientHeight;
      if (this.containerHeight === 0) {
        this.containerHeight = (this.$refs.container as HTMLElement).clientHeight;
        this.contentHeight = this.containerHeight - 60;
      } else {
        const diff = this.bodyHeight - document.body.clientHeight;
        this.containerHeight -= diff;
        this.contentHeight -= diff;
      }
      this.bodyHeight = document.body.clientHeight;
      this.styleHeight = `${this.contentHeight - 1}px`;
    }
  },
  updated() {
    this.resizeHandler();
  },
  mounted() {
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
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
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:horizontal {
  background: #888;
  border-radius: 0px;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>