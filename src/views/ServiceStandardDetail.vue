<template>
    <div class="standard-details">


        <div class="title-section">
            <h1>{{ StandarfDetail.fileName }}</h1>
        </div>

        <!-- <div class="authors">
            <span v-for="(author, index) in authors" :key="index">
                <a href="#">{{ author.name }}</a><sup>{{ author.affiliationIndex }}</sup>
                <i v-if="author.hasEmail" class="icon-email"></i>
            </span>
        </div> -->

        <div class="affiliations">
            <a href="#">{{ 1 }}. {{ StandarfDetail.issuingAgency }}</a>
        </div>

        <div class="abstract-section">
            <h3>范围：</h3>
            <p id="abstract-text">
                {{ StandarfDetail.serviceItems }}
            </p>
        </div>

        <!-- <div class="keywords-section">
            <h3>范围：</h3>

            <p v-for="(keyword, index) in keywords" :key="index" href="#">
                {{ keyword }}
            </p>

        </div> -->



        <div class="buttons-section">
            <button @click="GoRead" class="btn btn-read">在线阅读</button>
            <button class="btn btn-read">PDF下载</button>

        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { getStandards } from '@/api/public'
const router = useRouter();
const route = useRoute();

const StandarfDetail = ref({});

const baseUrl = import.meta.env.VITE_APP_BASE_API;
getStandards(route.query.id).then((res) => {
    StandarfDetail.value = res.data;

})

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
    console.log(StandarfDetail)
    openNewWindow('/online-reading?src=' + baseUrl + StandarfDetail.value.fileNumber)

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
  