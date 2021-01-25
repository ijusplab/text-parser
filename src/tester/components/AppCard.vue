<template>
  <div class="shadow-md hover:shadow-lg transition-shadow duration-500 rounded">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppCard'
})
</script>
