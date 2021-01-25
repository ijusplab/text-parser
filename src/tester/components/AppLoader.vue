<template>
  <div class="ease-linear rounded-full border-4 border-gray-200 h-10 w-10 animate-spin" :style="{ borderTopColor: computedColor }"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppLoader',
  props: {
    color: {
      type: String,
      default: 'gray',
      validation: (val: string) => {
        return [ 'gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink' ].includes(val);
      }
    }
  },
  computed: {
    computedColor(): string {
      const map = {
        'gray': '#4B5563',
        'red': '#DC2626',
        'yellow': '#D97706',
        'green': '#059669',
        'blue': '#2563EB',
        'indigo': '#4F46E5',
        'purple': '#7C3AED',
        'pink': '#DB2777'
      } as Record<string, string>;
      return map[this.color];
    }
  }
})
</script>
