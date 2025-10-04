<template>
  <div class="dynamic-review-page">
    <div class="banner">
      <div class="banner-left">
        <img src="@/assets/logo/logo.jpeg" class="logo" alt="logo" />
        <span class="system-title">乡村特色产业标准化生产服务规范与质量评价系统</span>
      </div>
      <el-button class="home-btn" type="primary" @click="goHome">返回首页</el-button>
    </div>
    <div class="center-content">
      <h2 class="content-title">服务主体评价</h2>
      <!-- 用户信息 -->
      <div class="user-info">
        <span>当前用户：{{ userInfo.name }}</span>
        <span class="user-type">（{{ userInfo.roleLabel }}）</span>
        <el-button v-if="userInfo.anonymous" size="small" class="toggle-btn" @click="toggleAnonymous">切换实名/匿名</el-button>
      </div>
      <!-- 统计概览卡片 -->
      <div v-if="showServicerStats && scoreData" class="stats-row">
        <div v-for="item in statItems" :key="item.key" class="stat-card">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value">{{ formatPercent(scoreData[item.key]) }}</div>
        </div>
      </div>
      <el-row :gutter="24">
        <el-col :span="8" v-if="showServicerStats && servicerInfo">
          <el-card class="servicer-info-card">
            <div class="servicer-title">{{ servicerInfo.name }}</div>
            <div class="servicer-info-row"><b>组织类型：</b>
              <span>{{ (es_org_type.find(item => item.value == servicerInfo.typeId) || {}).label || servicerInfo.typeId }}</span>
            </div>
            <div class="servicer-info-row"><b>联系人电话：</b>{{ servicerInfo.accountPhone }}</div>
            <div class="servicer-info-row"><b>法人代表：</b>{{ servicerInfo.corporate }}</div>
            <div class="servicer-info-row"><b>经营状态：</b>
              <span>{{ (es_manage_status.find(item => item.value == servicerInfo.manageForm) || {}).label || servicerInfo.manageForm }}</span>
            </div>
            <div class="servicer-info-row"><b>地区：</b>{{ servicerInfo.regionPre }}</div>
            <div class="servicer-info-row"><b>详细地址：</b>{{ servicerInfo.regionXx }}</div>
            <div class="servicer-info-row"><b>主体介绍：</b>{{ removeHtmlTags(servicerInfo.introduce) }}</div>
            
          </el-card>
        </el-col>
        <el-col :span="16">
          <!-- 评价表单 -->
          <el-card class="form-card">
            <el-form :model="form" ref="reviewForm" label-width="100px" class="review-form">
              <el-form-item label="服务主体" required>
                <el-row :gutter="10" align="middle">
                  <el-col :span="16">
                    <el-select v-model="form.servicer_id" filterable placeholder="请选择服务主体" style="width: 100%" @change="handleServicerChange">
                      <el-option v-for="item in servicerList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-space>
                      <el-button 
                        type="primary" 
                        @click="handleQueryServicer" 
                        :disabled="!form.servicer_id" 
                        :loading="queryLoading"
                      >
                        <template #icon>
                          <el-icon v-if="!queryLoading"><Search /></el-icon>
                        </template>
                        {{ queryLoading ? '查询中...' : '查询' }}
                      </el-button>
                      <el-button @click="handleResetServicer">重置</el-button>
                    </el-space>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="评价身份">
                <el-radio-group v-model="form.anonymous">
                  <el-radio :label="false">实名（{{ userInfo.name }}）</el-radio>
                  <el-radio :label="true">匿名</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="评价内容" required>
                <el-input
                  v-model="form.content"
                  type="textarea"
                  :rows="4"
                  maxlength="300"
                  show-word-limit
                  placeholder="请描述您的服务体验，如：服务态度、专业程度等"
                />
              </el-form-item>
              <el-form-item label="评分" required>
                <el-rate v-model="form.rating" :max="5" allow-half show-score class="big-rate" />
              </el-form-item>
              <el-form-item label="上传附件">
                <el-upload
                  action="/your-java-api/review/upload"
                  :on-success="handleUploadSuccess"
                  :file-list="form.attachments"
                  :limit="3"
                  list-type="picture-card"
                  class="upload-box"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="handleSubmit" :loading="loading" class="submit-btn">提交评价</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card v-if="showServicerStats && form.servicer_id" class="charts-card">
            <h3 class="charts-title">服务主体统计图表</h3>
            <el-skeleton v-if="queryLoading" :rows="4" animated style="margin-bottom: 12px" />
            <template v-else>
              <div v-if="chartUrls.pareto || chartUrls.bars || chartUrls.wordcloud || chartUrls.radar" class="chart-container">
                <div class="chart-group horizontal">
                  <div class="chart-item" v-if="chartUrls.pareto" @click="handleChartClick('pareto')">
                  <h4>{{ chartLabels.pareto }}</h4>
                  <img :src="chartUrls.pareto" :alt="chartLabels.pareto" class="chart-img" />
                </div>
                  <div class="chart-item" v-if="chartUrls.bars" @click="handleChartClick('bars')">
                  <h4>{{ chartLabels.bars }}</h4>
                  <img :src="chartUrls.bars" :alt="chartLabels.bars" class="chart-img" />
                </div>
                  <div class="chart-item" v-if="chartUrls.wordcloud" @click="handleChartClick('wordcloud')">
                  <h4>{{ chartLabels.wordcloud }}</h4>
                  <img :src="chartUrls.wordcloud" :alt="chartLabels.wordcloud" class="chart-img" />
                </div>
                  <div class="chart-item" v-if="chartUrls.radar" @click="handleChartClick('radar')">
                  <h4>{{ chartLabels.radar }}</h4>
                  <img :src="chartUrls.radar" :alt="chartLabels.radar" class="chart-img" />
                </div>
              </div>
            </div>
              <el-empty v-else description="暂无图表数据" />
            </template>
            <div v-if="scoreData" class="score-chart-container">
              <h4>服务质量评分</h4>
              <div ref="scoreChartRef" class="score-chart"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      Copyright © 2022-2025 江西农业大学 All Rights Reserved.
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="chartLabels[currentChart]"
      width="80%"
      :before-close="handleDialogClose"
      class="chart-dialog"
    >
      <div class="dialog-chart-container">
        <img :src="chartUrls[currentChart]" :alt="chartLabels[currentChart]" class="dialog-chart-img" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, nextTick } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import axios from 'axios'
