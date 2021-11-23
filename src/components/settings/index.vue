<template>
  <div class="drawer-container">
    <div>
      <div class="drawer-item">
        <span>{{ $t('settings.themeColor') }}</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.open') }} Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch"/>
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.fixed') }} Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch"/>
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.sidebar') }} Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch"/>
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.refresh') }}</span>
        <el-switch v-model="pageRefresh" class="drawer-switch"/>
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.uniqueOpened') }}</span>
        <el-switch v-model="uniqueOpened" class="drawer-switch"/>
      </div>

    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/theme-picker'

import {computed} from "vue";
import store from '@/store'

export default {
  components: { ThemePicker },
  setup() {
    const fixedHeader = computed({
      get() {
        return store.state.app.fixedHeader
      },
      set(val) {
        store.dispatch('app/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    })

    const sidebarLogo = computed({
      get() {
        return store.state.app.sidebarLogo
      },
      set(val) {
        store.dispatch('app/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    })

    const pageRefresh = computed({
      get() {
        return store.state.app.pageRefresh
      },
      set(val) {
        store.dispatch('app/changeSetting', {
          key: 'pageRefresh',
          value: val
        })
      }
    })

    const uniqueOpened = computed({
      get() {
        return store.state.app.uniqueOpened
      },
      set(val) {
        store.dispatch('app/changeSetting', {
          key: 'uniqueOpened',
          value: val
        })
      }
    })

    const tagsView = computed({
      get() {
        return store.state.app.tagsView
      },
      set(val) {
        store.dispatch('app/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    })

    const themeChange = (val) => {
      store.dispatch('app/changeSetting', {
        key: 'theme',
        value: val
      })
    }


    return {
      fixedHeader,
      tagsView,
      sidebarLogo,
      themeChange,
      pageRefresh,
      uniqueOpened,
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
