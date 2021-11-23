<template>
  <div class="sideBarBox">
    <!--取出存在store里的菜单 循环渲染到menu组建-->
    <Logo v-if="sidebarLogo" :collapse="collapse"></Logo>
    <el-scrollbar :class="{'showLogo':sidebarLogo}" height="100%">
      <el-menu
          :unique-opened="uniqueOpened"
          :collapse-transition="false"
          :collapse="collapse"
          :default-active="$route.path"
          :router="true"
          class="el-menu-vertical-demo sideBar"
          background-color="#22232e"
          text-color="#bfcbd9"
          :active-text-color="theme"
      >
        <sideItem v-for="item in menu" :key="item.path" :item="item" :base-path="item.path"></sideItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from "./components/Logo";
import sideItem from "./components/sideItem";
import {computed, onMounted, ref} from "vue";
import store from '@/store'
import path from "path";

export default {
  name: "index",
  data() {
    return {}
  },
  components: {
    Logo,
    sideItem
  },
  setup() {
    let menu = ref(null)

    const sidebarLogo = computed(() => {
      return store.state.app.sidebarLogo
    })
    const collapse = computed(() => {
      return store.state.app.collapse
    })
    const menuRouter = computed(() => {
      return store.state.user.menuRoute
    })
    const theme = computed(() => {
      return store.state.app.theme
    })
    const uniqueOpened = computed(() => {
      return store.state.app.uniqueOpened
    })


    //整理菜单格式
    const onlyOneShowingChild = (children = [], parent) => {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // 找到不嵌套的 nested:false
      if (parent.nested !== undefined && !parent.nested) {
        onlyOneChild = showingChildren[0]
        if (onlyOneChild === undefined) {
          return
        }
        onlyOneChild = parent
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = {...parent, path: '', noShowingChildren: true}
        return onlyOneChild
      }

      return false
    }
    const generateRoutes = (routes) => {
      const res = []
      for (let route of routes) {
        if (route.hidden) {
          continue
        }
        const onlyOneShowingChildren = onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChildren) {
          route = onlyOneShowingChildren
        }
        const data = route
        // recursive child routes
        if (route.children) {
          data.children = generateRoutes(route.children)
        }
        res.push(data)
      }
      return res
    }

    onMounted(() => {
      menu.value = generateRoutes(JSON.parse(JSON.stringify(menuRouter.value)))
    })

    return {
      sidebarLogo,
      collapse,
      menuRouter,
      theme,
      menu,
      generateRoutes,
      onlyOneShowingChild,
      uniqueOpened,
    }
  },

}
</script>
<style lang="scss">

.sideBar .el-sub-menu .el-menu-item {
  background: #15161e !important;
}

.sideBar .nest-menu .el-sub-menu__title {
  background: #15161e !important;
}

.sideBar .el-menu-item {
  background: #22232e !important;
  //color: #bfcbd9;

}

.sideBar .el-sub-menu__title:hover {
  background: #050508 !important;
}

.sideBar .el-menu-item:hover {
  background: #050508 !important;

}


/*菜单收缩样式*/
.sideBar .el-menu--collapse {
  height: 100%;
  overflow-y: scroll;
}


.el-scrollbar {
  width: calc(100% + 1px);
}

.el-menu {
  width: 100%;
  height: 100%;
}


</style>

<style lang="scss" scoped>

.sideBarBox {
  height: 100%;
  background-color: #22232e;
}

.showLogo {
  height: calc(100% - 50px)
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 100%;
  font-weight: 400 !important;
}

.sideBar {
  font-weight: 400 !important;
  min-height: 100%;
  width: 100%;

  :deep(.iconfont) {
    margin-right: 15px;
    display: inline-block;
    margin-bottom: 1px;
  }
}

.sideBar::-webkit-scrollbar { /*滚动条整体样式*/
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.sideBar::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
  background: white;
}

.sideBar::-webkit-scrollbar-track { /*滚动条里面轨道*/
  /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
  background: white;
}

</style>

