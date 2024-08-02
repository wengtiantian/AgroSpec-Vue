<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组织类型" prop="typeId">
        <el-select v-model="queryParams.typeId" placeholder="请选择组织类型" clearable>
          <el-option
            v-for="dict in es_org_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产主体名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入生产主体名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人电话" prop="accountPhone">
        <el-input
          v-model="queryParams.accountPhone"
          placeholder="请输入联系人电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号码" prop="idNumber">
        <el-input
          v-model="queryParams.idNumber"
          placeholder="请输入身份证号码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="土地确权证号" prop="soilNum">
        <el-input
          v-model="queryParams.soilNum"
          placeholder="请输入土地确权证号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区" prop="regionId">
        <el-input
          v-model="queryParams.regionId"
          placeholder="请输入地区"
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
          v-hasPermi="['system:producter:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:producter:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:producter:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:producter:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="producterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务主体id" align="center" prop="id" />
      <el-table-column label="组织类型" align="center" prop="typeId">
        <template #default="scope">
          <dict-tag :options="es_org_type" :value="scope.row.typeId"/>
        </template>
      </el-table-column>
      <el-table-column label="生产主体名称" align="center" prop="name" />
      <el-table-column label="联系人电话" align="center" prop="accountPhone" />
      <el-table-column label="身份证号码" align="center" prop="idNumber" />
      <el-table-column label="土地确权证号" align="center" prop="soilNum" />
      <el-table-column label="土地确权证书图片路径" align="center" prop="soilpic" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.soilpic" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="承包合同图片路径" align="center" prop="contract" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.contract" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="营业执照图片路径" align="center" prop="businessLicense" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.businessLicense" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center" prop="regionId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:producter:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:producter:remove']">删除</el-button>
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

    <!-- 添加或修改生产主体管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="producterRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户" />
        </el-form-item>
        <el-form-item label="组织类型" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择组织类型">
            <el-option
              v-for="dict in es_org_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产主体名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入生产主体名称" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="accountPhone">
          <el-input v-model="form.accountPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idNumber">
          <el-input v-model="form.idNumber" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="土地确权证号" prop="soilNum">
          <el-input v-model="form.soilNum" placeholder="请输入土地确权证号" />
        </el-form-item>
        <el-form-item label="土地确权证书图片路径" prop="soilpic">
          <image-upload v-model="form.soilpic"/>
        </el-form-item>
        <el-form-item label="承包合同图片路径" prop="contract">
          <image-upload v-model="form.contract"/>
        </el-form-item>
        <el-form-item label="营业执照图片路径" prop="businessLicense">
          <image-upload v-model="form.businessLicense"/>
        </el-form-item>
        <el-form-item label="地区" prop="regionId">
          <el-input v-model="form.regionId" placeholder="请输入地区" />
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

<script setup name="Producter">
import { listProducter, getProducter, delProducter, addProducter, updateProducter } from "@/api/system/producter";

const { proxy } = getCurrentInstance();
const { es_org_type } = proxy.useDict('es_org_type');

const producterList = ref([]);
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
    typeId: null,
    name: null,
    accountPhone: null,
    idNumber: null,
    soilNum: null,
    soilpic: null,
    contract: null,
    businessLicense: null,
    regionId: null,
  },
  rules: {
    name: [
      { required: true, message: "生产主体名称不能为空", trigger: "blur" }
    ],
    accountPhone: [
      { required: true, message: "联系人电话不能为空", trigger: "blur" }
    ],
    idNumber: [
      { required: true, message: "身份证号码不能为空", trigger: "blur" }
    ],
    soilNum: [
      { required: true, message: "土地确权证号不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询生产主体管理列表 */
function getList() {
  loading.value = true;
  listProducter(queryParams.value).then(response => {
    producterList.value = response.rows;
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
    typeId: null,
    name: null,
    accountPhone: null,
    idNumber: null,
    soilNum: null,
    soilpic: null,
    contract: null,
    businessLicense: null,
    regionId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("producterRef");
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
  title.value = "添加生产主体管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProducter(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改生产主体管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["producterRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProducter(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProducter(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除生产主体管理编号为"' + _ids + '"的数据项？').then(function() {
    return delProducter(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/producter/export', {
    ...queryParams.value
  }, `producter_${new Date().getTime()}.xlsx`)
}

getList();
</script>
