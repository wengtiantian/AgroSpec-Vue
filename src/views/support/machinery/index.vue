<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务主体ID" prop="serviceSubjectId">
        <el-input
          v-model="queryParams.serviceSubjectId"
          placeholder="请输入服务主体ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农机名称" prop="machineName">
        <el-input
          v-model="queryParams.machineName"
          placeholder="请输入农机名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农机型号" prop="machineModel">
        <el-input
          v-model="queryParams.machineModel"
          placeholder="请输入农机型号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终端编号" prop="terminalNumber">
        <el-input
          v-model="queryParams.terminalNumber"
          placeholder="请输入终端编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产厂家" prop="manufacturer">
        <el-input
          v-model="queryParams.manufacturer"
          placeholder="请输入生产厂家"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
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
          v-hasPermi="['system:machinery:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:machinery:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:machinery:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:machinery:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="machineryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="农机ID" align="center" prop="id" />
      <el-table-column label="服务主体ID" align="center" prop="serviceSubjectId" />
      <el-table-column label="农机名称" align="center" prop="machineName" />
      <el-table-column label="农机型号" align="center" prop="machineModel" />
      <el-table-column label="终端编号" align="center" prop="terminalNumber" />
      <el-table-column label="生产厂家" align="center" prop="manufacturer" />
      <el-table-column label="农机图片" align="center" prop="machineImageUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.machineImageUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_common_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:machinery:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:machinery:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改农机对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="machineryRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="服务主体ID" prop="serviceSubjectId">
          <el-input v-model="form.serviceSubjectId" placeholder="请输入服务主体ID" />
        </el-form-item>
        <el-form-item label="农机名称" prop="machineName">
          <el-input v-model="form.machineName" placeholder="请输入农机名称" />
        </el-form-item>
        <el-form-item label="农机型号" prop="machineModel">
          <el-input v-model="form.machineModel" placeholder="请输入农机型号" />
        </el-form-item>
        <el-form-item label="终端编号" prop="terminalNumber">
          <el-input v-model="form.terminalNumber" placeholder="请输入终端编号" />
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="农机图片" prop="machineImageUrl">
          <image-upload v-model="form.machineImageUrl"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_common_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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

<script setup name="Machinery">
import { listMachinery, getMachinery, delMachinery, addMachinery, updateMachinery } from "@/api/support/machinery.js";

const { proxy } = getCurrentInstance();
const { sys_common_status } = proxy.useDict('sys_common_status');

const machineryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    serviceSubjectId: null,
    machineName: null,
    machineModel: null,
    terminalNumber: null,
    manufacturer: null,
    machineImageUrl: null,
    status: null,
  },
  rules: {
    createTime: [
      { required: true, message: "记录创建时间不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "记录更新时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询农机列表 */
function getList() {
  loading.value = true;
  listMachinery(queryParams.value).then(response => {
    machineryList.value = response.rows;
    total.value = response.total;
    loading.value = false;
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
    serviceSubjectId: null,
    machineName: null,
    machineModel: null,
    terminalNumber: null,
    manufacturer: null,
    machineImageUrl: null,
    status: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null
  };
  proxy.resetForm("machineryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加农机";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getMachinery(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改农机";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["machineryRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMachinery(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMachinery(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除农机编号为"' + _ids + '"的数据项？').then(function() {
    return delMachinery(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/machinery/export', {
    ...queryParams.value
  }, `machinery_${new Date().getTime()}.xlsx`)
}

getList();
</script>
