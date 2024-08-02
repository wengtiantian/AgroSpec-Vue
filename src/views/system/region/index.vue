<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="父地区id" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父地区id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="路径" prop="regionPath">
        <el-input
          v-model="queryParams.regionPath"
          placeholder="请输入路径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="级别" prop="regionGrade">
        <el-input
          v-model="queryParams.regionGrade"
          placeholder="请输入级别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="名称" prop="localName">
        <el-input
          v-model="queryParams.localName"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="邮编" prop="zipcode">
        <el-input
          v-model="queryParams.zipcode"
          placeholder="请输入邮编"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否支持货到付款" prop="cod">
        <el-input
          v-model="queryParams.cod"
          placeholder="请输入是否支持货到付款"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:region:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Sort"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="regionList"
      row-key="id"
      :default-expand-all="isExpandAll"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
    <el-table-column label="地区id" prop="id" />
      <el-table-column label="父地区id" prop="parentId" />
      <el-table-column label="路径" align="center" prop="regionPath" />
      <el-table-column label="级别" align="center" prop="regionGrade" />
      <el-table-column label="名称" align="center" prop="localName" />
      <el-table-column label="邮编" align="center" prop="zipcode" />
      <el-table-column label="是否支持货到付款" align="center" prop="cod" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:region:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:region:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:region:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改地区(es_regions)对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="regionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父地区id" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="regionOptions"
            :props="{ value: 'id', label: 'localName', children: 'children' }"
            value-key="id"
            placeholder="请选择父地区id"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="路径" prop="regionPath">
          <el-input v-model="form.regionPath" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="级别" prop="regionGrade">
          <el-input v-model="form.regionGrade" placeholder="请输入级别" />
        </el-form-item>
        <el-form-item label="名称" prop="localName">
          <el-input v-model="form.localName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="邮编" prop="zipcode">
          <el-input v-model="form.zipcode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="是否支持货到付款" prop="cod">
          <el-input v-model="form.cod" placeholder="请输入是否支持货到付款" />
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

<script setup name="Region">
import { listRegion, getRegion, delRegion, addRegion, updateRegion } from "@/api/system/region";

const { proxy } = getCurrentInstance();

const regionList = ref([]);
const regionOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const isExpandAll = ref(false);
const refreshTable = ref(true);




const data = reactive({
  form: {},
  queryParams: {
    parentId: 0,
    regionPath: null,
    regionGrade: null,
    localName: null,
    zipcode: null,
    cod: null
  },
  rules: {
    localName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询地区(es_regions)列表 */
function getList() {
  loading.value = true;
  console.log(queryParams.value)
  listRegion(queryParams.value).then(response => {
    regionList.value = response.data.map(v=>{v.hasChildren=true;return v});
    loading.value = false;
  });
}

/** 查询地区(es_regions)下拉树结构 */
function getTreeselect() {
  listRegion().then(response => {
    regionOptions.value = [];
    const data = { id: 0, localName: '中国', children: [] };
    data.children = proxy.handleTree(response.data, "id", "parentId");
    regionOptions.value.push(data);
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
    parentId: 0,
    regionPath: null,
    regionGrade: null,
    localName: null,
    zipcode: null,
    cod: null
  };
  proxy.resetForm("regionRef");
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
    form.value.parentId = row.id;
  } else {
    form.value.parentId = 0;
  }
  open.value = true;
  title.value = "添加地区(es_regions)";
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
    form.value.parentId = row.parentId;
  }
  getRegion(row.id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改地区(es_regions)";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["regionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRegion(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRegion(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除地区(es_regions)编号为"' + row.id + '"的数据项？').then(function() {
    return delRegion(row.id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}


const load = (
  row,
  treeNode,
  resolve
) => {
  listRegion({parentId:row.id}).then(response => {
    resolve(response.data.map(v=>{v.hasChildren=true;return v}))
  });
}

getList();
</script>
