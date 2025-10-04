<template>
    <div class="search-result-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-inline">
                <el-icon class="header-icon"><Document /></el-icon>
                <h1 class="page-title">{{ pageTitle }}</h1>
                <span class="page-subtitle">{{ pageSubtitle }}</span>
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
                        <el-col :span="6">
                            <el-form-item label="名称" prop="fileName">
                <el-input v-model="queryParams.fileName" placeholder="请输入标准文件的名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="发布者" prop="issuingAgency">
                                <el-input v-model="queryParams.issuingAgency" placeholder="请输入发布机构名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="发布日期" prop="issueDate">
                <el-date-picker clearable v-model="queryParams.issueDate" type="date" value-format="YYYY-MM-DD"
                                    placeholder="请选择发布日期" style="width: 100%">
                </el-date-picker>
            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="类别" prop="standardCategory">
                                <el-select v-model="queryParams.standardCategory" placeholder="请选择标准类别" clearable style="width: 100%">
                                    <el-option v-for="dict in standard_category" :key="dict.value" :label="dict.label" :value="dict.value" />
                                </el-select>
            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="领域" prop="standardDomain">
                                <el-select v-model="queryParams.standardDomain" placeholder="请选择标准领域" clearable style="width: 100%">
                                    <el-option v-for="dict in standard_domain" :key="dict.value" :label="dict.label" :value="dict.value" />
                                </el-select>
            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="form-actions">
                                <el-button type="primary" icon="Search" @click="handleQuery" class="search-btn">搜索</el-button>
                                <el-button icon="Refresh" @click="resetQuery" class="reset-btn">重置</el-button>
                            </div>
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
                <el-button type="warning" plain icon="Download" @click="handleExport" class="export-btn">导出数据</el-button>
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
                <div class="standards-grid">
                    <el-card v-for="standard in standardsList" :key="standard.id" 
                        class="standard-card" shadow="hover" @click="handleRead(standard)">
                        <div class="card-header">
                            <div class="card-icon">
                                <el-icon class="file-icon"><Document /></el-icon>
                            </div>
                            <div class="card-info">
                                <h3 class="standard-name">{{ standard.fileName }}</h3>
                                <div class="standard-category">
                                    <dict-tag :options="standard_category" :value="standard.standardCategory" />
                                </div>
                            </div>
                            <div class="card-date">
                                <span class="date-label">发布日期</span>
                                <span class="date-value">{{ parseTime(standard.issueDate, '{y}-{m}-{d}') || '暂无' }}</span>
                            </div>
                        </div>
                        
                        <div class="card-content">
                            <div class="info-row">
                                <el-icon class="info-icon"><OfficeBuilding /></el-icon>
                                <span class="info-label">发布机构：</span>
                                <span class="info-value">{{ standard.issuingAgency || '暂无' }}</span>
                            </div>
                            <div class="info-row" v-if="standard.serviceScope">
                                <el-icon class="info-icon"><Location /></el-icon>
                                <span class="info-label">服务范围：</span>
                                <dict-tag :options="standard_domain" :value="standard.serviceScope" />
                            </div>
                            <div class="info-row" v-if="standard.effectiveDate">
                                <el-icon class="info-icon"><Calendar /></el-icon>
                                <span class="info-label">生效日期：</span>
                                <span class="info-value">{{ parseTime(standard.effectiveDate, '{y}-{m}-{d}') }}</span>
                            </div>
                            <div class="info-row" v-if="standard.fileNumber">
                                <el-icon class="info-icon"><Collection /></el-icon>
                                <span class="info-label">标准编号：</span>
                                <span class="info-value">{{ standard.fileNumber }}</span>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <div class="file-info">
                                <div class="file-status" v-if="standard.attachments">
                                    <el-icon class="status-icon"><Check /></el-icon>
                                    <span>有附件</span>
                                </div>
                                <div class="file-status no-file" v-else>
                                    <el-icon class="status-icon"><Close /></el-icon>
                                    <span>无附件</span>
                                </div>
                            </div>
                            <div class="card-actions">
                                <el-button type="primary" size="small" icon="Reading" @click.stop="handleRead(standard)" 
                                    class="action-btn" :disabled="!standard.attachments">
                                    在线阅读
                                </el-button>
                                <el-button type="success" size="small" icon="Download" @click.stop="handleDownload(standard)" 
                                    class="action-btn" :disabled="!standard.attachments">
                                    下载
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
                
                <!-- 空状态 -->
                <el-empty v-if="!loading && standardsList.length === 0" 
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
  
