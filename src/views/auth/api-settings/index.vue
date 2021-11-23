<template>
  <div class="components-container">
    <el-button type="primary"  @click="openEdit('new',null)" style="margin-bottom: 15px">{{ $t("api.addApi") }}</el-button>
    <el-popconfirm
        v-if="multipleSelection.length>0"
        :confirm-button-text="$t('system.ok')"
        :cancel-button-text="$t('system.cancel')"
        icon="el-icon-info"
        icon-color="red"
        :title="$t('system.deleteMsg')"
        @confirm="deleteRole()"
    >
      <template #reference>
        <el-button  type="danger">{{ $t('system.del') }}</el-button>
      </template>
    </el-popconfirm>
    <el-table ref="apiTable" @selection-change="handleSelectionChange" v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column align="center"  type="selection" width="55" />
      <el-table-column prop="name" align="center" show-overflow-tooltip :label="$t('api.name')" />
      <el-table-column prop="url" align="center"  show-overflow-tooltip :label="$t('api.url')" />
      <el-table-column prop="method" align="center" show-overflow-tooltip :label="$t('api.method')"/>
      <el-table-column prop="module" align="center" show-overflow-tooltip :label="$t('api.module')">
        <template #default="scope">
          {{generateRouterTitle(scope.row.module_data)}}
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" width="110" :label="$t('system.action')">
        <template #default="scope">
          <el-button size="mini" @click="openEdit('edit',scope.row)">{{ $t('system.edit') }}</el-button>
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
    <edit @refresh="getList" ref="editComponent"></edit>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, toRefs} from "vue";
import edit from "./components/edit"
import api from "@/api";
import {ElMessage} from "element-plus";

export default {
  name: "api-settings",
  components: {
    edit
  },
  setup() {
    //editRole 组件 refs
    const editComponent = ref(null)
    const generateRouterTitle = inject("generateRouterTitle")
    const apiTable = ref(null)

    let state = reactive({
      loading: false,
      tableData: [],
      multipleSelection:[],
      total: 0,
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
      api.user.getApiList(state.paging).then(res => {
        if (res.data.code === 200) {
          state.loading = false
          state.tableData = res.data.data.rows
          state.total = res.data.data.total
        }
      })
    }

    //删除
    const deleteRole = () => {
      api.user.deleteApi({ids:state.multipleSelection}).then(res => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg)
          getList()
          state.multipleSelection = []
        }
      })
    }

    onMounted(() => {
      getList()
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

   const  handleSelectionChange = (val)=> {
      let arr = []
     val.forEach(v=>{
       arr.push(v.id)
     })
     state.multipleSelection = arr
   }


    return {
      ...toRefs(state),
      editComponent,
      handleSelectionChange,
      apiTable,
      openEdit,
      getList,
      deleteRole,
      handleSizeChange,
      handleCurrentChange,
      generateRouterTitle
    }
  }
}
</script>

<style scoped>

</style>