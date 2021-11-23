<template>
  <div class="components-container menu-settings-box">
    <el-card class="menu-card">
      <template #header>
        <div class="card-header">
          <span>{{$t('menuSettings.title') }}</span>
          <div>
            <a style="font-size: 13px;margin-right: 30px;color: #999;cursor: pointer" @click="consoleData">{{$t('menuSettings.viewMenuData') }}</a>
            <el-button class="button" size="medium" type="text"
                       @click="append($t('menuSettings.addMenu'),null,'add')">
              {{ $t('menuSettings.addMenu') }}
            </el-button>
          </div>
        </div>
      </template>
      <div class="block">
        <el-tree
            ref="tree"
            :check-strictly="false"
            :data="treeData"
            :show-checkbox="false"
            :props="defaultProps"
            node-key="id"
            :default-expand-all="true"
            :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
                   <span class="custom-tree-node">
                    <span>{{ generateRouterTitle(data.meta) }}</span>
                    <span>
                      <a class="menu-set-btn" @click="append($t('menuSettings.addChildMenu'),data.id,'addNested')"
                         style="color: #68c23a" type="text">{{ $t('menuSettings.add') }}</a>
                      <a class="menu-set-btn" @click="editOpen($t('menuSettings.edit'),data.id,'edit')"
                         type="text">{{ $t('menuSettings.edit') }}</a>
                        <el-popconfirm
                            :confirm-button-text="this.$t('system.ok')"
                            :cancel-button-text="this.$t('system.cancel')"
                            icon="el-icon-info"
                            icon-color="red"
                            :title="this.$t('system.deleteMsg')"
                            @confirm="remove(data.id)"
                        >
                            <template #reference>
                                 <a class="menu-set-btn" style="color: #f56c6c"
                                    type="text">{{ $t('menuSettings.del') }}</a>
                            </template>
                         </el-popconfirm>
                    </span>
                  </span>
          </template>
        </el-tree>
      </div>
    </el-card>
    <edit @addMenu="addMenuData" @updateMenu="updateMenuData" ref="editChildComponent"></edit>
  </div>
</template>

<script>

import {computed, inject, onMounted, reactive, ref, toRefs} from "vue";
import path from "path";
import edit from "./components/edit";
import {useStore} from "vuex";
import api from "@/api"
import {ElMessage, ElNotification} from "element-plus";
import {useI18n} from "vue-i18n/index"
import {filterRouterFormat} from "@/route/setRoute";

export default {
  name: "menu-settings",
  components: {
    edit
  },
  setup() {
    const store = useStore()
    const i18n = useI18n()
    const state = reactive({
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    })

    const getMenuList = ()=>{
      api.user.getMenuList().then(res=>{
        let menuRoute =  filterRouterFormat(res.data.data)
        state.treeData = generateRoutes(menuRoute)
      })
    }

    const editChildComponent = ref(null)

    //国际化切换菜单
    const generateRouterTitle = inject('generateRouterTitle')


    //打开新增窗口
    const append = (title, id, type) => {
      openDrawer(title, id, type)
    }


    const editOpen = (title, id, type) => {
      api.user.getSingleMenu({id: id}).then(res => {
        if (res.data.code === 200) {
          editChildComponent.value.openEditValue(title, id, type, numChangeBool(res.data.data))
        }
      })
    }


    //提交新增菜单数据
    const addMenuData = (value) => {
      let data = boolChangeInt(value)
      api.user.addMenuRouter(data).then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          editChildComponent.value.closeDrawer()
          getMenuList()
        }
      }).catch(err=>{
        editChildComponent.value.loading = false
      })

    }

    //提交更新编辑的菜单数据
    const updateMenuData = (value) => {
      let data = boolChangeInt(value)
      api.user.updateMenuRouter(data).then(res => {
        if (res.data.code === 200) {
          editChildComponent.value.closeDrawer()
          ElMessage.success(res.data.msg)
          getMenuList()
        }
      }).catch(err=>{
        editChildComponent.value.loading = false
      })
    }

    //删除菜单
    const remove = (id) => {
      api.user.deleteMenuRouter({id}).then(res => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          getMenuList()
        }
      })
    }

    //窗口开启
    const openDrawer = (title, id, type) => {
      editChildComponent.value.open(title, id, type)
    }

    //int 转换为 bool
    const numChangeBool = (data) => {
      const keys = ['keep', 'affix', 'hidden', 'icon', 'nested']
      for (const key in data) {
        if (keys.includes(key)) {
          if (data[key] === 0) {
            data[key] = false
          } else if (data[key] === 1) {
            data[key] = true
          }
        }
      }
      return data
    }

    //bool 转换为int
    const boolChangeInt = (data) => {
      const keys = ['keep', 'affix', 'nested','hidden']
      for (const key in data) {
        if (keys.includes(key)) {
          if (data[key]) {
            data[key] = 1
          } else {
            data[key] = 0
          }
        }
      }
      return data
    }

    //整理菜单格式
    const onlyOneShowingChild = (children = [], parent) => {
      let onlyOneChild = null
      const showingChildren = children
      // 找到不嵌套的 nested:false
      if (parent.nested !== undefined && !parent.nested) {
        onlyOneChild = showingChildren[0]
        if (onlyOneChild === undefined) {
          return
        }
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        onlyOneChild.id = parent.id
        onlyOneChild.parent_id = parent.parent_id
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = {...parent, path: '', noShowingChildren: true}
        return onlyOneChild
      }

      return false
    }
    const generateRoutes = (routes, basePath = '/') => {
      const res = []
      for (let route of routes) {
        const onlyOneShowingChildren = onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChildren) {
          route = onlyOneShowingChildren
        }
        const data = {
          path: path.resolve(basePath, route.path),
          meta: route.meta,
          id: route.id,
          parent_id: route.parent_id
        }
        // recursive child routes
        if (route.children) {
          data.children = generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    }

    const titleNotification = computed(() => {
      return i18n.t("system.notification")
    })

    const ConsoleData = computed(() => {
      return i18n.t("system.consoleData")
    })

    const consoleData = () => {
      console.log("参考格式:", store.state.user.menuRoute)
      ElNotification({
        title: titleNotification.value,
        type: 'success',
        message: ConsoleData.value,
      })
    }


    onMounted(() => {
      getMenuList()

    })

    return {
      ...toRefs(state),
      append,
      remove,
      onlyOneShowingChild,
      generateRoutes,
      filterRouterFormat,
      generateRouterTitle,
      editChildComponent,
      openDrawer,
      addMenuData,
      updateMenuData,
      numChangeBool,
      boolChangeInt,
      editOpen,
      consoleData
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.menu-settings-box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .menu-card {
    width: 100%;
  }

  .menu-set-btn {
    font-size: 13px;
    margin-right: 20px;
  }

}
</style>
<style>
.menu-settings-box .el-tree-node__content {
  height: 35px;
}
</style>