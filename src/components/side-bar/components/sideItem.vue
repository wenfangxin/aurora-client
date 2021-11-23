<template>
  <el-sub-menu :index="item.path" v-if="item.nested">
    <template #title>
      <i class="iconfont" v-if="item.meta.icon" :class="item.meta.icon"></i>
      <span slot="title">{{ generateRouterTitle(item.meta) }}</span>
    </template>
    <template v-for="child in item.children" :key="child.path">
      <sideItem class="nest-menu" v-if="child.children&&child.nested" :item="child"
                :base-path="basePath+'/'+child.path"></sideItem>
      <el-menu-item @click="clickItem(basePath+'/'+child.path)" v-else :index="basePath+'/'+child.path" :key="child.path">
        {{ generateRouterTitle(child.meta )}}
      </el-menu-item>
    </template>
  </el-sub-menu>

  <el-menu-item @click="clickItem(item.path +item.children[0].path)" :index="item.path +item.children[0].path" v-else>
    <i class="iconfont" :class="item.children[0].meta.icon"></i>
    <template #title>{{ generateRouterTitle(item.children[0].meta) }}</template>
  </el-menu-item>
</template>

<script>

import {computed, inject} from "vue";
import {useStore} from "vuex";

export default {
  name: "sideItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup() {
    const store = useStore()
    const generateRouterTitle = inject('generateRouterTitle')

    const device = computed(() => {
      return store.state.app.device
    })

    const collapse = computed(() => {
      return store.state.app.collapse
    })
    const clickItem = (r)=>{
      if(device.value == 'mobile'&& !collapse.value){
        store.commit('app/SET_COLLAPSE',true)
      }
    }
    return {
      clickItem,
      generateRouterTitle,
    }
  }
}
</script>

<style scoped>

</style>