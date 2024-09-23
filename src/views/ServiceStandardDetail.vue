<template>
    <div class="standard-details">


        <div class="title-section">
            <h1>{{ standardName }}</h1>
        </div>

        <div class="authors">
            <span v-for="(author, index) in authors" :key="index">
                <a href="#">{{ author.name }}</a><sup>{{ author.affiliationIndex }}</sup>
                <i v-if="author.hasEmail" class="icon-email"></i>
            </span>
        </div>

        <div class="affiliations">
            <span v-for="(affiliation, index) in affiliations" :key="index">
                <a href="#">{{ index + 1 }}. {{ affiliation }}</a>
            </span>
        </div>

        <div class="abstract-section">
            <h3>摘要：</h3>
            <p id="abstract-text">
                {{ abstractText }}
            </p>
        </div>

        <div class="keywords-section">
            <h3>范围：</h3>

            <p v-for="(keyword, index) in keywords" :key="index" href="#">
                {{ keyword }}
            </p>

        </div>



        <div class="buttons-section">
            <button @click="GoRead" class="btn btn-read">在线阅读</button>
            <button class="btn btn-read">PDF下载</button>

        </div>
    </div>
</template>
  
<script setup>
import router from '@/router';
import { ref } from 'vue';

// 数据
const standardName = '农业社会化服务组织服务质量评价标准';
const hasVideo = true;
const authors = [
    { name: '陈悦均', affiliationIndex: 1, hasEmail: false },
    { name: '缪俊炜', affiliationIndex: 1, hasEmail: true },
];
const affiliations = ['江西省生子岩种养殖农民专业合作社'];
const abstractText = `农业社会化服务组织应提供以下服务内容：

农机作业服务：包括播种、施肥、植保、收获等机械化作业服务。
农资供应服务：包括种子、化肥、农药等农业生产资料的采购与配送。
技术指导服务：包括农作物种植、病虫害防治、土壤改良等方面的技术支持与培训。
农产品加工与销售服务：包括农产品的初加工、包装、贮藏和市场销售服务。`;
const keywords = ['本标准规定了农业社会化服务组织的服务内容、服务流程、服务评价指标、评价方法和监督管理要求。本标准适用于从事农业社会化服务的各类组织，包括农机合作社、农业生产托管服务公司、农产品加工配送企业等'];


// 抽象控制
const showFullAbstract = ref(false);

const expandAbstract = () => {
    showFullAbstract.value = true;
};

const collapseAbstract = () => {
    showFullAbstract.value = false;
};

// 摘要的截断处理
const truncatedAbstract = ref('');
if (abstractText.length > 100) {
    truncatedAbstract.value = abstractText.slice(0, 100) + '...';
} else {
    truncatedAbstract.value = abstractText;
}

const GoRead = () => {
    router.push({ name: 'OnlineReading' });
}
</script>
  
<style scoped>
.standard-details {
    font-family: Arial, sans-serif;
    color: #333;
    max-width: 1000px;
    margin: 0 auto;
    padding: 200px;
    background-color: #f9f9f9;
    height: 96vh;
}

.price-and-time {
    text-align: left;
    font-size: 14px;
    color: #ff5b5b;
}

.submission-time {
    margin-left: 20px;
    font-size: 12px;
    color: #555;
}

.title-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.title-section h1 {
    font-size: 24px;
    margin: 0;
}

.icons i {
    margin-left: 8px;
}

.authors span,
.affiliations span {
    margin-right: 15px;
}

.abstract-section {
    margin-top: 20px;
}

.abstract-section h3,
.keywords-section h3,
.funding-section h3,
.doi-section h3,
.specialty-section h3,
.classification-section h3,
.attachments-section h3 {
    font-size: 18px;
    margin-bottom: 10px;
    display: inline-block;
}

p {
    display: inline-block;
}

.keywords a {
    margin-right: 10px;
    color: #337ab7;
    text-decoration: none;
}

.keywords a:hover {
    text-decoration: underline;
}

.buttons-section {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.btn {
    padding: 10px 20px;
    margin: 0 10px;
    background-color: #337ab7;
    color: white;
    border: none;
    cursor: pointer;
}

.btn:hover {
    background-color: #285e8e;
}

.btn-read {
    background-color: #5cb85c;
}

.btn-read:hover {
    background-color: #4cae4c;
}

.btn-download {
    background-color: #f0ad4e;
}

.btn-download:hover {
    background-color: #ec971f;
}
</style>
  