<template>
  <div class="components-container">
    <aside>黄河尚有澄清日，岂能人无得运时？ 得宠思辱，居安思危。 念念有如临敌日，心心常似过桥时。 英雄行险道，富贵似花枝。 人情莫道春光好，只怕秋来有冷时。</aside>
    <tinymce v-model="editValue"></tinymce>
    <div v-html="editValue"></div>
  </div>
</template>

<script>
import tinymce from '@/components/tinymce'
import {onMounted, reactive, ref, toRefs} from "vue";
export default {
  name: "editor",
  components:{
    tinymce
  },
  setup(){

    const state = reactive({
      editValue:"<h2 style=\"text-align: justify;\"><span style=\"font-size: 16px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;雨霖铃&middot;秋别</span></h2> <p style=\"text-align: left;\"><span style=\"font-size: 16px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span style=\"font-size: 14px;\">柳永 &lt;宋&gt;</span></span></p> <div id=\"contson4d795944b856\" class=\"contson\" style=\"padding-left: 40px; text-align: left;\">寒蝉凄切，对长亭晚，骤雨初歇。</div> <div class=\"contson\" style=\"padding-left: 40px; text-align: left;\">都门帐饮无绪，留恋处，兰舟催发。</div> <div class=\"contson\" style=\"padding-left: 40px; text-align: left;\">执手相看泪眼，竟无语凝噎。</div> <div class=\"contson\" style=\"padding-left: 40px; text-align: left;\">念去去，千里烟波，暮霭沉沉楚天阔。<br />多情自古伤离别，更那堪，冷落清秋节！</div> <div class=\"contson\" style=\"padding-left: 40px; text-align: left;\">今宵酒醒何处？杨柳岸，晓风残月。</div> <div class=\"contson\" style=\"padding-left: 40px; text-align: left;\">此去经年，应是良辰好景虚设。便纵有千种风情，更与何人说？</div>"
    })

    return {
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>

</style>