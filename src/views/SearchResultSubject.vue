<template>
    <div class="search-result-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-inline">
                <el-icon class="header-icon"><Search /></el-icon>
                <h1 class="page-title">服务主体搜索</h1>
                <span class="page-subtitle">找到您需要的农业服务主体</span>
            </div>
            <div class="header-divider"></div>
        </div>

        <!-- 筛选条件 -->
        <div class="filter-section" v-show="showSearch">
            <el-card class="filter-card" shadow="hover">
                <template #header>
                    <div class="filter-header">
                        <el-icon><Filter /></el-icon>
                        <span class="filter-title">筛选条件</span>
                        <el-button text @click="showSearch = !showSearch">
                            <el-icon><ArrowUp v-if="showSearch" /><ArrowDown v-else /></el-icon>
                        </el-button>
                    </div>
                </template>
                
                <el-form :model="queryParams" ref="queryRef" label-width="100px" class="filter-form">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="queryParams.name" placeholder="请输入主体名称" clearable @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系电话" prop="accountPhone">
                        <el-input v-model="queryParams.accountPhone" placeholder="请输入联系人电话" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="组织类型" prop="typeId">
                        <el-select v-model="queryParams.typeId" placeholder="请选择组织类型" clearable>
                            <el-option v-for="dict in es_org_type" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="法人代表" prop="corporate">
                        <el-input v-model="queryParams.corporate" placeholder="请输入法人代表" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="服务区域" prop="regionId">
                        <el-input v-model="queryParams.regionId" placeholder="请输入服务区域" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经营状态" prop="manageForm">
                        <el-select v-model="queryParams.manageForm" placeholder="请选择经营状态" clearable>
                            <el-option v-for="dict in es_manage_status" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 继续为其余表单项添加行和列 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="从业人数" prop="population">
                        <el-input v-model="queryParams.population" placeholder="请输入从业人数" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="年服务营业收入" prop="income">
                        <el-input v-model="queryParams.income" placeholder="请输入年服务营业收入" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否认证" prop="isAuth">
                        <el-select v-model="queryParams.isAuth" placeholder="请选择是否认证" clearable>
                            <el-option v-for="dict in es_is_auth" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <!-- 根据需要继续添加更多的表单项 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="服务对象数" prop="serveNum">
                        <el-input v-model="queryParams.serveNum" placeholder="请输入服务对象数" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                </el-col>
                <el-col :span="16" style="text-align: end;">
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery" class="search-btn">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery" class="reset-btn">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
                </el-form>
            </el-card>
        </div>


        <!-- 工具栏 -->
        <div class="toolbar-section">
            <div class="toolbar-left">
                <div class="result-count">
                    <el-icon><List /></el-icon>
                    <span>共找到 <strong>{{ total }}</strong> 条结果</span>
                </div>
            </div>
            <div class="toolbar-right">
                <el-button type="warning" plain icon="Download" @click="handleExport" 
                    v-hasPermi="['system:servicer:export']" class="export-btn">导出数据</el-button>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </div>
        </div>

        <!-- 搜索结果 -->
        <div class="results-section">
            <div class="results-header">
                <h2 class="results-title">搜索结果</h2>
            </div>
            <!-- 卡片式结果展示 -->
            <div v-loading="loading" class="results-container">
                <div class="servicer-grid">
                    <el-card v-for="servicer in servicerList" :key="servicer.id" 
                        class="servicer-card" shadow="hover" @click="handleRead(servicer)">
                        <div class="card-header">
                            <div class="card-avatar">
                                <img v-if="servicer.logo" :src="servicer.logo" :alt="servicer.name" class="avatar-img" />
                                <el-icon v-else class="avatar-icon"><User /></el-icon>
                            </div>
                            <div class="card-info">
                                <h3 class="servicer-name">{{ servicer.name }}</h3>
                                <div class="servicer-type">
                                    <dict-tag :options="es_org_type" :value="servicer.typeId" />
                                </div>
                            </div>
                            <div class="card-status">
                                <dict-tag :options="es_is_auth" :value="servicer.isAuth" />
                            </div>
                        </div>
                        
                        <div class="card-content">
                            <div class="info-row">
                                <el-icon class="info-icon"><Phone /></el-icon>
                                <span class="info-label">联系电话：</span>
                                <span class="info-value">{{ servicer.accountPhone || '暂无' }}</span>
                            </div>
                            <div class="info-row">
                                <el-icon class="info-icon"><User /></el-icon>
                                <span class="info-label">法人代表：</span>
                                <span class="info-value">{{ servicer.corporate || '暂无' }}</span>
                            </div>
                            <div class="info-row">
                                <el-icon class="info-icon"><Location /></el-icon>
                                <span class="info-label">联系地址：</span>
                                <span class="info-value">{{ (servicer.regionPre || '') + (servicer.regionXx || '') || '暂无' }}</span>
                            </div>
                            <div class="info-row">
                                <el-icon class="info-icon"><Setting /></el-icon>
                                <span class="info-label">经营状态：</span>
                                <dict-tag :options="es_manage_status" :value="servicer.manageForm" />
                            </div>
                            <div class="info-row description-row" v-if="servicer.introduce">
                                <el-icon class="info-icon"><Document /></el-icon>
                                <span class="info-label">主体介绍：</span>
                                <el-tooltip effect="dark" :content="servicer.introduce" placement="top-start">
                                    <span class="info-value description">{{ servicer.introduce.substring(0, 50) }}{{ servicer.introduce.length > 50 ? '...' : '' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <div class="stats">
                                <div class="stat-item" v-if="servicer.population">
                                    <span class="stat-label">从业人数</span>
                                    <span class="stat-value">{{ servicer.population }}</span>
                                </div>
                                <div class="stat-item" v-if="servicer.serveNum">
                                    <span class="stat-label">服务对象</span>
                                    <span class="stat-value">{{ servicer.serveNum }}</span>
                                </div>
                            </div>
                            <el-button type="primary" size="small" class="view-btn">
                                <el-icon><View /></el-icon>
                                查看详情
                            </el-button>
                        </div>
                    </el-card>
                </div>
                
                <!-- 空状态 -->
                <el-empty v-if="!loading && servicerList.length === 0" 
                    description="暂无搜索结果" class="empty-state">
                    <el-button type="primary" @click="resetQuery">重新搜索</el-button>
                </el-empty>
            </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-section" v-show="total > 0">
            <pagination :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList" />
        </div>

        <!-- 推荐内容 -->
        <div class="recommend-section">
            <recommendations></recommendations>
        </div>
    </div>
</template>
  
<script setup name="Servicer">
import { listServicer } from "@/api/public";
import recommendations from '@/views/Recommendations.vue'
import { useRouter } from "vue-router";
import { 
    Search, Filter, ArrowUp, ArrowDown, List, 
    User, Phone, Location, Setting, Document, View 
} from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance();
const { es_is_auth, es_org_type, es_manage_status } = proxy.useDict('es_is_auth', 'es_org_type', 'es_manage_status');

const servicerList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const route = useRoute();
const searchQuery = route.query.searchQuery;
const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: searchQuery,
        typeId: null,
        accountPhone: null,
        corporate: null,
        manageForm: null,
        regionId: null,
        introduce: null,
        logo: null,
        video: null,
        pictureUrls: null,
        population: null,
        income: null,
        serveNum: null,
        farmersNum: null,
        serveArea: null,
        raiseNum: null,
        waterNum: null,
        otherNum: null,
        cropArea: null,
        isAuth: null,
    },
    rules: {
        name: [
            { required: true, message: "主体名称不能为空", trigger: "blur" }
        ],
        accountPhone: [
            { required: true, message: "联系人电话不能为空", trigger: "blur" }
        ],
        corporate: [
            { required: true, message: "法人代表不能为空", trigger: "blur" }
        ],
    }
});

