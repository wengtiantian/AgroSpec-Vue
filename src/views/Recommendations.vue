<template>
    <div class="recommendations">
        <h2>服务主体推荐</h2>
        <div class="card-row">
            <div class="card" v-for="(subject, index) in serviceSubjects" :key="index"
                @click="goToSubjectDetail(subject.id)">
                <img :src="subject.image" alt="服务主体图片">
                <p>{{ subject.name }}</p>
                <p>{{ subject.type }}</p>
                <el-rate v-model="subject.quality" disabled></el-rate>
            </div>
        </div>
        <h2>服务标准推荐</h2>
        <div class="card-row">
            <div class="card" v-for="(standard, index) in serviceStandards" :key="index"
                @click="goToStandardDetail(standard.id)">
                <img :src="standard.image" alt="服务标准图片">
                <p>{{ standard.name }}</p>
                <p>{{ standard.publisher }}</p>
                <p>{{ standard.time }}</p>
            </div>
        </div>
    </div>
</template>


<script setup>

const serviceSubjects = ref([
    { id: 1, name: '主体1', image: 'src/assets/logo/logo.jpeg', type: '类型1', quality: 4 },
    { id: 2, name: '主体2', image: 'src/assets/logo/logo.jpeg', type: '类型2', quality: 3.5 },
    { id: 3, name: '主体3', image: 'src/assets/logo/logo.jpeg', type: '类型3', quality: 5 },
]);

const serviceStandards = ref([
    { id: 1, name: '标准1', image: 'src/assets/logo/logo.jpeg', publisher: '发布者1', time: '2023-01-01' },
    { id: 2, name: '标准2', image: 'src/assets/logo/logo.jpeg', publisher: '发布者2', time: '2023-02-01' },
    { id: 3, name: '标准3', image: 'src/assets/logo/logo.jpeg', publisher: '发布者3', time: '2023-03-01' },
]);


const router = useRouter();

const goToSubjectDetail = (id) => {
    router.push({ name: 'ServiceSubjectDetail', query: { id } });
};

const goToStandardDetail = (id) => {
    router.push({ name: 'ServiceStandardDetail', query: { id } });
};
</script>

<style scoped>
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