import useUserStore from '@/store/modules/user'
import { listServicer, getServicer } from '@/api/subject/servicer'
import { addReviews } from '@/api/base/reviews'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { Search } from '@element-plus/icons-vue'

// 初始化变量
const userStore = useUserStore()
const roleLabelMap = {
  admin: '超级管理员',
  common: '普通管理员',
  producter: '生产主体',
  producer: '生产主体',
  servicer: '服务主体'
}
const userInfo = reactive({
  name: userStore.name,
  user_id: userStore.id,
  role: userStore.roles[0],
  roleLabel: roleLabelMap[userStore.roles[0]] || userStore.roles[0],
  anonymous: false
})

const servicerList = ref([]) // 服务主体列表
const form = reactive({
  servicer_id: '',
  anonymous: false,
  content: '',
  attachments: [],
  rating: 5 // 默认5星
})
const loading = ref(false)
const scoreData = ref(null)
const reviewList = ref([])  // 评论列表
const chartUrls = reactive({
  pareto: '',
  wordcloud: '',
  bars: '',
  radar: ''
})
const chartLabels = {
  pareto: '帕累托图',
  wordcloud: '词云图',
  bars: '评价分布柱状图',
  radar: '服务质量雷达图'
}
// 统计概览项
const statItems = [
  { key: '有形性', label: '有形性' },
  { key: '可靠性', label: '可靠性' },
  { key: '响应性', label: '响应性' },
  { key: '保证性', label: '保证性' },
  { key: '移情性', label: '移情性' },
  { key: '总分', label: '综合得分' },
]
const SQdimMap = ['有形性', '可靠性', '响应性', '保证性', '移情性']
const router = useRouter()
const showServicerStats = ref(false)
const servicerInfo = ref(null)
const scoreChartRef = ref(null)
let scoreChart = null
const dialogVisible = ref(false)
const currentChart = ref('')
const queryLoading = ref(false)

