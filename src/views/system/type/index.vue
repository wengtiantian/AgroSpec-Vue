<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="图标路径" prop="icon">
        <el-input v-model="queryParams.icon" placeholder="请输入图标路径" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="父级ID" prop="pid">
        <el-input v-model="queryParams.pid" placeholder="请输入父级ID" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="排序字段，用于控制显示顺序" prop="sorting">
        <el-input v-model="queryParams.sorting" placeholder="请输入排序字段，用于控制显示顺序" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="是否启用，0表示禁用，1表示启用" prop="isActive">
        <el-input v-model="queryParams.isActive" placeholder="请输入是否启用，0表示禁用，1表示启用" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="类型路径1,2,3" prop="typePath">
        <el-input v-model="queryParams.typePath" placeholder="请输入类型路径1,2,3" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:type:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="typeList" row-key="id" :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="id" prop="id" />

      <el-table-column label="名称" prop="name" />
      <el-table-column label="图标路径" align="center" prop="icon" />
      <el-table-column label="父级ID" align="center" prop="pid" />
      <el-table-column label="排序字段，用于控制显示顺序" align="center" prop="sorting" />
      <el-table-column label="描述或说明" align="center" prop="description" />
      <el-table-column label="是否启用，0表示禁用，1表示启用" align="center" prop="isActive" />
      <el-table-column label="类型路径1,2,3" align="center" prop="typePath" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:type:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)"
            v-hasPermi="['system:type:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:type:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改服务类型管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="typeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="图标路径" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标路径" />
        </el-form-item>
        <el-form-item label="父级ID" prop="pid">
          <el-tree-select v-model="form.pid" :data="typeOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }" value-key="id" placeholder="请选择父级ID"
            check-strictly />
        </el-form-item>
        <el-form-item label="排序字段，用于控制显示顺序" prop="sorting">
          <el-input v-model="form.sorting" placeholder="请输入排序字段，用于控制显示顺序" />
        </el-form-item>
        <el-form-item label="描述或说明" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否启用，0表示禁用，1表示启用" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入是否启用，0表示禁用，1表示启用" />
        </el-form-item>
        <el-form-item label="类型路径1,2,3" prop="typePath">
          <el-input v-model="form.typePath" placeholder="请输入类型路径1,2,3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Type">
import { listType, getType, delType, addType, updateType } from "@/api/system/type";

const { proxy } = getCurrentInstance();

const typeList = ref([]);
const typeOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const isExpandAll = ref(true);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    name: null,
    icon: null,
    pid: null,
    sorting: null,
    description: null,
    isActive: null,
    typePath: null
  },
  rules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    pid: [
      { required: true, message: "父级ID不能为空", trigger: "blur" }
    ],
    sorting: [
      { required: true, message: "排序字段，用于控制显示顺序不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
    isActive: [
      { required: true, message: "是否启用，0表示禁用，1表示启用不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询服务类型管理列表 */
function getList() {
  loading.value = true;
  listType(queryParams.value).then(response => {
    typeList.value = proxy.handleTree(response.data, "id", "pid");
    console.log(typeList.value)
    loading.value = false;
  });
}

/** 查询服务类型管理下拉树结构 */
function getTreeselect() {
  listType().then(response => {
    typeOptions.value = [];
    const data = { id: 0, name: '顶级节点', children: [] };
    data.children = proxy.handleTree(response.data, "id", "pid");
    typeOptions.value.push(data);
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    icon: null,
    pid: null,
    sorting: null,
    description: null,
    createTime: null,
    updateTime: null,
    isActive: null,
    createBy: null,
    updateBy: null,
    typePath: null
  };
  proxy.resetForm("typeRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  getTreeselect();
  if (row != null && row.id) {
    form.value.pid = row.id;
  } else {
    form.value.pid = 0;
  }
  open.value = true;
  title.value = "添加服务类型管理";
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await getTreeselect();
  if (row != null) {
    form.value.pid = row.pid;
  }
  getType(row.id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改服务类型管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["typeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateType(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addType(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除服务类型管理编号为"' + row.id + '"的数据项？').then(function () {
    return delType(row.id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

getList();
</script>
