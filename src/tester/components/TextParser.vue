<template>
  <div class="h-full flex flex-col items-center justify-center mx-auto">

    <!-- ERROR CONTAINER  -->
    <section v-if="error" class="border-2 rounded border-red-700 bg-red-50 flex flex-col items-center justify-center p-12 w-1/3">
      <div class="text-red-700 text-lg font-bold align-bottom">{{ errorMessage }}</div>
      <app-button class="m-6" @click="clear">OK</app-button>
    </section>

    <!-- DISPLAYING DATA  -->
    <section v-else-if="options.length > 0" class="w-full h-full flex flex-col content-between justify-start text-center px-4 pt-4">
      <app-tabs
        :title="doc.label"
        :options="options"
        :value="chosen"
        @input="choose($event)"
        @clear="clear()"
      ></app-tabs>
      <app-dataviewer
        :doc-name="doc?.name" 
        :target-name="options[chosen]?.name" 
        :data-output-items="cache[chosen]"
        :data-tree="outputTree.root"
        :text="text"
      ></app-dataviewer>
    </section>

    <!-- FILE READER  -->
    <section v-else class="h-full w-full flex items-center justify-center">
      <app-file-reader
        class="w-2/3 h-2/3" 
        @change="parseText($event)"
        @error="showError($event)"
      ></app-file-reader>
    </section>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import type { IParsedDocument, IParsedOption, IDataOutput, TOutputTree } from '../../parser';
import { Parser } from '../../parser';
import getDocSchemata from '../../../test/sample';

import AppButton from './AppButton.vue';
import AppFileReader from './AppFileReader.vue';
import AppTabs from './AppTabs.vue';
import AppTreeView from './AppTreeView.vue';
import AppDataviewer from './AppDataviewer.vue';

const parser = new Parser(getDocSchemata());

export default defineComponent({
  name: 'TextParser',
  components: {
    AppButton,
    AppFileReader,
    AppTabs,
    AppTreeView,
    AppDataviewer
  },
  setup: () => {
    const error = ref(false);
    const errorMessage = ref('');
    const doc = reactive({ name: '', label: '' } as { name: string, label: string});
    const cache = reactive([] as IDataOutput[][]);
    const options = ref([] as IParsedOption[]);
    const outputTree = ref({} as TOutputTree);
    const text = ref('');
    const chosen = ref(-1);
    return {
      parser,
      error,
      errorMessage,
      doc,
      cache,
      options,
      outputTree,
      text,
      chosen
    }
  },
  methods: {
    showError(msg: string) {
      this.error = true;
      this.errorMessage = msg;
    },
    parseText(text: string) {
      try {
        this.text = text;
        const output = this.parser.parse(text) as IParsedDocument;
        this.outputTree = output.options[0].outputTree;
        this.doc.name = output.name;
        this.doc.label = output.label;
        this.options = output?.options || [];
        if (this.options.length === 0) {
          this.showError('Conteúdo não identificado!');
        }
      } catch (e) {
        this.showError('Erro ao ler o documento!');
        console.log(e);
        console.log(text);
      }
    },
    choose(index: number) {
      this.chosen = index;
      if (this.cache.length === 0) this.cache = new Array(this.options.length);
      if (!this.cache[index]) {
        try {
          const optionOutput = this.options[index] as IParsedOption;
          const targetOutput = this.parser.getDataOutput(optionOutput);
          this.cache[index] = targetOutput; 
        } catch (e) {
          this.showError('Erro ao ler o documento!');
          console.log(e);
        }
      }
    },
    clear() {
      this.options = [];
      this.chosen = -1;
      this.cache = [];
      this. error = false;
      this.errorMessage = '';
    }
  }
})
</script>
