<template>
  <edit-drawer :loading="loading" :drawer="drawer" :size="400" :close="cancel" :confirm="confirm" :title="title">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
    >
      <el-form-item :label="$t('user.avatar')" prop="avatar">
        <imageCrop width="80px" height="80px" v-model="ruleForm.avatar"></imageCrop>
      </el-form-item>
      <el-form-item :label="$t('user.userName')" prop="user_name">
        <el-input v-model="ruleForm.user_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.number')" prop="number">
        <el-input v-model="ruleForm.number"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.phone')" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.role')" prop="role_key">
        <el-select filterable style="width: 100%" v-model="ruleForm.role_key">
          <el-option v-for="r in roleList" :key="r.role_key" :label="r.role_name" :value="r.role_key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.sex')" prop="sex">
        <el-select style="width: 100%" v-model="ruleForm.sex">
          <el-option key="1" label="男" :value="1"></el-option>
          <el-option key="2" label="女" :value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </edit-drawer>
</template>

<script>
import editDrawer from "@/components/edit-drawer"
import {computed, nextTick, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useI18n} from "vue-i18n/index"
import {useStore} from "vuex";
import imageCrop from "@/components/image-crop"
import api from "@/api";
import {ElMessage} from "element-plus";

export default {
  name: "edit",
  components: {
    editDrawer,
    imageCrop
  },
  props:["roleList"],
  emits: ["refresh"],
  setup(props, context) {
    const i18n = useI18n()
    const store = useStore()

    //ruleFormRef
    const ruleFormRef = ref(null)

    const state = reactive({
      id: null,
      drawer: false,
      loading: false,
      rolesList:[],
      type: null,                //new || edit
      ruleForm: {
        user_name: "",
        avatar: "",
        number: "",
        phone: "",
        sex:"",
        role_key: ""
      }
    })

    //表单校验规则
    const rules = computed(() => {
      return {
        user_name: [
          {
            required: true,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
        number: [
          {
            required: true,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
        phone: [
          {
            required: false,
            message: i18n.t('system.rules'),
            trigger: 'blur',
          }
        ],
        sex: [
          {
            required: true,
            message: i18n.t('system.select'),
            trigger: "change",

          }
        ],
        avatar: [
          {
            required: true,
            message: i18n.t('system.select'),
            trigger: "change",

          }
        ],
        role_key: [
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
        return i18n.t('user.addUser')
      }
      return i18n.t('user.editUser')
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
      api.user.createUser(data).then(res => {
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
      api.user.updateUser(data).then(res => {
        state.loading = false
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          context.emit("refresh")
          cancel()
        }
      })
    }

    onMounted(()=>{
    })


    return {
      ...toRefs(state),
      title,
      ruleFormRef,
      rules,
      open,
      cancel,
      confirm,
    }
  },
}
</script>

<style lang="scss" scoped>


</style>