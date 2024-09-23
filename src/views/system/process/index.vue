<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务主体ID" prop="servicerId">
        <el-input v-model="queryParams.servicerId" placeholder="请输入服务主体ID" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="审核结果" prop="auditResult">
        <el-select v-model="queryParams.auditResult" placeholder="请选择审核结果" clearable>
          <el-option v-for="dict in sys_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditorId">
        <el-input v-model="queryParams.auditorId" placeholder="请输入审核人" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker clearable v-model="queryParams.auditTime" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择审核时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="软删除标识时间" prop="deletedAt">
        <el-date-picker clearable v-model="queryParams.deletedAt" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择软删除标识时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:process:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:process:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:process:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['system:process:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="processList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="审核流程ID" align="center" prop="id" />
      <el-table-column label="服务主体ID" align="center" prop="servicerId" />
      <!-- <el-table-column label="审核内容" align="center" prop="auditContent" /> -->
      <el-table-column label="审核结果" align="center" prop="auditResult">
        <template #default="scope">
          <dict-tag :options="sys_common_status" :value="scope.row.auditResult" />
        </template>
      </el-table-column>
      <el-table-column label="评语" align="center" prop="comments" />
      <el-table-column label="审核人" align="center" prop="auditorId" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="软删除标识时间" align="center" prop="deletedAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deletedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:process:edit']">修改</el-button> -->
          <el-button v-if="scope.row.auditResult === null" link type="primary" icon="Edit" @click="handleAudit(scope.row)"
            v-hasPermi="['system:process:edit']">审核</el-button>
          <el-button v-else link type="primary" icon="Edit" @click="handleDetail(scope.row)"
            v-hasPermi="['system:process:edit']">查看详情</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:process:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改服务主体审核对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="processRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="服务主体ID" prop="servicerId">
          <el-input v-model="form.servicerId" placeholder="请输入服务主体ID" />
        </el-form-item>
        <el-form-item label="审核内容" prop="auditContent">
          <el-input v-model="form.auditContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="审核结果" prop="auditResult">
          <el-radio-group v-model="form.auditResult">
            <el-radio v-for="dict in sys_common_status" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评语" prop="comments">
          <el-input v-model="form.comments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="审核人" prop="auditorId">
          <el-input v-model="form.auditorId" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker clearable v-model="form.auditTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择审核时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="软删除标识时间" prop="deletedAt">
          <el-date-picker clearable v-model="form.deletedAt" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择软删除标识时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="openDeatil" append-to-body>
      <el-watermark :content="content" :font="{ fontSize: 24 }">
        <div class="pending-content">

          <h2>申报信息</h2>
          <el-descriptions border :column="2">
            <!-- Basic Information -->
            <el-descriptions-item label="主体名称">{{ basicInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="组织类型"> <dict-tag :options="es_org_type" :value="basicInfo.typeId" />
            </el-descriptions-item>
            <el-descriptions-item label="联系人电话">{{ basicInfo.accountPhone }}</el-descriptions-item>
            <el-descriptions-item label="法人代表">{{ basicInfo.corporate }}</el-descriptions-item>
            <el-descriptions-item label="经营状态"> <dict-tag :options="es_manage_status" :value="basicInfo.manageForm" />
            </el-descriptions-item>
            <el-descriptions-item label="详细地址">{{ basicInfo.regionXx }}</el-descriptions-item>
            <el-descriptions-item label="服务区域ID">{{ basicInfo.regionId }}</el-descriptions-item>

            <!-- Service Situation -->
            <el-descriptions-item label="从业人数">{{ basicInfo.population }}</el-descriptions-item>
            <el-descriptions-item label="年服务营业收入">{{ basicInfo.income }}</el-descriptions-item>
            <el-descriptions-item label="服务对象数">{{ basicInfo.serveNum }}</el-descriptions-item>
            <el-descriptions-item label="服务小农户数">{{ basicInfo.farmersNum }}</el-descriptions-item>
            <el-descriptions-item label="年服务面积">{{ basicInfo.serveArea }}</el-descriptions-item>
            <el-descriptions-item label="年畜牧服务量">{{ basicInfo.raiseNum }}</el-descriptions-item>
            <el-descriptions-item label="年水产服务量">{{ basicInfo.waterNum }}</el-descriptions-item>
            <el-descriptions-item label="其他行业服务总量">{{ basicInfo.otherNum }}</el-descriptions-item>
            <el-descriptions-item label="服务粮食作物面积">{{ basicInfo.cropArea }}</el-descriptions-item>

            <!-- Subject Situation -->
            <el-descriptions-item label="主体介绍">{{ basicInfo.introduce }}</el-descriptions-item>
            <el-descriptions-item label="主体Logo"> <image-preview :src="basicInfo.logo" :width="50" :height="50" />
            </el-descriptions-item>
            <el-descriptions-item label="主体视频"> <video :src="baseUrl + basicInfo.video" controls width="500"
                height="200"></video>
            </el-descriptions-item>
            <el-descriptions-item label="营业执照">
              <image-preview :src="basicInfo.manageCert" :width="100" :height="100" /></el-descriptions-item>
            <el-descriptions-item label="主体图片"><image-preview :src="basicInfo.pictureUrls" :width="100"
                :height="100" /></el-descriptions-item>
            <el-descriptions-item label="">
              <ServiceTypeSelector :disabled="true" v-model="storedPaths" />

            </el-descriptions-item>

          </el-descriptions>
          <!-- Agricultural Machinery Information -->


          <div v-for="(machine, index) in machineInfoList" :key="index">
            <el-descriptions border :column="2">
              <el-descriptions-item label="农机名称">{{ machine.machineName }}</el-descriptions-item>
              <el-descriptions-item label="农机型号">{{ machine.machineModel }}</el-descriptions-item>
              <el-descriptions-item label="终端编号">{{ machine.terminalNumber }}</el-descriptions-item>
              <el-descriptions-item label="生产厂家">{{ machine.manufacturer }}</el-descriptions-item>
              <el-descriptions-item label="农机图片URL"><image-preview :src="machine.machineImageUrl" :width="50"
                  :height="50" /></el-descriptions-item>
            </el-descriptions>

          </div>



          <div v-if="!isDetail" class="cxsq">
            <el-input v-model="form.comments"></el-input>
            <el-select v-model="form.auditResult" placeholder="请选择审核结果" clearable>
              <el-option v-for="dict in sys_common_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-button type="success" @click="handleSubmit">提交</el-button>
          </div>
        </div>
      </el-watermark>
    </el-dialog>
  </div>
</template>

<script setup name="Process">
import { listProcess, getProcess, delProcess, addProcess, updateProcess } from "@/api/system/process";
import { addMachinery } from "@/api/system/machinery"
import ServiceTypeSelector from '@/views/servicer/TypeSelect.vue'
const { proxy } = getCurrentInstance();
const baseUrl = import.meta.env.VITE_APP_BASE_API;
import { updateServicer } from '@/api/system/servicer'

const { sys_common_status, es_manage_status, es_org_type } = proxy.useDict('sys_common_status', 'es_manage_status', 'es_org_type');
const storedPaths = ref('');
const processList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const openDeatil = ref(false);
const content = ref('');
const isDetail = ref(false);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    servicerId: null,
    auditContent: null,
    auditResult: null,
    comments: null,
    auditorId: null,
    auditTime: null,
    deletedAt: null
  },
  rules: {
    servicerId: [
      { required: true, message: "服务主体ID不能为空", trigger: "blur" }
    ],
    auditContent: [
      { required: true, message: "审核内容不能为空", trigger: "blur" }
    ],
    auditResult: [
      { required: true, message: "审核结果不能为空", trigger: "change" }
    ],
    auditorId: [
      { required: true, message: "审核人不能为空", trigger: "blur" }
    ],
  },
  basicInfo: {},
  machineInfoList: [],
});

