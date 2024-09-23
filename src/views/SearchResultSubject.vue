<template>
    <div class="app-container">
        <h1 style="text-align: center;">服务主体</h1>

        <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="120px">
            <h2> 筛选条件</h2>
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
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>


        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport"
                    v-hasPermi="['system:servicer:export']">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <h2> 搜索结果</h2>
        <el-table size="large" border stripe v-loading="loading" :data="servicerList"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="名称" align="center" prop="name" />
            <el-table-column label="组织类型" align="center" prop="typeId">
                <template #default="scope">
                    <dict-tag :options="es_org_type" :value="scope.row.typeId" />
                </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center" prop="accountPhone" />
            <el-table-column label="法人代表" align="center" prop="corporate" />
            <el-table-column label="经营状态" align="center" prop="manageForm">
                <template #default="scope">
                    <dict-tag :options="es_manage_status" :value="scope.row.manageForm" />
                </template>
            </el-table-column>
            <el-table-column label="服务区域" align="center" prop="regionId" />
            <el-table-column label="主体介绍" align="center" prop="introduce" />
            <el-table-column label="是否认证" align="center" prop="isAuth">
                <template #default="scope">
                    <dict-tag :options="es_is_auth" :value="scope.row.isAuth" />
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['system:servicer:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['system:servicer:remove']">删除</el-button>
          </template>
        </el-table-column> -->
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />
        <div class="recommend">
            <recommendations></recommendations>

        </div>
    </div>
</template>
  
<script setup name="Servicer">
import { listServicer, getServicer, delServicer, addServicer, updateServicer } from "@/api/system/servicer";
import recommendations from '@/views/Recommendations.vue'

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
.app-container {
    padding-top: 150px;
    padding-left: 20%;
    padding-right: 20%;

}
</style> 