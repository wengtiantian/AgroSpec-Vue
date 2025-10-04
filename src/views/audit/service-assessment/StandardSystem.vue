<!-- src/views/service-assessment/StandardSystem.vue -->
<template>
  <div class="standard-system-container">
    <div class="page-header">
      <h1>准入标准体系</h1>
      <p>为各类服务主体提供全面的准入标准指南与规范要求</p>
    </div>

    <el-tabs type="border-card" class="standard-tabs">
      <el-tab-pane label="基础资质清单">
        <div class="section-container">
          <div class="section-header">
            <h2>基础资质清单</h2>
            <p>提供各类法定文件模板与要求指南，确保服务主体符合基本准入条件</p>
          </div>

          <div class="document-list">
            <el-card v-for="(doc, index) in basicDocuments" :key="index" class="document-card">
              <div class="document-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="document-info">
                <h3>{{ doc.title }}</h3>
                <p>{{ doc.description }}</p>
                <div class="document-actions">
                  <el-button type="success" size="small" @click="previewDocument(doc)">查看示例</el-button>
                  <el-button type="primary" size="small" @click="downloadTemplate(doc)">下载模板</el-button>
                </div>
              </div>
            </el-card>
          </div>

          <div class="additional-info">
            <el-alert
              title="注意事项"
              type="warning"
              description="请确保提交的所有文件真实有效，资质文件需在有效期内。伪造或提供虚假材料将导致申请被拒绝且记入信用档案。"
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="行业专项要求">
        <div class="section-container">
          <div class="section-header">
            <h2>行业专项要求</h2>
            <p>针对不同行业服务主体的差异化准入标准</p>
          </div>

          <div class="industry-selector">
            <el-select v-model="selectedIndustry" placeholder="请选择行业类型" @change="handleIndustryChange">
              <el-option v-for="item in industries" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div v-if="selectedIndustry" class="industry-requirements">
            <h3>{{ getSelectedIndustryLabel() }}行业准入标准</h3>

            <el-collapse accordion>
              <el-collapse-item v-for="(req, index) in industryRequirements" :key="index" :title="req.title">
                <div class="requirement-content">
                  <p>{{ req.description }}</p>
                  <ul class="requirement-list">
                    <li v-for="(item, i) in req.items" :key="i">{{ item }}</li>
                  </ul>
                  <el-tag v-if="req.mandatoryLevel === 'required'" type="danger" effect="dark">必备条件</el-tag>
                  <el-tag v-else-if="req.mandatoryLevel === 'recommended'" type="warning" effect="dark">推荐条件</el-tag>
                  <el-tag v-else type="info" effect="dark">参考条件</el-tag>
                </div>
              </el-collapse-item>
            </el-collapse>

            <div class="industry-documents">
              <h4>相关行业标准文件</h4>
              <el-table :data="industryDocuments" style="width: 100%" border>
                <el-table-column prop="title" label="文件名称" />
                <el-table-column prop="issueDate" label="发布日期" width="120" />
                <el-table-column prop="organization" label="发布机构" width="150" />
                <el-table-column label="操作" width="150">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="downloadDocument(scope.row)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div v-else class="select-notice">
            <el-empty description="请选择行业类型查看相关准入标准" />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="安全生产规范">
        <div class="section-container">
          <div class="section-header">
            <h2>安全生产规范</h2>
            <p>确保生产过程中的安全合规性指标与生产质量管控</p>
          </div>

          <div class="safety-categories">
            <el-row :gutter="20">
              <el-col v-for="(category, index) in safetyCategories" :key="index" :xs="24" :sm="12" :md="8">
                <el-card class="safety-card" shadow="hover" @click="selectSafetyCategory(category)">
                  <div class="safety-icon">
                    <el-icon v-if="category.icon"><component :is="category.icon" /></el-icon>
                  </div>
                  <div class="safety-title">{{ category.title }}</div>
                  <div class="safety-description">{{ category.description }}</div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <el-dialog
            v-model="safetyDialogVisible"
            :title="selectedSafetyCategory?.title || '安全规范详情'"
            width="70%"
          >
            <div v-if="selectedSafetyCategory" class="safety-detail">
              <p class="safety-intro">{{ selectedSafetyCategory.fullDescription }}</p>

              <h4>合规性指标</h4>
              <el-table :data="selectedSafetyCategory.complianceMetrics" style="width: 100%" border>
                <el-table-column prop="name" label="指标名称" />
                <el-table-column prop="standard" label="标准要求" />
                <el-table-column prop="checkMethod" label="检查方法" />
                <el-table-column prop="importance" label="重要性" width="100">
                  <template #default="scope">
                    <el-rate
                      v-model="scope.row.importanceLevel"
                      :colors="['#C6E2FF', '#409EFF', '#F56C6C']"
                      disabled
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <div class="safety-guidelines" v-if="selectedSafetyCategory.guidelines">
                <h4>操作指南</h4>
                <el-steps :active="selectedSafetyCategory.guidelines.length" direction="vertical">
                  <el-step
                    v-for="(step, index) in selectedSafetyCategory.guidelines"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                  />
                </el-steps>
              </div>

              <div class="reference-materials">
                <h4>参考资料</h4>
                <ul>
                  <li v-for="(ref, index) in selectedSafetyCategory.references" :key="index">
                    <a :href="ref.url" target="_blank">{{ ref.title }}</a> - {{ ref.source }}
                  </li>
                </ul>
              </div>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="help-section">
      <h3>遇到问题？</h3>
      <p>如果您在准备资料或理解标准方面需要帮助，请联系我们的标准顾问</p>
      <el-button type="success" @click="contactSupport">联系顾问</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Document, Warning, Briefcase, SetUp, Checked, Operation } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 基础资质清单数据
