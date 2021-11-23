<template>
  <edit-drawer :loading="loading" :drawer="drawer" :size="400" :close="cancel" :confirm="confirm" :title="title">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
    >
      <el-form-item :label="$t('api.name')" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('api.url')" prop="url">
        <el-input v-model="ruleForm.url"></el-input>
      </el-form-item>
      <el-form-item :label="$t('api.method')" prop="method">
        <el-select filterable style="width: 100%" v-model="ruleForm.method">
          <el-option key="POST" label="POST" value="POST"></el-option>
          <el-option key="GET" label="GET" value="GET"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('api.module')" prop="module">
        <el-select style="width: 100%" v-model="ruleForm.module">
          <el-option v-for="m in SelectMenuData" :key="m.id" :label="m.title" :value="m.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </edit-drawer>
</template>

<script>
import editDrawer from "@/components/edit-drawer"
import {computed, inject, nextTick, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useI18n} from "vue-i18n/index"
import {useStore} from "vuex";
import imageCrop from "@/components/image-crop"
import api from "@/api";
import path from "path";
import {filterRouterFormat} from "@/route/setRoute";
import {ElMessage} from "element-plus";

export default {
  name: "edit",
  components: {
    editDrawer,
    imageCrop
  },
  emits: ["refresh"],
  setup(props, context) {
    const i18n = useI18n()
    const store = useStore()
    const generateRouterTitle = inject('generateRouterTitle')

    //ruleFormRef
    const ruleFormRef = ref(null)

    const state = reactive({
      id: null,
      menuData: [],
      drawer: false,
      loading: false,
      rolesList: [],
      type: null,                //new || edit
      ruleForm: {
        name: "",
        url: "",
        module: "",
        method: "",
      }
    })

    //表单校验规则
    const rules = computed(() => {
      return {
        name: [
          {
            required: true,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
        url: [
          {
            required: true,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
        method: [
          {
            required: true,
            message: i18n.t('system.select'),
            trigger: "change",

          }
        ],
        module: [
          {
            required: true,
            message: i18n.t('system.select'),
            trigger: "change",

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
        return i18n.t('api.addApi')
      }
      return i18n.t('api.editApi')
    })


    //打开窗口
    const open = (type, data) => {
      state.drawer = true
      state.type = type
      if (type === 'new') {
        state.id = null
        return
      }
      nextTick(() => {
        for (const key in state.ruleForm) {
          state.ruleForm[key] = data[key]
        }
        state.id = data.id
      })
    }

    //关闭窗口
    const cancel = () => {
      state.id = null
      state.type = null
      state.loading = false
      ruleFormRef.value.resetFields()
      state.drawer = false
    }


    //confirm
    const confirm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          state.loading = true
          let data = {...state.ruleForm}
          if (state.type === "edit") {
            data.id = state.id
            update(data)
          } else if (state.type === 'new') {
            addNew(data)
          }
        }
      })
    }

    //新增
    const addNew = (data) => {
      api.user.createApi(data).then(res => {
        state.loading = false
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          context.emit("refresh")
          cancel()
        }
      })
    }

    //update
    const update = (data) => {
      api.user.updateApi(data).then(res => {
        state.loading = false
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          context.emit("refresh")
          cancel()
        }
      })
    }

    const filterMenuData = (routes, basePath = '/', prefixTitle = []) => {
      let res = []
      for (const router of routes) {
        // skip hidden router
        if (router.hidden) {
          continue
        }

        let data = {
          path: path.resolve(basePath, router.path),
          id: router.id
        }
        if (!router.nested) {
          if (router.meta && router.meta.title) {
            data.title = generateRouterTitle(router.meta)
          }
          if (router.children[0]) {
            data.title = generateRouterTitle(router.children[0].meta)
          }
          res.push(data)
        }

        // recursive child routes
        if (router.children && router.nested) {
          const tempRoutes = filterMenuData(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }


    const getMenuList = () => {
      api.user.getMenuList().then(res => {
        state.menuData = filterRouterFormat(res.data.data)
      })
    }

    const SelectMenuData = computed(()=>{
      return filterMenuData(state.menuData)
    })


    onMounted(() => {
      getMenuList()
    })


    return {
      ...toRefs(state),
      SelectMenuData,
      title,
      ruleFormRef,
      rules,
      open,
      cancel,
      confirm,
      filterMenuData
    }
  },
}
</script>

<style lang="scss" scoped>


</style>