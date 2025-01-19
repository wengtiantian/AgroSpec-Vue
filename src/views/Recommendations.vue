<template>
    <div class="recommendations">
        <h2>服务主体推荐</h2>
        <div class="card-row">
            <div class="card" v-for="(subject, index) in serviceSubjects" :key="index"
                @click="goToSubjectDetail(subject.id)">
                <img :src="baseUrl + subject.logo" width="500" height="300" alt="服务主体图片">
                <p>{{ subject.name }}</p>
                <dict-tag :options="es_org_type" :value="subject.typeId" />
                <el-rate v-model="subject.quality" disabled></el-rate>
            </div>
        </div>
        <h2>服务标准推荐</h2>
        <div class="card-row">
            <div class="card" v-for="(standard, index) in serviceStandards" :key="index"
                @click="goToStandardDetail(standard.id)">
                <img :src="baseUrl + standard.attachments" width="500" height="300" alt="服务标准图片">
                <p>{{ standard.fileName }}</p>
                <p>{{ standard.issuingAgency }}</p>
                <p>{{ standard.issueDate }}</p>
            </div>
        </div>
    </div>
</template>


<script setup>
import { listServicer, listStandards } from "@/api/public";
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const { proxy } = getCurrentInstance();
const { es_is_auth, es_org_type, es_manage_status } = proxy.useDict('es_is_auth', 'es_org_type', 'es_manage_status');
const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 3,
    },
    rules: {
    }
});

const { queryParams, form, rules } = toRefs(data);
const serviceSubjects = ref([]);
const serviceStandards = ref([]);
/** 查询列表 */
function getList() {
    listServicer(queryParams.value).then(response => {
        serviceSubjects.value = response.rows;
        serviceSubjects.value.map(v => {
            v.quality = Math.random() * 3 + 2
            return v
        })
    });
    listStandards(queryParams.value).then(response => {
        serviceStandards.value = response.rows;
    })
}





const router = useRouter();

const goToSubjectDetail = (id) => {
    router.push({ name: 'ServiceSubjectDetail', query: { id } });
};

const goToStandardDetail = (id) => {
    router.push({ name: 'ServiceStandardDetail', query: { id } });
};

getList()
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