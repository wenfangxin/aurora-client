<template>
  <div class="components-container">
    <el-button type="primary" @click="openEdit('new',null)" style="margin-bottom: 15px">{{
       $t('role.newRole')
      }}
    </el-button>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="role_name" align="center" :label="$t('role.roleName')" width="180"/>
      <el-table-column prop="role_key" align="center" :label="$t('role.roleKey')" width="180"/>
      <el-table-column prop="description" show-overflow-tooltip :label="$t('role.description')"/>
      <el-table-column prop="address" align="center" width="200" :label="$t('system.action')">
        <template #default="scope">
          <el-button size="mini" @click="openEdit('edit',scope.row)">{{ $t('system.edit') }}</el-button>
          <el-popconfirm
              :confirm-button-text="$t('system.ok')"
              :cancel-button-text="$t('system.cancel')"
              icon="el-icon-info"
              icon-color="red"
              :title="$t('system.deleteMsg')"
              @confirm="deleteRole(scope.row.id)"
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
    <edit-role @refresh="getRolesList" ref="editRoleComponent"></edit-role>
  </div>
</template>

<script>
import {onMounted, reactive, ref, toRefs} from "vue";
import editRole from "./components/edit-role"
import api from "@/api";
import {ElMessage} from "element-plus";

export default {
  name: "role-settings",
  components: {
    editRole
  },
  setup() {
    //editRole 组件 refs
    const editRoleComponent = ref(null)


    let state = reactive({
      loading: false,
      tableData: [],
      total: 0,
      paging: {
        page: 1,
        size: 10
      }
    })

    //打开编辑
    const openEdit = (type, data) => {
      editRoleComponent.value.open(type, data)
    }

    //获取菜单列表
    const getRolesList = () => {
      state.loading = true
      api.user.getRolesList(state.paging).then(res => {
        if (res.data.code === 200) {
          state.loading = false
          state.tableData = res.data.data.rows
          state.total = res.data.data.total
        }
      })
    }

    //删除
    const deleteRole = (id) => {
      api.user.deleteRole({id}).then(res => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          getRolesList()
        }
      })
    }

    onMounted(() => {
      getRolesList()
    })

    const handleSizeChange = (val) => {
      state.paging.page = 1
      state.paging.size = val
      getRolesList()
    }

    const handleCurrentChange = (val) => {
      state.paging.page = val
      getRolesList()
    }


    return {
      ...toRefs(state),
      editRoleComponent,
      openEdit,
      getRolesList,
      deleteRole,
      handleSizeChange,
      handleCurrentChange,
    }
  }
}
</script>

<style scoped>

</style>