<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>我的申请</h2>
      <p class="page-description">查看您的服务主体申请记录和状态</p>
    </div>

    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="主体名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入主体名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="申请状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择申请状态" clearable>
          <el-option v-for="dict in es_sh_jg" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="准入状态" prop="isAuth">
        <el-select v-model="queryParams.isAuth" placeholder="请选择准入状态" clearable>
          <el-option v-for="dict in es_is_auth" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
        >新增申请</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 申请记录表格 -->
    <el-table v-loading="loading" :data="servicerApplyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请编号" align="center" prop="id" width="80" />
      <el-table-column label="主体名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="组织类型" align="center" prop="typeId" width="100">
        <template #default="scope">
          <dict-tag :options="es_org_type" :value="scope.row.typeId" />
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center" prop="accountPhone" width="120" />
      <el-table-column label="法人代表" align="center" prop="corporate" width="100" />
      <el-table-column label="申请状态" align="center" prop="auditStatus" width="100">
        <template #default="scope">
          <dict-tag :options="es_sh_jg" :value="scope.row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="准入状态" align="center" prop="isAuth" width="100">
        <template #default="scope">
          <dict-tag :options="es_is_auth" :value="scope.row.isAuth" />
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="View"
            @click="handleView(scope.row)"
          >查看</el-button>
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.auditStatus === 2"
          >编辑</el-button>
          <el-button
            link
            type="danger"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.auditStatus === 2"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看申请详情对话框 -->
    <el-dialog title="申请详情" v-model="viewOpen" width="800px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="申请编号">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="主体名称">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="组织类型">
          <dict-tag :options="es_org_type" :value="viewForm.typeId" />
        </el-descriptions-item>
        <el-descriptions-item label="联系人电话">{{ viewForm.accountPhone }}</el-descriptions-item>
        <el-descriptions-item label="法人代表">{{ viewForm.corporate }}</el-descriptions-item>
        <el-descriptions-item label="服务种类">
          <div v-for="item in viewForm.serviceTypeXx && mergeFruitData(viewForm.serviceTypeXx)" :key="item">
            {{ item }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="服务区域">{{ viewForm.regionPre }}</el-descriptions-item>
        <el-descriptions-item label="详细地址">{{ viewForm.regionXx }}</el-descriptions-item>
        <el-descriptions-item label="主体介绍" :span="2">{{ viewForm.introduce }}</el-descriptions-item>
        <el-descriptions-item label="主体Logo" :span="2">
          <image-preview :src="viewForm.logo" :width="100" :height="100" />
        </el-descriptions-item>
        <el-descriptions-item label="营业执照" :span="2">
          <image-preview :src="viewForm.manageCert" :width="200" :height="150" />
        </el-descriptions-item>
        <el-descriptions-item label="主体图片" :span="2">
          <image-preview :src="viewForm.pictureUrls" :width="100" :height="100" />
        </el-descriptions-item>
        <el-descriptions-item label="从业人数">{{ viewForm.population }}</el-descriptions-item>
        <el-descriptions-item label="年服务营业收入">{{ viewForm.income }}</el-descriptions-item>
        <el-descriptions-item label="服务对象数">{{ viewForm.serveNum }}</el-descriptions-item>
        <el-descriptions-item label="服务小农户数">{{ viewForm.farmersNum }}</el-descriptions-item>
        <el-descriptions-item label="年服务面积">{{ viewForm.serveArea }}</el-descriptions-item>
        <el-descriptions-item label="年畜牧服务量">{{ viewForm.raiseNum }}</el-descriptions-item>
        <el-descriptions-item label="年水产服务量">{{ viewForm.waterNum }}</el-descriptions-item>
        <el-descriptions-item label="其他行业服务总量">{{ viewForm.otherNum }}</el-descriptions-item>
        <el-descriptions-item label="服务粮食作物面积">{{ viewForm.cropArea }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">
          <dict-tag :options="es_sh_jg" :value="viewForm.auditStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="准入状态">
          <dict-tag :options="es_is_auth" :value="viewForm.isAuth" />
        </el-descriptions-item>
        <el-descriptions-item label="审核意见" :span="2">{{ viewForm.auditRemark }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ parseTime(viewForm.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ parseTime(viewForm.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewOpen = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑申请对话框 -->
    <el-dialog title="编辑申请" v-model="editOpen" width="800px" append-to-body>
      <el-form ref="editRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="主体名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入主体名称" />
        </el-form-item>
        <el-form-item label="组织类型" prop="typeId">
          <el-select v-model="editForm.typeId" placeholder="请选择组织类型">
            <el-option v-for="dict in es_org_type" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人电话" prop="accountPhone">
          <el-input v-model="editForm.accountPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="法人代表" prop="corporate">
          <el-input v-model="editForm.corporate" placeholder="请输入法人代表" />
        </el-form-item>
        <el-form-item label="服务种类" prop="serviceTypeXx">
          <ServiceTypeSelector v-model="editForm.serviceTypeXx" />
        </el-form-item>
        <el-form-item label="服务区域" prop="regionPre">
          <RegionCascader v-model="editForm.regionPre" />
        </el-form-item>
        <el-form-item label="详细地址" prop="regionXx">
          <el-input v-model="editForm.regionXx" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="主体介绍" prop="introduce">
          <el-input v-model="editForm.introduce" type="textarea" :rows="3" placeholder="请输入主体介绍" />
        </el-form-item>
        <el-form-item label="主体Logo" prop="logo">
          <image-upload v-model="editForm.logo" />
        </el-form-item>
        <el-form-item label="营业执照" prop="manageCert">
          <image-upload v-model="editForm.manageCert" />
        </el-form-item>
        <el-form-item label="主体图片" prop="pictureUrls">
          <image-upload v-model="editForm.pictureUrls" :limit="5" />
        </el-form-item>
        <el-form-item label="从业人数" prop="population">
          <el-input-number v-model="editForm.population" :min="0" placeholder="请输入从业人数" />
        </el-form-item>
        <el-form-item label="年服务营业收入" prop="income">
          <el-input-number v-model="editForm.income" :min="0" :precision="2" placeholder="请输入年服务营业收入" />
        </el-form-item>
        <el-form-item label="服务对象数" prop="serveNum">
          <el-input-number v-model="editForm.serveNum" :min="0" placeholder="请输入服务对象数" />
        </el-form-item>
        <el-form-item label="服务小农户数" prop="farmersNum">
          <el-input-number v-model="editForm.farmersNum" :min="0" placeholder="请输入服务小农户数" />
        </el-form-item>
        <el-form-item label="年服务面积" prop="serveArea">
          <el-input-number v-model="editForm.serveArea" :min="0" :precision="2" placeholder="请输入年服务面积" />
        </el-form-item>
        <el-form-item label="年畜牧服务量" prop="raiseNum">
          <el-input-number v-model="editForm.raiseNum" :min="0" placeholder="请输入年畜牧服务量" />
        </el-form-item>
        <el-form-item label="年水产服务量" prop="waterNum">
          <el-input-number v-model="editForm.waterNum" :min="0" placeholder="请输入年水产服务量" />
        </el-form-item>
        <el-form-item label="其他行业服务总量" prop="otherNum">
          <el-input-number v-model="editForm.otherNum" :min="0" placeholder="请输入其他行业服务总量" />
        </el-form-item>
        <el-form-item label="服务粮食作物面积" prop="cropArea">
          <el-input-number v-model="editForm.cropArea" :min="0" :precision="2" placeholder="请输入服务粮食作物面积" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editOpen = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MyServicerApply">
import { ref, reactive, toRefs, getCurrentInstance } from 'vue';
import { listMyServicerApply, getServicerApply, updateServicerApply, delServicerApply } from '@/api/apply/servicer.js';
import { mergeFruitData } from '@/utils/service-type.js';
import ServiceTypeSelector from '@/views/subject/servicer_mess/TypeSelect.vue';
import RegionCascader from '@/views/subject/servicer_mess/RegionSelect.vue';

const { proxy } = getCurrentInstance();
const { es_org_type, es_sh_jg, es_is_auth } = proxy.useDict('es_org_type', 'es_sh_jg', 'es_is_auth');

const servicerApplyList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const viewOpen = ref(false);
const editOpen = ref(false);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    auditStatus: null,
    isAuth: null,
  },
  viewForm: {},
  editForm: {},
  editRules: {
    name: [{ required: true, message: '主体名称不能为空', trigger: 'blur' }],
    typeId: [{ required: true, message: '组织类型不能为空', trigger: 'change' }],
    accountPhone: [{ required: true, message: '联系人电话不能为空', trigger: 'blur' }],
    corporate: [{ required: true, message: '法人代表不能为空', trigger: 'blur' }],
  }
});

const { queryParams, viewForm, editForm, editRules } = toRefs(data);

/** 查询我的申请列表 */
function getList() {
  loading.value = true;
  listMyServicerApply(queryParams.value).then(response => {
    servicerApplyList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  proxy.$router.push('/apply/servicer');
}

/** 查看按钮操作 */
function handleView(row) {
  getServicerApply(row.id).then(response => {
    viewForm.value = response.data;
    viewOpen.value = true;
  });
}

/** 编辑按钮操作 */
function handleUpdate(row) {
  getServicerApply(row.id).then(response => {
    editForm.value = response.data;
    editOpen.value = true;
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除申请编号为"' + row.id + '"的数据项？').then(function() {
    return delServicerApply(row.id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess('删除成功');
  }).catch(() => {});
}

/** 提交编辑表单 */
function submitEditForm() {
  proxy.$refs['editRef'].validate(valid => {
    if (valid) {
      updateServicerApply(editForm.value).then(response => {
        proxy.$modal.msgSuccess('修改成功');
        editOpen.value = false;
        getList();
      });
    }
  });
}

getList();
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 500;
}

.page-description {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.dialog-footer {
  text-align: right;
}
</style>