const { proxy } = getCurrentInstance()
const { es_org_type, es_manage_status } = proxy.useDict('es_org_type', 'es_manage_status')

// 获取服务主体列表
async function fetchServicerList() {
  try {
    const res = await listServicer()
    servicerList.value = res.rows || []
  } catch (e) {
    ElMessage.error('获取服务主体列表失败')
  }
}

function handleUploadSuccess(response, file, fileList) {
  form.attachments = fileList
}

function toggleAnonymous() {
  form.anonymous = !form.anonymous
}

async function handleSubmit() {
  if (!form.servicer_id || !form.content.trim()) {
    ElMessage.warning('请填写完整信息')
    return
  }
  loading.value = true
  try {
    // 1. 尝试用接口1分析内容，如果失败则使用默认值
    let SQdim = [0.5, 0.5, 0.5, 0.5, 0.5] // 默认五维度评分
    let SenScore = 0.5 // 默认情感评分
    
    try {
    const pyRes = await axios.get('http://47.92.95.129:9898/api/v1/sq/ReviewProcess', {
        params: { current_review: form.content },
        timeout: 5000 // 5秒超时
      })
      if (pyRes.data && pyRes.data.code === 0) {
        SQdim = pyRes.data.data.SQdim || SQdim
        SenScore = pyRes.data.data.SenScore || SenScore
        console.log('✅ AI分析成功:', { SQdim, SenScore })
      } else {
        console.warn('⚠️ AI分析响应异常，使用默认值')
      }
    } catch (aiError) {
      console.warn('⚠️ AI分析服务暂时不可用，使用默认评分:', aiError.message)
      ElMessage.warning('AI分析服务暂时不可用，将使用基础评分模式')
    }

    // 2. 统一提交所有数据到后端
    const reviewData = {
      userId: userInfo.user_id,
      servicerId: form.servicer_id,
      content: form.content,
      SQdim,
      SenScore,
      rating: form.rating
    }
    const javaRes = await addReviews(reviewData)
    if (javaRes.code !== 200) throw new Error(javaRes.msg || '提交评价失败')

    // 3. 可选：刷新评分和图表
    await fetchServicerStats(form.servicer_id)

    // 显示加载动画
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在刷新数据，请稍候...',
      background: 'rgba(255, 255, 255, 0.7)'
    })
    ElMessage.success('评价提交成功！')
    setTimeout(() => {
      loadingInstance.close()
    }, 1200)
  } catch (e) {
    ElMessage.error(e.message || '提交失败')
  } finally {
    loading.value = false
  }
}

async function fetchServicerStats(servicerId) {
  try {
    const res = await axios.get('http://47.92.95.129:9898/api/v1/sq/SQbusiness', {
      params: { servicer_id: servicerId },
      timeout: 8000 // 8秒超时
    })
    if (res.data && res.data.code === 0) {
      const data = res.data.data
      // 评分数据
      scoreData.value = {
        有形性: data.TangiSc || 0.5,
        可靠性: data.ReliSc || 0.5,
        响应性: data.ResponSc || 0.5,
        保证性: data.AssuranceSc || 0.5,
        移情性: data.EmpathySc || 0.5,
        总分: data.TotalSc || 0.5
      }
      // 评论列表
      reviewList.value = data.data || []
      // 图表链接
      chartUrls.pareto = `http://47.92.95.129:9898/media/Pareto_chart/${servicerId}.jpg`
      chartUrls.wordcloud = `http://47.92.95.129:9898/media/WordCloud/${servicerId}.jpg`
      chartUrls.bars = `http://47.92.95.129:9898/media/Bars/${servicerId}.jpg`
      chartUrls.radar = `http://47.92.95.129:9898/media/Radar/${servicerId}.jpg`
      console.log('✅ 统计数据获取成功')
    } else {
      throw new Error(res.data?.msg || '获取服务主体统计信息失败')
    }
  } catch (e) {
    console.warn('⚠️ 统计服务暂时不可用:', e.message)
    ElMessage.warning('统计服务暂时不可用，部分功能可能受限')
    // 设置默认数据，避免页面空白
    scoreData.value = {
      有形性: 0.5,
      可靠性: 0.5,
      响应性: 0.5,
      保证性: 0.5,
      移情性: 0.5,
      总分: 0.5
    }
  }
}

