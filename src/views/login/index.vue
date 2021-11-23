<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="formValue" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h3 class="title">{{ $t('login.loginTitle') }}</h3>
      </div>
      <div class="languageBtnBox">
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
      <el-form-item prop="number">
        <span class="svg-container">
          <i class="iconfont icon-user"></i>
        </span>
        <el-input
            ref="username"
            v-model="formValue.number"
            :placeholder="$t('login.userName')"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="iconfont icon-mima"></i>
        </span>
        <el-input
            :key="passwordType"
            ref="password"
            v-model="formValue.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="login"
        />
        <span class="show-pwd" @click="showPwd">
          <i class="iconfont" :class="passwordType === 'password' ? 'icon-Group-' : 'icon-chakan'"></i>
        </span>
      </el-form-item>
      <el-button :loading="loading" size="medium" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="login">
        {{ $t('login.login') }}
      </el-button>
      <div style="color: white;font-size: 12px">
        <p>进入系统后，用户列表里的账号都可以登录，密码均为123456</p>
        <p>账号: lvbu、machao、guanyu</p>
        <p>密码: 123456</p>
      </div>
    </el-form>
  </div>
</template>
<script>
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import {computed, nextTick, reactive, ref, toRefs} from "vue";
import {useI18n} from 'vue-i18n/index'
import {setAsyncRoutes} from "@/route/setRoute";
import {useRouter} from "vue-router";

export default {
  name: "login",
  setup() {
    const store = useStore()
    const router = useRouter()
    const i18n = useI18n()

    const password = ref(null)
    const loginForm = ref(null)

    const state = reactive({
      loading: false,
      passwordType: 'password',
    })

    const formValue = reactive({
      number: '',
      password: ''
    })

    const loginRules = computed(() => {
      return {
        number: [{required: true, trigger: 'blur', message: i18n.t('login.checkUserName')}],
        password: [{required: true, trigger: 'blur', message: i18n.t('login.checkPassword')}]
      }
    })

    //当前的语言
    const locale = computed(() => {
      return store.state.app.locale
    })

    //语言切换成功消息提示
    const checkLanguageMessage = computed(() => {
      return i18n.t('topMenu.checkLanguageMessage')
    })

    //切换语言
    const changeLang = (key) => {
      store.dispatch('app/changeLanguage', key)
      ElMessage({
        type: "success",
        message: checkLanguageMessage.value
      })
    }

    //切换密码形态
    const showPwd = () => {
      if (state.passwordType === 'password') {
        state.passwordType = ''
      } else {
        state.passwordType = 'password'
      }
      nextTick(() => {
        password.value.focus()
      })
    }

    //登录
    const login = () => {
      loginForm.value.validate(async (valid) => {
        state.loading = true
        if (valid) {
          let res = await store.dispatch('user/userLogin', formValue)
          state.loading = false;
          if(res.code !== 200) return
          await setAsyncRoutes()
          await router.push({
            path: '/'
          })
        } else {
          state.loading = false;
          return false;
        }
      });
    }

    return {
      ...toRefs(state),
      password,
      loginForm,
      formValue,
      loginRules,
      locale,
      changeLang,
      showPwd,
      login
    }

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.languageBtnBox {
  position: absolute;
  right: 40px;
  top: 200px;

  i {
    color: white;
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 35px;
  }

  .el-form-item__error {
    padding-top: 10px !important;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    box-sizing: border-box;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 2px 10px 2px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    box-sizing: border-box;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
