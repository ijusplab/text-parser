<template>
  <div class="fixed w-full h-16 bg-white shadow-sm flex flex-row align-center justify-between">
    <div class="my-auto mx-4">
      <img width="200" alt="Vue logo" src="./assets/logo_dark.png">
    </div>
    <div class="my-auto mx-4">
      <h1 class="font-mono text-3xl antialiased font-medium">TextParser@{{pkg.version}}</h1>
    </div>
  </div>
  <app-card class="bg-white my-9 mt-20 mx-4 p-9">
    <TextParser />
  </app-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TextParser from './components/TextParser.vue';
import AppCard from './components/AppCard.vue';
import pkg from '../../package.json';

export default defineComponent({
  name: 'App',
  components: {
    AppCard,
    TextParser
  },
  setup() {
    return { pkg }
  }
})
</script>
