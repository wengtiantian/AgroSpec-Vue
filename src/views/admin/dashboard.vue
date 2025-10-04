<!-- 管理后台仪表盘 -->
<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>欢迎使用乡村特色产业标准化生产服务规范与质量评价系统管理后台</span>
            </div>
          </template>
          <div class="dashboard-content">
            <h2>系统概览</h2>
            <el-row :gutter="20" class="data-overview">
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="data-header">
                      <span>用户总数</span>
                    </div>
                  </template>
                  <div class="data-value">{{ userCount }}</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="data-header">
                      <span>服务主体数</span>
                    </div>
                  </template>
                  <div class="data-value">{{ servicerCount }}</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="data-header">
                      <span>生产主体数</span>
                    </div>
                  </template>
                  <div class="data-value">{{ producterCount }}</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="data-header">
                      <span>今日访问量</span>
                    </div>
                  </template>
                  <div class="data-value">{{ visitCount }}</div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 图表区域 -->
            <el-row :gutter="20" class="chart-row">
              <el-col :span="16">
                <el-card class="chart-card">
                  <template #header>
                    <div class="card-header">
                      <span>用户增长趋势</span>
                    </div>
                  </template>
                  <div ref="userTrendChart" class="chart"></div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="chart-card">
                  <template #header>
                    <div class="card-header">
                      <span>用户类型分布</span>
                    </div>
                  </template>
                  <div ref="userTypeChart" class="chart"></div>
                </el-card>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="chart-row">
              <el-col :span="24">
                <el-card class="chart-card">
                  <template #header>
                    <div class="card-header">
                      <span>访问量统计</span>
                    </div>
                  </template>
                  <div ref="visitChart" class="chart"></div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 模拟数据
const userCount = ref(0)
const servicerCount = ref(0)
const producterCount = ref(0)
const visitCount = ref(0)

// 图表引用
const userTrendChart = ref(null)
const userTypeChart = ref(null)
const visitChart = ref(null)

// 初始化图表
const initCharts = () => {
  // 用户增长趋势图
  const trendChart = echarts.init(userTrendChart.value)
  trendChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['总用户', '服务主体', '生产主体']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '总用户',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      },
      {
        name: '服务主体',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 290, 230, 220]
      },
      {
        name: '生产主体',
        type: 'line',
        smooth: true,
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  })

  // 用户类型分布图
  const typeChart = echarts.init(userTypeChart.value)
  typeChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '用户类型',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '服务主体' },
          { value: 735, name: '生产主体' },
          { value: 580, name: '普通用户' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })

  // 访问量统计图
  const visitChartInstance = echarts.init(visitChart.value)
  visitChartInstance.setOption({
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
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'bar',
        barWidth: '60%',
        data: [320, 332, 301, 334, 390, 330, 320],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ]
  })

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    trendChart.resize()
    typeChart.resize()
    visitChartInstance.resize()
  })
}

onMounted(() => {
  // 设置模拟数据
  userCount.value = 1000
  servicerCount.value = 150
  producterCount.value = 200
  visitCount.value = 500

  // 初始化图表
  initCharts()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-content {
  padding: 20px 0;
}

.data-overview {
  margin-top: 20px;
}

.data-header {
  font-size: 14px;
  color: #606266;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 10px 0;
}

.chart-row {
  margin-top: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart {
  height: 300px;
  width: 100%;
}

.el-card {
  margin-bottom: 20px;
}
</style> 