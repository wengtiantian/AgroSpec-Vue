<template>
    <div class="app-container">
        <h1 style="text-align: center;">服务标准</h1>
        <el-form class="form" :inline="true" :model="queryParams" ref="queryRef" v-show="showSearch">

            <h2> 筛选条件</h2>
            <el-form-item label-position="right" label="名称" prop="fileName">
                <el-input v-model="queryParams.fileName" placeholder="请输入标准文件的名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label-position="right" label="发布者" prop="issuingAgency">
                <el-input v-model="queryParams.issuingAgency" placeholder="请输入发布该标准文件的机构名称" clearable
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label-position="right" label="发布日期" prop="issueDate">
                <el-date-picker clearable v-model="queryParams.issueDate" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择文件的发布日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label-position="right" label="类别" prop="standardCategory">
                <el-input v-model="queryParams.standardCategory" placeholder="请输入文件所属的标准类别" clearable
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>


        </el-form>
        <h2> 搜索结果</h2>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>


        <el-table size="large" border stripe v-loading="loading" :data="standardsList"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column label="标准编号" align="center" prop="id" /> -->
            <el-table-column label="名称" align="center" prop="fileName">
                <template #default="scope">
                    <el-button link type="default" @click="handleRead(scope.row)">{{ scope.row.fileName }}</el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column label="标准文件" align="center" prop="fileNumber" /> -->
            <el-table-column label="发布者" align="center" prop="issuingAgency" />
            <el-table-column label="发布日期" align="center" prop="issueDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.issueDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类别" align="center" prop="standardCategory" />
            <el-table-column label="服务范围" align="center" prop="serviceScope" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button link type="primary" icon="Reading" @click="handleRead(scope.row)">在线阅读</el-button>
                    <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        <div class="recommend">
            <recommendations></recommendations>

        </div>


    </div>
</template>
  
<script setup name="Standards">
import { listStandards } from "@/api/public";
import recommendations from '@/views/Recommendations.vue'

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

/** 修改按钮操作 */
function handleRead(row) {
    const _id = row.fileNumber

    openNewWindow('/online-reading?src=' + baseUrl + _id)
    // router.push({ name: 'OnlineReading', query: { src: baseUrl + _id } })
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
.app-container {
    padding-top: 150px;
    padding-left: 20%;
    padding-right: 20%;

}
</style> 