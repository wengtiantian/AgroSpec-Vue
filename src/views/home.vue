<template>
    <div class="home-page">
        <!-- 主横幅区域 -->
        <section class="hero" id="hero">
            <div class="hero-content">
                <div class="hero-text">
                    <h1><span>乡村特色产业</span>标准化<br>生产服务规范与质量评价系统</h1>
                    <p>构建标准化生产服务质量数字化评价体系</p>
                    <div class="hero-buttons">
                        <el-button type="success" size="large" @click="scrollToSearch" class="hero-btn primary">
                            <el-icon><Search /></el-icon>
                            立即搜索
                        </el-button>
                        <el-button size="large" @click="goToEvaluation" class="hero-btn secondary">
                            <el-icon><DataAnalysis /></el-icon>
                            动态评价系统
                        </el-button>
                    </div>
                </div>

                <div class="video-container">
                    <div class="video-wrapper">
                        <!-- 临时使用图片替代视频 -->
                        <img 
                            src="@/assets/images/640.jpg" 
                            alt="乡村特色产业标准化生产" 
                            class="intro-video"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- 搜索区域 -->
        <section class="search-section" id="search">
            <div class="search-container">
                <div class="search-header">
                    <div class="header-decoration">
                        <div class="decoration-icon">
                            <el-icon><Search /></el-icon>
                        </div>
                        <div class="decoration-lines">
                            <div class="line line-1"></div>
                            <div class="line line-2"></div>
                            <div class="line line-3"></div>
                        </div>
                    </div>
                    <h2>智能搜索服务</h2>
                    <p>快速找到您需要的农业服务主体和标准文件</p>
                    <div class="search-stats">
                        <div class="stat-item">
                            <span class="stat-number">1000+</span>
                            <span class="stat-label">服务主体</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number">500+</span>
                            <span class="stat-label">标准文件</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number">100%</span>
                            <span class="stat-label">专业服务</span>
                        </div>
                    </div>
                </div>
                
                <div class="search-form-container">
                    <form @submit.prevent="onSearch" class="search-form">
                        <div class="search-input-group">
                            <div class="input-box type-selector">
                                <span class="input-label">
                                    <el-icon><Filter /></el-icon>
                                    搜索类型
                                </span>
                                <el-select v-model="searchType" placeholder="选择搜索类型" class="search-select">
                                    <el-option label="🏢 服务主体" value="service_subject">
                                        <div class="option-content">
                                            <span class="option-icon">🏢</span>
                                            <div class="option-text">
                                                <div class="option-title">服务主体</div>
                                                <div class="option-desc">搜索农业服务提供商</div>
                                            </div>
                                        </div>
                                    </el-option>
                                    <el-option label="📋 服务标准" value="service_standard">
                                        <div class="option-content">
                                            <span class="option-icon">📋</span>
                                            <div class="option-text">
                                                <div class="option-title">服务标准</div>
                                                <div class="option-desc">搜索标准化文件</div>
                                            </div>
                                        </div>
                                    </el-option>
                                </el-select>
                            </div>

                            <div class="input-box search-input-box">
                                <span class="input-label">
                                    <el-icon><Search /></el-icon>
                                    搜索内容
                                </span>
                                <el-input 
                                    v-model="searchQuery" 
                                    placeholder="请输入搜索关键词..." 
                                    class="search-input" 
                                    clearable
                                    @keyup.enter="onSearch"
                                >
                                    <template #suffix>
                                        <el-icon class="search-icon"><Search /></el-icon>
                                    </template>
                                </el-input>
                            </div>

                            <el-button type="success" @click="onSearch" class="search-submit-btn" size="large">
                                <el-icon><Search /></el-icon>
                                搜索
                            </el-button>
                        </div>
                        
                        <div class="search-suggestions">
                            <div class="suggestions-header">
                                <el-icon class="suggestions-icon"><Star /></el-icon>
                                <span class="suggestions-label">热门搜索</span>
                            </div>
                            <div class="suggestions-list">
                                <el-tag 
                                    v-for="tag in hotSearchTags" 
                                    :key="tag"
                                    @click="quickSearch(tag)"
                                    class="suggestion-tag"
                                    effect="plain"
                                >
                                    <el-icon><Search /></el-icon>
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <!-- 农标通大模型区域 -->
        <section class="agristd-model-section">
            <div class="model-container">
                <div class="model-content">
                    <div class="model-text">
                        <div class="model-badge">
                            <el-icon><Cpu /></el-icon>
                            <span>AI 智能助手</span>
                        </div>
                        <h2>农标通大模型</h2>
                        <p>基于大模型技术的农业标准化智能助手，为您提供专业的农业标准解读、技术指导和问题解答服务。</p>
                        <div class="model-features">
                            <div class="feature-item">
                                <el-icon><ChatDotRound /></el-icon>
                                <span>智能问答</span>
                            </div>
                            <div class="feature-item">
                                <el-icon><Document /></el-icon>
                                <span>标准解读</span>
                            </div>
                            <div class="feature-item">
                                <el-icon><MagicStick /></el-icon>
                                <span>技术指导</span>
                            </div>
                        </div>
                        <div class="model-actions">
                            <el-button type="primary" size="large" @click="goToAgristdModel" class="model-btn">
                                <el-icon><Link /></el-icon>
                                立即体验
                            </el-button>
                            <div class="status-tip">
                                <el-icon><Warning /></el-icon>
                                <span>如遇访问问题，请稍后重试</span>
                            </div>
                        </div>
                    </div>
                    <div class="model-visual">
                        <div class="model-card">
                            <div class="card-header">
                                <div class="ai-avatar">
                                    <el-icon><Cpu /></el-icon>
                                </div>
                                <div class="ai-info">
                                    <h3>农标通 AI</h3>
                                    <span>在线服务中</span>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="message ai-message">
                                    <p>您好！我是农标通大模型，可以为您解答农业标准化相关问题...</p>
                                </div>
                                <div class="message user-message">
                                    <p>如何申请有机认证？</p>
                                </div>
                                <div class="message ai-message">
                                    <p>有机认证申请需要满足以下条件：1. 生产基地环境符合有机标准...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 推荐内容区域 -->
        <section class="recommendations-section">
            <recommendations></recommendations>
        </section>

        <!-- 服务特色介绍 -->
        <section class="features" id="features">
            <div class="section-heading">
                <span>核心功能</span>
                <h1>3步轻松获取服务</h1>
            </div>
            <div class="features-container">
                <div class="feature-box">
                    <div class="feature-icon">
                        <el-icon><Search /></el-icon>
                    </div>
                    <h2>智能搜索</h2>
                    <p>快速搜索农业服务主体和标准文件，精准匹配您的需求</p>
                </div>

                <div class="feature-box">
                    <div class="feature-icon">
                        <el-icon><Document /></el-icon>
                    </div>
                    <h2>标准库查询</h2>
                    <p>丰富的种植和养殖标准库，提供专业的标准化指导</p>
                </div>

                <div class="feature-box">
                    <div class="feature-icon">
                        <el-icon><Star /></el-icon>
                    </div>
                    <h2>质量评价</h2>
                    <p>完善的服务质量评价体系，确保服务水平和效果</p>
                </div>
            </div>
        </section>

        <!-- 关于我们 -->
        <section class="about" id="about">
            <div class="section-heading">
                <span>关于我们</span>
                <h1>专业的农业标准化服务体验</h1>
            </div>
            <div class="about-container">
                <div class="about-img">
                    <img src="@/assets/images/640.jpg" alt="农业标准化服务">
                </div>
                <div class="about-text">
                    <span>关于平台</span>
                    <p>乡村特色产业是支撑乡村振兴发展和提升农民收入的重要途径，标准化生产是实现乡村特色产业规模化、品牌化的重要保障。而服务质量是乡村特色产业发展的重要基础，对提高乡村特色产业的生产效率、产品品质和服务水平具有重要意义。</p>
                    <p>传统的乡村特色产业服务质量评价往往依赖于人工主观评估和经验判断，存在评价标准不统一、评价过程不科学、评价结果不精准等问题。为此，本课题拟构建乡村特色产业社会化服务技术规范、主体准入规范的服务质量数字化评价体系，将有助于实现服务质量的规范化、科学化和数字化。</p>
                    <el-button type="success" size="large" @click="goToAbout" class="about-btn">
                        了解更多
                    </el-button>
                </div>
            </div>
        </section>

        <!-- 订阅通知 -->
        <section class="newsletter">
            <h2>订阅最新农业标准资讯</h2>
            <div class="newsletter-box">
                <el-input v-model="emailInput" placeholder="请输入您的邮箱地址" class="newsletter-input" />
                <el-button type="success" @click="subscribe" class="newsletter-btn">订阅</el-button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
    Document,
    Filter,
    DataAnalysis,
    Cpu,
    ChatDotRound,
    MagicStick,
    Link,
} from '@element-plus/icons-vue'
import recommendations from '@/views/Recommendations.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const searchType = ref('service_subject');
const searchQuery = ref('');
const emailInput = ref('');
const router = useRouter();

