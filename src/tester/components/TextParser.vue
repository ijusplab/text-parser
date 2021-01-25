<template>
  <div class="flex flex-col align-center justify-center max-w-2xl mx-auto">
    <div v-if="error" class="border-2 w-full min-h-32 rounded flex flex-col content-center justify-center text-center border-solid border-gray-500 p-4">
      <div class="text-red-500 font-bold">Erro:</div>
      <div>{{ errorMessage }}</div>
      <div class="mt-4">
        <app-button @click="cancel">OK</app-button>
      </div>
    </div>
    <div v-else-if="options.length > 0" class="border-2 w-full min-h-32 rounded flex flex-col content-center justify-center text-center border-solid border-blue-500 p-4">
      <div class="flex flex-row content-center justify-center">
        <h1 class="align-middle my-auto">Identificado:
          <span class="font-bold">{{ doc.label }}</span>
        </h1>
        <app-icon-button class="ml-4" @click="cancel">
          <svg class="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>          
        </app-icon-button>
      </div>
      <div class="mt-4">
        <template v-for="(option, index) in options" :key="index">
          <div class="inline-flex">
            <input type="radio" class="my-auto"
              :name="option.name" 
              :value="index"
              v-model="chosen" 
            >
            <label :for="option.name" class="mr-4">
              <span class="ml-2 align-top">{{ option.label }}</span>
              <span v-if="option.overwrites" class="text-red-500 font-bold">*</span>
            </label>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="border-2 w-full h-32 rounded flex flex-col content-center justify-center text-center" 
      :class="dragging ? 'border-solid border-blue-500 bg-blue-100' : 'border-dashed border-gray-500'"
      @dragover.stop.prevent="handleDragOver"
      @dragleave.stop.prevent="handleDragLeave"
      @drop.stop.prevent="readFile"
    >
      <div v-if="!reading">
        <div>Arraste o arquivo para cá</div>
        <div>- ou selecione -</div>
        <div>
          <button class="rounded-full transition-colors duration-500 hover:bg-gray-200 p-2 focus:outline-none" 
            @click="openFilePicker"
          >
            <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </button>
          <input style="display: none;" type="file" ref="picker" name="picker" accept="application/pdf, text/plain" @change="readFile">
        </div>
      </div>
      <div v-else>
        <app-loader color="gray" class="mx-auto"></app-loader>
      </div>
    </div>
  </div>
  <div v-show="options.some((option) => option.overwrites)" class="flex flex-col align-center justify-center mx-auto">
    <span class="text-red-500 text-xs mt-auto ml-auto">* overlaps = true</span>
  </div>
  <app-table :file-name="`${doc?.name}_${options[chosen]?.name}`" :targets="targets"></app-table>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import AppButton from './AppButton.vue';
import AppIconButton from './AppIconButton.vue';
import AppLoader from './AppLoader.vue';
import AppTable from './AppTable.vue';
import { Parser } from '../../parser';
import getConfig from '../../../test/sample';
import pdfjs from '@bundled-es-modules/pdfjs-dist/build/pdf';
import type { DataTable, IDataOutput, IOptionOutput } from '../../types';

pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.worker.min.js";

const parser = new Parser(getConfig());

export default defineComponent({
  name: 'TextParser',
  components: {
    AppButton,
    AppIconButton,
    AppLoader,
    AppTable
  },
  setup: () => {
    const picker = ref<null | { click: () => null }>(null);
    const error = ref(false);
    const errorMessage = ref('');
    const dragging = ref(false);
    const reading = ref(false);
    const doc = reactive({ name: '', label: '' } as { name: string, label: string});
    const options = ref([] as IOptionOutput[]);
    const chosen = ref(0);
    return {
      parser,
      picker,
      error,
      errorMessage,
      dragging, 
      reading,
      doc,
      options,
      chosen
    }
  },
  computed: {
    targets(): [] | { name: string, data: DataTable }[] {
      if (this.options.length > 0) {
        return this.options[this.chosen].targets;
      }
      return [];
    }
  },
  methods: {
    handleDragOver() {
      this.dragging = true;
    },
    handleDragLeave() {
      this.dragging = false;
    },
    openFilePicker(): void {
      this.picker?.click();
    },
    readFile(evt: Event): void {
      this.dragging = false;
      this.reading = true;
      let files;
      if (evt instanceof DragEvent) {
        files = evt.dataTransfer?.files;
      } else {
        const target = evt?.target as HTMLInputElement & EventTarget;
        files = target?.files;
      }

      if (files) {
        const file = files[0] ? files[0] : null;
        if (file) {
          if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async () => {
              const text = await this.getPdfContent(reader.result as string);
              this.parseText(text);
            }
            reader.readAsDataURL(file);
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              const text = reader.result as string;
              this.parseText(text);
            };
            reader.readAsText(file);
          }
        }
      } else {
        this.reading = false;
        this.error = true;
        this.errorMessage = "Conteúdo não identificado";
      }
    },
    async getPdfContent(dataUrl: string): Promise<string> {
      let doc = await pdfjs.getDocument(dataUrl).promise;
      let pageTexts = Array.from({ length: doc.numPages }, async (_v,i) => {
        return (await (await doc.getPage(i + 1)).getTextContent()).items.map((token: any) => token.str).join('\n');
      });
      const text = (await Promise.all(pageTexts)).join('\n'); 
      return text;
    },
    parseText(text: string) {
      try {
        const output = this.parser.parse(text) as IDataOutput;
        console.log(output);
        this.doc.name = output.name;
        this.doc.label = output.label;
        this.options = output?.options || [];
        if (this.options.length === 0) {
          this.error = true;
          this.errorMessage = "Conteúdo não identificado!";
        }
      } catch (e) {
        this.error = true;
        this.errorMessage = 'Erro ao ler o documento!';
        console.log(e);
      }
      this.reading = false;
    },
    cancel() {
      this.options = [];
      this.chosen = 0;
      this. error = false;
      this.errorMessage = '';
    },
    choose() {
      console.log(this.options[this.chosen]);
    }
  }
})
</script>

<style scoped>
.loader {
  border-top-color: #4B5563;
}
</style>