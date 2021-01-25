<template>
  <button type="button" 
    :class="`inline-flex flex-row justify-center content-center py-2 px-4 bg-${color}-${dark ? '500' : '300'} ${dark ? 'text-white' : 'text-' + color + '-800'} font-semibold rounded hover:bg-${color}-${dark ? '600' : '400'} focus:outline-none focus:ring-2 focus:ring-${color}-${dark ? '400' : '200'} focus:ring-opacity-75`">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppButton',
  props: {
    color: {
      type: String,
      default: 'gray',
      validation: (val: string) => {
        return [ 'gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink' ].includes(val);
      }
    },
    dark: {
      type: Boolean,
      default: false
    }
  }
})
</script>
