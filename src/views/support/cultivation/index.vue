<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标准编号" prop="standardId">
        <el-input
          v-model="queryParams.standardId"
          placeholder="请输入标准编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标准名称" prop="standardName">
        <el-input
          v-model="queryParams.standardName"
          placeholder="请输入标准名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布单位" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入发布单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布日期" prop="publishDate">
        <el-date-picker clearable
          v-model="queryParams.publishDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发布日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实施日期" prop="impleDate">
        <el-date-picker clearable
          v-model="queryParams.impleDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择实施日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="起草人" prop="author">
        <el-input
          v-model="queryParams.author"
          placeholder="请输入起草人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省份地区" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入省份地区"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['support:cultivation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['support:cultivation:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['support:cultivation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['support:cultivation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cultivationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="标准编号" align="center" prop="standardId" />
      <el-table-column label="标准名称" align="center" prop="standardName" />
      <el-table-column label="发布单位" align="center" prop="companyName" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实施日期" align="center" prop="impleDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.impleDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起草人" align="center" prop="author" />
      <el-table-column label="文件路径" align="center" prop="fileUrl" />
      <el-table-column label="省份地区" align="center" prop="province" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['support:cultivation:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['support:cultivation:remove']">删除</el-button>
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

    <!-- 添加或修改种植标准管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="cultivationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标准编号" prop="standardId">
          <el-input v-model="form.standardId" placeholder="请输入标准编号" />
        </el-form-item>
        <el-form-item label="标准名称" prop="standardName">
          <el-input v-model="form.standardName" placeholder="请输入标准名称" />
        </el-form-item>
        <el-form-item label="发布单位" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入发布单位" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker clearable
            v-model="form.publishDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实施日期" prop="impleDate">
          <el-date-picker clearable
            v-model="form.impleDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择实施日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="起草人" prop="author">
          <el-input v-model="form.author" placeholder="请输入起草人" />
        </el-form-item>
        <el-form-item label="文件路径" prop="fileUrl">
          <file-upload v-model="form.fileUrl"/>
        </el-form-item>
        <el-form-item label="省份地区" prop="province">
          <el-input v-model="form.province" placeholder="请输入省份地区" />
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

<script setup name="Cultivation">
import { listCultivation, getCultivation, delCultivation, addCultivation, updateCultivation } from "@/api/support/cultivation";

const { proxy } = getCurrentInstance();

const cultivationList = ref([]);
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
    standardId: null,
    standardName: null,
    companyName: null,
    publishDate: null,
    impleDate: null,
    author: null,
    fileUrl: null,
    province: null
  },
  rules: {
    standardId: [
      { required: true, message: "标准编号不能为空", trigger: "blur" }
    ],
    standardName: [
      { required: true, message: "标准名称不能为空", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "发布单位不能为空", trigger: "blur" }
    ],
    publishDate: [
      { required: true, message: "发布日期不能为空", trigger: "blur" }
    ],
    impleDate: [
      { required: true, message: "实施日期不能为空", trigger: "blur" }
    ],
    fileUrl: [
      { required: true, message: "文件路径不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询种植标准管理列表 */
function getList() {
  loading.value = true;
  listCultivation(queryParams.value).then(response => {
    cultivationList.value = response.rows;
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
    standardId: null,
    standardName: null,
    companyName: null,
    publishDate: null,
    impleDate: null,
    author: null,
    fileUrl: null,
    province: null
  };
  proxy.resetForm("cultivationRef");
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
  title.value = "添加种植标准管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCultivation(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改种植标准管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cultivationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCultivation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCultivation(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除种植标准管理编号为"' + _ids + '"的数据项？').then(function() {
    return delCultivation(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('support/cultivation/export', {
    ...queryParams.value
  }, `cultivation_${new Date().getTime()}.xlsx`)
}

getList();
</script>
