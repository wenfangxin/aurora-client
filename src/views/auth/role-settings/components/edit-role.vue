<template>
  <edit-drawer :loading="loading" :drawer="drawer" :size="500" :close="cancel" :confirm="confirm" :title="title">
    <el-form
        ref="ruleFormRef"
        :model="roleRuleForm"
        :rules="roleRules"
        label-width="105px"
        class="demo-ruleForm"
    >
      <el-form-item :label="$t('role.roleName')" prop="role_name">
        <el-input v-model="roleRuleForm.role_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('role.roleKey')" prop="role_key">
        <el-input :disabled="disableRoleKey" v-model="roleRuleForm.role_key"></el-input>
      </el-form-item>
      <el-form-item :label="$t('role.description')" prop="description">
        <el-input :rows="2" type="textarea" v-model="roleRuleForm.description"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin:10px 20px 20px 20px">
      <el-tabs>
        <el-tab-pane :label="$t('role.roleMenu')">
          <div class="roleBlockTree">
            <div style="text-align: right">
              <el-button type="text"  @click="allCheckMenu">{{ $t('system.allChecked') }}</el-button>
              <el-button size="mini" style="color:#606266;" type="text" @click="resetMenuTree">{{$t('system.reset')}}</el-button>
            </div>
            <el-tree
                ref="menuTree"
                :check-strictly="checkStrictly"
                :data="treeData"
                :show-checkbox="true"
                :props="{
             children: 'children',
             label: 'title'
          }"
                node-key="id"
                :default-expand-all="true"
                :expand-on-click-node="true"
            >
              <template #default="{ node, data }">
                   <span class="custom-tree">
                     <span>{{ generateRouterTitle(data.meta) }}</span>
                  </span>
              </template>
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('role.api')">
          <div class="roleBlockTree">
            <div style="text-align: right">
              <el-button type="text"  @click="allApiCheckMenu">{{ $t('system.allChecked') }}</el-button>
              <el-button size="mini" style="color:#606266;" type="text" @click="resetApiTree">{{$t('system.reset')}} </el-button>
            </div>
            <el-tree
                ref="apiTree"
                :check-strictly="false"
                :data="apiData"
                :show-checkbox="true"
                :props="{
             children: 'children',
             label: 'title'
          }"
                node-key="id"
                :default-expand-all="true"
                :expand-on-click-node="true"
            >
              <template #default="{ node, data }">
                   <span class="custom-tree">
                     <span v-if="typeof data.id == 'string'">{{ generateRouterTitle(data.name) }}</span>
                    <span v-else>{{data.name}}</span>
                  </span>
              </template>
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </edit-drawer>
</template>

