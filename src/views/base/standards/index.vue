<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入标准文件的名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件编号" prop="fileNumber">
        <el-input
          v-model="queryParams.fileNumber"
          placeholder="请输入标准文件的唯一编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布机构" prop="issuingAgency">
        <el-input
          v-model="queryParams.issuingAgency"
          placeholder="请输入发布该标准文件的机构名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="起草人" prop="author">
        <el-input
          v-model="queryParams.author"
          placeholder="请输入起草人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布日期" prop="issueDate">
        <el-date-picker clearable
          v-model="queryParams.issueDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择文件的发布日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实施日期" prop="effectiveDate">
        <el-date-picker clearable
          v-model="queryParams.effectiveDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择文件开始实施的日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="标准类别" prop="standardCategory">
        <el-select
          v-model="queryParams.standardCategory"
          placeholder="请选择标准类别"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in standard_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标准领域" prop="standardDomain">
        <el-select
          v-model="queryParams.standardDomain"
          placeholder="请选择标准领域"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in standard_domain"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="版本号" prop="versionNumber">
        <el-input
          v-model="queryParams.versionNumber"
          placeholder="请输入文件的版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修订日期" prop="revisionDate">
        <el-date-picker clearable
          v-model="queryParams.revisionDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择文件修订的日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否删除" prop="isDeleted">
        <el-input
          v-model="queryParams.isDeleted"
          placeholder="请输入0.未删除，1.删除"
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
          v-hasPermi="['base:standards:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['base:standards:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['base:standards:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['base:standards:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table 
      v-loading="loading" 
      :data="standardsList" 
      @selection-change="handleSelectionChange"
      style="width: 100%"
      :scroll="{ x: 'max-content' }"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="80" />
      <el-table-column label="名称" align="center" prop="fileName" width="200" show-overflow-tooltip />
      <el-table-column label="编号" align="center" prop="fileNumber" width="150" />
      <el-table-column label="发布机构" align="center" prop="issuingAgency" width="180" show-overflow-tooltip />
      <el-table-column label="起草人" align="center" prop="author" width="120" />
      <el-table-column label="发布日期" align="center" prop="issueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.issueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实施日期" align="center" prop="effectiveDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准类别" align="center" prop="standardCategory" width="120">
        <template #default="scope">
          <dict-tag :options="standard_category" :value="scope.row.standardCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="标准领域" align="center" prop="standardDomain" width="120">
        <template #default="scope">
          <dict-tag :options="standard_domain" :value="scope.row.standardDomain"/>
        </template>
      </el-table-column>
      <el-table-column label="农业服务范围" align="center" prop="serviceScope" width="150">
        <template #default="scope">
          <dict-tag :options="standard_domain" :value="scope.row.serviceScope"/>
        </template>
      </el-table-column>
      <el-table-column label="服务项目" align="center" prop="serviceItems" width="150" show-overflow-tooltip />
      <el-table-column label="服务要求" align="center" prop="serviceRequirements" width="150" show-overflow-tooltip />
      <el-table-column label="技术参数" align="center" prop="technicalParameters" width="150" show-overflow-tooltip />
      <el-table-column label="质量指标" align="center" prop="qualityIndicators" width="150" show-overflow-tooltip />
      <el-table-column label="版本号" align="center" prop="versionNumber" width="100" />
      <el-table-column label="修订日期" align="center" prop="revisionDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.revisionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修订说明" align="center" prop="revisionNotes" width="150" show-overflow-tooltip />
      <el-table-column label="相关文件" align="center" prop="relatedFiles" width="150" show-overflow-tooltip />
      <el-table-column label="封面图片" align="center" prop="coverImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.coverImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="附件" align="center" prop="attachments" width="120" show-overflow-tooltip />
      <el-table-column label="备注" align="center" prop="notes" width="150" show-overflow-tooltip />
      <el-table-column label="是否删除" align="center" prop="isDeleted" width="100" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['base:standards:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['base:standards:remove']">删除</el-button>
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
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="standardsRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="fileName">
              <el-input v-model="form.fileName" placeholder="请输入标准文件的名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="fileNumber">
              <el-input v-model="form.fileNumber" placeholder="请输入标准文件的唯一编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布机构" prop="issuingAgency">
              <el-input v-model="form.issuingAgency" placeholder="请输入发布该标准文件的机构名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起草人" prop="author">
              <el-input v-model="form.author" placeholder="请输入起草人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布日期" prop="issueDate">
              <el-date-picker clearable
                v-model="form.issueDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择文件的发布日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施日期" prop="effectiveDate">
              <el-date-picker clearable
                v-model="form.effectiveDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择文件开始实施的日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标准类别" prop="standardCategory">
              <el-select v-model="form.standardCategory" placeholder="请选择标准类别" style="width: 100%">
                <el-option
                  v-for="dict in standard_category"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准领域" prop="standardDomain">
              <el-select v-model="form.standardDomain" placeholder="请选择标准领域" style="width: 100%">
                <el-option
                  v-for="dict in standard_domain"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="版本号" prop="versionNumber">
              <el-input v-model="form.versionNumber" placeholder="请输入文件的版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修订日期" prop="revisionDate">
              <el-date-picker clearable
                v-model="form.revisionDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择文件修订的日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="修订内容的简要说明" prop="revisionNotes">
          <el-input v-model="form.revisionNotes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="相关或引用的其他标准文件" prop="relatedFiles">
          <el-input v-model="form.relatedFiles" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <image-upload v-model="form.coverImage"/>
        </el-form-item>
        <el-form-item label="其他附加资料或附件" prop="attachments">
          <file-upload v-model="form.attachments"/>
        </el-form-item>
        <el-form-item label="任何其他需要说明的信息" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否删除" prop="isDeleted">
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
import { ref, reactive, computed, watch, onMounted, getCurrentInstance, toRefs } from 'vue';
import { listStandards, getStandards, delStandards, addStandards, updateStandards } from "@/api/base/standards";

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

// 字典数据 - 从系统字典表动态获取
const { standard_category, standard_domain } = proxy.useDict('standard_category', 'standard_domain');

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    fileName: null,
    fileNumber: null,
    issuingAgency: null,
    author: null,
    issueDate: null,
    effectiveDate: null,
    standardCategory: null,
    standardDomain: null,
    serviceScope: null,
    serviceItems: null,
    serviceRequirements: null,
    technicalParameters: null,
    qualityIndicators: null,
    versionNumber: null,
    revisionDate: null,
    revisionNotes: null,
    relatedFiles: null,
    coverImage: null,
    attachments: null,
    notes: null,
    isDeleted: null
  },
  rules: {
    fileName: [
      { required: true, message: "标准文件的名称不能为空", trigger: "blur" }
    ],
    fileNumber: [
      { required: true, message: "标准文件的唯一编号不能为空", trigger: "blur" }
    ],
    issuingAgency: [
      { required: true, message: "发布该标准文件的机构名称不能为空", trigger: "blur" }
    ],
    issueDate: [
      { required: true, message: "文件的发布日期不能为空", trigger: "blur" }
    ],
    standardCategory: [
      { required: true, message: "文件所属的标准类别不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

// 表单引用
const queryRef = ref();
const standardsRef = ref();

// 组件挂载时初始化数据
onMounted(() => {
  getList();
});

/** 查询标准管理列表 */
function getList() {
  loading.value = true;
  listStandards(queryParams.value).then(response => {
    standardsList.value = response.rows || [];
    total.value = response.total || 0;
    loading.value = false;
  }).catch(error => {
    console.error('查询标准管理列表失败:', error);
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
    author: null,
    issueDate: null,
    effectiveDate: null,
    standardCategory: null,
    standardDomain: null,
    serviceScope: null,
    serviceItems: null,
    serviceRequirements: null,
    technicalParameters: null,
    qualityIndicators: null,
    versionNumber: null,
    revisionDate: null,
    revisionNotes: null,
    relatedFiles: null,
    coverImage: null,
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
  proxy.download('base/standards/export', {
    ...queryParams.value
  }, `standards_${new Date().getTime()}.xlsx`)
}

getList();
</script>