const basicDocuments = ref([
  {
    id: 1,
    title: '营业执照',
    description: '企业法人营业执照或个体工商户营业执照副本，需在有效期内。',
    templateUrl: '/templates/business-license.docx'
  },
  {
    id: 2,
    title: '场地证明',
    description: '生产场地产权证明或租赁合同，租赁合同需提供出租方产权证明。',
    templateUrl: '/templates/premise-proof.docx'
  },
  {
    id: 3,
    title: '法人身份证明',
    description: '法定代表人或负责人身份证正反面复印件。',
    templateUrl: '/templates/id-verification.docx'
  },
  {
    id: 4,
    title: '税务登记证明',
    description: '税务登记证或税务部门出具的纳税证明。',
    templateUrl: '/templates/tax-registration.docx'
  },
  {
    id: 5,
    title: '银行开户许可证',
    description: '企业银行基本账户开户许可证或基本存款账户信息。',
    templateUrl: '/templates/bank-account.docx'
  },
  {
    id: 6,
    title: '资质申请表',
    description: '服务主体准入资质申请表，需完整填写并加盖公章。',
    templateUrl: '/templates/qualification-application.docx'
  }
]);

// 行业专项要求数据
const industries = ref([
  { label: '种植类', value: 'planting' },
  { label: '养殖类', value: 'breeding' },
  { label: '农产品加工类', value: 'processing' }
]);

const selectedIndustry = ref('');
const industryRequirements = ref([]);
const industryDocuments = ref([]);

