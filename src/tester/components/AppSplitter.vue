<template>
  <div class="w-full h-full flex flex-row max-w-screen">
    <div ref="aside" :style="{ width: aside }">
      <slot name="aside"></slot>
    </div>
    <div class="resize-handle border-2" style="cursor: ew-resize;"
      @mousedown.prevent.stop="startResizing"
    ></div>
    <div ref="section" :style="`width: calc(100% - ${aside})`">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AppSplitter',
  props: {
    aside: {
      type: String,
      default: '25%'
    }
  },
  setup() {
    const resizing = ref(false);
    const asideWidth = ref(0);
    const sectionWidth = ref(0);
    const xPosition = ref(0);
    return { resizing, asideWidth, sectionWidth, xPosition }
  },
  methods: {
    startResizing(e: MouseEvent) {
      const aside = this.$refs.aside as HTMLElement;
      const section = this.$refs.section as HTMLElement;
      this.asideWidth = aside.offsetWidth;
      this.sectionWidth = section.clientWidth;
      this.xPosition = e.screenX;
      this.resizing = true;
    },
    move(e: MouseEvent) {
      if (this.resizing) {
        const aside = this.$refs.aside as HTMLElement;
        const section = this.$refs.section as HTMLElement;
        const cursorDelta = e.screenX - this.xPosition;
        const asideWidth = this.asideWidth + cursorDelta;
        const sectionWidth =this.sectionWidth - cursorDelta;
        aside.style.width = asideWidth + 'px'; 
        section.style.width = sectionWidth + 'px'; 
      }
    },
    stopResizing() {
      this.resizing = false;
    },
    adjustWidth() {
      const section = this.$refs.section as HTMLElement;
      const aside = this.$refs.aside as HTMLElement;
      section.style.width = `width: calc(100% - ${aside.offsetWidth})`;
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.move);
    window.addEventListener('mouseup', this.stopResizing); 
    window.addEventListener('resize', this.adjustWidth);
    this.adjustWidth();
  },
  unmounted() {
    window.removeEventListener('mousemove', this.move);
    window.removeEventListener('mouseup', this.stopResizing);
  }
})
</script>
