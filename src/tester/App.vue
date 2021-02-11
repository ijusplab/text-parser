<template>
  <header class="flex fixed w-full flex-row items-center justify-between bg-white shadow-lg mb-2 py-2 ">
    <div class="my-auto mx-4">
      <img width="200" alt="Vue logo" src="./assets/logo_dark.png">
    </div>
    <div class="my-auto mx-4">
      <h1 class="font-mono text-3xl antialiased font-medium">TextParser@{{pkg.version}}</h1>
    </div>
  </header>
  <section class="bg-white h-full pt-16">
    <TextParser />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import pkg from '../../package.json';

import TextParser from './components/TextParser.vue';

export default defineComponent({
  name: 'App',
  components: {
    TextParser
  },
  setup() {
    return { pkg }
  }
})
</script>