<script setup name="Standards">
import { listStandards } from "@/api/public";
import recommendations from '@/views/Recommendations.vue'
import { 
    Document, Filter, ArrowUp, ArrowDown, List, 
    OfficeBuilding, Location, Calendar, Collection, 
    Check, Close, Reading, Download 
} from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance();
const { standard_category, standard_domain } = proxy.useDict('standard_category', 'standard_domain');

const standardsList = ref([]);
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
        fileName: searchQuery,
        fileNumber: null,
        issuingAgency: null,
        issueDate: null,
        effectiveDate: null,
        standardCategory: null,
        standardDomain: route.query.standardDomain || null,
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

// 动态页面标题
const pageTitle = computed(() => {
    const standardDomain = route.query.standardDomain;
    if (standardDomain === '2') { // 种植标准的字典值是2
        return '种植标准库';
    } else if (standardDomain === '1') { // 养殖标准的字典值是1
        return '养殖标准库';
    }
    return '服务标准搜索';
});

const pageSubtitle = computed(() => {
    const standardDomain = route.query.standardDomain;
    if (standardDomain === '2') { // 种植标准的字典值是2
        return '种植相关的农业服务标准文件';
    } else if (standardDomain === '1') { // 养殖标准的字典值是1
        return '养殖相关的农业服务标准文件';
    }
    return '查找您需要的农业服务标准文件';
});

function openNewWindow(path) {
    const newWindow = window.open(window.location.origin);
    if (newWindow) {
        // 在新窗口中设置路由
        newWindow.location.href = `${window.location.origin}${path}`;
    } else {
        console.error('窗口打开失败');
    }
}

/** 查询标准管理列表 */
function getList() {
    loading.value = true;

    // 清理查询参数，只传递有值的参数
    const cleanParams = {};
    Object.keys(queryParams.value).forEach(key => {
        const value = queryParams.value[key];
        if (value !== null && value !== undefined && value !== '') {
            cleanParams[key] = value;
        }
    });
    
    console.log('查询参数:', cleanParams);
    
    listStandards(cleanParams).then(response => {
        console.log('API响应:', response);
        standardsList.value = response.rows || [];
        total.value = response.total || 0;
        loading.value = false;
    }).catch(error => {
        console.error('查询标准列表失败:', error);
        standardsList.value = [];
        total.value = 0;
        loading.value = false;
        proxy.$message.error('查询失败，请稍后重试');
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
        isDownloadd: null
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
    data.queryParams = {
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
    }
    handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}
const router = useRouter()
const baseUrl = import.meta.env.VITE_APP_BASE_API;

/** 在线阅读按钮操作 */
function handleRead(row) {
    if (row.attachments) {
        openNewWindow('/online-reading?src=' + baseUrl + row.attachments)
    } else {
        console.warn('该标准文件没有上传附件')
        proxy.$modal.msgWarning('该标准文件没有上传附件，无法在线阅读')
    }
}

/** 下载按钮操作 */
function handleDownload(row) {
    if (row.attachments) {
        const downloadUrl = baseUrl + row.attachments
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = row.fileName + '.pdf'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } else {
        console.warn('该标准文件没有上传附件')
        proxy.$modal.msgWarning('该标准文件没有上传附件，无法下载')
    }
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('system/standards/export', {
        ...queryParams.value
    }, `standards_${new Date().getTime()}.xlsx`)
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

.form-actions {
    text-align: center;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}

.search-btn {
    background: #10b981;
    border: 1px solid #10b981;
    border-radius: 6px;
    padding: 12px 24px;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 100px;
}

.search-btn:hover {
    background: #059669;
    border-color: #059669;
}

.reset-btn {
    border-radius: 6px;
    padding: 12px 24px;
    font-weight: 500;
    border: 1px solid #d1d5db;
    color: #6b7280;
    transition: all 0.2s ease;
    min-width: 100px;
    background: white;
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

/* 标准卡片网格 */
.standards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
}

.standard-card {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.standard-card:hover {
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

.card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.file-icon {
    font-size: 20px;
    color: white;
}

.card-info {
    flex: 1;
    min-width: 0;
}

.standard-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 6px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.standard-category {
    margin-top: 4px;
}

.card-date {
    text-align: right;
    flex-shrink: 0;
}

.date-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 2px;
}

.date-value {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
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

/* 卡片底部 */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid #f3f4f6;
    background: #f9fafb;
}

.file-info {
    display: flex;
    align-items: center;
}

.file-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #10b981;
    font-weight: 500;
}

.file-status.no-file {
    color: #ef4444;
}

.status-icon {
    font-size: 14px;
}

.card-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    padding: 6px 12px;
    transition: all 0.2s ease;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    
    .standards-grid {
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
    
    .form-actions {
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }
    
    .search-btn,
    .reset-btn {
        width: 200px;
        max-width: 100%;
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

.filter-form :deep(.el-date-editor .el-input__wrapper) {
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