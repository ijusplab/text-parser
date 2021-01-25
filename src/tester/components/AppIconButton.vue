<template>
  <button :class="`rounded-full transition-colors duration-500 ${disabled ? '' : 'hover:bg-gray-200'} p-2 focus:outline-none ${disabled ? 'cursor-default' : 'cursor-pointer'}`" :disabled="disabled">
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