// 热门搜索标签
const hotSearchTags = ref(['种植技术', '养殖标准', '有机认证', '质量检测', '农产品加工']);

const onSearch = () => {
    if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索内容');
        return;
    }
    
    console.log(`搜索类型: ${searchType.value}, 搜索内容: ${searchQuery.value}`);
    if (searchType.value == 'service_standard') {
        router.push({ name: 'SearchResult', query: { searchType: searchType.value, searchQuery: searchQuery.value } });
    } else {
        router.push({ name: 'SearchResultSubject', query: { searchType: searchType.value, searchQuery: searchQuery.value } });
    }
};

const scrollToSearch = () => {
    const searchSection = document.querySelector('#search');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
    }
};

const goToEvaluation = () => {
    router.push('/quality-evaluation/dynamic-system');
};

const goToAbout = () => {
    // 可以跳转到关于我们页面或显示更多信息
    ElMessage.info('关于我们页面开发中...');
};

const subscribe = () => {
    if (!emailInput.value.trim()) {
        ElMessage.warning('请输入邮箱地址');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        ElMessage.error('请输入正确的邮箱格式');
        return;
    }
    ElMessage.success('订阅成功！我们会第一时间为您推送最新资讯');
    emailInput.value = '';
};

const quickSearch = (tag) => {
    searchQuery.value = tag;
    searchType.value = 'service_standard'; // 热门搜索默认搜索标准
    onSearch();
};

