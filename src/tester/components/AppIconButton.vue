<template>
  <button 
    class="rounded-full transition-colors duration-500 focus:outline-none inline-flex items-center justify-center"
    :class="`${disabled ? '' : 'hover:bg-gray-200'} ${disabled ? 'cursor-default' : 'cursor-pointer'}`" :disabled="disabled"
    style="width: 36px; height: 36px;"
  >
    <div :class="disabled ? 'opacity-25': ''">
      <slot></slot>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppIconButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>
