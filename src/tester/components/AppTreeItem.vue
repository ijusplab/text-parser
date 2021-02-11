<template>
  <div :style="indent" class="my-1">
    <div
      class="item text-left font-mono text-xs cursor-pointer"
      :class="{ leaf: isLeaf, node: !isLeaf, 'open': isOpen }"
      @click="toggle"
    >
      <span :class="isLeaf ? '' : 'border-b border-dotted border-gray-500'">{{ item.name }}</span>
      <span v-if="isLeaf"> ({{ item.value }})</span>
    </div>
    <template v-if="isOpen">
      <app-tree-item 
        v-for="(child, index) in item.children" :key="index"
        :item="child"
        :depth="depth + 1"
      ></app-tree-item>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import type { Leaf, Node } from '../../parser';

export default defineComponent({
  name: 'AppTreeItem',
  props: {
    item: {
      type: Object as PropType<Node<any, any, any> | Leaf<any, any, any>>,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const isOpen = ref(false);
    return { isOpen };
  },
  computed: {
    isLeaf(): boolean {
      return this.item.isLeaf();
    },
    indent(): { transform: string } {
      return { transform: `translate(${this.depth * 5}px)`};
    }
  },
  methods: {
    toggle() {
      if (!this.isLeaf) this.isOpen = !this.isOpen;
    }
  }
})
</script>

<style>
.item.node {
  font-weight: bold;
}
.item.node::before {
  font-size: smaller;
  content: '⯈ ';
}
.item.node.open::before {
  font-size: smaller;
  content: '⯆ ';
}
.item.leaf::before {
  content: '• ';
}

</style>