// 跳转到农标通大模型
const goToAgristdModel = () => {
    console.log('点击农标通大模型按钮');
    window.open('https://www.agristd.com', '_blank');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
}

:root {
    --main-color: #67C23A;
    --second-color: #85CE61;
    --text-color: #444444;
    --light-bg: #F0F9FF;
    --white: #FFFFFF;
    --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    --gradient: linear-gradient(135deg, #67C23A, #85CE61);
}

.home-page {
    font-family: 'Poppins', 'Microsoft YaHei', sans-serif;
    overflow-x: hidden;
}

/* Hero Section */
.hero {
    width: 100%;
    min-height: 100vh;
    position: relative;
    background: linear-gradient(135deg, rgba(103, 194, 58, 0.9), rgba(133, 206, 97, 0.8)), 
                url('@/assets/images/640.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr;
    padding: 80px 60px 60px;
}

.hero-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
}

.hero-text h1 {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--white);
    line-height: 1.2;
    margin-bottom: 20px;
    letter-spacing: 1px;
}

.hero-text span {
    color: #FFE066;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-text p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 30px;
    line-height: 1.6;
}

.hero-buttons {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.hero-btn {
    padding: 15px 30px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 50px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.hero-btn.primary {
    background: var(--white);
    color: var(--main-color);
    box-shadow: var(--shadow);
}

.hero-btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-btn.secondary {
    background: transparent;
    color: var(--white);
    border: 2px solid var(--white);
}

.hero-btn.secondary:hover {
    background: var(--white);
    color: var(--main-color);
    transform: translateY(-3px);
}

/* Video Section */
.video-container {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
}

.video-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient);
    border-radius: 24px 24px 0 0;
}

