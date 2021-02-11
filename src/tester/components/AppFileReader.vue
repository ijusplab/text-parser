<template>
  <div class="border-2 rounded flex flex-row items-center justify-center p-4" 
    :class="dragging ? 'border-solid border-blue-500 bg-blue-100' : 'border-dashed border-gray-500'"
    @dragover.stop.prevent="handleDragOver"
    @dragleave.stop.prevent="handleDragLeave"
    @drop.stop.prevent="readFile"
  >
    <div v-if="!reading" class="flex flex-col items-center justify-center">
      <div>Selecione</div>
      <button class="rounded-full transition-colors duration-500 hover:bg-gray-200 p-2 focus:outline-none" 
        @click="openFilePicker"
      >
        <svg style="width:24px;height:24px" class="text-gray-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z" />
        </svg>            
      </button>
      <div>
        <input style="display: none;" type="file" ref="picker" name="picker" accept="application/pdf, text/plain" @change="readFile">
      </div>
      <div>ou arraste para cá</div>
    </div>
    <div v-else>
      <app-loader color="gray" class="mx-auto"></app-loader>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import getPDFText from '../pdf';

import AppIconButton from './AppIconButton.vue';
import AppLoader from './AppLoader.vue';

export default defineComponent({
  name: 'AppFileReader',
  components: {
    AppIconButton,
    AppLoader
  },
  emits: ['error', 'change'],
  setup: () => {
    const picker = ref<null | { click: () => null }>(null);
    const dragging = ref(false);
    const reading = ref(false);
    return {
      picker,
      dragging, 
      reading
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
              const text = await getPDFText(reader.result as string);
              this.$emit('change', text);
            }
            reader.readAsDataURL(file);
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              const text = reader.result as string;
              this.$emit('change', text);
            };
            reader.readAsText(file);
          }
        }
      } else {
        this.reading = false;
        this.$emit('error', 'Conteúdo não identificado');
      }
    }
  }
})
</script>
