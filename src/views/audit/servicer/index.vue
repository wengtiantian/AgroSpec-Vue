<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主体名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入主体名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="组织类型" prop="typeId">
        <el-select v-model="queryParams.typeId" placeholder="请选择组织类型" clearable>
          <el-option v-for="dict in es_org_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人电话" prop="accountPhone">
        <el-input v-model="queryParams.accountPhone" placeholder="请输入联系人电话" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="法人代表" prop="corporate">
        <el-input v-model="queryParams.corporate" placeholder="请输入法人代表" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Check"
          :disabled="single"
          @click="handleBatchApprove"
          v-hasPermi="['audit:servicer:approve']"
        >批量通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Close"
          :disabled="single"
          @click="handleBatchReject"
          v-hasPermi="['audit:servicer:reject']"
        >批量拒绝</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['audit:servicer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="servicerApplyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请ID" align="center" prop="id" />
      <el-table-column label="申请人ID" align="center" prop="applyUserId" />
      <el-table-column label="主体名称" align="center" prop="name" />
      <el-table-column label="组织类型" align="center" prop="typeId">
        <template #default="scope">
          <dict-tag :options="es_org_type" :value="scope.row.typeId" />
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center" prop="accountPhone" />
      <el-table-column label="法人代表" align="center" prop="corporate" />
      <el-table-column label="服务种类" align="center" prop="serviceTypeXx" width="120">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.serviceTypeXx" placement="top-start">
            {{ scope.row.serviceTypeXx && scope.row.serviceTypeXx.substring(0, 10) + '...' }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="服务区域" align="center" prop="regionPre" width="120">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.regionPre" placement="top-start">
            {{ scope.row.regionPre && scope.row.regionPre.substring(0, 10) + '...' }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="从业人数" align="center" prop="population" />
      <el-table-column label="年服务营业收入" align="center" prop="income" />
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template #default="scope">
          <dict-tag :options="es_sh_jg" :value="scope.row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="准入状态" align="center" prop="isAuth">
        <template #default="scope">
          <dict-tag :options="es_is_auth" :value="scope.row.isAuth" />
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)" v-hasPermi="['audit:servicer:query']">查看</el-button>
          <el-button link type="success" icon="Check" @click="handleApprove(scope.row)" v-hasPermi="['audit:servicer:approve']" v-if="scope.row.auditStatus === 2">通过</el-button>
          <el-button link type="danger" icon="Close" @click="handleReject(scope.row)" v-hasPermi="['audit:servicer:reject']" v-if="scope.row.auditStatus === 2">拒绝</el-button>
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

    <!-- 审核对话框 -->
    <el-dialog :title="auditTitle" v-model="auditOpen" width="60%" append-to-body>
      <el-form ref="auditRef" :model="auditForm" :rules="auditRules" label-width="120px">
        <el-descriptions border :column="2" v-if="auditForm">
          <el-descriptions-item label="申请ID">{{ auditForm.id }}</el-descriptions-item>
          <el-descriptions-item label="主体名称">{{ auditForm.name }}</el-descriptions-item>
          <el-descriptions-item label="组织类型">
            <dict-tag :options="es_org_type" :value="auditForm.typeId" />
          </el-descriptions-item>
          <el-descriptions-item label="联系人电话">{{ auditForm.accountPhone }}</el-descriptions-item>
          <el-descriptions-item label="法人代表">{{ auditForm.corporate }}</el-descriptions-item>
          <el-descriptions-item label="服务区域">{{ auditForm.regionPre }}</el-descriptions-item>
          <el-descriptions-item label="详细地址">{{ auditForm.regionXx }}</el-descriptions-item>
          <el-descriptions-item label="服务种类">{{ auditForm.serviceTypeXx }}</el-descriptions-item>
          <el-descriptions-item label="从业人数">{{ auditForm.population }}</el-descriptions-item>
          <el-descriptions-item label="年服务营业收入">{{ auditForm.income }}</el-descriptions-item>
          <el-descriptions-item label="服务对象数">{{ auditForm.serveNum }}</el-descriptions-item>
          <el-descriptions-item label="服务小农户数">{{ auditForm.farmersNum }}</el-descriptions-item>
          <el-descriptions-item label="年服务面积">{{ auditForm.serveArea }}</el-descriptions-item>
          <el-descriptions-item label="年畜牧服务量">{{ auditForm.raiseNum }}</el-descriptions-item>
          <el-descriptions-item label="年水产服务量">{{ auditForm.waterNum }}</el-descriptions-item>
          <el-descriptions-item label="其他行业服务总量">{{ auditForm.otherNum }}</el-descriptions-item>
          <el-descriptions-item label="服务粮食作物面积">{{ auditForm.cropArea }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ parseTime(auditForm.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
          <el-descriptions-item label="主体介绍" :span="2">
            <div v-html="auditForm.introduce"></div>
          </el-descriptions-item>
          <el-descriptions-item label="主体Logo" v-if="auditForm.logo">
            <image-preview :src="auditForm.logo" :width="100" :height="100" />
          </el-descriptions-item>
          <el-descriptions-item label="主体视频" v-if="auditForm.video">
            <video :src="baseUrl + auditForm.video" controls width="300" height="200"></video>
          </el-descriptions-item>
          <el-descriptions-item label="营业执照" v-if="auditForm.manageCert">
            <image-preview :src="auditForm.manageCert" :width="100" :height="100" />
          </el-descriptions-item>
          <el-descriptions-item label="主体图片" v-if="auditForm.pictureUrls">
            <image-preview :src="auditForm.pictureUrls" :width="100" :height="100" />
          </el-descriptions-item>
        </el-descriptions>
        
        <el-divider></el-divider>
        
        <el-form-item label="审核结果" prop="auditStatus">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="审核意见" prop="auditRemark">
          <el-input 
            v-model="auditForm.auditRemark" 
            type="textarea" 
            :rows="4"
            placeholder="请输入审核意见" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelAudit">取 消</el-button>
          <el-button type="primary" @click="submitAudit">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog title="申请详情" v-model="viewOpen" width="80%" append-to-body>
      <el-descriptions border :column="2" v-if="viewData">
        <el-descriptions-item label="申请ID">{{ viewData.id }}</el-descriptions-item>
        <el-descriptions-item label="申请人ID">{{ viewData.applyUserId }}</el-descriptions-item>
        <el-descriptions-item label="主体名称">{{ viewData.name }}</el-descriptions-item>
        <el-descriptions-item label="组织类型">
          <dict-tag :options="es_org_type" :value="viewData.typeId" />
        </el-descriptions-item>
        <el-descriptions-item label="联系人电话">{{ viewData.accountPhone }}</el-descriptions-item>
        <el-descriptions-item label="法人代表">{{ viewData.corporate }}</el-descriptions-item>
        <el-descriptions-item label="服务区域">{{ viewData.regionPre }}</el-descriptions-item>
        <el-descriptions-item label="详细地址">{{ viewData.regionXx }}</el-descriptions-item>
        <el-descriptions-item label="服务种类">{{ viewData.serviceTypeXx }}</el-descriptions-item>
        <el-descriptions-item label="从业人数">{{ viewData.population }}</el-descriptions-item>
        <el-descriptions-item label="年服务营业收入">{{ viewData.income }}</el-descriptions-item>
        <el-descriptions-item label="服务对象数">{{ viewData.serveNum }}</el-descriptions-item>
        <el-descriptions-item label="服务小农户数">{{ viewData.farmersNum }}</el-descriptions-item>
        <el-descriptions-item label="年服务面积">{{ viewData.serveArea }}</el-descriptions-item>
        <el-descriptions-item label="年畜牧服务量">{{ viewData.raiseNum }}</el-descriptions-item>
        <el-descriptions-item label="年水产服务量">{{ viewData.waterNum }}</el-descriptions-item>
        <el-descriptions-item label="其他行业服务总量">{{ viewData.otherNum }}</el-descriptions-item>
        <el-descriptions-item label="服务粮食作物面积">{{ viewData.cropArea }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <dict-tag :options="es_sh_jg" :value="viewData.auditStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="准入状态">
          <dict-tag :options="es_is_auth" :value="viewData.isAuth" />
        </el-descriptions-item>
        <el-descriptions-item label="经营状态">
          <dict-tag :options="es_manage_status" :value="viewData.manageStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="审核意见">{{ viewData.auditRemark }}</el-descriptions-item>
        <el-descriptions-item label="审核人ID">{{ viewData.auditUserId }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ parseTime(viewData.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ parseTime(viewData.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
        <el-descriptions-item label="主体介绍" :span="2">
          <div v-html="viewData.introduce"></div>
        </el-descriptions-item>
        <el-descriptions-item label="主体Logo" v-if="viewData.logo">
          <image-preview :src="viewData.logo" :width="100" :height="100" />
        </el-descriptions-item>
        <el-descriptions-item label="主体视频" v-if="viewData.video">
          <video :src="baseUrl + viewData.video" controls width="300" height="200"></video>
        </el-descriptions-item>
        <el-descriptions-item label="营业执照" v-if="viewData.manageCert">
          <image-preview :src="viewData.manageCert" :width="100" :height="100" />
        </el-descriptions-item>
        <el-descriptions-item label="主体图片" v-if="viewData.pictureUrls">
          <image-preview :src="viewData.pictureUrls" :width="100" :height="100" />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="ServicerAudit">
import { listServicerApply, getServicerApply, auditServicerApply, batchAuditServicerApply } from "@/api/apply/servicer";

const { proxy } = getCurrentInstance();
const { es_org_type, es_sh_jg, es_is_auth, es_manage_status } = proxy.useDict('es_org_type', 'es_sh_jg', 'es_is_auth', 'es_manage_status');

const servicerApplyList = ref([]);
const auditOpen = ref(false);
const viewOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const auditTitle = ref("");
const viewData = ref(null);
const baseUrl = import.meta.env.VITE_APP_BASE_API;

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    typeId: null,
    accountPhone: null,
    corporate: null,
    serviceTypeXx: null,
    serviceTypePath: null,
    regionPre: null,
    regionXx: null,
    regionId: null,
    population: null,
    income: null,
    serveNum: null,
    farmersNum: null,
    serveArea: null,
    raiseNum: null,
    waterNum: null,
    otherNum: null,
    cropArea: null,
    auditStatus: null,
    isAuth: null,
    manageForm: null, // 使用manageForm而不是manageStatus
  },
  auditForm: {
    id: null,
    auditStatus: null,
    auditRemark: null,
    auditUserId: null,
    auditTime: null,
  },
  auditRules: {
    auditStatus: [
      { required: true, message: "审核结果不能为空", trigger: "change" }
    ],
    auditRemark: [
      { required: true, message: "审核意见不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, auditForm, auditRules } = toRefs(data);

/** 查询服务主体申请列表 */
function getList() {
  loading.value = true;
  listServicerApply(queryParams.value).then(response => {
    servicerApplyList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消审核
function cancelAudit() {
  auditOpen.value = false;
  resetAuditForm();
}

// 重置审核表单
function resetAuditForm() {
  auditForm.value = {
    id: null,
    auditStatus: null,
    auditRemark: null,
    auditUserId: null,
    auditTime: null,
  };
  proxy.resetForm("auditRef");
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

/** 查看按钮操作 */
function handleView(row) {
  viewData.value = row;
  viewOpen.value = true;
}

/** 通过按钮操作 */
function handleApprove(row) {
  resetAuditForm();
  getServicerApply(row.id).then(response => {
    auditForm.value = { ...response.data, auditStatus: 0 };
    auditTitle.value = "审核通过";
    auditOpen.value = true;
  });
}

/** 拒绝按钮操作 */
function handleReject(row) {
  resetAuditForm();
  getServicerApply(row.id).then(response => {
    auditForm.value = { ...response.data, auditStatus: 1 };
    auditTitle.value = "审核拒绝";
    auditOpen.value = true;
  });
}

/** 批量通过按钮操作 */
function handleBatchApprove() {
  if (ids.value.length === 0) {
    proxy.$modal.msgError("请选择要审核的数据");
    return;
  }
  
  proxy.$modal.confirm('是否确认批量通过选中的申请？').then(function() {
    const data = {
      ids: ids.value,
      auditStatus: 0,
      auditRemark: "批量审核通过",
      auditUserId: proxy.$store.state.user.id,
      auditTime: new Date()
    };
    return batchAuditServicerApply(data);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("批量审核成功");
  }).catch(() => {});
}

/** 批量拒绝按钮操作 */
function handleBatchReject() {
  if (ids.value.length === 0) {
    proxy.$modal.msgError("请选择要审核的数据");
    return;
  }
  
  proxy.$modal.confirm('是否确认批量拒绝选中的申请？').then(function() {
    const data = {
      ids: ids.value,
      auditStatus: 1,
      auditRemark: "批量审核拒绝",
      auditUserId: proxy.$store.state.user.id,
      auditTime: new Date()
    };
    return batchAuditServicerApply(data);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("批量审核成功");
  }).catch(() => {});
}

/** 提交审核 */
function submitAudit() {
  proxy.$refs["auditRef"].validate(valid => {
    if (valid) {
      auditForm.value.auditUserId = proxy.$store.state.user.id;
      auditForm.value.auditTime = new Date();
      
      auditServicerApply(auditForm.value).then(response => {
        proxy.$modal.msgSuccess("审核成功");
        auditOpen.value = false;
        getList();
      });
    }
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('audit/servicer/export', {
    ...queryParams.value
  }, `servicer_audit_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped>
.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
</style>