.video-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.intro-video {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 20px;
}


/* Search Section */
.search-section {
    padding: 100px 60px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    position: relative;
    overflow: hidden;
}

.search-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%2367C23A" fill-opacity="0.03"><circle cx="30" cy="30" r="2"/></g></svg>') repeat;
    pointer-events: none;
}

.search-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.search-header {
    text-align: center;
    margin-bottom: 60px;
    position: relative;
}

.header-decoration {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    position: relative;
}

.decoration-icon {
    width: 80px;
    height: 80px;
    background: var(--gradient);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: var(--white);
    box-shadow: 0 10px 30px rgba(103, 194, 58, 0.3);
    position: relative;
    z-index: 2;
}

.decoration-lines {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}

.line {
    height: 2px;
    background: var(--gradient);
    border-radius: 1px;
    position: absolute;
    opacity: 0.6;
}

.line-1 {
    width: 200px;
    top: -10px;
    left: -100px;
    animation: float 3s ease-in-out infinite;
}

.line-2 {
    width: 150px;
    top: 0;
    left: -75px;
    animation: float 3s ease-in-out infinite 1s;
}

.line-3 {
    width: 100px;
    top: 10px;
    left: -50px;
    animation: float 3s ease-in-out infinite 2s;
}

@keyframes float {
    0%, 100% { transform: translateX(0) scaleX(1); opacity: 0.6; }
    50% { transform: translateX(10px) scaleX(1.1); opacity: 0.8; }
}

.search-header h2 {
    font-size: 3rem;
    font-weight: 800;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
    letter-spacing: -1px;
}

.search-header p {
    font-size: 1.3rem;
    color: #64748b;
    margin: 0 0 40px 0;
    font-weight: 500;
}

.search-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin-top: 30px;
}

.stat-item {
    text-align: center;
    position: relative;
}

.stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--main-color);
    line-height: 1;
    margin-bottom: 8px;
}

.stat-label {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.stat-divider {
    width: 2px;
    height: 60px;
    background: linear-gradient(to bottom, transparent, var(--main-color), transparent);
    opacity: 0.3;
}

/* Search Form */
.search-form-container {
    background: var(--white);
    padding: 50px;
    border-radius: 32px;
    box-shadow: 
        0 32px 64px rgba(0, 0, 0, 0.12),
        0 0 0 1px rgba(255, 255, 255, 0.8);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(20px);
}

.search-form-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--gradient);
    border-radius: 32px 32px 0 0;
}

.search-form-container::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(103, 194, 58, 0.05) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
    pointer-events: none;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.2; }
}

.search-input-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: end;
    margin-bottom: 25px;
}

.input-box {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.search-input-box {
    flex: 2;
}

.type-selector {
    flex: 1.2;
}

.input-label {
    font-weight: 600;
    color: var(--text-color);
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.input-label .el-icon {
    color: var(--main-color);
}

:deep(.search-select .el-input__wrapper),
:deep(.search-input .el-input__wrapper) {
    border-radius: 20px;
    border: 3px solid #f1f5f9;
    padding: 16px 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: #f8fafc;
    height: 60px;
    box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.02),
        0 1px 3px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 2;
}

:deep(.search-select .el-input__wrapper:hover),
:deep(.search-input .el-input__wrapper:hover) {
    border-color: rgba(103, 194, 58, 0.3);
    background: var(--white);
    box-shadow: 
        0 8px 25px rgba(103, 194, 58, 0.1),
        0 4px 10px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
}

:deep(.search-select .el-input__wrapper:focus-within),
:deep(.search-input .el-input__wrapper:focus-within) {
    border-color: var(--main-color);
    background: var(--white);
    box-shadow: 
        0 0 0 4px rgba(103, 194, 58, 0.15),
        0 12px 30px rgba(103, 194, 58, 0.2);
    transform: translateY(-3px);
}

:deep(.search-input .el-input__suffix) {
    display: flex;
    align-items: center;
}

.search-icon {
    color: #999;
    transition: color 0.3s ease;
}

:deep(.search-input .el-input__wrapper:focus-within) .search-icon {
    color: var(--main-color);
}

.search-submit-btn {
    padding: 16px 40px;
    border-radius: 20px;
    font-weight: 700;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 160px;
    height: 60px;
    background: var(--gradient);
    border: none;
    font-size: 17px;
    color: var(--white) !important;
    box-shadow: 
        0 8px 20px rgba(103, 194, 58, 0.3),
        0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    z-index: 2;
}

.search-submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.search-submit-btn:hover::before {
    left: 100%;
}

:deep(.search-submit-btn .el-icon),
:deep(.search-submit-btn span) {
    color: var(--white) !important;
    position: relative;
    z-index: 1;
}

.search-submit-btn:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
        0 15px 35px rgba(103, 194, 58, 0.4),
        0 8px 15px rgba(0, 0, 0, 0.15);
}

