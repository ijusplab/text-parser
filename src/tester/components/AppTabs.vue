<template>
  <div class="flex flex-col content-between justify-start text-center">
    <div class="flex flex-row items-center justify-between border-b">
      <h1 class="align-middle my-auto flex items-center justify-start">
        <span class="mr-2">Identificado:</span>
        <span class="font-bold">{{ title }}</span>
        <app-icon-button class="ml-2" @click="$emit('clear')">
          <svg style="width:20px;height:20px" class="text-gray-600" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </svg>
        </app-icon-button>
      </h1>
      <div class="flex flex-row">
        <ul v-for="(option, index) in options" :key="index" class="list-reset">
          <li class="-mb-px mr-1" @click="$emit('input', index)">
            <div 
              class="cursor-pointer inline-block py-2 px-4 hover:text-gray-900 font-semibold"
              :class="value === index ? 'bg-white border-l border-t border-r rounded-t text-grey-900': 'text-gray-600 bg-gray-100'"
            >
              <span>{{ option.label }}</span>
              <span v-if="option.overwrites" class="text-red-500 font-bold">*</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-show="options.some((option) => option.overwrites)" class="ml-auto my-0">
      <span class="text-red-500 text-xs"><span class="font-bold">* </span><code>overwrites = true</code></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { IParsedOption } from '../../parser';

import AppIconButton from './AppIconButton.vue';

export default defineComponent({
  name: 'AppTabs',
  components: {
    AppIconButton
  },
  emits: ['clear', 'input'],
  props: {
    title: {
      type: String,
      default: 'Unknown'
    },
    options: {
      type: Array as PropType<[] | IParsedOption[]>,
      default: () => []
    },
    value: {
      type: Number,
      default: 0
    }
  }
})
</script>
