<template>
  <div class="upload-container">
<!--    <el-button icon="el-icon-upload" size="mini" type="primary"-->
<!--               @click=" dialogVisible=true">-->
<!--      {{ $t('editor.multipleUploadBtn') }}-->
<!--    </el-button>-->
    <el-dialog v-model="dialogVisible">
      <el-upload
          :multiple="true"
          :file-list="fileList"
          :show-file-list="true"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          class="editor-slide-upload"
          list-type="picture-card"
          :data="{'token':$store.state.app.qiNiuToken}"
          :action="defaultConfig.uploadUrl"

      >
        <el-button size="small" type="primary">
          {{ $t('editor.clickUpload') }}
        </el-button>
      </el-upload>
      <div style="text-align: right">
        <el-button @click="dialogVisible = false">
          {{ $t('editor.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ $t('editor.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {computed, reactive, toRefs} from "vue";
import {ElMessage} from "element-plus";
import {defaultConfig} from "@/config";
import {useI18n} from 'vue-i18n/index'

export default {
  name: 'EditorSlideUpload',
  setup(props, context) {
    const state = reactive({
      dialogVisible: false,
      listObj: {},
      fileList: []
    })

    const i18n = useI18n()

    const checkAllSuccess = () => {
      return Object.keys(state.listObj).every(item => state.listObj[item].hasSuccess)
    }

    const checkingMsg = computed(() => {
     return  i18n.t('editor.uploadLoadingMsg')
    })

    const handleSubmit = () => {
      const arr = Object.keys(state.listObj).map(v => state.listObj[v])
      if (!checkAllSuccess()) {
        ElMessage.warning(checkingMsg.value)
        return
      }
      context.emit('successCBK', arr)
      state.listObj = {}
      state.fileList = []
      state.dialogVisible = false
    }

    const handleSuccess = (response, file) => {
      const uid = file.uid
      const objKeyArr = Object.keys(state.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (state.listObj[objKeyArr[i]].uid === uid) {
          // state.listObj[objKeyArr[i]].url = response.files.file
          state.listObj[objKeyArr[i]].url = defaultConfig.imgPrefixUrl+response.key  //上传七牛服务器后url
          state.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    }

    const handleRemove = (file) => {
      const uid = file.uid
      const objKeyArr = Object.keys(state.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (state.listObj[objKeyArr[i]].uid === uid) {
          delete state.listObj[objKeyArr[i]]
          return
        }
      }
    }

    const beforeUpload = (file) => {
      // let isLtM = file.size / 1024 / 1024 < 50;
      //
      // if (!isLtM) {
      //   ElMessage.error('上传图片大小不能超过 50MB!');
      //   return isLtM;
      // }
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      state.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function () {
          state.listObj[fileName] = {hasSuccess: false, uid: file.uid}
        }
        resolve(true)
      })
    }


    return {
      ...toRefs(state),
      defaultConfig,
      checkAllSuccess,
      handleSubmit,
      handleSuccess,
      handleRemove,
      beforeUpload
    }
  },
}
</script>
<style lang="scss">
.upload-container {
  .el-upload-list__item-preview {
    display: none !important;
  }

  .el-upload-list__item-delete {
    margin-left: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;

  :deep(.el-upload--picture-card ) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
