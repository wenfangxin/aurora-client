<template>
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>
</template>

<script>
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import Moment from "moment";
import {ElConfigProvider} from 'element-plus'
import {computed, onMounted, provide} from "vue";
import {useStore} from 'vuex'
import i18n from "@/language";
import {useRoute, useRouter} from "vue-router";
import {getPageTitle} from "@/utils";

export default {
  name: 'App',
  components: {
    ElConfigProvider
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    //监听当前语言切换
    const lang = computed(() => {
      return store.state.app.locale
    })

    //设置element-plus的组件国际化
    const locale = computed(() => {
      i18n.global.locale = lang.value
      //切换语言时候 改变当前页面的title
      document.title = getPageTitle(route.meta,lang.value)
      switch (lang.value) {
        case 'en':
          Moment.locale('en')
          return enLocale
        case 'zh':
          Moment.locale('zh-cn')
          return zhLocale
      }
    })


    //在computed中监听store里的语言切换变化，触发方法更新所有路由菜单相关的数据i18n切换
    const generateRouterTitle = (meta) => {
      switch (lang.value) {
        case "zh":
          return meta.title
        case "en":
          return meta.en_title
        default:
          return meta.title
      }
    }


    //在app里定义全局方法generateRouterTitle 使用provide/inject每个子组件都能访问到
    provide('generateRouterTitle', generateRouterTitle)

    return {
      locale,
      lang
    }
  },



}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

#nprogress .bar {
  background: #409eff !important; //路由进度条自定义颜色
}
</style>
