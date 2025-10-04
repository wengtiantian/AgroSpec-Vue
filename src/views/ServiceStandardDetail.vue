<template>
    <div class="page-container">
        <!-- 导航栏 -->
        <div class="nav-bar">
            <el-button @click="goBack" link class="back-btn">
                <el-icon><ArrowLeft /></el-icon>
                返回
            </el-button>
            <span class="nav-title">服务标准详情</span>
        </div>

        <!-- 主要内容区域 -->
        <div class="main-content">
            <!-- 标题卡片 -->
            <el-card class="title-card" shadow="never">
                <div class="header-section">
                    <div class="title-content">
                        <h1 class="standard-title">{{ StandarfDetail.fileName }}</h1>
                        <div class="title-meta">
                            <el-tag type="success" effect="light" size="small">
                                <el-icon><Document /></el-icon>
                                服务标准
                            </el-tag>
                            <span class="file-number" v-if="StandarfDetail.fileNumber">
                                编号：{{ StandarfDetail.fileNumber }}
            </span>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <el-button @click="GoRead" type="success" :icon="View" size="large" class="action-btn">
                            在线阅读
                        </el-button>
                        <el-button @click="DownloadPDF" type="primary" :icon="Download" size="large" class="action-btn">
                            下载PDF
                        </el-button>
                    </div>
                </div>
            </el-card>

            <!-- 标准封面图片展示 -->
            <div class="cover-section" v-if="getCoverImages().length > 0">
                <div class="cover-gallery">
                    <div class="options">
                        <div 
                            v-for="(image, index) in getCoverImages()" 
                            :key="index"
                            class="option"
                            :class="{ active: index === activeImageIndex }"
                            :style="{ '--optionBackground': `url(${getCoverImageUrl(image.url)})` }"
                            @click="setActiveImage(index)"
                        >
                            <div class="shadow"></div>
                            <div class="label">
                                <div class="icon">
                                    <el-icon><Picture /></el-icon>
                                </div>
                                <div class="info">
                                    <div class="main">{{ image.title || StandarfDetail.fileName || '标准封面' }}</div>
                                    <div class="sub">{{ image.description || '点击查看详情' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>

            <!-- 页面主体内容 -->
            <div class="page-body">
                <!-- 左侧主内容栏 -->
                <div class="main-column">
                    <!-- 服务范围卡片 -->
                    <el-card class="info-card scope-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><CollectionTag /></el-icon>
                                <span class="header-title">农业服务范围</span>
                            </div>
                        </template>
                        <div class="scope-content">
                            <div v-if="StandarfDetail.serviceScope" class="scope-text">
                                {{ StandarfDetail.serviceScope }}
                            </div>
                            <div v-else class="scope-empty">
                                <el-icon><Warning /></el-icon>
                                <span>暂无农业服务范围说明</span>
                            </div>
                        </div>
                    </el-card>

                    <!-- 服务要求卡片 -->
                    <el-card class="info-card requirements-card" shadow="hover" v-if="StandarfDetail.serviceRequirements">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><DocumentChecked /></el-icon>
                                <span class="header-title">服务要求</span>
                            </div>
                        </template>
                        <div class="requirements-content">
                            <div class="requirements-text">{{ StandarfDetail.serviceRequirements }}</div>
                        </div>
                    </el-card>

                    <!-- 技术参数卡片 -->
                    <el-card class="info-card technical-card" shadow="hover" v-if="StandarfDetail.technicalParameters">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><Setting /></el-icon>
                                <span class="header-title">技术参数</span>
                            </div>
                        </template>
                        <div class="technical-content">
                            <div class="technical-text">{{ StandarfDetail.technicalParameters }}</div>
        </div>
                    </el-card>

                    <!-- 质量指标卡片 -->
                    <el-card class="info-card quality-card" shadow="hover" v-if="StandarfDetail.qualityIndicators">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><Odometer /></el-icon>
                                <span class="header-title">质量指标</span>
                            </div>
                        </template>
                        <div class="quality-content">
                            <div class="quality-text">{{ StandarfDetail.qualityIndicators }}</div>
                        </div>
                    </el-card>

                    <!-- 统一的补充信息卡片 -->
                    <el-card class="info-card supplementary-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><Notebook /></el-icon>
                                <span class="header-title">补充信息</span>
                            </div>
                        </template>
                        <div v-if="hasSupplementaryInfo" class="supplementary-content">
                            <div v-if="StandarfDetail.revisionNotes" class="supplementary-item">
                                <div class="supplementary-title">
                                    <el-icon><DocumentCopy /></el-icon>
                                    <span>修订说明</span>
                                </div>
                                <div class="supplementary-text">{{ StandarfDetail.revisionNotes }}</div>
                            </div>
                            <div v-if="StandarfDetail.relatedFiles" class="supplementary-item">
                                <div class="supplementary-title">
                                    <el-icon><Link /></el-icon>
                                    <span>相关文件</span>
                                </div>
                                <div class="supplementary-text">{{ StandarfDetail.relatedFiles }}</div>
                            </div>
                            <div v-if="StandarfDetail.notes" class="supplementary-item">
                                <div class="supplementary-title">
                                    <el-icon><Notebook /></el-icon>
                                    <span>备注</span>
                                </div>
                                <div class="supplementary-text">{{ StandarfDetail.notes }}</div>
                            </div>
                        </div>
                        <div v-else class="supplementary-empty">
                            <el-icon><InfoFilled /></el-icon>
                            <span>暂无更多补充信息</span>
                        </div>
                    </el-card>

                    <!-- 相关标准推荐卡片 -->
                    <el-card class="info-card related-standards-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><Star /></el-icon>
                                <span class="header-title">相关推荐</span>
                            </div>
                        </template>
                        <div class="related-standards-content">
                            <div class="related-standard-item" v-for="item in getRelatedStandards()" :key="item.id">
                                <div class="related-standard-icon">
                                    <el-icon><Document /></el-icon>
                                </div>
                                <div class="related-standard-info">
                                    <h4 class="related-standard-title">{{ item.title }}</h4>
                                    <p class="related-standard-desc">{{ item.description }}</p>
                                    <el-tag :type="item.type" size="small">{{ item.category }}</el-tag>
                                </div>
                            </div>
                            <div v-if="getRelatedStandards().length === 0" class="no-related-standards">
                                <el-icon><DocumentRemove /></el-icon>
                                <span>暂无相关标准推荐</span>
                            </div>
                        </div>
                    </el-card>
                </div>

                <!-- 右侧边栏 -->
                <div class="sidebar-column">
                    <!-- 基本信息卡片 -->
                    <el-card class="info-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><InfoFilled /></el-icon>
                                <span class="header-title">基本信息</span>
                            </div>
                        </template>
                        <div class="info-item">
                            <label>发布单位：</label>
                            <span class="info-value">{{ StandarfDetail.issuingAgency || '—' }}</span>
                        </div>
                        <div class="info-item" v-if="StandarfDetail.issueDate">
                            <label>发布时间：</label>
                            <span class="info-value">{{ StandarfDetail.issueDate }}</span>
                        </div>
                        <div class="info-item" v-if="StandarfDetail.effectiveDate">
                            <label>实施时间：</label>
                            <span class="info-value">{{ StandarfDetail.effectiveDate }}</span>
                        </div>
                        <div class="info-item" v-if="StandarfDetail.author">
                            <label>起草人：</label>
                            <span class="info-value">{{ StandarfDetail.author }}</span>
                        </div>
                        <div class="info-item" v-if="StandarfDetail.standardDomain">
                            <label>标准领域：</label>
                            <el-tag :type="getStandardDomainType(StandarfDetail.standardDomain)" size="small">
                                {{ getStandardDomainText(StandarfDetail.standardDomain) }}
                            </el-tag>
                        </div>
                    </el-card>

                    <!-- 标准核心要素可视化卡片 -->
                    <el-card class="info-card venn-card" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <el-icon class="header-icon"><Compass /></el-icon>
                                <span class="header-title">标准核心要素</span>
                            </div>
                        </template>
                        <div class="venn-container">
                            <div class="venn">
                                <span>服务标准</span>
                                <span>核心体系</span>
                                <div class="venn__circles">
                                    <i><em data-text="服务范围"></em></i>
                                    <i><em data-text="技术规范"></em></i>
                                    <i><em data-text="质量保证"></em></i>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getStandards } from '@/api/public';
import { ElMessage } from 'element-plus';
import { 
    ArrowLeft, 
    Document, 
    View, 
    Download, 
    InfoFilled, 
    CollectionTag, 
    DocumentChecked, 
    Setting, 
    Odometer,
    Compass,
    Warning,
    DocumentCopy,
    Link,
    Notebook,
    Picture,
    Star,
    DocumentRemove
} from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

const StandarfDetail = ref({});
const hasSupplementaryInfo = ref(false);
const activeImageIndex = ref(0); // 新增一个状态来判断是否有补充信息

const baseUrl = import.meta.env.VITE_APP_BASE_API;

// 获取标准详情
getStandards(route.query.id).then((res) => {
    StandarfDetail.value = res.data;
    console.log('获取到的标准详情数据:', StandarfDetail.value);

    // 检查是否存在任何补充信息
    if (StandarfDetail.value.revisionNotes || StandarfDetail.value.relatedFiles || StandarfDetail.value.notes) {
        hasSupplementaryInfo.value = true;
    }
}).catch(() => {
    ElMessage.error('获取标准详情失败');
});

// 返回上一页
const goBack = () => {
    router.go(-1);
};

// 获取标准领域类型（用于标签颜色）
const getStandardDomainType = (domain) => {
    switch(domain) {
        case '1': return 'warning';  // 养殖标准
        case '2': return 'success';  // 种植标准
        default: return 'info';
    }
};

// 获取标准领域文本
const getStandardDomainText = (domain) => {
    switch(domain) {
        case '1': return '养殖标准';
        case '2': return '种植标准';
        default: return '其他标准';
    }
};

function openNewWindow(path) {
    const newWindow = window.open(window.location.origin);
    if (newWindow) {
        // 在新窗口中设置路由
        newWindow.location.href = `${window.location.origin}${path}`;
    } else {
        console.error('窗口打开失败');
    }
}

const GoRead = () => {
    if (StandarfDetail.value.attachments) {
        openNewWindow('/online-reading?src=' + baseUrl + StandarfDetail.value.attachments);
    } else {
        ElMessage.warning('该标准文件没有上传附件，无法在线阅读');
    }
};

const DownloadPDF = () => {
    if (StandarfDetail.value.attachments) {
        const downloadUrl = baseUrl + StandarfDetail.value.attachments;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = StandarfDetail.value.fileName + '.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        ElMessage.success('开始下载文件');
    } else {
        ElMessage.warning('该标准文件没有上传附件，无法下载');
    }
};

// 获取封面图片URL
const getCoverImageUrl = (coverImage) => {
    if (!coverImage) return '';
    
    // 如果已经是完整的URL，直接返回
    if (coverImage.startsWith('http')) {
        return coverImage;
    }
    
    // 如果是/profile/开头的路径，直接使用
    if (coverImage.startsWith('/profile/')) {
        return coverImage;
    }
    
    // 其他情况拼接baseUrl
    return baseUrl + coverImage;
};

// 预览封面图片
const previewCover = () => {
    // Element Plus的el-image组件会自动处理预览
    console.log('预览封面图片');
};

// 处理封面标签
const getCoverTags = (tags) => {
    if (!tags) return [];
    
    // 如果是字符串，按逗号分割
    if (typeof tags === 'string') {
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // 如果是数组，直接返回
    if (Array.isArray(tags)) {
        return tags;
    }
    
    return [];
};

// 获取封面图片数组
const getCoverImages = () => {
    if (!StandarfDetail.value.coverImage) return [];
    
    // 如果coverImage是字符串，可能包含多个图片URL（逗号分隔）
    if (typeof StandarfDetail.value.coverImage === 'string') {
        const urls = StandarfDetail.value.coverImage.split(',').map(url => url.trim()).filter(url => url);
        
        // 固定返回五张图片
        const baseUrl = urls[0] || '';
        return [
            {
                url: baseUrl,
                title: StandarfDetail.value.fileName || '标准封面',
                description: '标准主要封面图片'
            },
            {
                url: urls[1] || baseUrl,
                title: '详细视图',
                description: '查看完整标准信息'
            },
            {
                url: urls[2] || baseUrl,
                title: '应用场景',
                description: '了解实际应用情况'
            },
            {
                url: urls[3] || baseUrl,
                title: '技术规范',
                description: '技术标准详细说明'
            },
            {
                url: urls[4] || baseUrl,
                title: '质量保证',
                description: '质量标准与认证'
            }
        ];
    }
    
    // 如果是数组格式，也固定返回五张
    if (Array.isArray(StandarfDetail.value.coverImage)) {
        const images = StandarfDetail.value.coverImage;
        const baseImage = images[0] || '';
        
        return [
            {
                url: typeof images[0] === 'string' ? images[0] : (images[0]?.url || baseImage),
                title: typeof images[0] === 'object' ? images[0].title : '标准封面',
                description: typeof images[0] === 'object' ? images[0].description : '标准主要封面图片'
            },
            {
                url: typeof images[1] === 'string' ? images[1] : (images[1]?.url || baseImage),
                title: typeof images[1] === 'object' ? images[1].title : '详细视图',
                description: typeof images[1] === 'object' ? images[1].description : '查看完整标准信息'
            },
            {
                url: typeof images[2] === 'string' ? images[2] : (images[2]?.url || baseImage),
                title: typeof images[2] === 'object' ? images[2].title : '应用场景',
                description: typeof images[2] === 'object' ? images[2].description : '了解实际应用情况'
            },
            {
                url: typeof images[3] === 'string' ? images[3] : (images[3]?.url || baseImage),
                title: typeof images[3] === 'object' ? images[3].title : '技术规范',
                description: typeof images[3] === 'object' ? images[3].description : '技术标准详细说明'
            },
            {
                url: typeof images[4] === 'string' ? images[4] : (images[4]?.url || baseImage),
                title: typeof images[4] === 'object' ? images[4].title : '质量保证',
                description: typeof images[4] === 'object' ? images[4].description : '质量标准与认证'
            }
        ];
    }
    
    return [];
};

// 设置活动图片索引（添加防抖优化）
let animationTimeout = null;
const setActiveImage = (index) => {
    // 清除之前的动画
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }
    
    // 立即更新索引
    activeImageIndex.value = index;
    
    // 添加小延迟确保动画完成
    animationTimeout = setTimeout(() => {
        animationTimeout = null;
    }, 400);
};

// 获取相关标准推荐（模拟数据，实际应从后端获取）
const getRelatedStandards = () => {
    // 这里可以根据当前标准的领域、关键词等来推荐相关标准
    const domain = StandarfDetail.value.standardDomain;
    
    if (domain === '1') { // 养殖标准
        return [
            {
                id: 1,
                title: '畜禽养殖污染防治技术规范',
                description: '规范畜禽养殖过程中的污染防治措施',
                category: '环保标准',
                type: 'success'
            },
            {
                id: 2,
                title: '动物防疫技术标准',
                description: '确保养殖动物健康的防疫技术要求',
                category: '防疫标准',
                type: 'warning'
            }
        ];
    } else if (domain === '2') { // 种植标准
        return [
            {
                id: 3,
                title: '有机农产品种植标准',
                description: '有机农产品的种植技术和质量要求',
                category: '有机标准',
                type: 'success'
            },
            {
                id: 4,
                title: '农药使用安全技术规范',
                description: '农药在种植过程中的安全使用标准',
                category: '安全标准',
                type: 'danger'
            }
        ];
    }
    
    return [];
};
</script>
  
<style scoped>
.page-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* 导航栏样式 */
.nav-bar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;
}

