<template>
  <el-card style="margin-bottom:20px;">
    <template #header class="clearfix">
      <span>About me</span>
    </template>

    <div class="user-profile">
      <div class="box-center">
        <el-avatar :size="100" :src="user.avatar"></el-avatar>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.user_name }}</div>
        <div class="user-role text-center text-muted">
          <el-tag>{{ user.role_key }}</el-tag> </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><span>Education</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            JS in Computer Science from the University of Technology
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="80" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="80" />
          </div>
          <div class="progress-item">
            <span>Golang</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="70"  />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  setup(){
    const store = useStore()
    const user = computed(()=>{
      return store.state.user.userInfoData
    })

    return{
      user
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}
.text-center{
  text-align: center;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