.search-submit-btn:active {
    transform: translateY(-2px) scale(0.98);
}

/* Search Suggestions */
.search-suggestions {
    padding-top: 40px;
    border-top: 2px solid #f1f5f9;
    margin-top: 30px;
    position: relative;
    z-index: 2;
}

.suggestions-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
}

.suggestions-icon {
    color: #fbbf24;
    font-size: 18px;
    animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(10deg); }
}

.suggestions-label {
    font-size: 16px;
    color: var(--text-color);
    font-weight: 600;
    white-space: nowrap;
}

.suggestions-list {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
}

.suggestion-tag {
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 25px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e2e8f0;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
}

.suggestion-tag::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--gradient);
    transition: left 0.3s ease;
    z-index: -1;
}

.suggestion-tag:hover::before {
    left: 0;
}

.suggestion-tag:hover {
    color: var(--white);
    border-color: var(--main-color);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(103, 194, 58, 0.3);
}

.suggestion-tag .el-icon {
    font-size: 12px;
    transition: transform 0.3s ease;
}

.suggestion-tag:hover .el-icon {
    transform: scale(1.2);
}

/* Select Options */
:deep(.el-select-dropdown__item) {
    padding: 0;
}

.option-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    width: 100%;
}

.option-icon {
    font-size: 18px;
    flex-shrink: 0;
}

.option-text {
    flex: 1;
}

.option-title {
    font-weight: 600;
    color: var(--text-color);
    font-size: 14px;
}

.option-desc {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
}

/* Features Section */
.features {
    padding: 80px 60px;
    background: var(--light-bg);
}

.section-heading {
    text-align: center;
    margin-bottom: 60px;
}

.section-heading span {
    font-weight: 600;
    text-transform: uppercase;
    color: var(--main-color);
    font-size: 14px;
    letter-spacing: 2px;
}

.section-heading h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin-top: 10px;
}

.features-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-box {
    text-align: center;
    padding: 40px 30px;
    background: var(--white);
    border-radius: 20px;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    cursor: pointer;
}

.feature-box:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
    width: 80px;
    height: 80px;
    background: var(--gradient);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
    font-size: 32px;
    color: var(--white);
    transition: all 0.3s ease;
}

.feature-box:hover .feature-icon {
    transform: scale(1.1);
}

.feature-box h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 15px;
}

.feature-box p {
    color: #666;
    line-height: 1.6;
    font-size: 15px;
}

/* 农标通大模型区域 */
.agristd-model-section {
    padding: 80px 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
}

.agristd-model-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>') repeat;
    pointer-events: none;
}

.model-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.model-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

.model-text {
    color: var(--white);
}

.model-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 16px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.model-text h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.2;
}

.model-text p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 30px;
    opacity: 0.9;
}

.model-features {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
}

.feature-item .el-icon {
    font-size: 18px;
    color: #FFE066;
}

.model-btn {
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 50px;
    background: var(--white);
    color: #667eea;
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.model-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    background: #f8f9fa;
}

.model-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
}

.status-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
}

.status-tip .el-icon {
    font-size: 16px;
    color: #FFE066;
}

.model-visual {
    display: flex;
    justify-content: center;
    align-items: center;
}

