<template>
    <div class="recommendations">
        <h2 class="section-title">服务主体推荐</h2>
        <div class="carousel-container">
            <button class="nav-arrow left" @click="prev('subject')">‹</button>
            <div class="carousel-track">
                <div class="carousel-card subject-card"
                     v-for="(subject, index) in serviceSubjects"
                     :key="index"
                     :class="getCardClass('subject', index)"
                     @click="handleCardClick('subject', index)">
                    <img :src="subject.pictureUrls ? baseUrl + subject.pictureUrls.split(',')[0] : placeholderImage"
                         alt="服务主体图片" @error="handleImageError($event)">
                </div>
            </div>
            <button class="nav-arrow right" @click="next('subject')">›</button>
        </div>
        <div class="member-info" v-if="currentSubject">
            <h2 class="member-name" @click="currentSubject?.id && goToSubjectDetail(currentSubject.id)">{{ currentSubject.name }}</h2>
            <p class="member-role">
                <dict-tag :options="es_org_type" :value="currentSubject.typeId" />
            </p>
        </div>
        <div class="dots" v-if="serviceSubjects.length > 1">
            <div class="dot" v-for="(s, i) in serviceSubjects" :key="'sdot'+i" :class="{ active: i === currentSubjectIndex }" @click="setCurrent('subject', i)"></div>
        </div>

        <h2 class="section-title">服务标准推荐</h2>
        <div class="carousel-container">
            <button class="nav-arrow left" @click="prev('standard')">‹</button>
            <div class="carousel-track">
                <div class="carousel-card standard-card"
                     v-for="(standard, index) in serviceStandards"
                     :key="index"
                     :class="getCardClass('standard', index)"
                     @click="handleCardClick('standard', index)">
                    <img :src="standard.coverImage ? baseUrl + standard.coverImage : placeholderImage"
                         alt="服务标准图片" @error="handleImageError($event)">
                </div>
            </div>
            <button class="nav-arrow right" @click="next('standard')">›</button>
        </div>
        <div class="member-info" v-if="currentStandard">
            <h2 class="member-name" @click="currentStandard?.id && goToStandardDetail(currentStandard.id)">{{ currentStandard.fileName }}</h2>
            <p class="member-role">{{ currentStandard.issuingAgency || '—' }}</p>
        </div>
        <div class="dots" v-if="serviceStandards.length > 1">
            <div class="dot" v-for="(s, i) in serviceStandards" :key="'tdot'+i" :class="{ active: i === currentStandardIndex }" @click="setCurrent('standard', i)"></div>
        </div>
    </div>
</template>

<script setup>
import { listServicer, listStandards } from "@/api/public";
import { ref, reactive, toRefs, getCurrentInstance, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import profileImage from '@/assets/images/profile.jpg';

const baseUrl = import.meta.env.VITE_APP_BASE_API;
// 使用本地图片作为占位符，避免外部链接
const placeholderImage = profileImage;
const { proxy } = getCurrentInstance();
const { es_is_auth, es_org_type, es_manage_status } = proxy.useDict('es_is_auth', 'es_org_type', 'es_manage_status');

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
    },
    rules: {},
});

const { queryParams, form, rules } = toRefs(data);
const serviceSubjects = ref([]);
const serviceStandards = ref([]);
const subjectRow = ref(null);
const standardRow = ref(null);
const subjectScrollLeftDisabled = ref(true);
const subjectScrollRightDisabled = ref(true);
const standardScrollLeftDisabled = ref(true);
const standardScrollRightDisabled = ref(true);
const subjectActiveIndicator = ref(0);
const standardActiveIndicator = ref(0);

// 3D 轮播状态
const currentSubjectIndex = ref(0)
const currentStandardIndex = ref(0)
const currentSubject = computed(() => serviceSubjects.value[currentSubjectIndex.value])
const currentStandard = computed(() => serviceStandards.value[currentStandardIndex.value])