const { queryParams, form, rules } = toRefs(data);


/** 查询列表 */
function getList() {
    loading.value = true;

    listServicer(queryParams.value).then(response => {
        servicerList.value = response.rows;
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
        userId: null,
        name: null,
        typeId: null,
        accountPhone: null,
        corporate: null,
        manageForm: null,
        regionId: null,
        introduce: null,
        logo: null,
        video: null,
        pictureUrls: null,
        population: null,
        income: null,
        serveNum: null,
        farmersNum: null,
        serveArea: null,
        raiseNum: null,
        waterNum: null,
        otherNum: null,
        cropArea: null,
        isAuth: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
    };
    proxy.resetForm("servicerRef");
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    data.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: null,
        typeId: null,
        accountPhone: null,
        corporate: null,
        manageForm: null,
        regionId: null,
        introduce: null,
        logo: null,
        video: null,
        pictureUrls: null,
        population: null,
        income: null,
        serveNum: null,
        farmersNum: null,
        serveArea: null,
        raiseNum: null,
        waterNum: null,
        otherNum: null,
        cropArea: null,
        isAuth: null,
    }
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
    title.value = "添加服务主体";
}
const router = useRouter();
function handleRead(row) {
    const _id = row.id

    router.push({ name: 'ServiceSubjectDetail', query: { id: _id } })
}