.model-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    max-width: 400px;
    width: 100%;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.ai-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: 20px;
}

.ai-info h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.ai-info span {
    font-size: 12px;
    color: #67C23A;
    font-weight: 500;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message {
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.4;
    max-width: 85%;
}

.ai-message {
    background: #f0f0f0;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.user-message {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: var(--white);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
}

/* Recommendations Section */
.recommendations-section {
    padding: 80px 60px;
    background: var(--white);
    position: relative;
}

.recommendations-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 4px;
    background: var(--gradient);
    border-radius: 2px;
}

/* About Section */
.about {
    padding: 80px 60px;
    background: var(--light-bg);
}

.about-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
}

.about-img img {
    width: 100%;
    border-radius: 20px;
    box-shadow: var(--shadow);
}

.about-text span {
    font-weight: 600;
    color: var(--main-color);
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 2px;
}

.about-text p {
    margin: 20px 0;
    color: var(--text-color);
    line-height: 1.7;
    font-size: 16px;
}

.about-btn {
    padding: 15px 30px;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.about-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(103, 194, 58, 0.3);
}

/* Newsletter Section */
.newsletter {
    background: var(--gradient);
    padding: 60px;
    text-align: center;
    color: var(--white);
}

.newsletter h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 30px;
}

.newsletter-box {
    display: flex;
    justify-content: center;
    gap: 20px;
    max-width: 500px;
    margin: 0 auto;
}

:deep(.newsletter-input .el-input__wrapper) {
    border-radius: 50px;
    border: none;
    padding: 12px 20px;
    background: var(--white);
}

.newsletter-btn {
    padding: 12px 24px;
    border-radius: 50px;
    background: var(--white);
    color: var(--main-color);
    font-weight: 600;
    border: none;
    transition: all 0.3s ease;
}

.newsletter-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1200px) {
    .hero {
        padding: 80px 40px 60px;
    }
    
    .features,
    .about,
    .search-section,
    .recommendations-section {
        padding: 60px 40px;
    }
}

@media (max-width: 768px) {
    .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
    }
    
    .hero-text h1 {
        font-size: 2.5rem;
    }
    
    .hero-buttons {
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .search-input-group {
        flex-direction: column;
        align-items: stretch;
    }
    
    .input-box {
        min-width: auto;
    }
    
    .intro-video {
        height: 250px;
    }
    
    .search-header h2 {
        font-size: 2rem;
    }
    
    .decoration-icon {
        width: 60px;
        height: 60px;
        font-size: 28px;
    }
    
    .search-stats {
        gap: 20px;
        flex-direction: column;
    }
    
    .stat-number {
        font-size: 2rem;
    }
    
    /* 农标通大模型响应式 */
    .model-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
    }
    
    .model-text h2 {
        font-size: 2.5rem;
    }
    
    .model-features {
        justify-content: center;
        gap: 20px;
    }
    
    .model-card {
        max-width: 100%;
    }
    
    .about-container {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .about-img {
        order: 1;
    }
    
    .about-text {
        order: 2;
    }
    
    .newsletter-box {
        flex-direction: column;
        align-items: center;
    }
    
    :deep(.newsletter-input) {
        width: 100%;
        max-width: 300px;
    }
}

@media (max-width: 480px) {
    .hero {
        padding: 60px 20px 40px;
    }
    
    .hero-text h1 {
        font-size: 2rem;
    }
    
    .section-heading h1 {
        font-size: 1.8rem;
    }
    
    .features,
    .about,
    .recommendations-section {
        padding: 40px 20px;
    }
    
    .search-form-container {
        padding: 30px 20px;
    }
    
    .video-container {
        padding: 20px;
    }
    
    .search-header h2 {
        font-size: 1.5rem;
    }
    
    .stat-number {
        font-size: 1.5rem;
    }
    
    .suggestions-list {
        gap: 10px;
    }
    
    .suggestion-tag {
        padding: 8px 16px;
        font-size: 13px;
    }
    
    .newsletter {
        padding: 40px 20px;
    }
}
</style>