function setCurrent(type, index){
    if(type==='subject'){
        currentSubjectIndex.value = (index + serviceSubjects.value.length) % serviceSubjects.value.length
    }else{
        currentStandardIndex.value = (index + serviceStandards.value.length) % serviceStandards.value.length
    }
}
function prev(type){ setCurrent(type, (type==='subject'?currentSubjectIndex.value:currentStandardIndex.value) - 1) }
function next(type){ setCurrent(type, (type==='subject'?currentSubjectIndex.value:currentStandardIndex.value) + 1) }
function getCardClass(type, index){
    const len = type==='subject'?serviceSubjects.value.length:serviceStandards.value.length
    const cur = type==='subject'?currentSubjectIndex.value:currentStandardIndex.value
    if(len===0) return ''
    const offset = (index - cur + len) % len
    if(offset===0) return 'center'
    if(offset===1) return 'right-1'
    if(offset===2) return 'right-2'
    if(offset===len-1) return 'left-1'
    if(offset===len-2) return 'left-2'
    return 'hidden'
}

function handleCardClick(type, index){
    // 若点击的是当前居中卡片，则直接跳转到详情；否则先将其设为当前
    const isSubject = type==='subject'
    const len = isSubject? serviceSubjects.value.length : serviceStandards.value.length
    if(len===0) return
    const cur = isSubject? currentSubjectIndex.value : currentStandardIndex.value
    if(index === cur){
        if(isSubject){
            const item = serviceSubjects.value[index]
            item?.id && goToSubjectDetail(item.id)
        }else{
            const item = serviceStandards.value[index]
            item?.id && goToStandardDetail(item.id)
        }
    }else{
        setCurrent(type, index)
    }
}

// 计算指示器数量
const subjectIndicators = computed(() => {
    return Math.ceil(serviceSubjects.value.length / 3); // 假设每屏显示3张卡片
});
const standardIndicators = computed(() => {
    return Math.ceil(serviceStandards.value.length / 3);
});

/** 查询列表 */
function getList() {
    listServicer(queryParams.value).then(response => {
        console.log('服务主体API响应:', response);
        const rows = response?.rows || response?.data || [];
        serviceSubjects.value = Array.isArray(rows) ? rows : [];
        serviceSubjects.value = serviceSubjects.value.map(v => ({
            ...v,
            quality: Math.random() * 3 + 2,
        }));
        // 等待DOM更新后再更新滚动状态
        nextTick(() => {
            updateScrollState('subject');
        });
    }).catch(error => {
        console.error('获取服务主体列表失败:', error);
        serviceSubjects.value = []; // 确保即使出错也初始化为空数组
        proxy.$message.error('获取服务主体失败，请稍后重试');
    });

    console.log('调用标准列表API，参数:', {
        pageNum: queryParams.value.pageNum,
        pageSize: queryParams.value.pageSize
    });
    
    listStandards({
        pageNum: queryParams.value.pageNum,
        pageSize: queryParams.value.pageSize
    }).then(response => {
        console.log('API返回的标准数据:', response);
        const rows = response?.rows || response?.data || [];
        serviceStandards.value = Array.isArray(rows) ? rows : [];
        console.log('设置的服务标准数据:', serviceStandards.value);
        if (serviceStandards.value.length > 0) {
            console.log('数据表字段检查:', {
                总数: response?.total || serviceStandards.value.length,
                数据量: serviceStandards.value.length,
                第一条数据: serviceStandards.value[0],
                封面图字段检查: serviceStandards.value[0] ? {
                    coverImage: serviceStandards.value[0].coverImage,
                    attachments: serviceStandards.value[0].attachments,
                    fileName: serviceStandards.value[0].fileName
                } : null
            });
        }
        // 等待DOM更新后再更新滚动状态
        nextTick(() => {
            updateScrollState('standard');
        });
    }).catch(error => {
        console.error('获取服务标准列表失败:', error);
        serviceStandards.value = []; // 确保即使出错也初始化为空数组
        proxy.$message.error('获取服务标准失败，请稍后重试');
    });
}

