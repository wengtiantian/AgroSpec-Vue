<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标准文件的名称" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入标准文件的名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布该标准文件的机构名称" prop="issuingAgency">
        <el-input
          v-model="queryParams.issuingAgency"
          placeholder="请输入发布该标准文件的机构名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件的发布日期" prop="issueDate">
        <el-date-picker clearable
          v-model="queryParams.issueDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择文件的发布日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="文件开始实施的日期" prop="effectiveDate">
        <el-date-picker clearable
          v-model="queryParams.effectiveDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择文件开始实施的日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="文件所属的标准类别" prop="standardCategory">
        <el-input
          v-model="queryParams.standardCategory"
          placeholder="请输入文件所属的标准类别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件的版本号" prop="versionNumber">
        <el-input
          v-model="queryParams.versionNumber"
          placeholder="请输入文件的版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件修订的日期" prop="revisionDate">
        <el-date-picker clearable
          v-model="queryParams.revisionDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择文件修订的日期">
        </el-date-picker>
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
          v-hasPermi="['system:standards:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:standards:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:standards:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:standards:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="standardsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标准编号" align="center" prop="id" />
      <el-table-column label="标准文件的名称" align="center" prop="fileName" />
      <el-table-column label="标准文件" align="center" prop="fileNumber" />
      <el-table-column label="发布该标准文件的机构名称" align="center" prop="issuingAgency" />
      <el-table-column label="文件的发布日期" align="center" prop="issueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.issueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件开始实施的日期" align="center" prop="effectiveDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件所属的标准类别" align="center" prop="standardCategory" />
      <el-table-column label="文件适用的农业服务范围" align="center" prop="serviceScope" />
      <el-table-column label="具体的服务项目或内容" align="center" prop="serviceItems" />
      <el-table-column label="服务的具体要求和规范" align="center" prop="serviceRequirements" />
      <el-table-column label="技术标准和参数" align="center" prop="technicalParameters" />
      <el-table-column label="服务质量的评估指标" align="center" prop="qualityIndicators" />
      <el-table-column label="文件的版本号" align="center" prop="versionNumber" />
      <el-table-column label="文件修订的日期" align="center" prop="revisionDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.revisionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修订内容的简要说明" align="center" prop="revisionNotes" />
      <el-table-column label="相关或引用的其他标准文件" align="center" prop="relatedFiles" />
      <el-table-column label="其他附加资料或附件" align="center" prop="attachments" />
      <el-table-column label="任何其他需要说明的信息" align="center" prop="notes" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:standards:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:standards:remove']">删除</el-button>
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

    <!-- 添加或修改标准管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="standardsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标准文件的名称" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入标准文件的名称" />
        </el-form-item>
        <el-form-item label="标准文件" prop="fileNumber">
          <file-upload v-model="form.fileNumber"/>
        </el-form-item>
        <el-form-item label="发布该标准文件的机构名称" prop="issuingAgency">
          <el-input v-model="form.issuingAgency" placeholder="请输入发布该标准文件的机构名称" />
        </el-form-item>
        <el-form-item label="文件的发布日期" prop="issueDate">
          <el-date-picker clearable
            v-model="form.issueDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择文件的发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文件开始实施的日期" prop="effectiveDate">
          <el-date-picker clearable
            v-model="form.effectiveDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择文件开始实施的日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文件所属的标准类别" prop="standardCategory">
          <el-input v-model="form.standardCategory" placeholder="请输入文件所属的标准类别" />
        </el-form-item>
        <el-form-item label="文件适用的农业服务范围" prop="serviceScope">
          <el-input v-model="form.serviceScope" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="具体的服务项目或内容" prop="serviceItems">
          <el-input v-model="form.serviceItems" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="服务的具体要求和规范" prop="serviceRequirements">
          <el-input v-model="form.serviceRequirements" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="技术标准和参数" prop="technicalParameters">
          <el-input v-model="form.technicalParameters" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="服务质量的评估指标" prop="qualityIndicators">
          <el-input v-model="form.qualityIndicators" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="文件的版本号" prop="versionNumber">
          <el-input v-model="form.versionNumber" placeholder="请输入文件的版本号" />
        </el-form-item>
        <el-form-item label="文件修订的日期" prop="revisionDate">
          <el-date-picker clearable
            v-model="form.revisionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择文件修订的日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修订内容的简要说明" prop="revisionNotes">
          <el-input v-model="form.revisionNotes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="相关或引用的其他标准文件" prop="relatedFiles">
          <el-input v-model="form.relatedFiles" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="其他附加资料或附件" prop="attachments">
          <el-input v-model="form.attachments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="任何其他需要说明的信息" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="0.未删除，1.删除" prop="isDeleted">
          <el-input v-model="form.isDeleted" placeholder="请输入0.未删除，1.删除" />
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

<script setup name="Standards">
import { listStandards, getStandards, delStandards, addStandards, updateStandards } from "@/api/system/standards";

const { proxy } = getCurrentInstance();

const standardsList = ref([]);
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
    fileName: null,
    fileNumber: null,
    issuingAgency: null,
    issueDate: null,
    effectiveDate: null,
    standardCategory: null,
    serviceScope: null,
    serviceItems: null,
    serviceRequirements: null,
    technicalParameters: null,
    qualityIndicators: null,
    versionNumber: null,
    revisionDate: null,
    revisionNotes: null,
    relatedFiles: null,
    attachments: null,
    notes: null,
  },
  rules: {
    fileName: [
      { required: true, message: "标准文件的名称不能为空", trigger: "blur" }
    ],
    fileNumber: [
      { required: true, message: "标准文件不能为空", trigger: "blur" }
    ],
    issuingAgency: [
      { required: true, message: "发布该标准文件的机构名称不能为空", trigger: "blur" }
    ],
    issueDate: [
      { required: true, message: "文件的发布日期不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询标准管理列表 */
function getList() {
  loading.value = true;
  listStandards(queryParams.value).then(response => {
    standardsList.value = response.rows;
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
    fileName: null,
    fileNumber: null,
    issuingAgency: null,
    issueDate: null,
    effectiveDate: null,
    standardCategory: null,
    serviceScope: null,
    serviceItems: null,
    serviceRequirements: null,
    technicalParameters: null,
    qualityIndicators: null,
    versionNumber: null,
    revisionDate: null,
    revisionNotes: null,
    relatedFiles: null,
    attachments: null,
    notes: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    isDeleted: null
  };
  proxy.resetForm("standardsRef");
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
  title.value = "添加标准管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getStandards(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改标准管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["standardsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateStandards(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStandards(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除标准管理编号为"' + _ids + '"的数据项？').then(function() {
    return delStandards(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/standards/export', {
    ...queryParams.value
  }, `standards_${new Date().getTime()}.xlsx`)
}

getList();
</script>
