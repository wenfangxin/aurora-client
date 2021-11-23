<template>
  <el-drawer :destroy-on-close="true" :show-close="true" v-model="showSettings" @close="closeSetting"
             :title="$t('settings.title')">
    <slot/>
  </el-drawer>
</template>

<script>


import {computed} from "vue";
import store from '@/store'

export default {
  name: 'RightPanel',
  setup() {
    const showSettings = computed(() => {
      return true
    })
    const closeSetting = () => {
      store.dispatch('app/changeShowSettings', false)
    }
    return {
      showSettings,
      closeSetting
    }
  }
}
</script>

<style>
</style>
