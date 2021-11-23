<template>
  <editDrawer :drawer="drawer" :size="500" :title="drawerTitle" :loading="loading" :close="closeDrawer"
              :confirm="confirm">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="105px"
        class="demo-ruleForm"
    >
      <el-form-item :label="$t('menuSettings.nested')" prop="nested">
        <el-switch v-model="ruleForm.nested"></el-switch>
      </el-form-item>
      <p class="tip">{{$t('menuSettings.tip') }}</p>
      <el-form-item :label="$t('menuSettings.path')" prop="path">
        <el-input v-model="ruleForm.path"></el-input>
      </el-form-item>
      <el-form-item :label="$t('menuSettings.component')" prop="component">
        <el-input v-model="ruleForm.component"></el-input>
      </el-form-item>
      <p class="tip">{{ $t('menuSettings.addSingleMenuMsg') }}</p>
      <el-form-item :label="$t('menuSettings.redirect')" prop="redirect">
        <el-input v-model="ruleForm.redirect"></el-input>
      </el-form-item>
      <el-form-item :label="$t('menuSettings.name')" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('menuSettings.routeTitle')" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item :label="$t('menuSettings.enTitle')" prop="en_title">
        <el-input v-model="ruleForm.en_title"></el-input>
      </el-form-item>
      <el-form-item :label="$t('menuSettings.icon')" prop="icon">
        <el-input v-model="ruleForm.icon"></el-input>
      </el-form-item>
      <p class="tip">{{$t('menuSettings.orderNumberTip') }}</p>
      <el-form-item :label="$t('menuSettings.orderNumber')" prop="order_number">
        <el-input-number v-model="ruleForm.order_number"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('menuSettings.affix')" prop="affix">
        <el-switch v-model="ruleForm.affix"></el-switch>
      </el-form-item>
      <p class="tip">{{$t('menuSettings.keepTip') }}</p>
      <el-form-item :label="$t('menuSettings.keep')" prop="keep">
        <el-switch v-model="ruleForm.keep"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('menuSettings.hidden')" prop="hidden">
        <el-switch v-model="ruleForm.hidden"></el-switch>
      </el-form-item>

    </el-form>
  </editDrawer>
</template>

<script>
import editDrawer from '@/components/edit-drawer'
import {computed, nextTick, reactive, ref, toRefs, watch} from "vue";
import {useI18n} from 'vue-i18n/index'
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

export default {
  name: "edit-drawer",
  components: {
    editDrawer
  },
  emits: ["addMenu", "updateMenu"],
  setup(props, context) {
    const i18n = useI18n()
    const store = useStore()
    const state = reactive({
      drawer: false,
      addMenuTitle: 'Title',
      id: null,
      loading: false,
      type: "",
      ruleForm: {
        path: '',
        component: '',
        redirect: '',
        nested: false,
        name: '',
        title: '',
        en_title: '',
        affix: false,
        order_number: 0,
        icon: '',
        keep: false,
        hidden:false
      }
    })

    const typeList = ['addNested', 'edit', 'add']

    //抽屉title
    const drawerTitle = computed(() => {
      return state.addMenuTitle
    })


    //表单
    const ruleFormRef = ref(null)

    //表单校验规则
    const rules = computed(() => {
      return {
        path: [
          {
            required: true,
            message: i18n.t('menuSettings.rules'),
            trigger: 'blur',
          }
        ],
        component: [
          {
            required: true,
            message: i18n.t('menuSettings.rules'),
            trigger: 'blur',
          }
        ],
        title: [
          {
            required: true,
            message: i18n.t('menuSettings.rules'),
            trigger: 'blur',
          }
        ],
        en_title: [
          {
            required: true,
            message: i18n.t('menuSettings.rules'),
            trigger: 'blur',
          }
        ],
        redirect: [
          {
            required: false,
            message: i18n.t('menuSettings.rules'),
            trigger: 'blur',
          }
        ],
        icon: [
          {
            required: false,
            message: i18n.t('menuSettings.rules'),
            trigger: 'blur',
          }
        ],
        name: [
          {
            required: true,
            message: i18n.t('menuSettings.rules'),
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

    //打开方法
    const open = (title, id, type) => {
      state.addMenuTitle = title
      state.id = id
      state.type = type
      state.drawer = true
    }

    //打开编辑 赋值form
    const openEditValue = (title, id, type, data) => {
      open(title, id, type)
      let menu = JSON.parse(JSON.stringify(data))
      nextTick(() => {
        for (const key in state.ruleForm) {
          state.ruleForm[key] = menu[key]
        }
      })
    }

    //关闭
    const closeDrawer = () => {
      state.id = null
      state.type = ""
      state.loading = false
      ruleFormRef.value.resetFields()
      state.drawer = false
    }

    const misParamsMsg = computed(() => {
      return i18n.t('system.misParams')
    })

    //确认提交
    const confirm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          state.loading = true
          let menuData = JSON.parse(JSON.stringify(state.ruleForm))
          if (state.type === "") {
            ElMessage.warning(misParamsMsg.value)
            state.loading = false
            return
          }
          if (state.type === 'add') {
            context.emit("addMenu", menuData)
          } else if (state.type === 'addNested') {
            menuData.parent_id = state.id
            context.emit("addMenu", menuData)
          } else if (state.type === 'edit') {
            menuData.id = state.id
            context.emit("updateMenu", menuData)
          }
        } else {
          return false
        }
      })
    }

    return {
      ...toRefs(state),
      drawerTitle,
      rules,
      ruleFormRef,
      closeDrawer,
      confirm,
      open,
      openEditValue
    }


  }
}
</script>

<style scoped>
.tip {
  margin: 0 0 10px 100px;
  font-size: 12px;
  color: #919191;
}

</style>