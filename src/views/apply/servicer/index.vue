<!--
 * @Author: wengtiantian
 * @Description: 网页展示——服务主体申请功能
-->
<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>服务主体申请</h2>
      <p class="page-description">申请成为服务主体，为农业服务提供专业支持</p>
    </div>

    <!-- 申请状态显示 -->
    <div class="status-section" v-if="status !== null">
      <el-card class="status-card">
        <div class="status-content">
          <div class="status-icon">
            <el-icon v-if="status === 0" class="status-unapplied"><Clock /></el-icon>
            <el-icon v-else-if="status === 1" class="status-approved"><Check /></el-icon>
            <el-icon v-else class="status-pending"><Clock /></el-icon>
          </div>
          <div class="status-info">
            <h3 v-if="status === 0">您还未申请服务主体</h3>
            <h3 v-else-if="status === 1">您的服务主体申请已通过</h3>
            <h3 v-else>您的服务主体申请正在审核中</h3>
            <p v-if="status === 0">点击下方按钮开始申请</p>
            <p v-else-if="status === 1">恭喜您获得服务主体资格</p>
            <p v-else>请耐心等待审核结果</p>
          </div>
        </div>
        <div class="status-actions">
          <el-button v-if="status === 0" type="primary" @click="startApplication">
            <el-icon><Plus /></el-icon>
            开始申请
          </el-button>
          <el-button v-else-if="status === 2" type="primary" @click="viewApplication">
            <el-icon><View /></el-icon>
            查看申请
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 申请表单 -->
    <div v-if="showSteps" class="application-form">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="基本信息" description="填写主体基本信息"></el-step>
        <el-step title="服务信息" description="填写服务相关信息"></el-step>
        <el-step title="附件信息" description="上传相关附件"></el-step>
        <el-step title="提交申请" description="确认并提交申请"></el-step>
      </el-steps>

      <div class="step-content">
        <!-- 步骤1：基本信息 -->
        <div v-if="currentStep === 0" class="step-panel">
          <h3>基本信息</h3>
          <el-form :model="basicInfo" :rules="basicRules" ref="basicFormRef" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主体名称" prop="name">
                  <el-input v-model="basicInfo.name" placeholder="请输入主体名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织类型" prop="typeId">
                  <el-select v-model="basicInfo.typeId" placeholder="请选择组织类型">
                    <el-option v-for="dict in es_org_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="联系人电话" prop="accountPhone">
                  <el-input v-model="basicInfo.accountPhone" placeholder="请输入联系人电话" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人代表" prop="corporate">
                  <el-input v-model="basicInfo.corporate" placeholder="请输入法人代表" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="服务区域" prop="regionPre">
                  <RegionCascader v-model="basicInfo.regionPre" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细地址" prop="regionXx">
                  <el-input v-model="basicInfo.regionXx" placeholder="请输入详细地址" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="主体介绍" prop="introduce">
              <el-input v-model="basicInfo.introduce" type="textarea" :rows="4" placeholder="请输入主体介绍" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤2：服务信息 -->
        <div v-if="currentStep === 1" class="step-panel">
          <h3>服务信息</h3>
          <el-form :model="basicInfo" :rules="serviceRules" ref="serviceFormRef" label-width="120px">
            <el-form-item label="服务种类" prop="serviceTypeXx">
              <ServiceTypeSelector v-model="basicInfo.serviceTypeXx" v-model:selectedText="selectedServiceTypeTexts" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="从业人数" prop="population">
                  <el-input-number v-model="basicInfo.population" :min="0" placeholder="请输入从业人数" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年服务营业收入" prop="income">
                  <el-input-number v-model="basicInfo.income" :min="0" :precision="2" placeholder="请输入年服务营业收入" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务对象数" prop="serveNum">
                  <el-input-number v-model="basicInfo.serveNum" :min="0" placeholder="请输入服务对象数" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="服务小农户数" prop="farmersNum">
                  <el-input-number v-model="basicInfo.farmersNum" :min="0" placeholder="请输入服务小农户数" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年服务面积" prop="serveArea">
                  <el-input-number v-model="basicInfo.serveArea" :min="0" :precision="2" placeholder="请输入年服务面积" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年畜牧服务量" prop="raiseNum">
                  <el-input-number v-model="basicInfo.raiseNum" :min="0" placeholder="请输入年畜牧服务量" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="年水产服务量" prop="waterNum">
                  <el-input-number v-model="basicInfo.waterNum" :min="0" placeholder="请输入年水产服务量" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="其他行业服务总量" prop="otherNum">
                  <el-input-number v-model="basicInfo.otherNum" :min="0" placeholder="请输入其他行业服务总量" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务粮食作物面积" prop="cropArea">
                  <el-input-number v-model="basicInfo.cropArea" :min="0" :precision="2" placeholder="请输入服务粮食作物面积" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 步骤3：附件信息 -->
        <div v-if="currentStep === 2" class="step-panel">
          <h3>附件信息</h3>
          <el-form :model="basicInfo" :rules="attachmentRules" ref="attachmentFormRef" label-width="120px">
            <el-form-item label="主体Logo" prop="logo">
              <image-upload v-model="basicInfo.logo" />
              <div class="upload-tip">建议尺寸：200x200px，支持JPG、PNG格式</div>
            </el-form-item>
            <el-form-item label="营业执照" prop="manageCert">
              <image-upload v-model="basicInfo.manageCert" />
              <div class="upload-tip">请上传清晰的营业执照照片</div>
            </el-form-item>
            <el-form-item label="主体图片" prop="pictureUrls">
              <image-upload v-model="basicInfo.pictureUrls" :limit="5" />
              <div class="upload-tip">最多上传5张图片，展示主体形象</div>
            </el-form-item>
            <el-form-item label="主体视频" prop="video">
              <file-upload v-model="basicInfo.video" />
              <div class="upload-tip">支持MP4、AVI格式，大小不超过100MB</div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤4：提交申请 -->
        <div v-if="currentStep === 3" class="step-panel">
          <h3>确认信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="主体名称">{{ basicInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="组织类型">
              <dict-tag :options="es_org_type" :value="basicInfo.typeId" />
            </el-descriptions-item>
            <el-descriptions-item label="联系人电话">{{ basicInfo.accountPhone }}</el-descriptions-item>
            <el-descriptions-item label="法人代表">{{ basicInfo.corporate }}</el-descriptions-item>
            <el-descriptions-item label="服务区域">{{ regionDisplayText || basicInfo.regionPre }}</el-descriptions-item>
            <el-descriptions-item label="详细地址">{{ basicInfo.regionXx }}</el-descriptions-item>
            <el-descriptions-item label="主体介绍" :span="2">{{ basicInfo.introduce }}</el-descriptions-item>
            <el-descriptions-item label="服务种类" :span="2">
              <template v-if="selectedServiceTypeTexts && selectedServiceTypeTexts.length">
                <div v-for="txt in selectedServiceTypeTexts" :key="txt">{{ txt }}</div>
              </template>
              <template v-else>
                {{ basicInfo.serviceTypeXx }}
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="从业人数">{{ basicInfo.population }}</el-descriptions-item>
            <el-descriptions-item label="年服务营业收入">{{ basicInfo.income }}</el-descriptions-item>
            <el-descriptions-item label="服务对象数">{{ basicInfo.serveNum }}</el-descriptions-item>
            <el-descriptions-item label="服务小农户数">{{ basicInfo.farmersNum }}</el-descriptions-item>
            <el-descriptions-item label="年服务面积">{{ basicInfo.serveArea }}</el-descriptions-item>
            <el-descriptions-item label="年畜牧服务量">{{ basicInfo.raiseNum }}</el-descriptions-item>
            <el-descriptions-item label="年水产服务量">{{ basicInfo.waterNum }}</el-descriptions-item>
            <el-descriptions-item label="其他行业服务总量">{{ basicInfo.otherNum }}</el-descriptions-item>
            <el-descriptions-item label="服务粮食作物面积">{{ basicInfo.cropArea }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 步骤导航按钮 -->
      <div class="step-actions">
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button v-if="currentStep < 3" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="currentStep === 3" type="success" @click="submitApplication">提交申请</el-button>
        <el-button @click="cancelApplication">取消申请</el-button>
      </div>
    </div>

    <!-- 申请详情查看 -->
    <div v-if="showDetails" class="application-details">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>申请详情</span>
            <el-button type="primary" @click="editApplication" v-if="status === 2">编辑申请</el-button>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请编号">{{ basicInfo.id }}</el-descriptions-item>
          <el-descriptions-item label="主体名称">{{ basicInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="组织类型">
            <dict-tag :options="es_org_type" :value="basicInfo.typeId" />
          </el-descriptions-item>
          <el-descriptions-item label="联系人电话">{{ basicInfo.accountPhone }}</el-descriptions-item>
          <el-descriptions-item label="法人代表">{{ basicInfo.corporate }}</el-descriptions-item>
          <el-descriptions-item label="申请状态">
            <dict-tag :options="es_sh_jg" :value="basicInfo.auditStatus" />
          </el-descriptions-item>
          <el-descriptions-item label="准入状态">
            <dict-tag :options="es_is_auth" :value="basicInfo.isAuth" />
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ parseTime(basicInfo.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-descriptions-item>
          <el-descriptions-item label="服务区域">{{ basicInfo.regionPre }}</el-descriptions-item>
          <el-descriptions-item label="详细地址">{{ basicInfo.regionXx }}</el-descriptions-item>
          <el-descriptions-item label="主体介绍" :span="2">{{ basicInfo.introduce }}</el-descriptions-item>
          <el-descriptions-item label="主体Logo" :span="2">
            <image-preview :src="basicInfo.logo" :width="100" :height="100" />
          </el-descriptions-item>
          <el-descriptions-item label="营业执照" :span="2">
            <image-preview :src="basicInfo.manageCert" :width="200" :height="150" />
          </el-descriptions-item>
          <el-descriptions-item label="主体图片" :span="2">
            <image-preview :src="basicInfo.pictureUrls" :width="100" :height="100" />
          </el-descriptions-item>
          <el-descriptions-item label="从业人数">{{ basicInfo.population }}</el-descriptions-item>
          <el-descriptions-item label="年服务营业收入">{{ basicInfo.income }}</el-descriptions-item>
          <el-descriptions-item label="服务对象数">{{ basicInfo.serveNum }}</el-descriptions-item>
          <el-descriptions-item label="服务小农户数">{{ basicInfo.farmersNum }}</el-descriptions-item>
          <el-descriptions-item label="年服务面积">{{ basicInfo.serveArea }}</el-descriptions-item>
          <el-descriptions-item label="年畜牧服务量">{{ basicInfo.raiseNum }}</el-descriptions-item>
          <el-descriptions-item label="年水产服务量">{{ basicInfo.waterNum }}</el-descriptions-item>
          <el-descriptions-item label="其他行业服务总量">{{ basicInfo.otherNum }}</el-descriptions-item>
          <el-descriptions-item label="服务粮食作物面积">{{ basicInfo.cropArea }}</el-descriptions-item>
          <el-descriptions-item label="审核意见" :span="2">{{ basicInfo.auditRemark }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<script setup name="ServicerApply">
import { ref, reactive, toRefs, getCurrentInstance, watch } from 'vue';
import { getServicerByUserId, getCurrentUserServicer, getServicerByUserIdParam } from '@/api/subject/servicer.js';
import { submitServicerApply } from '@/api/apply/servicer.js';
import { getInfo } from '@/api/login.js';
import { mergeFruitData } from '@/utils/service-type.js';
import { getRegionTextByPath } from '@/utils/region.js';
import { submit, listAll } from '@/api/system/process.js';
import ServiceTypeSelector from '@/views/subject/servicer_mess/TypeSelect.vue';
import RegionCascader from '@/views/subject/servicer_mess/RegionSelect.vue';
import { Check, Plus, Clock, Close } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance();
const { es_org_type, es_sh_jg, es_is_auth } = proxy.useDict('es_org_type', 'es_sh_jg', 'es_is_auth');

const status = ref(null); // 申请状态：0-未申请，1-已准入，2-审核中
const showSteps = ref(false); // 显示申请步骤
const showDetails = ref(false); // 显示申请详情
const currentStep = ref(0); // 当前步骤
const selectedServiceTypeTexts = ref([]); // 服务种类可读文本
const regionDisplayText = ref(''); // 服务区域可读文本

const data = reactive({
  basicInfo: {
    id: null,
    name: '',
    typeId: null,
    accountPhone: '',
    corporate: '',
    regionPre: '',
    regionXx: '',
    introduce: '',
    serviceTypeXx: '',
    population: null,
    income: null,
    serveNum: null,
    farmersNum: null,
    serveArea: null,
    raiseNum: null,
    waterNum: null,
    otherNum: null,
    cropArea: null,
    logo: '',
    manageCert: '',
    pictureUrls: '',
    video: '',
    auditStatus: null,
    isAuth: null,
    auditRemark: '',
    createTime: null
  },
  process: {
    servicerId: null
  },
  basicRules: {
    name: [{ required: true, message: '主体名称不能为空', trigger: 'blur' }],
    typeId: [{ required: true, message: '组织类型不能为空', trigger: 'change' }],
    accountPhone: [{ required: true, message: '联系人电话不能为空', trigger: 'blur' }],
    corporate: [{ required: true, message: '法人代表不能为空', trigger: 'blur' }],
    regionPre: [{ required: true, message: '服务区域不能为空', trigger: 'change' }],
    regionXx: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
    introduce: [{ required: true, message: '主体介绍不能为空', trigger: 'blur' }]
  },
  serviceRules: {
    serviceTypeXx: [{ required: true, message: '服务种类不能为空', trigger: 'change' }],
    population: [{ required: true, message: '从业人数不能为空', trigger: 'blur' }],
    income: [{ required: true, message: '年服务营业收入不能为空', trigger: 'blur' }]
  },
  attachmentRules: {
    logo: [{ required: true, message: '主体Logo不能为空', trigger: 'change' }],
    manageCert: [{ required: true, message: '营业执照不能为空', trigger: 'change' }]
  }
});

const { basicInfo, process, basicRules, serviceRules, attachmentRules } = toRefs(data);

// 获取用户申请状态
function fetchServicerByUserId() {
  // 直接设置为未申请状态，让用户可以开始申请
  status.value = 0;
  
  // 尝试获取用户信息（可选）
  getInfo().then(userResponse => {
    console.log('用户信息获取成功:', userResponse);
  }).catch(error => {
    console.log('获取用户信息失败，但不影响申请流程:', error);
  });
}

// 处理服务主体响应数据
function handleServicerResponse(response) {
  status.value = response.data.isAuth;
  if (response.data.regionId) {
    response.data.regionId = JSON.parse(response.data.regionId);
  }
  
  if (status.value === 0) {
    // 未申请
    basicInfo.value = response.data;
  } else if (status.value === 1) {
    // 已准入
    basicInfo.value = response.data;
    showDetails.value = true;
  } else if (status.value === 2) {
    // 审核中
    basicInfo.value = response.data;
    showDetails.value = true;
  }
}

// 开始申请
function startApplication() {
  showSteps.value = true;
  currentStep.value = 0;
}

// 查看申请
function viewApplication() {
  showDetails.value = true;
}

// 编辑申请
function editApplication() {
  showSteps.value = true;
  currentStep.value = 0;
}

// 下一步
function nextStep() {
  if (currentStep.value === 0) {
    proxy.$refs['basicFormRef'].validate(valid => {
      if (valid) {
        currentStep.value++;
      }
    });
  } else if (currentStep.value === 1) {
    proxy.$refs['serviceFormRef'].validate(valid => {
      if (valid) {
        currentStep.value++;
        // 进入确认页前解析地区文本
        if (Array.isArray(basicInfo.value.regionPre)) {
          const ids = basicInfo.value.regionPre.map(id => parseInt(id)).filter(id => !isNaN(id));
          if (ids.length) {
            getRegionTextByPath(ids).then(text => {
              regionDisplayText.value = text;
            }).catch(() => {
              regionDisplayText.value = Array.isArray(basicInfo.value.regionPre) ? basicInfo.value.regionPre.join('/') : String(basicInfo.value.regionPre || '');
            });
          }
        } else if (typeof basicInfo.value.regionPre === 'string') {
          const ids = basicInfo.value.regionPre.split(/[\/ ,]/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
          if (ids.length) {
            getRegionTextByPath(ids).then(text => {
              regionDisplayText.value = text;
            }).catch(() => {
              regionDisplayText.value = basicInfo.value.regionPre;
            });
          }
        }
      }
    });
  } else {
    currentStep.value++;
  }
}

// 上一步
function prevStep() {
  currentStep.value--;
}

// 取消申请
function cancelApplication() {
  showSteps.value = false;
  currentStep.value = 0;
}

// 提交申请
function submitApplication() {
  // 验证所有表单
  const validatePromises = [];
  
  // 验证基本信息表单
  if (proxy.$refs['basicFormRef']) {
    validatePromises.push(
      new Promise((resolve) => {
        proxy.$refs['basicFormRef'].validate(valid => {
          resolve({ form: 'basic', valid });
        });
      })
    );
  }
  
  // 验证服务信息表单
  if (proxy.$refs['serviceFormRef']) {
    validatePromises.push(
      new Promise((resolve) => {
        proxy.$refs['serviceFormRef'].validate(valid => {
          resolve({ form: 'service', valid });
        });
      })
    );
  }
  
  // 验证附件表单
  if (proxy.$refs['attachmentFormRef']) {
    validatePromises.push(
      new Promise((resolve) => {
        proxy.$refs['attachmentFormRef'].validate(valid => {
          resolve({ form: 'attachment', valid });
        });
      })
    );
  }
  
  // 等待所有验证完成
  Promise.all(validatePromises).then(results => {
    const allValid = results.every(result => result.valid);
    
    if (allValid) {
      // 走准入申请流程接口，不直接写主体表
      const applyData = { ...basicInfo.value };
      // 兼容后端：regionPre 期望为字符串，前端组件为数组
      if (Array.isArray(applyData.regionPre)) {
        applyData.regionPre = applyData.regionPre.join('/');
      }
      // 兼容后端：serviceTypeXx 期望为字符串，前端组件可能返回数组
      if (Array.isArray(applyData.serviceTypeXx)) {
        applyData.serviceTypeXx = applyData.serviceTypeXx.join(',');
      } else if (typeof applyData.serviceTypeXx === 'object' && applyData.serviceTypeXx !== null) {
        // 防御性处理：如果是对象，取其可枚举值再拼接
        try {
          const values = Object.values(applyData.serviceTypeXx);
          applyData.serviceTypeXx = Array.isArray(values) ? values.join(',') : String(applyData.serviceTypeXx);
        } catch (e) {
          applyData.serviceTypeXx = String(applyData.serviceTypeXx);
        }
      }
      
      proxy.$modal.loading('正在提交申请，请稍候...');
      
      submitServicerApply(applyData).then(() => {
        proxy.$modal.closeLoading();
        proxy.$modal.msgSuccess("申请提交成功，请等待审核");
        showSteps.value = false;
        fetchServicerByUserId();
      }).catch(error => {
        proxy.$modal.closeLoading();
        console.error('申请提交失败:', error);
        proxy.$modal.msgError('申请提交失败: ' + (error.message || '未知错误'));
      });
    } else {
      // 找出验证失败的表单
      const failedForms = results.filter(result => !result.valid);
      proxy.$modal.msgError(`请完善以下信息：${failedForms.map(f => f.form).join('、')}`);
    }
  }).catch(error => {
    console.error('表单验证失败:', error);
    proxy.$modal.msgError('表单验证失败，请检查输入信息');
  });
}

// 初始化
fetchServicerByUserId();
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 500;
}

.page-description {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.status-section {
  margin-bottom: 30px;
}

.status-card {
  border-radius: 8px;
}

.status-content {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.status-icon {
  margin-right: 20px;
  font-size: 48px;
}

.status-icon.status-unapplied {
  color: #909399;
}

.status-icon.status-pending {
  color: #E6A23C;
}

.status-icon.status-approved {
  color: #67C23A;
}

.status-info h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
}

.status-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.status-actions {
  text-align: right;
}

.application-form {
  margin-top: 30px;
}

.step-content {
  margin: 30px 0;
  min-height: 400px;
}

.step-panel {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.step-panel h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
}

.step-actions {
  text-align: center;
  margin-top: 30px;
}

.step-actions .el-button {
  margin: 0 10px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.application-details {
  margin-top: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 16px;
  font-weight: 500;
}
</style>
