<template>
    <div class="service-subject-detail">
        <!-- 顶部部分：返回按钮 -->
        <!-- <div class="top-section">
            <el-button link @click="goBack" class="back-button">← 返回上一级</el-button>
        </div> -->

        <!-- 中间部分：服务主体介绍 -->
        <div class="middle-section">
            <div class="video-section">
                <video :src="baseUrl + subjectDetail.video" controls class="subject-video"></video>
            </div>
            <div class="info-section">
                <h2>{{ subjectDetail.name }}</h2>
                <div>电话: {{ subjectDetail.accountPhone }}</div>
                <div>地址: {{ subjectDetail.regionPre + subjectDetail.regionXx }}</div>
                <div :key="item"
                    v-for="item in subjectDetail.serviceTypeXx && mergeFruitData(JSON.parse(subjectDetail.serviceTypeXx))">
                    {{ item }}</div>
                <div>服务评价：<el-rate v-model="subjectDetail.quality" disabled></el-rate></div>
                <div class="introduction">简介: {{ removeHtmlTags(subjectDetail.introduce) }}</div>
            </div>
        </div>

        <!-- 新增部分：服务主体图片展示 -->
        <div class="images-section">
            <h3>服务主体图片展示</h3>
            <div class="images-row">
                <img v-for="image in subjectDetail.pictureUrls && subjectDetail.pictureUrls.split(',')"
                    :src="baseUrl + image" :key="image" alt="服务主体图片" class="subject-image">
            </div>
        </div>

        <!-- 新增部分：评价框和提交按钮 -->
        <div class="review-section">
            <h3>发表评价</h3>
            <el-input type="textarea" :rows="4" placeholder="请输入您的评价" v-model="reviewText" class="review-input"></el-input>
            <el-button type="primary" @click="submitReview" class="submit-button">提交评价</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mergeFruitData } from '@/utils/service-type'
import { getServicer } from "@/api/public";
import { ElMessage } from 'element-plus';
import { addbyproducter } from "@/api/base/reviews";

const router = useRouter();
const route = useRoute();
const subjectDetail = ref({});
const reviewText = ref('');
const rating = ref(5); // 默认评分（1-5星）

const baseUrl = import.meta.env.VITE_APP_BASE_API;
getServicer(route.query.id).then((res) => {
    subjectDetail.value = res.data;
    subjectDetail.value.quality = 4
})

const goBack = () => {
    router.go(-1);
};

const submitReview = async () => {
    if (reviewText.value.trim() === '') {
        ElMessage.warning('评价内容不能为空');
        return;
    }
    const reviewData = {
        servicerId: subjectDetail.value.id, // 服务主体ID
        content: reviewText.value, // 评价内容
        rating: rating.value, // 评分
    };

    // 调用 addReviews API 提交评价
    const response = await addbyproducter(reviewData);
    ElMessage.success('评价提交成功');
    reviewText.value = ''; // 清空输入框
    rating.value = 5; // 重置评分

};

// 移除HTML标签的函数
function removeHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '');
}
</script>

<style scoped>
/* 为整个页面添加浅色背景 */
.service-subject-detail {
    width: 80%;
    margin: 100px auto;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    /* 浅灰色背景 */
    padding: 30px;
    /* 增加内边距 */
    border-radius: 15px;
    /* 圆角 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* 添加阴影 */
}

.top-section {
    text-align: right;
    margin-top: 20px;
}

.back-button {
    font-size: 16px;
    color: #333;
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.back-button:hover {
    color: #409EFF;
    /* 鼠标悬停时改变颜色 */
}

.middle-section {
    display: flex;
    justify-content: space-between;
    margin: 40px 0;
    background-color: #e8f5e9;
    /* 浅浅绿色背景 */
    padding: 20px;
    /* 内边距 */
    border-radius: 10px;
    /* 圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 阴影 */
}

.video-section {
    flex: 1;
    margin-right: 20px;
}

.subject-video {
    width: 100%;
    height: 400px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.info-section {
    flex: 1;
    padding-left: 20px;
}

.info-section h2 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #2e7d32;
    /* 深绿色标题 */
}

.info-section div {
    font-size: 18px;
    margin-bottom: 10px;
    color: #666;
}

.introduction {
    line-height: 1.6;
    color: #444;
}

.images-section {
    margin-top: 40px;
    background-color: #e8f5e9;
    /* 浅浅绿色背景 */
    padding: 20px;
    /* 内边距 */
    border-radius: 10px;
    /* 圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 阴影 */
}

.images-section h3 {
    font-size: 24px;
    color: #2e7d32;
    /* 深绿色标题 */
    margin-bottom: 20px;
}

.images-row {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.images-row img {
    width: 300px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.review-section {
    margin-top: 40px;
    background-color: #e8f5e9;
    /* 浅浅绿色背景 */
    padding: 20px;
    /* 内边距 */
    border-radius: 10px;
    /* 圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 阴影 */
}

.review-section h3 {
    font-size: 24px;
    color: #2e7d32;
    /* 深绿色标题 */
    margin-bottom: 20px;
}

.review-input {
    margin-bottom: 20px;
}

.submit-button {
    width: 100%;
    background-color: #4caf50;
    /* 绿色按钮 */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    /* 添加过渡效果 */
}

.submit-button:hover {
    background-color: #66bb6a;
    /* 鼠标悬停时改变颜色 */
}
</style>