<script>
import editDrawer from "@/components/edit-drawer"
import {computed, inject, nextTick, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useI18n} from "vue-i18n/index"
import {useStore} from "vuex";
import path from "path";
import api from "@/api"
import {ElMessage} from "element-plus";
import {filterRouterFormat} from "@/route/setRoute";
export default {
  name: "edit-role",
  components: {
    editDrawer
  },
  emits:["refresh"],
  setup(props,context) {
    const i18n = useI18n()
    const store = useStore()

    const menuTree = ref(null)
    const apiTree = ref(null)


    //国际化切换菜单
    const generateRouterTitle = inject("generateRouterTitle")

    //ruleFormRef
    const ruleFormRef = ref(null)

    const state = reactive({
      id: null,
      treeData:[],
      apiData:[],
      disableRoleKey:false,
      checkStrictly:true,
      drawer: false,
      loading:false,
      type: null,                //new || edit
      roleRuleForm: {
        role_name: "",
        role_key: "",
        description: ""
      }
    })

    //表单校验规则
    const roleRules = computed(() => {
      return {
        role_name: [
          {
            required: true,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
        role_key: [
          {
            required: true,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
        description: [
          {
            required: true,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
      }
    })

    //监听语言切换 防止form rules触发
    watch(() => store.state.app.locale, () => {
      if (ruleFormRef.value !== null) {
        nextTick(() => {
          ruleFormRef.value.clearValidate()
        })
      }
    })

    //title
    const title = computed(() => {
      if (state.type === "new") {
        return i18n.t('role.newRole')
      }
      return i18n.t('role.editRole')
    })

    const getMenuList = ()=>{
      api.user.getMenuList().then(res=>{
        let menuRoute =  filterRouterFormat(res.data.data)
        state.treeData = generateRoutes(menuRoute)
      })
    }

    const getApiList = () => {
      api.user.getApiList({page:1,size:10000}).then(res => {
        if (res.data.code === 200) {
          let dataInfo = {};
          res.data.data.rows.forEach((item, index) => {
            let { module,module_data } = item;
            if (!dataInfo[module]) {
              dataInfo[module] = {
                id:"parent"+String(index),
                name:module_data,
                children: []
              }
            }
            dataInfo[module].children.push(item);
          });
          state.apiData = Object.values(dataInfo)
        }
      })
    }


    //打开窗口
    const open = (type, data) => {
      state.drawer = true
      state.type = type
      if (type === 'new') {
        state.checkStrictly = false
        state.disableRoleKey = false
        state.id = null
        return
      }
      state.disableRoleKey = true
      state.checkStrictly = true
      nextTick(() => {
        for (const key in state.roleRuleForm) {
          state.roleRuleForm[key] = data[key]
        }
        state.id = data.id
        let menu = JSON.parse(JSON.stringify(data.menu))
        let api = JSON.parse(JSON.stringify(data.api))
        menuTree.value.setCheckedKeys(menu.split(","))
        apiTree.value.setCheckedKeys(api.split(","))
        state.checkStrictly = false
      })
    }

    //关闭窗口
    const cancel = () => {
      state.drawer = false
      state.id = null
      state.type = null
      state.loading = false
      ruleFormRef.value.resetFields()
      resetMenuTree()
    }

    //confirm
    const confirm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          // state.loading = true
          let roleData = {...state.roleRuleForm}
          roleData.menu = getCheckedKeys().toString()
          roleData.api = getApiTreeCheck().toString() || "0"
          if(state.type === "edit"){
            roleData.id = state.id
            updateRole(roleData)
          }else if(state.type === 'new'){
            addNewRole(roleData)
          }
        }
      })
    }

    //新增角色
    const addNewRole = (data)=>{
      api.user.createRole(data).then(res=>{
        state.loading = false
        if(res.data.code === 200){
          ElMessage.success(res.data.msg)
          context.emit("refresh")
          cancel()
        }
      })
    }

    //update 角色
    const updateRole = (data)=>{
      api.user.updateRole(data).then(res=>{
        state.loading = false
        if(res.data.code === 200){
          ElMessage.success(res.data.msg)
          context.emit("refresh")
          cancel()
        }
      })
    }


    //整理菜单格式为树状需要
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
        // skip some route
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

    //获取menuTree 已经勾选的
    const getCheckedKeys = () => {
      return [...menuTree.value.getCheckedKeys(),...menuTree.value.getHalfCheckedKeys()]
    }

    //获取apiTree 已经勾选的
    const getApiTreeCheck = ()=>{
      let ids = apiTree.value.getCheckedKeys()
      ids = ids.filter(v=>{
        return typeof v != "string"
      })
      return ids
    }

    //全选menuTree
    const allCheckMenu = ()=>{
      menuTree.value.setCheckedNodes(state.treeData)
    }

    //全选apiTree
    const allApiCheckMenu = ()=>{
      apiTree.value.setCheckedNodes(state.apiData)
    }

    //取消全选menuTree /清除
    const resetMenuTree = ()=>{
      menuTree.value.setCheckedKeys([])
    }

    //取消全选apiTree /清除
    const resetApiTree = ()=>{
      apiTree.value.setCheckedKeys([])
    }

    onMounted(()=>{
      getMenuList()
      getApiList()
    })


    return {
      ...toRefs(state),
      title,
      menuTree,
      ruleFormRef,
      roleRules,
      getCheckedKeys,
      open,
      cancel,
      confirm,
      onlyOneShowingChild,
      generateRoutes,
      generateRouterTitle,
      allCheckMenu,
      resetMenuTree,
      apiTree,
      getApiTreeCheck,
      resetApiTree,
      allApiCheckMenu
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 20px;
}

</style>
<style>
.roleBlockTree .el-tree-node__content {
  height: 32px;
}
</style>