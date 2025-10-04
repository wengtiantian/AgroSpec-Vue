<template>
  <!-- 导入表 -->
  <el-dialog title="导入表" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button type="success" @click="loadAllTables">加载所有表</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <div class="table-info" style="margin-bottom: 10px; color: #606266; font-size: 14px;">
        共找到 <strong>{{ total }}</strong> 张表，已选择 <strong>{{ tables.length }}</strong> 张表
      </div>
      <el-table @row-click="clickRow" ref="table" :data="dbTableList" @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="表名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="tableComment" label="表描述" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page="queryParams.pageNum"
        :limit="queryParams.pageSize"
        :page-sizes="[50, 100, 200, 500]"
        @pagination="handlePagination"
      />
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleImportTable">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { listDbTable, importTable } from "@/api/tool/gen";

const total = ref(0);
const visible = ref(false);
const tables = ref([]);
const dbTableList = ref([]);
const { proxy } = getCurrentInstance();

const queryParams = reactive({
  pageNum: 1,
  pageSize: 50, // 设置足够大的分页大小以显示所有可导入表
  tableName: undefined,
  tableComment: undefined
});

const emit = defineEmits(["ok"]);

/** 查询参数列表 */
function show() {
  // 强制设置分页大小以确保显示所有表
  queryParams.pageNum = 1;
  queryParams.pageSize = 100;
  queryParams.tableName = undefined;
  queryParams.tableComment = undefined;
  
  console.log('打开导入表对话框，参数:', queryParams);
  getList();
  visible.value = true;
}
/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  tables.value = selection.map(item => item.tableName);
}
/** 查询表数据 */
function getList() {
  // 确保参数正确
  const params = {
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,
    tableName: queryParams.tableName,
    tableComment: queryParams.tableComment
  };
  
  console.log('查询数据库表列表，参数:', params);
  
  listDbTable(params).then(res => {
    console.log('数据库表列表响应:', res);
    console.log(`表总数: ${res.total}, 当前页: ${res.rows ? res.rows.length : 0}`);
    
    dbTableList.value = res.rows || [];
    total.value = res.total || 0;
  }).catch(error => {
    console.error('查询数据库表列表失败:', error);
    proxy.$modal.msgError('查询数据库表列表失败: ' + (error.message || '未知错误'));
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 加载所有表 */
function loadAllTables() {
  console.log('加载所有表...');
  queryParams.pageNum = 1;
  queryParams.pageSize = 100; // 设置足够大的分页大小以获取所有表
  queryParams.tableName = undefined;
  queryParams.tableComment = undefined;
  getList();
}

/** 分页变化处理 */
function handlePagination(pagination) {
  console.log('分页变化:', pagination);
  queryParams.pageNum = pagination.page;
  queryParams.pageSize = pagination.limit;
  getList();
}

/** 导入按钮操作 */
function handleImportTable() {
  const tableNames = tables.value.join(",");
  if (tableNames == "") {
    proxy.$modal.msgError("请选择要导入的表");
    return;
  }
  importTable({ tables: tableNames }).then(res => {
    proxy.$modal.msgSuccess(res.msg);
    if (res.code === 200) {
      visible.value = false;
      emit("ok");
    }
  });
}

defineExpose({
  show,
});
</script>
