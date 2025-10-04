<template>
  <div class="standards-center-page">
    <!-- 顶部横幅 -->
    <div class="banner">
      <div class="banner-left">
        <img src="@/assets/logo/logo.jpeg" class="logo" alt="logo" />
        <span class="system-title">乡村特色产业标准化生产服务规范与质量评价系统</span>
      </div>
      <el-button class="home-btn" type="primary" @click="goHome">返回首页</el-button>
    </div>

    <!-- 中心内容 -->
    <div class="center-content">
      <div class="content-header">
        <div class="header-inline">
          <h2 class="content-title">农业标准库</h2>
          <span class="content-subtitle">请选择您要查看的标准类型</span>
        </div>
        <div class="content-divider"></div>
      </div>
      
      <!-- 标准分类卡片 -->
      <div class="standards-categories">
        <div class="category-card" @click="goToPlantationStandards">
          <div class="card-badge badge-plant">植</div>
          <div class="card-title">种植标准库</div>
          <div class="card-description">
            覆盖农作物种植技术、作业规范、质量控制、采后处理等标准文件
          </div>
          <div class="card-stats">
            <span class="stats-pill">
              <el-icon><Document /></el-icon>
              <span class="stats-text">共 {{ plantationCount }} 个标准</span>
            </span>
          </div>
        </div>

        <div class="category-card" @click="goToBreedingStandards">
          <div class="card-badge badge-breeding">养</div>
          <div class="card-title">养殖标准库</div>
          <div class="card-description">
            覆盖畜禽水产养殖技术、饲养管理、疫病防控、产品安全等标准文件
          </div>
          <div class="card-stats">
            <span class="stats-pill">
              <el-icon><Document /></el-icon>
              <span class="stats-text">共 {{ breedingCount }} 个标准</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 最新更新区域 -->
      <div class="latest-section">
        <div class="latest-header">
          <div class="header-inline">
            <h3 class="latest-title">最新更新</h3>
            <span class="latest-subtitle">最近发布或更新的服务标准</span>
          </div>
          <div class="latest-actions">
            <el-button text type="primary" @click="goToPlantationStandards">查看种植标准</el-button>
            <el-button text type="primary" @click="goToBreedingStandards">查看养殖标准</el-button>
          </div>
        </div>
        <div class="latest-grid">
          <div class="latest-card" v-for="std in latestStandards" :key="std.id" @click="openStandardSearch(std)">
            <div class="latest-name" :title="std.fileName">{{ std.fileName }}</div>
            <div class="latest-meta">
              <span class="latest-agency" :title="std.issuingAgency || '—'">{{ std.issuingAgency || '—' }}</span>
              <span class="dot">·</span>
              <span class="latest-date">{{ std.issueDate || '—' }}</span>
            </div>
            <div class="latest-footer">
              <span class="domain-pill" :class="{ plant: std.standardDomain==='种植', breed: std.standardDomain==='养殖' }">{{ std.standardDomain || '—' }}</span>
              <el-button size="small" type="primary" text @click.stop="openStandardReading(std)"
                :disabled="!std.attachments">在线阅读</el-button>
            </div>
          </div>
          <el-empty v-if="latestStandards.length===0" description="暂无最新标准" />
        </div>
      </div>
    </div>

    <div class="footer">
      Copyright © 2022-2024 江西农业大学 All Rights Reserved.
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listStandards } from '@/api/public'

const router = useRouter()

// 响应式数据
const plantationCount = ref(0)
const breedingCount = ref(0)
const hasPermission = ref(false)
const latestStandards = ref([])

// 获取标准数量统计
const getStandardsCounts = async () => {
  try {
    // 获取种植标准数量 (通过 standardDomain 字段区分，使用字典数字值)
    const plantationRes = await listStandards({ 
      standardDomain: '2', // 种植标准的字典值是2
      pageNum: 1,
      pageSize: 1 
    })
    plantationCount.value = plantationRes.total || 0

    // 获取养殖标准数量
    const breedingRes = await listStandards({ 
      standardDomain: '1', // 养殖标准的字典值是1
      pageNum: 1,
      pageSize: 1 
    })
    breedingCount.value = breedingRes.total || 0
  } catch (error) {
    console.error('获取标准数量失败:', error)
    // 如果API调用失败，显示默认数量
    plantationCount.value = 0
    breedingCount.value = 0
  }
}

// 获取最近更新的标准（各取最新的几条）
const getLatestStandards = async () => {
  try {
    const res = await listStandards({ pageNum: 1, pageSize: 6, orderByColumn: 'issue_date', isAsc: 'desc' })
    latestStandards.value = (res.rows || []).map(it => ({
      id: it.id,
      fileName: it.fileName,
      issuingAgency: it.issuingAgency,
      issueDate: it.issueDate,
      standardDomain: it.standardDomain,
      attachments: it.attachments
    }))
  } catch (e) {
    latestStandards.value = []
  }
}

