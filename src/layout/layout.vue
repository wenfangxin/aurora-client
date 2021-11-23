<template>
  <div class="menuBox">
    <div v-if="device=='mobile' && !collapse" class="drawer-bg" @click="handleClickOutside"/>
    <side-bar :class="{'smallClientSidebar':device == 'mobile'&&!collapse}" :style="{'width':collapse?'64px':'220px'}"
              class="sidebar-container"></side-bar>
    <div :style="{'marginLeft':collapse?'64px':'220px'}"
         :class="{'isFixedHeader':!fixedHead,'smallClientContent':device == 'mobile'}"
         class="content">
      <div class="topBarPosition">
        <top-menu></top-menu>
        <tags-view v-if="tagsView"/>
      </div>
      <div :class="{'isFixedHeader':fixedHead}"
           :style="{'marginTop':tagsView?'85px':'50px','height':tagsView?'calc(100% - 85px)':'calc(100% - 50px)'}"
           class="contentBto">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :include="keepAliveViews">
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
    <RightPanel v-if="showSettings">
      <settings></settings>
    </RightPanel>
  </div>
</template>

<script>
import SideBar from '@/components/side-bar/index.vue';
import TopMenu from "@/components/top-menu/index.vue";
import RightPanel from "@/components/right-panel/index.vue";
import settings from "@/components/settings/index.vue";
import TagsView from "@/components/tags-view/index.vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {computed, onBeforeMount, onMounted, ref, watch} from "vue";

export default {
  name: "layout",
  components: {
    SideBar,
    TopMenu,
    RightPanel,
    settings,
    TagsView,
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const {body} = document
    const smallSize = 950
    const middleSize = 1100
    let rect = ref(0)


    const collapse = computed(() => {
      return store.state.app.collapse
    })

    const fixedHead = computed(() => {
      return store.state.app.fixedHeader
    })

    const tagsView = computed(() => {
      return store.state.app.tagsView
    })

    const showSettings = computed(() => {
      return store.state.app.showSettings
    })

    const keepAliveViews = computed(() => {
      return store.state.app.keepAliveViews
    })

    const device = computed(() => {
      return store.state.app.device
    })

    watch(route, () => {
      //监听路由变化 执行添加addKeep
      addKeep()
      //监听是否执行移动端缩放
      if (device.value === 'mobile', !collapse) {
        store.commit('app/SET_COLLAPSE', true)
      }
    })


    //当前页面是否需要加入到keep-live
    const addKeep = () => {
      const {name} = route
      if (name) {
        store.dispatch('app/addKeepAlive', route)
      }
      return false
    }

    const isMobile = (widthRect) => {
      if (widthRect <= smallSize) {
        return "mobile"
      } else if (widthRect <= middleSize) {
        return 'middle'
      } else {
        return 'default'
      }
    }

    const handleClickOutside = () => {
      store.commit('app/SET_COLLAPSE', true)
    }

    const resizeHandler = () => {
      rect.value = body.getBoundingClientRect().width
      if (!document.hidden) {
        store.dispatch('app/toggleDevice', isMobile(rect.value))
        if (isMobile(rect.value) == 'mobile') {
          store.commit('app/SET_COLLAPSE', true)
        }
      }
    }

    onMounted(async () => {
      addKeep()
      rect.value = body.getBoundingClientRect().width
      await store.dispatch('app/toggleDevice', isMobile(rect.value))
      if (isMobile(rect.value) == 'mobile') {
        store.commit('app/SET_COLLAPSE', true)
      }
      await store.dispatch("app/getQiNiuToken")
      await store.dispatch("user/getUserData")

    })

    onBeforeMount(() => {
      window.addEventListener('resize', resizeHandler)
    })

    return {
      addKeep,
      collapse,
      fixedHead,
      tagsView,
      showSettings,
      keepAliveViews,
      device,
      resizeHandler,
      handleClickOutside
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },

}
</script>
<style lang="scss" scoped>
.smallClientSidebar {
  z-index: 11;
}

.smallClientContent {
  margin-left: 0 !important;
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  transition: width .28s;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 10;
}

/*vue过渡动画*/
.fade-enter-active, .fade-leave-active {
  transition: opacity 0s
}

.fade-enter, .fade-leave-to {
  opacity: 0
}


.menuBox {
  width: 100%;
  height: 100%;
  display: flex;
}

.content {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
  transition: margin-left .28s;


  .contentBto {
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
}

.topBarPosition {
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
}

.transitionContent {
  width: calc(100% - 64px);
}

.isFixedHeader {
  overflow-y: scroll;
}
</style>
