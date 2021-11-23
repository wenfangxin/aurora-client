<template>
  <div class="components-container">
    <div class="search-form">
      <el-form label-position="right" ref="searchFormRef" :inline="true" label-width="80px" :model="searchForm"
               class="demo-form-inline">
        <div style="display: flex;align-items: center;flex-wrap: wrap">
          <el-form-item :label="$t('user.userName')" prop="user_name">
            <el-input class="form-item-width" v-model="searchForm.user_name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.number')" prop="number">
            <el-input class="form-item-width" v-model="searchForm.number"></el-input>
          </el-form-item>
          <el-form-item v-if="openExpend" :label="$t('user.phone')" prop="phone">
            <el-input class="form-item-width" v-model="searchForm.phone"></el-input>
          </el-form-item>
          <el-form-item v-if="openExpend" :label="$t('user.role')" prop="role_key">
            <el-select clearable filterable class="form-item-width" v-model="searchForm.role_key">
              <el-option v-for="r in rolesList" :key="r.role_key" :label="r.role_name"
                         :value="r.role_key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="openExpend" :label="$t('user.state')" prop="state">
            <el-select clearable class="form-item-width" v-model="searchForm.state">
              <el-option key="2" :label="$t('user.all')" :value="2"></el-option>
              <el-option key="1" :label="$t('user.enable')" :value="1"></el-option>
              <el-option key="0" :label="$t('user.disable')" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <div class="form-item-width">
              <el-button @click="search" type="primary">{{ $t("system.search") }}</el-button>
              <el-button @click="reset">{{ $t("system.reset") }}</el-button>
              <a class="expendShrink" :style="{'color':$store.state.app.theme}" v-if="!openExpend" @click="closeOpen">
                <span> {{ $t("system.expend") }}</span>
                <i class="iconfont icon-xiangxia"></i>
              </a>
              <a class="expendShrink" :style="{'color':$store.state.app.theme}" v-if="openExpend" @click="closeOpen">
                <span>{{ $t("system.shrink") }}</span>
                <i class="iconfont icon-xiangshang"></i>
              </a>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-button type="primary" @click="openEdit('new',null)" style="margin-bottom: 15px">{{ $t('user.addUser') }}
    </el-button>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="user_name" show-overflow-tooltip align="center" min-width="140"
                       :label="$t('user.userName')">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: left;padding-left: 10px">
            <el-avatar style="margin-right:5px" shape="square" :size="32" :src="scope.row.avatar"></el-avatar>
            <div>{{ scope.row.user_name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="number" show-overflow-tooltip align="center" min-width="140" :label="$t('user.number')"/>
      <el-table-column prop="phone" show-overflow-tooltip align="center" min-width="140" :label="$t('user.phone')"/>
      <el-table-column prop="role_data.role_name" show-overflow-tooltip align="center" min-width="140"
                       :label="$t('user.role')">
        <template #default="scope">
          <div>
            <el-tag effect="plain">{{ scope.row.role_data.role_name }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sex" show-overflow-tooltip align="center" min-width="100" :label="$t('user.sex')">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.sex == 1" type="success">男</el-tag>
            <el-tag v-if="scope.row.sex == 2" type="danger">女</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="state" show-overflow-tooltip align="center" min-width="140" :label="$t('user.state')">
        <template #default="scope">
          <div>
            <el-tag effect="dark" v-if="scope.row.state == 1">{{ $t('user.enable') }}</el-tag>
            <el-tag effect="dark" v-if="scope.row.state == 0" type="danger">{{ $t('user.disable') }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" show-overflow-tooltip align="center" min-width="160"
                       :label="$t('user.createTime')"/>
      <el-table-column prop="address" fixed="right" align="center" width="240" :label="$t('system.action')">
        <template #default="scope">
          <el-button size="mini" @click="openEdit('edit',scope.row)">{{ $t('system.edit') }}</el-button>
          <el-button type="warning" @click="updateUserSate(0,scope.row.id)" size="mini" v-if="scope.row.state == 1">
            {{ $t('user.disable') }}
          </el-button>
          <el-button type="primary" size="mini" @click="updateUserSate(1,scope.row.id)" v-if="scope.row.state == 0">
            {{ $t('user.enable') }}
          </el-button>
          <el-popconfirm
              :confirm-button-text="$t('system.ok')"
              :cancel-button-text="$t('system.cancel')"
              icon="el-icon-info"
              icon-color="red"
              :title="$t('system.deleteMsg')"
              @confirm="deleteData(scope.row.id)"
          >
            <template #reference>
              <el-button size="mini" type="danger">{{ $t('system.del') }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 15px;text-align: right">
      <el-pagination
          v-model:currentPage="paging.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="paging.size"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <edit-role :roleList="rolesList" @refresh="reset" ref="editComponent"></edit-role>
  </div>
</template>

<script>
import {nextTick, onMounted, reactive, ref, toRefs} from "vue";
import editRole from "./components/edit"
import api from "@/api";
import {ElMessage} from "element-plus";

export default {
  name: "user-settings",
  components: {
    editRole
  },
  setup() {
    //edit 组件 refs
    const editComponent = ref(null)

    const searchFormRef = ref(null)

    const searchForm = reactive({
      user_name: "",
      number: "",
      phone: "",
      state: 2,
      role_key: ""
    })

    let state = reactive({
      loading: false,
      tableData: [],
      total: 0,
      openExpend: false,
      rolesList: [],
      paging: {
        page: 1,
        size: 10
      }
    })

    //打开编辑
    const openEdit = (type, data) => {
      editComponent.value.open(type, data)
    }

    //获取列表
    const getList = () => {
      state.loading = true
      let data = JSON.parse(JSON.stringify(searchForm))
      data.page = state.paging.page
      data.size = state.paging.size
      api.user.queryUser(data).then(res => {
        if (res.data.code === 200) {
          state.loading = false
          state.tableData = res.data.data.rows
          state.total = res.data.data.total
        }
      })
    }

    //获取角色list
    const getRoleList = () => {
      api.user.getRolesList({page: 1, size: 1000}).then(res => {
        if (res.data.code === 200) {
          state.rolesList = res.data.data.rows
        }
      })
    }

    //修改用户状态
    const updateUserSate = (state, id) => {
      let data = {
        state,
        id
      }
      api.user.updateUserState(data).then(res => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          getList()
        }
      })
    }

    //删除
    const deleteData = (id) => {
      api.user.deleteUser({id}).then(res => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          getList()
        }
      })
    }

    //search
    const search = () => {
      state.paging.page = 1
      getList()
    }

    //resetSearch
    const reset = () => {
      searchFormRef.value.resetFields()
      nextTick(() => search())
    }

    //展开收起搜索框
    const closeOpen = () => {
      state.openExpend = !state.openExpend;
    }

    onMounted(() => {
      getList()
      getRoleList()
    })

    const handleSizeChange = (val) => {
      state.paging.page = 1
      state.paging.size = val
      getList()
    }

    const handleCurrentChange = (val) => {
      state.paging.page = val
      getList()
    }


    return {
      ...toRefs(state),
      searchForm,
      editComponent,
      searchFormRef,
      search,
      reset,
      openEdit,
      getList,
      deleteData,
      handleSizeChange,
      handleCurrentChange,
      updateUserSate,
      closeOpen
    }
  }
}
</script>

<style lang="scss" scoped>

.form-item-width {
  width: 208px;
}

.search-form .el-form-item {
  margin-right: 28px;
}

.expendShrink {
  font-size: 13px;
  margin-left: 12px;
  cursor: pointer;

  i {
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>