function goHome() {
  router.push('/home')
}

function handleServicerChange(val) {
  showServicerStats.value = false
  scoreData.value = null
  chartUrls.pareto = ''
  chartUrls.wordcloud = ''
  chartUrls.bars = ''
  chartUrls.radar = ''
}

async function handleQueryServicer() {
  if (form.servicer_id) {
    queryLoading.value = true
    try {
      await fetchServicerStats(form.servicer_id)
      const res = await getServicer(form.servicer_id)
      if (res && res.data) {
        servicerInfo.value = res.data
      } else {
        servicerInfo.value = null
      }
      showServicerStats.value = true
      // 初始化评分图表
      nextTick(() => {
        if (scoreData.value) {
          console.log('初始化图表，数据:', scoreData.value)
          initScoreChart()
        }
      })
    } catch (e) {
      console.error('查询服务主体失败:', e)
      ElMessage.error('查询服务主体失败')
    } finally {
      queryLoading.value = false
    }
  }
}

function handleResetServicer() {
  form.servicer_id = '';
  showServicerStats.value = false;
  scoreData.value = null;
  servicerInfo.value = null;
  chartUrls.pareto = '';
  chartUrls.wordcloud = '';
  chartUrls.bars = '';
  chartUrls.radar = '';
}

// 初始化评分图表
function initScoreChart() {
  if (!scoreChartRef.value) return
  
  scoreChart = echarts.init(scoreChartRef.value)
  updateScoreChart()
}

// 更新评分图表数据
function updateScoreChart() {
  if (!scoreChart || !scoreData.value) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 1,
      axisLabel: {
        formatter: function(value) {
          return (value * 100).toFixed(1) + '%'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: ['有形性', '可靠性', '响应性', '保证性', '移情性', '总分'],
      axisLabel: {
        interval: 0
      }
    },
    series: [
      {
        name: '评分',
        type: 'bar',
        data: [
          scoreData.value.有形性,
          scoreData.value.可靠性,
          scoreData.value.响应性,
          scoreData.value.保证性,
          scoreData.value.移情性,
          scoreData.value.总分
        ],
        itemStyle: {
          color: function(params) {
            const colorList = ['#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452']
            return colorList[params.dataIndex]
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            return (params.value * 100).toFixed(1) + '%'
          }
        }
      }
    ]
  }

  scoreChart.setOption(option)
}

// 百分比格式化
function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '--'
  return (Number(value) * 100).toFixed(1) + '%'
}

// 处理图表点击事件
function handleChartClick(chartType) {
  currentChart.value = chartType
  dialogVisible.value = true
}

// 处理对话框关闭
function handleDialogClose() {
  dialogVisible.value = false
  currentChart.value = ''
}

// 生命周期
onMounted(() => {
  // 校验登录
  if (!userStore.token) {
    window.location.href = '/login'
  }
  fetchServicerList().then(() => {
    if (form.servicer_id) {
      fetchServicerStats(form.servicer_id)
    }
  })
})

function removeHtmlTags(str) {
  if (!str) return ''
  return str.replace(/<[^>]*>/g, '')
}
</script>

<style scoped>
.dynamic-review-page {
  font-family: 'Inter', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 50%, #A5D6A7 100%);
  background-attachment: fixed;
  padding-bottom: 60px;
  color: #1e293b;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

.dynamic-review-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 50%, rgba(184, 233, 148, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 195, 74, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(76, 175, 80, 0.3) 0%, transparent 50%);
  z-index: 0;
}

.dynamic-review-page::after {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(232, 245, 232, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: backgroundMove 30s linear infinite;
  z-index: 0;
}

@keyframes backgroundMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(40px, 40px); }
}

.dynamic-review-page > * {
  position: relative;
  z-index: 1;
}

