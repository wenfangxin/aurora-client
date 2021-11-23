<template>
  <el-scrollbar ref="scrollContainer" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot/>
  </el-scrollbar>
</template>

<script>

import {computed, onMounted, ref} from "vue";

export default {
  name: 'ScrollPane',
  // data() {
  //   return {
  //     left: 0
  //   }
  // },
  emits:['scroll'],
  setup(prop,context) {
    const scrollContainer = ref(null)

    const scrollWrapper = computed(() => {
      return scrollContainer.value.$refs.wrap
    })

    const handleScroll = (e) => {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = scrollWrapper.value
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    }
    const emitScroll = () => {
      context.emit('scroll')
    }
    onMounted(() => {
      scrollWrapper.value.addEventListener('scroll', emitScroll, true)
    })
    return {
      scrollWrapper,
      scrollContainer,
      handleScroll,
      emitScroll
    }
  },
  beforeDestroy() {
    this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
  },
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }

  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>

