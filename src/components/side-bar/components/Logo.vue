<template>
  <div class="sidebar-logo-container">
      <router-link v-if="collapse" key="collapse"  class="sidebar-logo-link" to="/">
        <img  src="../../../assets/logo.png" style="margin-right: 0"  class="sidebar-logo">
<!--        <h1  class="sidebar-title">{{ title }} </h1>-->
      </router-link>
      <router-link v-if="!collapse" key="expand" class="sidebar-logo-link" to="/">
        <img   src="../../../assets/logo.png" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
  </div>

</template>

<script>
import {computed} from "vue";
import {title} from '@/config/defaultSettings'
import store from '@/store'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  setup(){
    const collapse = computed(()=>{
      return store.state.app.collapse
    })

    return{
      logoWidth:'100%',
      title: title,
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png',
      collapse
    }
  },
}
</script>

<style lang="scss" scoped>


.sidebar-logo-container {
  position: relative;
  height: 50px;
  width: calc(100% - 1px);
  line-height: 50px;
  background: #191a23;
  text-align: center;
  overflow: hidden;
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 38px;
      height: 38px;
      vertical-align: middle;
      margin-right: 3px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;

      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

}
</style>