// 检查用户权限
const checkPermission = () => {
  // 这里可以根据实际的权限系统来判断
  // 暂时设置为 false，需要根据实际权限系统调整
  hasPermission.value = false
}

// 导航方法
const goHome = () => {
  router.push('/home')
}

const goToPlantationStandards = () => {
  // 跳转到搜索结果页面，传递种植相关的筛选参数
  router.push({
    name: 'SearchResult',
    query: {
      searchType: 'service_standard',
      standardDomain: '2' // 种植标准的字典值是数字2
    }
  })
}

const goToBreedingStandards = () => {
  // 跳转到搜索结果页面，传递养殖相关的筛选参数
  router.push({
    name: 'SearchResult',
    query: {
      searchType: 'service_standard',
      standardDomain: '1' // 养殖标准的字典值是数字1
    }
  })
}

const goToStandardsManagement = () => {
  router.push('/base/standards')
}

onMounted(() => {
  getStandardsCounts()
  checkPermission()
  getLatestStandards()
})

// 打开标准的搜索/阅读
const baseUrl = import.meta.env.VITE_APP_BASE_API
const openStandardSearch = (std) => {
  if (std?.standardDomain === '2') { // 种植标准的字典值是2
    router.push({
      name: 'SearchResult',
      query: {
        searchType: 'service_standard',
        standardDomain: '2'
      }
    })
  } else if (std?.standardDomain === '1') { // 养殖标准的字典值是1
    router.push({
      name: 'SearchResult',
      query: {
        searchType: 'service_standard',
        standardDomain: '1'
      }
    })
  } else {
    router.push({
      name: 'SearchResult',
      query: {
        searchType: 'service_standard',
        searchQuery: std?.fileName || ''
      }
    })
  }
}
const openStandardReading = (std) => {
  if (std?.attachments) {
    const url = baseUrl + std.attachments
    const w = window.open(url, '_blank')
    if (!w) ElMessage.warning('请允许弹出窗口以在线阅读')
  } else {
    ElMessage.warning('该标准暂无附件')
  }
}
</script>

<style scoped>
.standards-center-page {
  font-family: 'Arial', sans-serif;
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 40px;
}

.banner {
  width: 100%;
  height: 90px;
  background: linear-gradient(90deg, #4cbf81 0%, #48a3e0 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 40px;
}

.banner-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 60px;
  margin-right: 18px;
  border-radius: 10px;
  background: #fff;
  padding: 4px;
}

.system-title {
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  white-space: nowrap;
}

.home-btn {
  font-size: 16px;
  border-radius: 20px;
  height: 40px;
  margin-left: 20px;
}

.center-content {
  width: 80%;
  max-width: 1200px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  padding: 40px;
}

.content-header { margin-bottom: 24px; }
.header-inline { display: flex; align-items: baseline; gap: 12px; }
.content-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.content-subtitle { font-size: 14px; color: #6b7280; }
.content-divider { height: 1px; background: #e5e7eb; margin-top: 10px; }

.standards-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.category-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  position: relative;
  overflow: hidden;
}

.category-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
}

.card-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  border-bottom-left-radius: 12px;
}
.badge-plant { background: #10b981; }
.badge-breeding { background: #3b82f6; }

.card-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; }

.card-description { font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 16px; }

.card-stats { display: flex; justify-content: flex-start; align-items: center; }
.stats-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; background: #f0fdf4; color: #065f46; border: 1px solid #bbf7d0; font-size: 12px; }
.stats-text { font-weight: 600; }

.latest-section { background: #f9fafb; border-radius: 12px; padding: 20px; }
.latest-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
.latest-title { font-size: 16px; font-weight: 700; color: #111827; margin: 0; }
.latest-subtitle { font-size: 13px; color: #6b7280; }
.latest-actions { display: flex; gap: 8px; }
.latest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.latest-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; cursor: pointer; transition: all .2s ease; }
.latest-card:hover { border-color: #10b981; box-shadow: 0 4px 12px rgba(16,185,129,.15); transform: translateY(-2px); }
.latest-name { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 6px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.latest-meta { font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; overflow: hidden; }
.latest-agency { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.dot { color: #9ca3af; }
.latest-footer { display: flex; justify-content: space-between; align-items: center; }
.domain-pill { padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid; }
.domain-pill.plant { background: #f0fdf4; color: #065f46; border-color: #bbf7d0; }
.domain-pill.breed { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: var(--el-color-success, #67c23a);
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  color: #fff;
  z-index: 100;
  border-radius: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .center-content {
    width: 90%;
    margin: 20px auto 0 auto;
    padding: 24px;
  }
  
  .standards-categories {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .category-card {
    padding: 24px;
  }
  
  .content-title {
    font-size: 28px;
  }
  
  .banner {
    padding: 0 20px;
  }
  
  .system-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .banner-left {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .logo {
    margin-bottom: 8px;
    margin-right: 0;
  }
  
  .system-title {
    font-size: 14px;
    white-space: normal;
    text-align: left;
  }
  
  .home-btn {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
