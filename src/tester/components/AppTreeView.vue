<template>
  <div ref="container">
    <div class="flex flex-row items-center justify-start pb-2 border-b">
      <app-icon-button
        class="mr-1"
        title="Baixar JSON" 
        @click="$emit('downloadjson')"
      >
        <svg style="width:20px;height:20px" class="text-gray-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z" />
        </svg>      
      </app-icon-button>
      <app-icon-button
        class="mr-1"
        title="Baixar TEXTO" 
        @click="$emit('downloadtxt')"
      >
        <svg style="width:20px;height:20px" class="text-gray-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
        </svg>      
      </app-icon-button>
      <app-icon-button
        class="mr-1"
        title="Ver no console" 
        @click="$emit('toconsole')"
      >
        <svg style="width:20px;height:20px" class="text-gray-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M13,19V16H21V19H13M8.5,13L2.47,7H6.71L11.67,11.95C12.25,12.54 12.25,13.5 11.67,14.07L6.74,19H2.5L8.5,13Z" />
        </svg>    
      </app-icon-button>
    </div>
    <div class="h-full text-xs font-mono overflow-auto pt-2">
      <app-tree-item
        :item="root"
        :depth="0"
      ></app-tree-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Node } from '../../parser';

import AppIconButton from '../components/AppIconButton.vue';
import AppTreeItem from './AppTreeItem.vue';

export default defineComponent({
  name: 'AppTreeView',
  components: {
    AppIconButton,
    AppTreeItem
  },
  emits: ['downloadjson', 'toconsole'],
  props: {
    root: {
      type: Object as PropType<Node<any, any, any>>,
      required: true
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  watch: {
    height: {
      handler(val) {
        const el = this.$refs.container as HTMLElement;
        el.style.height = val;
      }
    }
  },
  mounted() {
    const el = this.$refs.container as HTMLElement;
    el.style.height = this.height;
  }
})
</script>
