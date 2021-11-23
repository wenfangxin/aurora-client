<template>
  <div class="ns">
    <div class="textBox">
      <p>那一年我21岁，在我一生的黄金时代。我有好多奢望。我想爱，想吃，还想瞬间变成天上半明半暗的云。</p>
      <p>后来我才知道，生活就是一个缓慢受捶的过程，人一天天老下去，奢望也一天天消逝，最后变得像挨了捶的牛一样。可是我过21岁生日的时候没有遇见这一点。我觉得自己会永远生猛下去，什么也捶不了我。</p>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import {Aim, Edit} from "@element-plus/icons";

export default {
  name: "home",
  components: {
    Edit,
    Aim
  },
  setup() {
    return {
      value1: ref(new Date()),
    }
  }
}
</script>

<style lang="scss" scoped>
.ns {
  color: #5a5a5a;
  height: 100%;
  background: #f0f2f5;
  padding: 25px 30px;
  box-sizing: border-box;
  font-family: cursive;
  display: flex;
  justify-content: center;
  .textBox{
    width: 500px;
    p{
      text-indent: 2em;
      line-height: 30px;
    }
  }
}
</style>