const router = useRouter();

const goToSubjectDetail = (id) => {
    router.push({ name: 'ServiceSubjectDetail', query: { id } });
};

const goToStandardDetail = (id) => {
    router.push({ name: 'ServiceStandardDetail', query: { id } });
};

// 处理图片加载失败
const handleImageError = (event) => {
    event.target.src = placeholderImage;
};

// 滚动方法
const scrollLeft = (type) => {
    const row = type === 'subject' ? subjectRow.value : standardRow.value;
    console.log('点击左滚动，类型:', type, '元素:', row);
    if (row) {
        const scrollAmount = row.offsetWidth * 0.9;
        console.log('滚动距离:', scrollAmount, '当前scrollLeft:', row.scrollLeft);
        row.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
        });
        // 延迟更新状态
        setTimeout(() => updateScrollState(type), 300);
    }
};

const scrollRight = (type) => {
    const row = type === 'subject' ? subjectRow.value : standardRow.value;
    console.log('点击右滚动，类型:', type, '元素:', row);
    if (row) {
        const scrollAmount = row.offsetWidth * 0.9;
        console.log('滚动距离:', scrollAmount, '当前scrollLeft:', row.scrollLeft);
        row.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });
        // 延迟更新状态
        setTimeout(() => updateScrollState(type), 300);
    }
};

// 更新滚动状态
const updateScrollState = (type) => {
    const row = type === 'subject' ? subjectRow.value : standardRow.value;
    if (row) {
        const scrollLeft = row.scrollLeft;
        const scrollWidth = row.scrollWidth;
        const clientWidth = row.clientWidth;

        console.log(`更新${type}滚动状态:`, {
            scrollLeft,
            scrollWidth,
            clientWidth,
            canScrollLeft: scrollLeft > 0,
            canScrollRight: scrollLeft + clientWidth < scrollWidth - 1,
            needScroll: scrollWidth > clientWidth
        });

        if (type === 'subject') {
            // 如果内容宽度小于等于容器宽度，则不需要滚动，禁用所有按钮
            if (scrollWidth <= clientWidth) {
                subjectScrollLeftDisabled.value = true;
                subjectScrollRightDisabled.value = true;
            } else {
                subjectScrollLeftDisabled.value = scrollLeft <= 0;
                subjectScrollRightDisabled.value = scrollLeft + clientWidth >= scrollWidth - 1;
            }
            subjectActiveIndicator.value = Math.round(scrollLeft / (scrollWidth / subjectIndicators.value));
        } else {
            // 如果内容宽度小于等于容器宽度，则不需要滚动，禁用所有按钮
            if (scrollWidth <= clientWidth) {
                standardScrollLeftDisabled.value = true;
                standardScrollRightDisabled.value = true;
            } else {
                standardScrollLeftDisabled.value = scrollLeft <= 0;
                standardScrollRightDisabled.value = scrollLeft + clientWidth >= scrollWidth - 1;
            }
            standardActiveIndicator.value = Math.round(scrollLeft / (scrollWidth / standardIndicators.value));
        }
    }
};

// 组件挂载后初始化
onMounted(() => {
    getList();
});
</script>

<style scoped>
.recommendations {
    margin: 40px auto;
    padding: 0 20px;
    max-width: 1400px;
}

.section-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    position: relative;
    padding-left: 15px;
}

.section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 5px;
    background: var(--el-color-primary);
    border-radius: 2px;
}

