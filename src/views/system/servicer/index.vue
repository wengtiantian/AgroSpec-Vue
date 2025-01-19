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
      <el-form-item label="经营状态" prop="manageForm">
        <el-select v-model="queryParams.manageForm" placeholder="请选择经营状态" clearable>
          <el-option v-for="dict in es_manage_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="regionId">
        <el-input v-model="queryParams.regionId" placeholder="请输入地址" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="从业人数" prop="population">
        <el-input v-model="queryParams.population" placeholder="请输入从业人数" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="年服务营业收入" prop="income">
        <el-input v-model="queryParams.income" placeholder="请输入年服务营业收入" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="服务对象数" prop="serveNum">
        <el-input v-model="queryParams.serveNum" placeholder="请输入服务对象数" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="服务小农户数" prop="farmersNum">
        <el-input v-model="queryParams.farmersNum" placeholder="请输入服务小农户数" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="年服务面积" prop="serveArea">
        <el-input v-model="queryParams.serveArea" placeholder="请输入年服务面积" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="年畜牧服务量" prop="raiseNum">
        <el-input v-model="queryParams.raiseNum" placeholder="请输入年畜牧服务量" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="年水产服务量" prop="waterNum">
        <el-input v-model="queryParams.waterNum" placeholder="请输入年水产服务量" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="其他行业服务总量" prop="otherNum">
        <el-input v-model="queryParams.otherNum" placeholder="请输入其他行业服务总量" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="服务粮食作物面积" prop="cropArea">
        <el-input v-model="queryParams.cropArea" placeholder="请输入服务粮食作物面积" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="是否认证" prop="isAuth">
        <el-select v-model="queryParams.isAuth" placeholder="请选择是否认证" clearable>
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:servicer:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:servicer:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:servicer:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['system:servicer:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="servicerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务主体id" align="center" prop="id" />
      <el-table-column label="主体名称" align="center" prop="name" />
      <el-table-column label="组织类型" align="center" prop="typeId">
        <template #default="scope">
          <dict-tag :options="es_org_type" :value="scope.row.typeId" />
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center" prop="accountPhone" />
      <el-table-column label="法人代表" align="center" prop="corporate" />
      <el-table-column label="经营状态" align="center" prop="manageForm">
        <template #default="scope">
          <dict-tag :options="es_manage_status" :value="scope.row.manageForm" />
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="regionXx">
        <template #default="scope">
          {{ scope.row.regionPre + scope.row.regionXx }}
        </template>
      </el-table-column>
      <el-table-column label="主体介绍" align="center" prop="introduce">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.introduce && scope.row.introduce" placement="top-start">
            {{ scope.row.introduce && scope.row.introduce.substring(0, 10) }}
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column label="主体Logo" align="center" prop="logo" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.logo" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="主体视频" align="center" prop="video" />
      <el-table-column label="主体图片" align="center" prop="pictureUrls" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.pictureUrls" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="从业人数" align="center" prop="population" />
      <el-table-column label="年服务营业收入" align="center" prop="income" />
      <el-table-column label="服务对象数" align="center" prop="serveNum" />
      <el-table-column label="服务小农户数" align="center" prop="farmersNum" />
      <el-table-column label="年服务面积" align="center" prop="serveArea" />
      <el-table-column label="年畜牧服务量" align="center" prop="raiseNum" />
      <el-table-column label="年水产服务量" align="center" prop="waterNum" />
      <el-table-column label="其他行业服务总量" align="center" prop="otherNum" />
      <el-table-column label="服务粮食作物面积" align="center" prop="cropArea" />
      <el-table-column label="是否认证" align="center" prop="isAuth">
        <template #default="scope">
          <dict-tag :options="es_is_auth" :value="scope.row.isAuth" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:servicer:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:servicer:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改服务主体对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="servicerRef" :model="form" :rules="rules">
        <!-- <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item> -->
        <el-form-item label="主体名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入主体名称" />
        </el-form-item>
        <el-form-item label="组织类型" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择组织类型">
            <el-option v-for="dict in es_org_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人电话" prop="accountPhone">
          <el-input v-model="form.accountPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="法人代表" prop="corporate">
          <el-input v-model="form.corporate" placeholder="请输入法人代表" />
        </el-form-item>
        <el-form-item label="经营状态" prop="manageForm">
          <el-select v-model="form.manageForm" placeholder="请选择经营状态">
            <el-option v-for="dict in es_manage_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="regionId">
          <!-- {{ form.regionPre }}
          {{ form.regionId }} -->
          <RegionCascader :width="'100%'" v-model:text="form.regionPre" v-model="form.regionId" />
          <el-input v-model="form.regionXx" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="主体介绍">
          <editor v-model="form.introduce" :min-height="192" />
        </el-form-item>
        <el-form-item label="主体Logo" prop="logo">
          <image-upload v-model="form.logo" />
        </el-form-item>
        <el-form-item label="主体视频" prop="video">
          <file-upload :limit="1" :fileSize="100" :fileType="['mp4']" v-model="form.video" />
        </el-form-item>
        <el-form-item label="主体图片" prop="pictureUrls">
          <image-upload v-model="form.pictureUrls" />
        </el-form-item>
        <el-form-item label="从业人数" prop="population">
          <el-input v-model="form.population" placeholder="请输入从业人数" />
        </el-form-item>
        <el-form-item label="年服务营业收入" prop="income">
          <el-input v-model="form.income" placeholder="请输入年服务营业收入" />
        </el-form-item>
        <el-form-item label="服务对象数" prop="serveNum">
          <el-input v-model="form.serveNum" placeholder="请输入服务对象数" />
        </el-form-item>
        <el-form-item label="服务小农户数" prop="farmersNum">
          <el-input v-model="form.farmersNum" placeholder="请输入服务小农户数" />
        </el-form-item>
        <el-form-item label="年服务面积" prop="serveArea">
          <el-input v-model="form.serveArea" placeholder="请输入年服务面积" />
        </el-form-item>
        <el-form-item label="年畜牧服务量" prop="raiseNum">
          <el-input v-model="form.raiseNum" placeholder="请输入年畜牧服务量" />
        </el-form-item>
        <el-form-item label="年水产服务量" prop="waterNum">
          <el-input v-model="form.waterNum" placeholder="请输入年水产服务量" />
        </el-form-item>
        <el-form-item label="其他行业服务总量" prop="otherNum">
          <el-input v-model="form.otherNum" placeholder="请输入其他行业服务总量" />
        </el-form-item>
        <el-form-item label="服务粮食作物面积" prop="cropArea">
          <el-input v-model="form.cropArea" placeholder="请输入服务粮食作物面积" />
        </el-form-item>
        <!-- <el-form-item label="是否认证" prop="isAuth">
          <el-select v-model="form.isAuth" placeholder="请选择是否认证">
            <el-option v-for="dict in es_is_auth" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item> -->
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

<script setup name="Servicer">
import { listServicer, getServicer, delServicer, addServicer, updateServicer } from "@/api/system/servicer";
import RegionCascader from '../../servicer/RegionSelect.vue';
import { getRegionTextByPath } from '@/utils/region'
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
const preRegionText = ref("");

const data = reactive({
  form: {},
  queryParams: {
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

/** 查询服务主体列表 */
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
    regionXx: null,
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
  title.value = "添加服务主体";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getServicer(_id).then(response => {
    form.value = response.data;
    form.value.regionId = JSON.parse(form.value.regionId)
    open.value = true;
    title.value = "修改服务主体";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["servicerRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        form.value.regionId = JSON.stringify(form.value.regionId)

        console.log(preRegionText.value)
        console.log(form.value.regionXx)
        updateServicer(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        form.value.regionId = JSON.stringify(form.value.regionId)
        console.log(form.value.regionXx)
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
