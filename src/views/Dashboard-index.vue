<template>
  <div class="default-index-page">
    <div class="welcome-banner">
      <img src="@/assets/logo/logo.jpeg" class="logo" alt="logo" />
      <div class="welcome-text">
        <h1>欢迎进入乡村特色产业标准化生产服务规范与质量评价系统后台</h1>
        <p>本系统为各类用户提供标准化管理、数据统计、资料下载等一站式服务。</p>
      </div>
    </div>
    <div class="quick-links">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="quick-card" @click="goTo('/user/profile')">
            <div class="icon-area"><el-icon><User /></el-icon></div>
            <div class="card-title">个人中心</div>
            <div class="card-desc">查看和编辑个人信息，修改密码等</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="quick-card" @click="goTo('/standards-center')">
            <div class="icon-area"><el-icon><Document /></el-icon></div>
            <div class="card-title">农业标准库</div>
            <div class="card-desc">查询、下载和管理种植与养殖标准文件</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="quick-card" @click="goTo('/admin/dashboard')">
            <div class="icon-area"><el-icon><DataAnalysis /></el-icon></div>
            <div class="card-title">数据统计</div>
            <div class="card-desc">查看系统数据统计与分析（如有权限）</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="system-info">
      <h2>系统简介</h2>
      <p>
        通过制定的标准化乡村特色产业社会化服务流程和相应的服务质量标准，建立规范化的服务流程和标准化的服务质量评价体系，服务提供者可以通过数字化系统对服务质量进行评价和反馈，不断优化服务质量；借助建立的服务提供者准入规范和审核机制来保障服务提供者的素质和能力；研究的数字化技术系统，将服务质量评价过程数字化，以提高服务质量评价的效率和准确性，以及对服务质量进行实时监控和反馈，帮助服务提供者及时发现和解决问题，提高服务质量和客户满意度。
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Document, DataAnalysis } from '@element-plus/icons-vue'
const router = useRouter()
function goTo(path) {
  router.push(path)
}
</script>

<style scoped>
.default-index-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40px;
}
.welcome-banner {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #4cbf81 0%, #48a3e0 100%);
  color: #fff;
  padding: 40px 60px 30px 60px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
}
.logo {
  height: 80px;
  margin-right: 36px;
  border-radius: 12px;
  background: #fff;
  padding: 8px;
}
.welcome-text h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}
.welcome-text p {
  font-size: 18px;
  margin: 0;
}
.quick-links {
  margin: 40px auto 0 auto;
  width: 80%;
}
.quick-card {
  cursor: pointer;
  transition: box-shadow 0.2s;
  border-radius: 16px;
  text-align: center;
  min-height: 180px;
  margin-bottom: 24px;
}
.quick-card:hover {
  box-shadow: 0 8px 32px 0 rgba(72,163,224,0.15);
  background: #f0faff;
}
.icon-area {
  font-size: 40px;
  margin: 24px 0 12px 0;
  color: #48a3e0;
}
.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}
.card-desc {
  font-size: 14px;
  color: #666;
}
.system-info {
  width: 80%;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  padding: 32px 32px 24px 32px;
  text-align: left;
}
.system-info h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
}
.system-info p {
  font-size: 16px;
  color: #333;
  margin: 0;
}
</style>