.carousel-container { width: 100%; max-width: 1200px; height: 450px; position: relative; perspective: 1000px; margin: 30px auto 10px; }
.carousel-track { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; position: relative; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94); }
.carousel-card { position: absolute; width: 280px; height: 380px; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15); transition: all 0.8s cubic-bezier(0.25,0.46,0.45,0.94); cursor: pointer; }
.carousel-card img { width: 100%; height: 100%; object-fit: cover; transition: all 0.8s cubic-bezier(0.25,0.46,0.45,0.94); }
.carousel-card.center { z-index: 10; transform: scale(1.1) translateZ(0); }
.carousel-card.left-2 { z-index: 1; transform: translateX(-400px) scale(0.8) translateZ(-300px); opacity: .7; }
.carousel-card.left-1 { z-index: 5; transform: translateX(-200px) scale(0.9) translateZ(-100px); opacity: .9; }
.carousel-card.right-1 { z-index: 5; transform: translateX(200px) scale(0.9) translateZ(-100px); opacity: .9; }
.carousel-card.right-2 { z-index: 1; transform: translateX(400px) scale(0.8) translateZ(-300px); opacity: .7; }
.carousel-card.hidden { opacity: 0; pointer-events: none; }
.member-info { text-align: center; margin-top: 12px; transition: all .5s ease-out; }
.member-name { color: var(--el-color-success, #67C23A); font-size: 1.6rem; font-weight: 700; margin-bottom: 6px; display: inline-block; }
.member-role { color: #848696; font-size: 1rem; font-weight: 500; opacity: .9; letter-spacing: .05em; }
.dots { display: flex; justify-content: center; gap: 10px; margin: 8px 0 30px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(8,42,123,0.2); cursor: pointer; transition: all .3s ease; }
.dot.active { background: var(--el-color-success, #67C23A); transform: scale(1.2); }
.nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: var(--el-color-success, #67C23A); color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 20; transition: all .3s ease; font-size: 1.5rem; border: none; outline: none; box-shadow: 0 8px 20px rgba(0,0,0,.12); }
.nav-arrow:hover { background: var(--el-color-success-dark-2, #529b2e); transform: translateY(-50%) scale(1.1); }
.nav-arrow.left { left: 20px; }
.nav-arrow.right { right: 20px; }

.card-row { display: none; }

.card {
    flex: 0 0 320px;
    min-width: 320px;
    height: 360px;
    padding: 15px;
    border-radius: 16px;
    text-align: center;
    background: linear-gradient(145deg, #ffffff, #f0f4f8);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card:hover {
    cursor: pointer;
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.card img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
    transition: transform 0.3s ease;
    flex-shrink: 0;
}

.card:hover img {
    transform: scale(1.05);
}

.card-content {
    padding: 15px 10px;
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 8px 0;
    line-height: 1.4;
    height: 44px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}

.card-subtitle {
    font-size: 14px;
    color: #666;
    margin: 5px 0;
    line-height: 1.3;
    height: 36px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}

.card-date {
    font-size: 12px;
    color: #999;
    margin: 5px 0;
    flex-shrink: 0;
}

.subject-card .type-tag {
    margin: 10px auto;
    background: var(--el-color-info-light);
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 12px;
}

.subject-card .rating {
    margin-top: 10px;
}

.scroll-btn { display: none; }

.scroll-container::before,
.scroll-container::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    pointer-events: none;
    z-index: 1;
}

.scroll-container::before {
    left: 0;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.95), transparent);
}

.scroll-container::after {
    right: 0;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.95), transparent);
}

.scroll-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
}

.indicator {
    width: 8px;
    height: 8px;
    background: #d9d9d9;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.indicator.active {
    background: var(--el-color-primary);
    width: 12px;
    height: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .carousel-card { width: 220px; height: 300px; }
    .carousel-card.left-2 { transform: translateX(-250px) scale(0.8) translateZ(-300px); }
    .carousel-card.left-1 { transform: translateX(-120px) scale(0.9) translateZ(-100px); }
    .carousel-card.right-1 { transform: translateX(120px) scale(0.9) translateZ(-100px); }
    .carousel-card.right-2 { transform: translateX(250px) scale(0.8) translateZ(-300px); }
}

@media (max-width: 480px) {
    .card {
        flex: 0 0 240px;
        min-width: 240px;
    }

    .card img {
        height: 140px;
    }

    .card-title {
        font-size: 16px;
    }

    .scroll-btn {
        width: 36px;
        height: 36px;
    }
}
</style>