/* 横幅 */
.banner {
  height: 90px;
  background: rgba(232, 245, 232, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(184, 233, 148, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #1e293b;
  position: relative;
  z-index: 10;
}

.banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(232,245,232,0.15), rgba(184,233,148,0.08));
  border-radius: 0;
  z-index: -1;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px;
  box-shadow: 0 8px 32px rgba(139, 195, 74, 0.25);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(184, 233, 148, 0.4);
}

.logo:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.system-title {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
  color: #1e293b;
}

.home-btn {
  border-radius: 50px;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  padding: 0 28px;
  background: linear-gradient(135deg, #ffffff, #f8fdf9);
  color: #1e293b;
  border: 1px solid rgba(184, 233, 148, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.home-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.home-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #f8fdf9, #ffffff);
}

.home-btn:hover::before {
  left: 100%;
}

/* 主内容 */
.center-content {
  max-width: 1400px;
  width: 95%;
  margin: 50px auto;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(184, 233, 148, 0.3);
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  padding: 60px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
}

.center-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(184,233,148,0.06));
  border-radius: 24px;
  z-index: -1;
}

.center-content:hover {
  transform: translateY(-4px);
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.content-title {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  color: #0b1324;
  margin-bottom: 40px;
  position: relative;
}

.content-title::after {
  content: '';
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  font-size: 16px;
  color: #1f2937;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(184, 233, 148, 0.35);
  border-radius: 50px;
  padding: 16px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 概览统计 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 18px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(184, 233, 148, 0.3);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.stat-label {
  font-size: 14px;
  color: #4b5563;
}

.stat-value {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.user-type {
  color: #166534;
  font-weight: 600;
  background: rgba(22, 101, 52, 0.08);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(22, 101, 52, 0.2);
}

.toggle-btn {
  border-radius: 50px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.toggle-btn:hover::before {
  left: 100%;
}

/* 服务主体信息卡片 */
.servicer-info-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(184, 233, 148, 0.4);
  padding: 32px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.servicer-info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(184,233,148,0.08));
  border-radius: 20px;
  z-index: -1;
}

.servicer-info-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.servicer-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
  position: relative;
}

.servicer-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.servicer-info-row {
  font-size: 14px;
  margin-bottom: 12px;
  color: #1f2937;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(184, 233, 148, 0.35);
  transition: all 0.3s ease;
}

.servicer-info-row:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.servicer-info-row b {
  color: #14532d;
  font-weight: 600;
  min-width: 100px;
  display: inline-block;
}

.score-highlight {
  color: #fbbf24;
  font-weight: 700;
  background: rgba(251, 191, 36, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

/* 表单卡片 */
.form-card {
  border-radius: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(184, 233, 148, 0.4);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.form-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(184,233,148,0.08));
  border-radius: 20px;
  z-index: -1;
}

.form-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.review-form {
  max-width: 700px;
  margin: 0 auto;
}

.big-rate {
  font-size: 36px !important;
  --el-rate-icon-size: 36px;
  margin-bottom: 20px;
  justify-content: center;
}

.upload-box {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.submit-btn {
  width: 160px;
  height: 50px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
}

.submit-btn:hover::before {
  left: 100%;
}

/* 图表卡片 */
.charts-card {
  margin-top: 40px;
  border-radius: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(184, 233, 148, 0.4);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.charts-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(184,233,148,0.08));
  border-radius: 20px;
  z-index: -1;
}

.charts-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.charts-title {
  font-size: 22px;
  font-weight: 800;
  color: #0b1324;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

.charts-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.chart-group {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.chart-group.vertical {
  flex-direction: column;
  align-items: center;
}

.chart-group.horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.chart-item {
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.chart-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.chart-item:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.08);
}

.chart-item:hover::before {
  left: 100%;
}

.chart-item h4 {
  font-size: 16px;
  color: #111827;
  margin-bottom: 12px;
  font-weight: 600;
}

.chart-img {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-img:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 页脚 */
.footer {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  padding: 30px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 60px;
  background: rgba(232, 245, 232, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  font-weight: 500;
}

/* 表单控件美化 */
.dynamic-review-page :deep(.el-form-item__label) {
  color: #0f172a;
  font-weight: 600;
  font-size: 14px;
}

.dynamic-review-page :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.dynamic-review-page :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(76, 175, 80, 0.15);
}

.dynamic-review-page :deep(.el-input__wrapper.is-focus) {
  border-color: #4caf50;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(76, 175, 80, 0.25);
}

.dynamic-review-page :deep(.el-input__inner) {
  color: #111827;
  background: transparent;
}

.dynamic-review-page :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.dynamic-review-page :deep(.el-select .el-input__inner) {
  color: #1e293b;
}

.dynamic-review-page :deep(.el-radio__label) {
  color: #111827;
}

.dynamic-review-page :deep(.el-radio__inner) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.dynamic-review-page :deep(.el-radio__inner:hover) {
  border-color: #3b82f6;
}

.dynamic-review-page :deep(.el-radio.is-checked .el-radio__inner) {
  background: #3b82f6;
  border-color: #3b82f6;
}

.dynamic-review-page :deep(.el-button) {
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dynamic-review-page :deep(.el-button:hover) {
  transform: translateY(-2px);
}

/* 评分图表容器 */
.score-chart-container {
  margin-top: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.score-chart-container h4 {
  font-size: 22px;
  color: #ffffff;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
  background: linear-gradient(135deg, #ffffff, #f1f5f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-chart {
  width: 100%;
  height: 350px;
}

/* 对话框样式 */
.chart-dialog :deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.chart-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: 20px 20px 0 0;
  padding: 24px;
}

.chart-dialog :deep(.el-dialog__title) {
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
}

.chart-dialog :deep(.el-dialog__body) {
  padding: 32px;
}

.dialog-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-chart-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dynamic-review-page {
    padding: 0 40px;
  }

  .banner {
    padding: 0 40px;
    height: 80px;
  }

  .system-title {
    font-size: 22px;
  }

  .center-content {
    width: 100%;
    padding: 50px;
  }

  .chart-group {
    flex-direction: column;
    gap: 20px;
  }

  .chart-item {
    min-width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .dynamic-review-page {
    padding: 0 20px;
  }

  .banner {
    padding: 0 20px;
    height: 70px;
    flex-direction: column;
    gap: 10px;
    padding-top: 15px;
  }

  .banner-left {
    gap: 15px;
  }

  .system-title {
    font-size: 18px;
  }

  .logo {
    height: 48px;
  }

  .home-btn {
    height: 36px;
    font-size: 14px;
    padding: 0 16px;
  }

  .center-content {
    padding: 30px 20px;
    margin: 30px auto;
    width: 95%;
  }

  .content-title {
    font-size: 28px;
  }

  .user-info {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  }

  .servicer-info-card,
  .form-card,
  .charts-card {
    padding: 24px;
  }

  .servicer-title {
    font-size: 20px;
  }

  .review-form {
    max-width: 100%;
  }

  .chart-container {
    gap: 24px;
  }

  .chart-item {
    padding: 16px;
    min-width: 100%;
  }

  .chart-item h4 {
    font-size: 16px;
}

.score-chart {
    height: 280px;
  }
}

@media (max-width: 480px) {
  .dynamic-review-page {
    padding: 0 15px;
  }

  .banner {
    padding: 0 15px;
    height: 60px;
  }

  .system-title {
    font-size: 14px;
  }

  .logo {
    height: 40px;
  }

  .home-btn {
    height: 32px;
    font-size: 12px;
    padding: 0 12px;
  }

  .center-content {
    padding: 20px 15px;
    margin: 20px auto;
  }

  .content-title {
    font-size: 24px;
  }

  .user-info {
    padding: 16px 12px;
  }

  .servicer-info-card,
  .form-card,
  .charts-card {
  padding: 20px;
}

  .servicer-info-row {
    padding: 10px 12px;
    font-size: 14px;
  }

  .submit-btn {
    width: 140px;
    height: 44px;
    font-size: 16px;
  }

  .chart-item h4 {
    font-size: 14px;
  }

  .score-chart {
    height: 240px;
  }
}

</style>