/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getServicer(_id).then(response => {
        form.value = response.data;
        open.value = true;
        title.value = "修改服务主体";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["servicerRef"].validate(valid => {
        if (valid) {
            if (form.value.id != null) {
                updateServicer(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addServicer(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除服务主体编号为"' + _ids + '"的数据项？').then(function () {
        return delServicer(_ids);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('system/servicer/export', {
        ...queryParams.value
    }, `servicer_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style scoped>
.search-result-container {
    min-height: 100vh;
    background: #f8fafc;
    padding: 100px 0 40px;
}

/* 页面标题 */
.page-header {
    margin: 0 auto 20px;
    padding: 0 20px;
    max-width: 1200px;
}

.header-inline {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-icon {
    font-size: 22px;
    color: #10b981;
}

.page-title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.page-subtitle {
    font-size: 14px;
    color: #6b7280;
}

.header-divider {
    height: 1px;
    background: #e5e7eb;
    margin-top: 10px;
}

/* 筛选部分 */
.filter-section {
    max-width: 1200px;
    margin: 0 auto 32px;
    padding: 0 20px;
}

.filter-card {
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background: white;
}

.filter-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #374151;
}

.filter-title {
    flex: 1;
}

.filter-form {
    padding: 24px 0;
}

.search-btn {
    background: #10b981;
    border: 1px solid #10b981;
    border-radius: 6px;
    padding: 10px 20px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.search-btn:hover {
    background: #059669;
    border-color: #059669;
}

.reset-btn {
    border-radius: 6px;
    padding: 10px 20px;
    font-weight: 500;
    border: 1px solid #d1d5db;
    color: #6b7280;
    transition: all 0.2s ease;
}

.reset-btn:hover {
    border-color: #9ca3af;
    color: #4b5563;
}

/* 工具栏 */
.toolbar-section {
    max-width: 1200px;
    margin: 0 auto 24px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 16px 24px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.result-count {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: #374151;
}

.result-count strong {
    color: #10b981;
    font-weight: 600;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.export-btn {
    border-radius: 6px;
    border: 1px solid #f59e0b;
    color: #f59e0b;
    background: white;
    padding: 8px 16px;
    font-size: 14px;
    transition: all 0.2s ease;
}

.export-btn:hover {
    background: #f59e0b;
    color: white;
}

/* 结果部分 */
.results-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.results-header {
    margin-bottom: 20px;
    text-align: center;
}

.results-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.results-container {
    min-height: 400px;
}

/* 卡片网格 */
.servicer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
}

.servicer-card {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.servicer-card:hover {
    border-color: #10b981;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

/* 卡片头部 */
.card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid #f3f4f6;
}

.card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    background: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-icon {
    font-size: 20px;
    color: white;
}

.card-info {
    flex: 1;
    min-width: 0;
}

.servicer-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 6px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.servicer-type {
    margin-top: 4px;
}

.card-status {
    flex-shrink: 0;
}

/* 卡片内容 */
.card-content {
    padding: 16px 20px;
}

.info-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 14px;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-icon {
    font-size: 14px;
    color: #10b981;
    flex-shrink: 0;
    margin-top: 2px;
}

.info-label {
    color: #6b7280;
    font-weight: 500;
    min-width: 68px;
    flex-shrink: 0;
}

.info-value {
    color: #374151;
    font-weight: 400;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.description-row .info-value {
    white-space: normal;
    line-height: 1.4;
    max-height: 2.8em;
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.description {
    cursor: help;
}

/* 卡片底部 */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid #f3f4f6;
    background: #f9fafb;
}

.stats {
    display: flex;
    gap: 16px;
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 2px;
}

.stat-value {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #10b981;
}

.view-btn {
    border-radius: 6px;
    background: #10b981;
    border: 1px solid #10b981;
    color: white;
    font-weight: 500;
    font-size: 14px;
    padding: 6px 12px;
    transition: all 0.2s ease;
}

.view-btn:hover {
    background: #059669;
    border-color: #059669;
}

/* 空状态 */
.empty-state {
    padding: 60px 20px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
}

/* 分页 */
.pagination-section {
    margin: 32px auto;
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
}

/* 推荐部分 */
.recommend-section {
    margin-top: 48px;
    background: white;
    border-radius: 12px;
    padding: 32px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .search-result-container {
        padding: 80px 0 20px;
    }
    
    .servicer-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .toolbar-section {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        padding: 12px 16px;
    }
    
    .toolbar-left,
    .toolbar-right {
        justify-content: center;
    }
    
    .filter-section,
    .results-section,
    .pagination-section {
        padding: 0 12px;
    }
    
    .header-content {
        padding: 24px 20px;
        margin: 0 12px;
    }
    
    .filter-form :deep(.el-row) {
        flex-direction: column;
    }
    
    .filter-form :deep(.el-col) {
        width: 100% !important;
        margin-bottom: 16px;
    }
}

/* Element Plus 组件样式覆盖 */
.filter-form :deep(.el-input__wrapper) {
    border-radius: 6px;
    border: 1px solid #d1d5db;
    box-shadow: none;
    transition: all 0.2s ease;
}

.filter-form :deep(.el-input__wrapper:hover) {
    border-color: #9ca3af;
}

.filter-form :deep(.el-input__wrapper.is-focus) {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.filter-form :deep(.el-select .el-input__wrapper) {
    border-radius: 6px;
}

:deep(.el-card__header) {
    background: #f9fafb;
    border-bottom: 1px solid #e2e8f0;
}

:deep(.dict-tag) {
    border-radius: 4px;
    font-weight: 500;
    font-size: 12px;
    padding: 2px 8px;
}

:deep(.el-pagination) {
    justify-content: center;
}

:deep(.el-pagination .btn-next),
:deep(.el-pagination .btn-prev) {
    border-radius: 6px;
}

:deep(.el-pagination .el-pager li) {
    border-radius: 6px;
    margin: 0 2px;
}
</style> 