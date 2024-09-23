<template>
    <div class="home-page">
        <!-- 顶部横幅 -->
        <div class="banner">
            乡村特色产业标准化生产服务规范与质量评价系统
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
                <el-button type="success" @click="onSearch" :icon="Search" class="search-button">搜索</el-button>
                <!-- <el-button type="success" :icon="Search" circle @click="onSearch" class="search-button" /> -->

            </div>

            <!-- 推荐内容 -->
            <recommendations></recommendations>
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
import recommendations from '@/views/Recommendations.vue'

const searchType = ref('service_subject');
const searchQuery = ref('');
const router = useRouter();

const onSearch = () => {
    // 搜索功能逻辑
    console.log(`搜索类型: ${searchType.value}, 搜索内容: ${searchQuery.value}`);
    if (searchType.value == 'service_standard') {
        router.push({ name: 'SearchResult', query: { searchType: searchType.value, searchQuery: searchQuery.value } });
    } else {
        router.push({ name: 'SearchResultSubject', query: { searchType: searchType.value, searchQuery: searchQuery.value } });

    }


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
</style>
  