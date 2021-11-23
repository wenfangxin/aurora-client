<template>
  <el-drawer
      v-model="drawer"
      :destroy-on-close="true"
      :with-header="withHeader"
      :title="title"
      :close-on-click-modal="true"
      :direction="direction"
      :before-close="close"
      :size="size"
      modal-class="edit-drawer"
  >
    <slot/>
    <div class="drawer-footer">
      <el-button @click="close">{{$t('menuSettings.cancel')}}</el-button>
      <el-button :loading="loading" @click="confirm" type="primary">{{$t('menuSettings.confirm')}}</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "index",
  props: {
    drawer: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'title'
    },
    size: {
      type: Number || String,
      default: 400
    },
    withHeader: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    close: {
      type: Function,
      default: () => {
      }
    },
    confirm: {
      type: Function,
      default: function () {
      }
    }
  },
  setup(props, context) {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.drawer-footer {
  text-align: right;
  padding: 10px 20px;
  border-top: 1px solid #d8d8d9;
  position: absolute;
  left: 0;
  width: 100%;
  background: white;
  bottom: 0;
  z-index: 1;
}
</style>
<style>
.edit-drawer .el-drawer__body{
  padding-bottom: 53px;
  overflow-y: scroll;
}
</style>