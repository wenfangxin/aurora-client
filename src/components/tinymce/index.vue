<template>
  <div class="tinymce-container">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
    <div class="editor-custom-btn-container">
      <editorImage ref="editorImage"  class="editor-upload-btn" @successCBK="imageSuccessCBK"/>
    </div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import load from './dynamicLoadScript'
import editorImage from './components/EditorImage'
import {defaultConfig} from "@/config";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {useI18n} from 'vue-i18n/index'
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce@5.10.0/tinymce.min.js'
const zhLange = 'https://cdn.jsdelivr.net/npm/tinymce-lang/langs/zh_CN.js'
import api from "@/api"
export default {
  props: {
    modelValue: String,
    maxHeight: {
      type: [Number, String],
      required: false,
      default: 500
    },
    minHeight: {
      type: [Number, String],
      required: false,
      default: 350
    }
  },
  emits: {"update:modelValue": null},
  components: {
    editorImage
  },
  setup(props, context) {
    const i18n = useI18n()
    const store = useStore()
    const editorImage = ref(null)
    const tinymceId = 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    let hasChange = ref(false)
    let hasInit = ref(false)
    const languageTypeList = {
      'en': 'en',
      'zh': 'zh_CN',
      'es': 'es_MX',
      'ja': 'ja'
    }

    const languageUrlList = {
      'zh': zhLange,
    }

    let tinymceLanguage = computed(() => {
      return languageTypeList[store.state.app.locale]
    })

    let tinymceLangUrl = computed(() => {
      return languageUrlList[store.state.app.locale]
    })

    const multipleUploadBtnMsg = computed(()=>{
      return i18n.t('editor.multipleUploadBtn')
    })


    const init = {
      selector: `#${tinymceId}`,
      language: tinymceLanguage.value,
      language_url: tinymceLangUrl.value, // 中文语言包路径
      menubar: true, // 菜单栏
      autoresize_bottom_margin: 50,
      default_link_target: '_blank',
      max_height: props.maxHeight,
      min_height: props.minHeight,
      branding: false,
      resize: true, // 改变大小
      statusbar: true, // 底部状态栏
      toolbar_mode: "none",
      plugins:
          "wordcount codesample visualchars visualblocks textpattern template tabfocus  searchreplace  quickbars print preview paste pagebreak noneditable nonbreaking media insertdatetime importcss image hr help fullscreen  directionality code charmap link code table lists advlist anchor autolink autoresize autosave", // 插件需要import进来
      toolbar1:
          "formats undo redo paste print | fontsizeselect |fontselect| wordcount ltr rtl visualchars visualblocks spellchecker |searchreplace  preview pagebreak nonbreaking  media multipleUpload image| code codesample anchor preview fullscreen help ",
      toolbar2: "outdent indent aligncenter alignleft alignright alignjustify lineheight underline quicklink h2 h3 blockquote numlist bullist table removeformat forecolor backcolor bold italic  strikethrough hr charmap link insertdatetime subscript superscript cut ",
      content_style: `
            p {margin: 5px 0; font-size: 14px}
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%;height:auto; }
            a                         { text-decoration: none; }
            video                      {max-height:100%;}
            iframe                    { max-width: 100%; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
      `,
      fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
      font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",

      init_instance_callback: editor => {
        if (props.modelValue) {
          editor.setContent(props.modelValue)
        }
        hasInit = true
        editor.on('NodeChange Change KeyUp SetContent', () => {
          hasChange = true
          context.emit('update:modelValue', editor.getContent())
        })
      },
      setup:(editor)=>{
        //自定义按钮 打开多选图片功能
        editor.ui.registry.addButton('multipleUpload', {
          tooltip:multipleUploadBtnMsg.value,
          icon:'gallery',
          onAction:()=>{
            editorImage.value.dialogVisible = true
            editor.execCommand('', false, ''); //按钮失去选中色
          }
        });
      },
      //   图片上传
      // images_upload_handler: function (blobInfo, success) {
      //   var reader = new FileReader();
      //   reader.readAsDataURL(blobInfo.blob());
      //   reader.onload = function () {
      //     success(this.result);
      //   };
      // },
      //七牛上传服务端
      images_upload_handler: (blobInfo, success, failure) => {
        let blobData = new FormData();
        blobData.append('file', blobInfo.blob())
        blobData.append('token', store.state.app.qiNiuToken)
        api.app.upload(blobData)
            .then(res=>{
              if(res.data.key){
                success( defaultConfig.imgPrefixUrl + res.data.key)
              } else {
                failure("Upload error")
              }
            })
            .catch(()=>{
              failure("Upload error")
            })
      },

    }

    let content = ref(props.modelValue)
    watch(()=>content, (val) => {
      if (!hasChange && hasInit) {
        nextTick(() => window.tinymce.get(tinymceId).setContent(val || ''))
      }
    })

    watch(tinymceLanguage, (value) => {
      init.language = tinymceLanguage.value
      init.language_url = tinymceLangUrl.value
      destroyTinymce()
      nextTick(() => initTinymce())
    })


    const initLoad = () => {
      load(tinymceCDN, (err) => {
        if (err) {
          ElMessage.error(err.message)
          return
        }
        initTinymce()
      })
    }

    const initTinymce = () => {
      window.tinymce.init(init)
    }

    const destroyTinymce = () => {
      const tinymce = window.tinymce.get(tinymceId)
      if (tinymce) {
        tinymce.destroy()
      }
    }

    const setContent = (value) => {
      window.tinymce.get(tinymceId).setContent(value)
    }

    const getContent = () => {
      window.tinymce.get(tinymceId).getContent()
    }

    const imageSuccessCBK = (arr) => {
      arr.forEach(v => window.tinymce.get(tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`))
    }

    onMounted(() => {
      initLoad()
    })


    return {
      init,
      tinymceId,
      getContent,
      tinymceLanguage,
      setContent,
      imageSuccessCBK,
      initTinymce,
      destroyTinymce,
      hasInit,
      hasChange,
      initLoad,
      editorImage
    }

  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
};
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  :deep(.mce-fullscreen ) {
    z-index: 10000;
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-upload-btn {
  display: inline-block;
}
</style>