.back-btn {
    font-size: 16px;
    color: #606266;
    margin-right: 16px;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: #f0f0f0;
    color: #409EFF;
}

.nav-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
}

/* 主要内容区域 */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

/* 标题卡片 */
.title-card {
    margin-bottom: 24px;
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* 封面展示区域 */
.cover-section {
    margin-bottom: 24px;
}

.cover-gallery {
    width: 100%;
}

/* 多图展示组件样式 */
.options {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    overflow: hidden;
    width: 100%;
    height: 320px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateZ(0); /* 启用GPU加速 */
    backface-visibility: hidden; /* 优化渲染性能 */
}

.option {
    position: relative;
    overflow: hidden;
    min-width: 60px;
    margin: 10px;
    background: var(--optionBackground, #E6E9ED);
    background-size: auto 120%;
    background-position: center;
    cursor: pointer;
    transition: flex-grow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                transform 0.3s ease-out,
                border-radius 0.3s ease-out;
    border-radius: 16px;
    will-change: flex-grow, transform;
    transform: translateZ(0); /* 启用GPU加速 */
    backface-visibility: hidden; /* 优化渲染性能 */
}

/* 默认颜色配置 - 五张图片 */
.option:nth-child(1) { --defaultBackground: #ED5565; }
.option:nth-child(2) { --defaultBackground: #FC6E51; }
.option:nth-child(3) { --defaultBackground: #FFCE54; }
.option:nth-child(4) { --defaultBackground: #2ECC71; }
.option:nth-child(5) { --defaultBackground: #5D9CEC; }

.option.active {
    flex-grow: 10000;
    transform: scale(1);
    max-width: 600px;
    margin: 0px;
    border-radius: 20px;
    background-size: auto 100%;
    transition: flex-grow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                transform 0.3s ease-out,
                border-radius 0.3s ease-out,
                margin 0.3s ease-out;
}

.option.active .shadow {
    box-shadow: inset 0 -120px 120px -120px black, inset 0 -120px 120px -100px black;
}

.option.active .label {
    bottom: 20px;
    left: 20px;
}

.option.active .label .info > div {
    left: 0px;
    opacity: 1;
}

.option:not(.active) {
    flex-grow: 1;
    border-radius: 16px;
}

.option:not(.active) .shadow {
    bottom: -40px;
    box-shadow: inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
}

.option:not(.active) .label {
    bottom: 10px;
    left: 10px;
}

.option:not(.active) .label .info > div {
    left: 20px;
    opacity: 0;
}

.shadow {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 120px;
    transition: box-shadow 0.3s ease-out, bottom 0.3s ease-out;
    will-change: box-shadow, bottom;
}

.label {
    display: flex;
    position: absolute;
    right: 0px;
    height: 40px;
    transition: bottom 0.3s ease-out, left 0.3s ease-out;
    will-change: bottom, left;
}

.label .icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: white;
    color: var(--defaultBackground, #409EFF);
}

.label .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
    color: white;
    white-space: pre;
}

.label .info > div {
    position: relative;
    transition: left 0.3s ease-out, opacity 0.3s ease-out;
    will-change: left, opacity;
}

.label .info .main {
    font-weight: bold;
    font-size: 1.2rem;
}

.label .info .sub {
    transition-delay: 0.1s;
    font-size: 0.9rem;
    opacity: 0.9;
}

/* 响应式设计 - 五张图片版本 */
@media screen and (max-width: 900px) {
    .options {
        height: 280px;
    }
}

@media screen and (max-width: 768px) {
    .options {
        height: 260px;
    }
    .option:nth-child(5) {
        display: none;
    }
}

@media screen and (max-width: 640px) {
    .options {
        height: 240px;
    }
    .option:nth-child(4),
    .option:nth-child(5) {
        display: none;
    }
}

@media screen and (max-width: 520px) {
    .options {
        height: 200px;
    }
    .option:nth-child(3),
    .option:nth-child(4),
    .option:nth-child(5) {
        display: none;
    }
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
}

.title-content {
    flex: 1;
}

.standard-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.title-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.file-number {
    color: #909399;
    font-size: 14px;
    padding: 4px 12px;
    background: #f5f7fa;
    border-radius: 20px;
}

.action-buttons {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
}

.action-btn {
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 页面主体内容 */
.page-body {
    display: flex;
    gap: 20px;
    margin-top: 24px;
}

/* 左侧主内容栏 */
.main-column {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 右侧边栏 */
.sidebar-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 相关标准推荐卡片 */
.related-standards-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.related-standard-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    cursor: pointer;
}

.related-standard-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #409EFF;
}

.related-standard-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #409EFF, #67C23A);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
}

.related-standard-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.related-standard-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    line-height: 1.4;
}

.related-standard-desc {
    font-size: 14px;
    color: #606266;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.no-related-standards {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #909399;
    font-size: 14px;
}

.no-related-standards .el-icon {
    font-size: 32px;
    margin-bottom: 8px;
    opacity: 0.6;
}

/* 信息网格 */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.info-card {
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #303133;
}

.header-icon {
    font-size: 18px;
    color: #409EFF;
}

.header-title {
    font-size: 16px;
}

/* 基本信息样式 */
.info-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f7fa;
}

.info-item:last-child {
    border-bottom: none;
}

.info-item label {
    width: 100px;
    font-weight: 500;
    color: #606266;
    flex-shrink: 0;
}

.info-value {
    color: #303133;
    flex: 1;
}

/* 内容区域样式 */
.scope-content,
.requirements-content,
.technical-content,
.quality-content,
.revision-content,
.related-content,
.notes-content {
    padding: 16px 0;
}

.scope-text,
.requirements-text,
.technical-text,
.quality-text,
.revision-text,
.related-text,
.notes-text {
    line-height: 1.8;
    color: #303133;
    margin: 0;
    font-size: 18px;
}

/* 空状态样式 */
.scope-empty {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #909399;
    font-size: 14px;
    padding: 20px 0;
    justify-content: center;
}

.scope-empty .el-icon {
    font-size: 16px;
}

/* 底部操作区域 */
.bottom-actions {
    margin-top: 32px;
}

.actions-card {
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.actions-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.file-icon {
    font-size: 32px;
    color: #409EFF;
}

.file-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-name {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.file-tip {
    font-size: 14px;
    color: #909399;
}

.action-group {
    display: flex;
    gap: 16px;
    flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
    .page-body {
        flex-direction: column;
        gap: 16px;
    }

    .main-column,
    .sidebar-column {
        flex: none;
        width: 100%;
    }
    
    /* 封面响应式 */
    .cover-wrapper {
        width: 200px;
        height: 280px;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 16px;
    }
    
    .header-section {
        flex-direction: column;
        gap: 16px;
    }
    
    .action-buttons {
        width: 100%;
        justify-content: center;
    }
    
    .actions-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
    
    .action-group {
        justify-content: center;
        width: 100%;
    }
    
    .standard-title {
        font-size: 24px;
    }
    
    /* 封面移动端优化 */
    .cover-wrapper {
        width: 160px;
        height: 220px;
    }
}

@media (max-width: 480px) {
    .action-buttons,
    .action-group {
        flex-direction: column;
    }
    
    .action-btn {
        width: 100%;
    }
}

/* 韦恩图卡片样式 */
.venn-card .header-icon {
    color: #667eea;
}

.venn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    min-height: 280px;
}

/* 韦恩图样式 */
.venn {
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    text-transform: uppercase;
    font-size: 14px;
    color: white;
    font-weight: bold;
    line-height: 1;
    
    width: 240px;
    height: 240px;
    padding: 25px;
    
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
}

.venn:hover,
.venn:hover *,
.venn:hover *:after {
    animation-play-state: paused;
}

.venn > span {
    position: relative;
    z-index: 1;
    text-align: center;
    display: block;
    font-size: 16px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.venn > span:nth-child(2) {
    position: absolute;
    inset: 53% 0 0 0;
    font-size: 12px;
}

.venn__circles {
    position: absolute;
    inset: auto 0 12% 0;
    margin: auto;
    width: 78%;
    height: 73%;
    transform-origin: 50% 55%;
    animation: venn_rotate 7s linear infinite;
}

.venn__circles i {
    animation: venn_rotate 7s linear infinite;
    animation-direction: reverse;
    
    position: absolute;
    bottom: 0;
    margin: auto;
    width: 62%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: rgba(80, 227, 194, 0.6);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.venn__circles i:nth-child(2) {
    --animation-delay: calc(-7s / 3 * 2);
    right: 0;
    bottom: 0;
    background: rgba(255, 183, 77, 0.6);
}

.venn__circles i:nth-child(3) {
    --animation-delay: calc(-7s / 3);
    left: 0;
    right: 0;
    bottom: auto;
    background: rgba(255, 108, 108, 0.6);
}

.venn__circles em {
    font-style: normal;
    position: absolute;
    inset: 35% 5%;
    animation: venn_rotate 7s linear infinite;
    animation-delay: var(--animation-delay);
    display: flex;
    align-items: flex-end;
}

.venn__circles em:after {
    content: attr(data-text);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 66.6666666%;
    animation: venn_rotate 7s linear infinite;
    animation-delay: var(--animation-delay);
    animation-direction: reverse;
    font-size: 12px;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@keyframes venn_rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 响应式韦恩图优化 */
@media (max-width: 768px) {
    .venn {
        width: 200px;
        height: 200px;
        padding: 20px;
        font-size: 12px;
    }
    
    .venn > span {
        font-size: 14px;
    }
    
    .venn > span:nth-child(2) {
        font-size: 10px;
    }
    
    .venn__circles em:after {
        font-size: 9px;
    }
    
    .venn-container {
        padding: 15px;
        min-height: 220px;
    }
}

@media (max-width: 480px) {
    .venn {
        width: 160px;
        height: 160px;
        padding: 15px;
        font-size: 10px;
    }
    
    .venn > span {
        font-size: 12px;
    }
    
    .venn > span:nth-child(2) {
        font-size: 8px;
    }
    
    .venn__circles em:after {
        font-size: 8px;
    }
    
    .venn-container {
        padding: 10px;
        min-height: 180px;
    }
}

/* 特殊卡片颜色主题 */
.scope-card .header-icon {
    color: #67C23A;
}

.requirements-card .header-icon {
    color: #E6A23C;
}

.technical-card .header-icon {
    color: #909399;
}

.quality-card .header-icon {
    color: #F56C6C;
}

/* 新增卡片颜色主题 */
.supplementary-card .header-icon {
    color: #409EFF; /* Blue */
}

.supplementary-card .header-title {
    color: #409EFF; /* Blue */
}

.supplementary-content .supplementary-item .supplementary-title .header-icon {
    color: #409EFF; /* Blue */
}

.supplementary-content .supplementary-item .supplementary-title {
    color: #409EFF; /* Blue */
}

.supplementary-content .supplementary-item .supplementary-text {
    color: #303133; /* Dark text */
}

.supplementary-empty .el-icon {
    color: #909399; /* Gray */
}

/* 新增卡片颜色主题 */
.revision-card .header-icon {
    color: #67C23A; /* Green */
}

.related-card .header-icon {
    color: #409EFF; /* Blue */
}

.notes-card .header-icon {
    color: #E6A23C; /* Orange */
}

/* 相关推荐卡片颜色主题 */
.related-standards-card .header-icon {
    color: #F56C6C; /* Red */
}
</style>
  