// 行业要求数据集
const industryRequirementsData = {
  planting: [
    {
      title: '种植用地要求',
      description: '种植基地用地需符合以下条件：',
      items: [
        '土地用途为农业用地，符合当地土地规划',
        '基地面积不低于5亩（特色作物可适当放宽）',
        '土壤质量检测报告显示无重金属污染',
        '周边5公里内无重工业企业或污染源'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '灌溉水源要求',
      description: '灌溉用水需要满足：',
      items: [
        '灌溉水源水质符合农田灌溉水质标准（GB 5084-2021）',
        '具备完善的灌溉系统',
        '有水质检测报告（每年至少1次）'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '专业技术人员',
      description: '需配备相关技术人员：',
      items: [
        '至少1名具有农学或相关专业中级以上职称的技术人员',
        '技术人员需有3年以上相关作物种植经验',
        '定期参加农业技术培训'
      ],
      mandatoryLevel: 'recommended'
    },
    {
      title: '设施设备要求',
      description: '生产设施设备需具备：',
      items: [
        '农药、肥料等投入品专用仓库',
        '基本农机具设备',
        '防虫害、防病害设施'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '产品质量管理',
      description: '需建立的质量管理体系：',
      items: [
        '生产记录档案管理系统',
        '产品检验能力或与检测机构合作关系',
        '农产品质量安全追溯体系'
      ],
      mandatoryLevel: 'recommended'
    }
  ],
  breeding: [
    {
      title: '养殖场地要求',
      description: '养殖场地需符合以下条件：',
      items: [
        '符合当地畜禽养殖规划区域',
        '距离居民区、水源保护区、学校等敏感区域300米以上',
        '养殖场布局合理，生产区、生活区、隔离区分开',
        '有合法的养殖场用地手续'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '环保设施要求',
      description: '需配备的环保设施：',
      items: [
        '粪污处理设施，实现粪污资源化利用',
        '废水处理系统，出水符合排放标准',
        '病死动物无害化处理设施',
        '恶臭处理设施'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '疫病防控能力',
      description: '防疫条件需满足：',
      items: [
        '建立完善的生物安全防护体系',
        '设置消毒设施、隔离舍',
        '制定疫病防控应急预案',
        '配备专职兽医或签订兽医服务协议'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '饲养管理能力',
      description: '饲养管理需具备：',
      items: [
        '饲料储存设施',
        '饲料质量检验能力',
        '配备自动饲喂、环境控制等设备（规模养殖）',
        '建立完善的饲养管理制度'
      ],
      mandatoryLevel: 'recommended'
    },
    {
      title: '养殖档案管理',
      description: '档案管理需包括：',
      items: [
        '建立养殖全过程记录系统',
        '投入品使用记录',
        '疫病防治记录',
        '产品销售记录与追溯体系'
      ],
      mandatoryLevel: 'recommended'
    }
  ],
  processing: [
    {
      title: '生产场所要求',
      description: '加工厂房需满足：',
      items: [
        '符合食品生产相关标准的厂房',
        '厂区布局合理，生产区、仓储区、办公区分开',
        '建筑面积满足生产规模需求',
        '地面硬化，排水通畅'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '生产设备要求',
      description: '生产设备需具备：',
      items: [
        '食品级生产设备',
        '设备布局合理，符合工艺流程要求',
        '计量、检测设备齐全',
        '设备维护保养记录完善'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '卫生管理要求',
      description: '卫生条件需满足：',
      items: [
        '建立食品安全管理体系',
        '人员卫生管理制度完善',
        '虫害防控措施到位',
        '定期进行微生物等检测'
      ],
      mandatoryLevel: 'required'
    },
    {
      title: '质量控制能力',
      description: '质量控制需具备：',
      items: [
        '原料采购质量控制体系',
        '生产过程关键控制点管理',
        '成品检验能力',
        '不合格品管理制度'
      ],
      mandatoryLevel: 'recommended'
    },
    {
      title: '资质证书要求',
      description: '需持有的证书：',
      items: [
        '食品生产许可证',
        '有机食品、绿色食品等认证（可选）',
        'HACCP、ISO等质量管理体系认证（可选）',
        '产品检验报告'
      ],
      mandatoryLevel: 'required'
    }
  ]
};

const industryDocumentsData = {
  planting: [
    { title: '绿色食品种植技术规程', issueDate: '2022-03-15', organization: '农业农村部', url: '/docs/green-planting-guide.pdf' },
    { title: '有机农产品认证实施规则', issueDate: '2021-06-18', organization: '国家认监委', url: '/docs/organic-certification.pdf' },
    { title: '农产品质量安全追溯管理办法', issueDate: '2023-01-10', organization: '农业农村部', url: '/docs/quality-tracing.pdf' },
    { title: '农药安全使用标准', issueDate: '2022-05-20', organization: '农业农村部', url: '/docs/pesticide-safety.pdf' }
  ],
  breeding: [
    { title: '畜禽规模养殖污染防治条例', issueDate: '2021-07-12', organization: '生态环境部', url: '/docs/pollution-prevention.pdf' },
    { title: '动物防疫条件审查办法', issueDate: '2022-09-30', organization: '农业农村部', url: '/docs/animal-prevention.pdf' },
    { title: '兽药使用安全规范', issueDate: '2023-04-05', organization: '农业农村部', url: '/docs/vet-drug-safety.pdf' },
    { title: '畜禽养殖标准化示范场创建指南', issueDate: '2021-11-18', organization: '农业农村部', url: '/docs/breeding-standardization.pdf' }
  ],
  processing: [
    { title: '食品生产许可管理办法', issueDate: '2022-02-28', organization: '市场监管总局', url: '/docs/food-production-license.pdf' },
    { title: '食品安全国家标准 食品生产通用卫生规范', issueDate: '2021-08-15', organization: '国家卫健委', url: '/docs/food-hygiene.pdf' },
    { title: '农产品初加工管理规范', issueDate: '2023-03-20', organization: '农业农村部', url: '/docs/primary-processing.pdf' },
    { title: '食品生产企业危害分析与关键控制点体系认证实施规则', issueDate: '2022-10-12', organization: '认监委', url: '/docs/haccp-rules.pdf' }
  ]
};

// 安全生产规范数据
const safetyCategories = ref([
  {
    id: 1,
    title: '农药使用规范',
    description: '规范农药选择、使用、储存全过程',
    icon: 'Warning',
    fullDescription: '本规范旨在指导农业生产者科学、安全地使用农药，降低农药残留风险，保障农产品质量安全和环境安全。涵盖农药采购、储存、配制、施用及容器处理等全过程管理要求。',
    complianceMetrics: [
      { name: '禁用农药', standard: '禁止使用国家明令禁止的高毒、高残留农药', checkMethod: '农药采购记录检查、库存检查', importanceLevel: 5 },
      { name: '农药使用记录', standard: '详细记录农药名称、使用时间、使用量、使用地块、操作人员等信息', checkMethod: '农药使用台账检查', importanceLevel: 4 },
      { name: '安全间隔期', standard: '严格执行农药安全间隔期规定，收获前禁止用药时间符合规定', checkMethod: '用药记录与采收时间核对', importanceLevel: 5 },
      { name: '农药储存条件', standard: '农药应储存在专用仓库，远离水源、食品，标识清晰', checkMethod: '仓库现场检查', importanceLevel: 3 },
      { name: '操作人员防护', standard: '施药人员应配备必要的防护装备，如手套、口罩等', checkMethod: '现场检查、人员访谈', importanceLevel: 4 }
    ],
    guidelines: [
      { title: '农药选购', description: '选择登记农药，适合目标作物和病虫害，优先选择低毒低残留品种' },
      { title: '配药准备', description: '穿戴防护装备，按说明书配制，避免接触皮肤和眼睛' },
      { title: '施药操作', description: '选择合适天气，避开中午高温，顺风操作，均匀喷洒' },
      { title: '清洗处理', description: '施药后清洗工具和防护装备，防止交叉污染' },
      { title: '记录存档', description: '详细记录用药情况，保存农药标签和说明书，至少保存2年' }
    ],
    references: [
      { title: '农药安全使用标准', source: '农业农村部', url: '#' },
      { title: '农药安全使用指南', source: '农业技术推广中心', url: '#' },
      { title: '常见农作物农药使用手册', source: '农业科学院', url: '#' }
    ]
  },
  {
    id: 2,
    title: '兽药使用规范',
    description: '畜禽养殖兽药使用安全管理标准',
    icon: 'Briefcase',
    fullDescription: '本规范针对畜禽养殖过程中兽药的科学合理使用制定，旨在保障动物健康、食品安全和公共卫生安全。规定了兽药采购、储存、使用、休药期管理等要求。',
    complianceMetrics: [
      { name: '兽药来源', standard: '兽药必须从有资质的经营企业购买，有合法有效票据', checkMethod: '兽药采购记录和票据检查', importanceLevel: 5 },
      { name: '禁用药物', standard: '禁止使用国家明令禁止的兽药及其他化合物', checkMethod: '兽药库存检查', importanceLevel: 5 },
      { name: '用药记录', standard: '详细记录用药动物、药品名称、用法用量、用药日期、休药期等', checkMethod: '用药记录检查', importanceLevel: 4 },
      { name: '休药期管理', standard: '严格执行休药期规定，休药期内动物产品不得出售', checkMethod: '出栏/出售记录与用药记录比对', importanceLevel: 5 },
      { name: '兽药储存', standard: '兽药应专柜存放，避光、通风、干燥，分类管理', checkMethod: '兽药储存设施检查', importanceLevel: 3 }
    ],
    guidelines: [
      { title: '疾病诊断', description: '由兽医进行诊断，确定是否需要用药及用药方案' },
      { title: '用药选择', description: '根据诊断结果选择适当药物，优先使用窄谱抗生素' },
      { title: '用药操作', description: '严格按照说明书剂量给药，注意给药方式和时间' },
      { title: '观察记录', description: '用药后观察动物反应，记录治疗效果' },
      { title: '休药期管理', description: '严格执行休药期，休药期内标记动物，产品不得销售' }
    ],
    references: [
      { title: '兽药使用安全规范', source: '农业农村部', url: '#' },
      { title: '畜禽养殖兽药使用指南', source: '兽医协会', url: '#' },
      { title: '常见畜禽疾病用药手册', source: '农业科学院', url: '#' }
    ]
  },
  {
    id: 3,
    title: '肥料施用规范',
    description: '科学合理施肥技术与管理要求',
    icon: 'SetUp',
    fullDescription: '本规范旨在指导农业生产者科学合理使用肥料，提高肥料利用效率，减少环境污染，保障农产品质量安全。包括肥料选择、施用方法、用量控制等内容。',
    complianceMetrics: [
      { name: '肥料质量', standard: '使用有登记证的合格肥料，不使用未知来源、无标签肥料', checkMethod: '肥料采购记录检查', importanceLevel: 4 },
      { name: '施肥方案', standard: '根据土壤测试和作物需求制定施肥方案，平衡施用氮磷钾', checkMethod: '施肥方案和记录检查', importanceLevel: 3 },
      { name: '有机肥处理', standard: '畜禽粪便等有机肥料必须经过无害化处理后使用', checkMethod: '有机肥处理设施和记录检查', importanceLevel: 4 },
      { name: '施肥记录', standard: '详细记录肥料名称、施用时间、地点、用量等信息', checkMethod: '施肥记录检查', importanceLevel: 3 },
      { name: '环境保护', standard: '避免过量施肥，减少肥料流失，保护水环境', checkMethod: '周边水体检测、施肥量评估', importanceLevel: 4 }
    ],
    guidelines: [
      { title: '土壤测试', description: '定期进行土壤测试，了解土壤养分状况' },
      { title: '肥料选择', description: '根据作物需求和土壤条件选择适宜肥料' },
      { title: '施肥时机', description: '选择适宜的施肥时期，避免雨季大量施肥' },
      { title: '施肥方法', description: '采用深施、侧施等减少流失的方法' },
      { title: '用量控制', description: '控制单次施肥量，提倡分次施肥' }
    ],
    references: [
      { title: '科学施肥技术指南', source: '农业农村部', url: '#' },
      { title: '主要农作物施肥指南', source: '农业技术推广中心', url: '#' },
      { title: '绿色施肥技术手册', source: '农业科学院', url: '#' }
    ]
  },
  {
    id: 4,
    title: '防疫措施规范',
    description: '畜禽养殖场疫病防控管理标准',
    icon: 'Checked',
    fullDescription: '本规范旨在指导畜禽养殖场做好疫病防控工作，减少疫病发生风险，保障动物健康和公共卫生安全。包括场区生物安全措施、免疫程序、消毒措施等内容。',
    complianceMetrics: [
      { name: '场区隔离', standard: '养殖场应设置围墙或围栏，控制人员和车辆进出', checkMethod: '现场检查隔离设施', importanceLevel: 4 },
      { name: '消毒设施', standard: '入口处设置消毒设施，对进出人员和车辆进行消毒', checkMethod: '现场检查消毒设施', importanceLevel: 4 },
      { name: '免疫程序', standard: '按照疫苗使用说明和防疫要求制定免疫程序', checkMethod: '免疫记录检查', importanceLevel: 4 },
      { name: '疫病监测', standard: '定期进行疫病监测，发现异常及时报告', checkMethod: '监测记录检查', importanceLevel: 3 },
      { name: '病死动物处理', standard: '病死动物应按规定进行无害化处理', checkMethod: '处理记录和设施检查', importanceLevel: 5 }
    ],
    guidelines: [
      { title: '生物安全', description: '建立完善的生物安全体系，防止病原传入' },
      { title: '消毒程序', description: '制定科学的消毒程序，定期实施消毒' },
      { title: '免疫管理', description: '建立完整的免疫档案，按时进行免疫' },
      { title: '疫情监控', description: '建立疫情监控体系，及时发现和处理疫情' }
    ],
    references: [
      { title: '动物防疫法', source: '全国人大', url: '#' },
      { title: '畜禽养殖场疫病防控技术规范', source: '农业农村部', url: '#' },
      { title: '动物疫病防控指南', source: '中国动物疫病预防控制中心', url: '#' }
    ]
  }
]);

// 当前查看的标准详情
const currentStandard = ref(null);

// 显示标准详情
const showStandardDetail = (standard) => {
  currentStandard.value = standard;
};

// 关闭标准详情
const closeStandardDetail = () => {
  currentStandard.value = null;
};

// 下载模板
const downloadTemplate = (templateUrl) => {
  // 模拟下载
  ElMessage.success('模板下载已开始');
  console.log('下载模板:', templateUrl);
};

// 上传文件
const uploadFile = (info) => {
  ElMessage.success(`${info.file.name} 上传成功`);
};

// 联系客服
const contactSupport = () => {
  ElMessageBox.alert('客服电话：400-123-4567<br>工作时间：9:00-18:00', '联系客服', {
    dangerouslyUseHTMLString: true
  });
};

// 申请审核
const applyForAudit = () => {
  ElMessageBox.confirm('确认提交申请？我们将在3个工作日内完成审核。', '提交申请', {
    confirmButtonText: '确认提交',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('申请已提交，请耐心等待审核结果');
  });
};

// 计算准备度
const preparationProgress = computed(() => {
  const total = basicDocuments.value.length;
  const completed = basicDocuments.value.filter(doc => doc.uploaded).length;
  return Math.round((completed / total) * 100);
});
</script>

<style scoped>
.standards-system {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.system-container {
  max-width: 1200px;
  margin: 0 auto;
}

.system-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.system-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.system-header p {
  font-size: 1.2em;
  opacity: 0.9;
}

.standards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.standard-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.standard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.preparation-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.support-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
</style>