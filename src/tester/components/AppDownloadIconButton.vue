<template>
  <a :href="href"
    :class="`rounded-full transition-colors duration-500 ${disabled ? '' : 'hover:bg-gray-200'} p-2 focus:outline-none cursor-pointer ${disabled ? 'pointer-events-none' : 'pointer-events-auto'}`" :download="fileName">
    <div :class="disabled ? 'opacity-25': ''">
      <slot></slot>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppDownloadIconButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: 'download'
    }
  }
})
</script>
