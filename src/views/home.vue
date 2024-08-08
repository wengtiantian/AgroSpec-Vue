<template>
    <div class="home-page">
        <!-- 顶部横幅 -->
        <div class="banner">
            乡村特色产业社会化服务技术规范、主体准入与质量评价数字化系统
        </div>


        <!-- 中心内容 -->
        <div class="center-content">
            <!-- 搜索框 -->
            <div class="search-container">
                <el-select popper-class="mypopper" v-model="searchType" placeholder="选择搜索类型" class="search-type">
                    <el-option label="服务主体" value="service_subject"></el-option>
                    <el-option label="服务标准" value="service_standard"></el-option>
                </el-select>
                <el-input v-model="searchQuery" placeholder="请输入搜索内容" class="search-input" clearable />
                <el-button type="success" :icon="Search" class="search-button">搜索</el-button>
                <!-- <el-button type="success" :icon="Search" circle @click="onSearch" class="search-button" /> -->

            </div>

            <!-- 推荐内容 -->
            <div class="recommendations">
                <h2>服务主体推荐</h2>
                <div class="card-row">
                    <div class="card" v-for="(subject, index) in serviceSubjects" :key="index">
                        <img :src="subject.image" alt="服务主体图片">
                        <p>{{ subject.name }}</p>
                        <p>{{ subject.type }}</p>
                        <el-rate v-model="subject.quality" disabled></el-rate>
                    </div>
                </div>
                <h2>服务标准推荐</h2>
                <div class="card-row">
                    <div class="card" v-for="(standard, index) in serviceStandards" :key="index">
                        <img :src="standard.image" alt="服务标准图片">
                        <p>{{ standard.name }}</p>
                        <p>{{ standard.publisher }}</p>
                        <p>{{ standard.time }}</p>
                    </div>
                </div>
            </div>
        </div>
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
} from '@element-plus/icons-vue'


const searchType = ref('service_subject');
const searchQuery = ref('');

const serviceSubjects = ref([
    { name: '主体1', image: 'src/assets/logo/logo.jpeg', type: '类型1', quality: 4 },
    { name: '主体2', image: 'src/assets/logo/logo.jpeg', type: '类型2', quality: 3.5 },
    { name: '主体3', image: 'src/assets/logo/logo.jpeg', type: '类型3', quality: 5 },
]);

const serviceStandards = ref([
    { name: '标准1', image: 'src/assets/logo/logo.jpeg', publisher: '发布者1', time: '2023-01-01' },
    { name: '标准2', image: 'src/assets/logo/logo.jpeg', publisher: '发布者2', time: '2023-02-01' },
    { name: '标准3', image: 'src/assets/logo/logo.jpeg', publisher: '发布者3', time: '2023-03-01' },
]);

const onSearch = () => {
    // 搜索功能逻辑
    console.log(`搜索类型: ${searchType.value}, 搜索内容: ${searchQuery.value}`);
};


</script>
  
<style scoped>
.home-page {
    font-family: 'Arial', sans-serif;
    text-align: center;
}



.banner {
    width: 100%;
    height: 400px;
    background-image: url(../assets/images/banner.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 44px;
    font-weight: bold;
    /* padding-top: 80px; */
    /* 与header高度相同的顶部空白 */
    box-sizing: border-box;
}

.center-content {
    width: 60%;
    margin: 20px auto;
    /* 减少顶部空白 */
}

.search-container {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    align-items: center;
}

/* 深度选择器覆盖 Element Plus 样式 */
:deep(.search-type .el-input__wrapper) {
    height: 48px;
    border-radius: 50px;
    text-align: center;
}

:deep(.search-input .el-input__wrapper) {
    height: 48px;
    border-radius: 50px;
    /* 搜索框圆角50% */
    margin-left: 10px;

}

::v-deep .el-select .el-input__inner {
    text-align: center;
}

.mypopper .el-select-dropdown__item {
    text-align: center;
}

.search-button {
    width: 155px;
    height: 50px;
    border-radius: 50px;
    margin-left: 10px;

}

.recommendations {
    margin-top: 40px;
}

.card-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

.card {
    width: 30%;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    text-align: center;

    border: 2px solid transparent;
    /* 设置默认透明边框 */
}

.card img {
    max-width: 100%;

    border-radius: 20px;
}

.card p {
    margin-top: 10px;
    font-size: 18px;
}

.card:hover {
    cursor: pointer;
    /* 放大动画 */
    border: 0.5px solid var(--el-color-success)
        /* 边框颜色 */
}
</style>
  