const { queryParams, form, rules, basicInfo, machineInfoList } = toRefs(data);

/** 查询服务主体审核列表 */
function getList() {
  loading.value = true;
  listProcess(queryParams.value).then(response => {
    processList.value = response.rows;
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
    servicerId: null,
    auditContent: null,
    auditResult: null,
    comments: null,
    auditorId: null,
    auditTime: null,
    createTime: null,
    updateTime: null,
    deletedAt: null
  };
  proxy.resetForm("processRef");
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
  title.value = "添加服务主体审核";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProcess(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改服务主体审核";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["processRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProcess(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProcess(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除服务主体审核编号为"' + _ids + '"的数据项？').then(function () {
    return delProcess(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/process/export', {
    ...queryParams.value
  }, `process_${new Date().getTime()}.xlsx`)
}


function handleAudit(row) {
  const _id = row.id || ids.value
  getProcess(_id).then(response => {
    form.value = response.data;
    const data = JSON.parse(form.value.auditContent);
    basicInfo.value = data.basicInfo;
    machineInfoList.value = data.machineInfoList;
    storedPaths.value = data.type;
    isDetail.value = false;
    content.value = '待审核';
    openDeatil.value = true;

  });

}
function handleSubmit() {
  if (form.value.auditResult == 0) {
    //通过
    basicInfo.value.isAuth = 1;
    updateServicer(basicInfo.value).then(res => {
      machineInfoList.value.map(machine => { machine.serviceSubjectId = basicInfo.value.id; return machine; })
      Promise.all(machineInfoList.value.map(machine => addMachinery(machine))).then(res => {
        updateProcess(form.value).then(res => {
          proxy.$modal.msgSuccess("提交成功");
          openDeatil.value = false;
          getList();
        });
      })
    })

  } else if (form.value.auditResult == 1) {
    //不通过
    updateProcess(form.value).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      openDeatil.value = false;
      getList();
    });
  }

}

function handleDetail(row) {

  const _id = row.id || ids.value
  getProcess(_id).then(response => {
    form.value = response.data;
    const data = JSON.parse(form.value.auditContent);
    basicInfo.value = data.basicInfo;
    machineInfoList.value = data.machineInfoList;
    storedPaths.value = data.type;
    isDetail.value = true;
    content.value = '已审核';
    openDeatil.value = true;

  });


}

getList();
</script>
<style scoped>
.cxsq {
  margin-top: 10px;
  display: flex;
}
</style>