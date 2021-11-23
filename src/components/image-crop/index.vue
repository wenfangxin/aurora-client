<template>
  <div>
    <my-upload field="file"
               @crop-success="cropSuccess"
               @crop-upload-success="cropUploadSuccess"
               @crop-upload-fail="cropUploadFail"
               v-model="show"
               v-if="forceRefresh"
               :noCircle="false"
               :noSquare="false"
               :noRotate="false"
               :url="defaultConfig.uploadUrl"
               :params="{
                 token:$store.state.app.qiNiuToken,
               }"
               :headers="headers"
               :langType="lang"
               img-format="png"></my-upload>
              <div :style="{zIndex:zIndex,height:height,width:width}" class="pan-item">
              <div class="pan-info">
                <div :style="{height:height,width:width}" class="pan-info-roles-container">
                  <el-link :underline="false"  @click="toggleShow">
                    <i class="iconfont icon-dianji uploadIcon"></i>
                  </el-link>
                </div>
              </div>
              <!-- eslint-disable-next-line -->
              <div :style="{backgroundImage: `url(${imgDataUrl})`}" class="pan-thumb"></div>
            </div>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload';
import {computed, nextTick, reactive, toRefs, watch} from "vue";
import {useStore} from "vuex";
import {defaultConfig} from "@/config"

export default {
  name: "index",
  props: {
    modelValue: String,
    width: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: '150px'
    },
    zIndex: {
      type: Number,
      default: 1
    },

  },
  components: {
    myUpload,
  },
  setup(props,context) {
    const store = useStore()
    const state = reactive({
      show: false,
      imgDataUrl: props.modelValue, // the datebase64 url of created image
      headers: {
        sMail: '*_~'
      },
      params: {

      },
      forceRefresh:true
    })

    const lang = computed(()=>{
      //切换语言时候v-if 强制刷新子组件
      state.forceRefresh = false
      nextTick(()=> state.forceRefresh = true)
      return store.state.app.locale
    })

    watch(()=>state.imgDataUrl,(value)=>{
      context.emit('update:modelValue',value)
    })


    watch(()=>props.modelValue,(value)=>{
      state.imgDataUrl = value
    })

    const toggleShow = () => {
      state.show = !state.show;
    }

    const cropSuccess = (imgDataUrl, field) => {
    }

    const cropUploadSuccess = (jsonData, field) => {
      state.imgDataUrl = defaultConfig.imgPrefixUrl+jsonData.key
    }

    const cropUploadFail = (status, field) => {
      console.log('-------- upload fail --------');
      console.log('field: ' + field);
    }


    return {
      ...toRefs(state),
      toggleShow,
      cropUploadFail,
      cropSuccess,
      cropUploadSuccess,
      lang,
      defaultConfig
    }
  }
}
</script>

<style scoped>
.uploadIcon {
  font-size: 25px;
  display: block;
}
.pan-item {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.pan-info-roles-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pan-thumb {
  width: 100%;
  height: 100%;
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  transform-origin: 95% 40%;
  transition: all 0.3s ease-in-out;
}

/* .pan-thumb:after {
  content: '';
  width: 8px;
  height: 8px;
  position: absolute;
  border-radius: 50%;
  top: 40%;
  left: 95%;
  margin: -4px 0 0 -4px;
  background: radial-gradient(ellipse at center, rgba(14, 14, 14, 1) 0%, rgba(125, 126, 125, 1) 100%);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.9);
} */

.pan-info {
  position: absolute;
  width: inherit;
  height: inherit;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: inset 0 0 0 5px rgba(0, 0, 0, 0.05);
}

.pan-info h3 {
  color: #fff;
  text-transform: uppercase;
  position: relative;
  letter-spacing: 2px;
  font-size: 18px;
  margin: 0 60px;
  padding: 22px 0 0 0;
  height: 85px;
  font-family: 'Open Sans', Arial, sans-serif;
  text-shadow: 0 0 1px #fff, 0 1px 2px rgba(0, 0, 0, 0.3);
}

.pan-info p {
  color: #fff;
  padding: 10px 5px;
  font-style: italic;
  margin: 0 30px;
  font-size: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

.pan-info p a {
  display: block;
  color: #333;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  font-style: normal;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 9px;
  letter-spacing: 1px;
  padding-top: 24px;
  margin: 7px auto 0;
  font-family: 'Open Sans', Arial, sans-serif;
  opacity: 0;
  transition: transform 0.3s ease-in-out 0.2s, opacity 0.3s ease-in-out 0.2s, background 0.2s linear 0s;
  transform: translateX(60px) rotate(90deg);
}

.pan-info p a:hover {
  background: rgba(255, 255, 255, 0.5);
}

.pan-item:hover .pan-thumb {
  transform: rotate(-110deg);
}

.pan-item:hover .pan-info p a {
  opacity: 1;
  transform: translateX(0px) rotate(0deg);
}
</style>