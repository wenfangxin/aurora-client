<template>
  <el-form   label-width="80px">
    <el-form-item :label="$t('user.avatar')" prop="avatar">
      <imageCrop width="80px" height="80px" v-model="user.avatar"></imageCrop>
    </el-form-item>
    <el-form-item :label="$t('user.userName')" prop="user_name">
      <el-input v-model="user.user_name"></el-input>
    </el-form-item>
    <el-form-item :label="$t('user.phone')" prop="phone">
      <el-input v-model="user.phone"></el-input>
    </el-form-item>
    <el-form-item :label="$t('user.sex')" prop="sex">
      <el-select style="width: 100%" v-model="user.sex">
        <el-option key="1" label="男" :value="1"></el-option>
        <el-option key="2" label="女" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import imageCrop from "@/components/image-crop"
import {reactive} from "vue";

export default {
  components:{
    imageCrop
  },
  setup(){
    const user = reactive({
      user_name: '',
      phone: '',
      avatar:'',
      sex:''
    })
    return {
      user
    }
  },
  methods: {
    submit() {

    }
  }
}
</script>
