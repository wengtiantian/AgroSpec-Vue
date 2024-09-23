<template>
    <div class="service-subject-detail">
        <!-- 顶部部分：返回按钮 -->
        <div class="top-section">
            <el-button type="text" @click="goBack" class="back-button">← 返回上一级</el-button>
        </div>

        <!-- 中间部分：服务主体介绍 -->
        <div class="middle-section">
            <div class="video-section">
                <video :src="subjectDetail.videoUrl" controls class="subject-video"></video>
            </div>
            <div class="info-section">
                <h2>{{ subjectDetail.name }}</h2>
                <p>电话: {{ subjectDetail.phone }}</p>
                <p>地址: {{ subjectDetail.address }}</p>
                <p>服务类型: {{ subjectDetail.type }}</p>
                <el-rate v-model="subjectDetail.quality" disabled></el-rate>
                <p class="introduction">简介: {{ subjectDetail.introduction }}</p>
            </div>
        </div>

        <!-- 新增部分：服务主体图片展示 -->
        <div class="images-section">
            <h3>服务主体图片展示</h3>
            <div class="images-row">
                <img v-for="(image, index) in subjectDetail.images" :src="image" :key="index" alt="服务主体图片"
                    class="subject-image">
            </div>
        </div>


    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const subjectDetail = ref({
    name: '主体1',
    phone: '123-456-7890',
    address: '某省某市某区某街道',
    type: '类型1',
    quality: 4.5,
    videoUrl: 'src/assets/videos/sample.mp4',
    introduction: '这是一个示例服务主体的详细介绍。提供了各种类型的服务，并且在本地有着良好的声誉。',
    images: [
        'src/assets/logo/logo.jpeg',
        'src/assets/logo/logo.jpeg',
        'src/assets/logo/logo.jpeg',
    ],
});
const goBack = () => {
    router.go(-1);
};
</script>
  
<style scoped>
.service-subject-detail {

    width: 80%;
    margin: 80px auto;
    font-family: 'Arial', sans-serif;
}

.top-section {
    text-align: right;
    margin-top: 20px;
}

.back-button {
    font-size: 16px;
    color: #333;
}

.middle-section {
    display: flex;
    justify-content: space-between;
    margin: 40px 0;
}

.video-section {
    flex: 1;
    margin-right: 20px;
}

.subject-video {
    width: 100%;
    border-radius: 10px;
}

.info-section {
    flex: 1;
    padding-left: 20px;
}

.info-section h2 {
    font-size: 28px;
    margin-bottom: 20px;
}

.info-section p {
    font-size: 18px;
    margin-bottom: 10px;
}

.images-section {
    margin-top: 40px;
}

.images-row {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.images-row img {
    width: 300px;
}

.bottom-section {
    margin-top: 40px;
}

.card-row {
    display: flex;
    justify-content: space-between;
}

.card {
    width: 30%;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    text-align: center;
}

.card img {
    max-width: 100%;
    border-radius: 20px;
}

.card p {
    margin-top: 10px;
    font-size: 18px;
}
</style>
  