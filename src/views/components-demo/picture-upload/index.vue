<template>
  <div class="components-container">
    <aside>黄昏把酒祝东风，且从容。</aside>
    <imageCrop :width="width" :height="height" v-model="imgUrl"></imageCrop>
    <br>
    <aside>两水夹明镜，双桥落彩虹。人烟寒橘柚，秋色老梧桐</aside>
  </div>
</template>

<script>
import imageCrop from "@/components/image-crop"
import {nextTick, onMounted, reactive, ref, toRefs} from "vue";
export default {
  name: "picture-upload",
  components: {
    imageCrop,
  },
  setup() {

    const state = reactive({
      imgUrl: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      width: '100px',
      height: '100px'
    })

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>

</style>