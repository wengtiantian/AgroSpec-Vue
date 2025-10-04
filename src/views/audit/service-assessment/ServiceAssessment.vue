<!-- src/views/service-assessment/ServiceAssessment.vue -->
<template>
  <div class="service-assessment-container">
    <div class="page-banner">
      <h1>服务主体准入评估</h1>
      <p>通过规范化的评估体系，提升农业服务主体的标准化水平和质量水平</p>
    </div>

    <div class="service-modules">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="module in serviceModules" :key="module.name">
          <router-link :to="module.path">
            <el-card class="module-card" shadow="hover">
              <div class="module-icon">
                <el-icon><component :is="module.icon" /></el-icon>
              </div>
              <div class="module-title">{{ module.title }}</div>
              <div class="module-desc">{{ module.description }}</div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <div class="service-intro">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <div class="intro-content">
            <h2>服务主体准入评估系统</h2>
            <p>服务主体准入评估系统是一套完整的评估服务体系，旨在规范农业服务主体的准入条件，提高服务质量，促进农业产业高质量发展。</p>
            <p>通过建立科学的评估标准和流程，对服务主体的基础资质、专业能力、安全生产规范等方面进行全面评估，确保农业服务主体具备提供高质量服务的条件。</p>
            <el-button type="success" @click="$router.push('/service-assessment/standard-system')">了解准入标准</el-button>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="intro-image">
                <img src="@/assets/images/640.jpg" alt="服务主体准入评估" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const serviceModules = reactive([
  {
    title: '准入标准体系',
    description: '包含基础资质清单、行业专项要求及安全生产规范',
    path: '/service-assessment/standard-system',
    icon: 'Document'
  },
  {
    title: '在线评估服务',
    description: '提供在线自评和专家评估服务，快速获取评估结果',
    path: '/service-assessment/online-service',
    icon: 'Service'
  },
  {
    title: '信用档案管理',
    description: '建立健全的服务主体信用档案，提升行业信任度',
    path: '/service-assessment/credit-management',
    icon: 'DataLine'
  },
  {
    title: '政策工具箱',
    description: '汇集各类支持政策与工具，助力主体发展',
    path: '/service-assessment/policy-toolkit',
    icon: 'Briefcase'
  }
]);
</script>

<style scoped>
.service-assessment-container {
  width: 100%;
  padding: 20px;
}

.page-banner {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
  background-color: #f6f9f6;
  border-radius: 8px;
}

.page-banner h1 {
  font-size: 36px;
  color: var(--el-color-success);
  margin-bottom: 16px;
}

.page-banner p {
  font-size: 18px;
  color: #606266;
}

.service-modules {
  margin-bottom: 50px;
}

.module-card {
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.module-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: var(--el-color-success);
}

.module-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}

.module-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.service-intro {
  background-color: #f6f9f6;
  padding: 40px;
  border-radius: 8px;
}

.intro-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.intro-content h2 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 20px;
}

.intro-content p {
  font-size: 16px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.intro-image {
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.intro-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>