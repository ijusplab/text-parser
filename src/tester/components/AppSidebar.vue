<template>
  <div class="flex flex-col items-start justify-start text-left p-4 h-full overflow-auto">
    teste
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Node, Leaf } from '../../parser';

export default defineComponent({
  name: 'AppSidebar',
  emits: ['close'],
  props: {
    item: {
      type: Object as PropType<Node<any, any, any> | Leaf<any, any, any>>,
      required: true
    }
  },
})
</script>
