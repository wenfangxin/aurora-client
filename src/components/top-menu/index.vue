<template>
  <div class="topBox">
    <div class="topLeft">
      <i @click="changeSidebar" style="margin-right: 20px" class="iconfont"
         :class="collapse?'icon-zhedie2':'icon-zhedie1'"></i>
      <i @click="refresh" v-if="pageRefresh" class="iconfont icon-shuaxin refreshIcon"></i>
      <div v-if="device == 'default'" class="bread">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/home' }">{{ $t('topMenu.home') }}</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in matched" :key="index">{{ generateRouterTitle(item.meta) }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="topRight">
      <div class="topRight" v-show="device == 'default' || device == 'middle'">
        <div class="timeBox" v-if="device == 'default'">
          <span>{{ time }}</span>
        </div>
        <headerSearch></headerSearch>
        <div class="buttonIconBox">
          <i @click="handleFullScreen" class="iconfont" :class="fullIcon"></i>
        </div>
        <div class="buttonIconBox">
          <i @click="openSetting" class="iconfont icon-shezhi"></i>
        </div>
        <div class="buttonIconBox">
          <el-dropdown style="vertical-align: middle;margin-bottom: 3px" trigger="click" @command="changeLang">
            <span class="el-dropdown-link">
              <i style="font-size: 19px" class="iconfont icon-language"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh" :disabled="locale == 'zh'">中文</el-dropdown-item>
                <el-dropdown-item command="en" :disabled="locale == 'en'">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="buttonIconBox">
        <el-dropdown style="vertical-align: middle;">
          <div style="display: flex;align-items: flex-end;" class="el-dropdown-link">
            <div class="userPhoto">
              <img :src="userData.avatar"
                   alt="">
            </div>
            <el-icon style="font-size: 12px;margin-left:5px;font-weight: bold;margin-bottom: 4px;" class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/user">
                <el-dropdown-item>{{ $t('topMenu.user') }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="logOut()">{{ $t('topMenu.logOut') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import headerSearch from "@/components/header-search/index.vue"
import Moment from "moment";
import {useStore} from "vuex";
import {useRoute, useRouter} from 'vue-router'
import {computed, inject, nextTick, onMounted, reactive, toRefs, watch} from "vue";
import {ElMessage} from "element-plus";
import {useI18n} from 'vue-i18n/index'
import {ArrowDown} from "@element-plus/icons";

export default {
  name: "index",
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const i18n = useI18n()

    const state = reactive({
      fullIcon: 'icon-fullscreen-expand',
      time: '00:00:00',
      matched: null,
      fullscreen: false  // 是否全屏
    })

    const generateRouterTitle = inject('generateRouterTitle')

    //当前的语言
    const locale = computed(() => {
      return store.state.app.locale
    })

    const device = computed(() => {
      return store.state.app.device
    })

    //语言切换成功消息提示
    const checkLanguageMessage = computed(() => {
      return i18n.t('topMenu.checkLanguageMessage')
    })


    //是否显示page刷新按钮
    const pageRefresh = computed(() => {
      return store.state.app.pageRefresh
    })

    const collapse = computed(() => {
      return store.state.app.collapse
    })

    const userData = computed(() => {
      return store.state.user.userInfoData
    })

    //监听路由变化
    watch(route, (newValue, old) => {
      getBreadcrumb()
    })

    //切换语言
    const changeLang = (key) => {
      store.dispatch('app/changeLanguage', key)
      ElMessage({
        type: "success",
        message: checkLanguageMessage.value
      })
    }


    //根据路由获取面包屑
    const getBreadcrumb = () => {
      state.matched = route.matched.filter(
          (item) => item.meta && item.meta.title && item.path != "/home"
      );
    }

    //折叠菜单
    const changeSidebar = () => {
      if (collapse.value) {
        store.commit('app/SET_COLLAPSE', false);
      } else {
        store.commit('app/SET_COLLAPSE', true);
      }
    }

    //全屏
    const handleFullScreen = () => {
      let element = document.documentElement;
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (state.fullscreen) {
        state.fullIcon = 'icon-fullscreen-expand'

        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {    // 否则，进入全屏
        state.fullIcon = 'icon-fullscreen-shrink'

        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      // 改变当前全屏状态
      state.fullscreen = !state.fullscreen;
    }

    //退出登录
    const logOut = async () => {
      await store.dispatch('user/logOut');
    }

    //打开设置
    const openSetting = () => {
      store.dispatch('app/changeShowSettings', true)
    }

    //刷新当前页面
    const refresh = () => {
      const {name, query, path} = route
      store.dispatch('app/delCachedView', name).then(() => {
        nextTick(() => {
          router.replace({
            path: '/redirect',
            query: {
              path: path,
              data: JSON.stringify(query)
            }
          })
        })
      })
    }

    onMounted(() => {
      getBreadcrumb()
      setInterval(() => {
        state.time = Moment(new Date(), Moment.ISO_8601).format('YYYY-MM-DD dddd HH:mm:ss')
      }, 1000)
    })

    return {
      ...toRefs(state),
      locale,
      pageRefresh,
      changeLang,
      getBreadcrumb,
      changeSidebar,
      handleFullScreen,
      logOut,
      userData,
      openSetting,
      refresh,
      device,
      collapse,
      generateRouterTitle,
      checkLanguageMessage
    }
  },
  components: {
    headerSearch,
    ArrowDown
  }
}
</script>

<style lang="scss" scoped>
.buttonIconBox:hover {
  background: #00000006;
}

.buttonIconBox {
  height: 50px;
  line-height: 48px;
  padding: 0 9px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.refreshIcon {
  margin-right: 20px;
  font-size: 15px !important;
  font-weight: bold;
}

.topBox {
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  background: white;
  align-items: center;
  padding: 0 15px;
  justify-content: space-between;

  .topLeft {
    display: flex;
    align-items: center;
  }

  .topRight {
    display: flex;
    align-items: center;
  }

  i {
    display: block;
    font-size: 22px;
    cursor: pointer;
    color: #5a5e66;
  }
}

.openIcon {
  transform: rotate(45deg);
  font-size: 24px !important;
}

.userPhoto {
  img {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #eee;
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.timeBox {
  margin: 0 30px;
  color: #656565;
  display: flex;
  align-items: center;

  span {
    margin-right: 5px;
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: bold;
  }
}

</style>
