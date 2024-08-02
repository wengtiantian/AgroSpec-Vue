<template>
    <el-watermark v-if="status === 0" content="未准入" :font="{ fontSize: 24 }">
        <div class="centered-content">
            <p>您还没有申请准入，点击下方开始按钮进行准入申请</p>
            <el-button type="primary" @click="startApplication">开始</el-button>
        </div>
    </el-watermark>
    <el-watermark v-else-if="status === 2" content="待审核" :font="{ fontSize: 24 }">
        <div class="pending-content">

            <h2>申报信息</h2>
            <el-descriptions border :column="2">
                <!-- Basic Information -->
                <el-descriptions-item label="主体名称">{{ basicInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="组织类型"> <dict-tag :options="es_org_type" :value="basicInfo.typeId" />
                </el-descriptions-item>
                <el-descriptions-item label="联系人电话">{{ basicInfo.accountPhone }}</el-descriptions-item>
                <el-descriptions-item label="法人代表">{{ basicInfo.corporate }}</el-descriptions-item>
                <el-descriptions-item label="经营状态"> <dict-tag :options="es_manage_status" :value="basicInfo.manageForm" />
                </el-descriptions-item>
                <el-descriptions-item label="详细地址">{{ basicInfo.regionXx }}</el-descriptions-item>
                <el-descriptions-item label="服务区域ID">{{ basicInfo.regionId }}</el-descriptions-item>

                <!-- Service Situation -->
                <el-descriptions-item label="从业人数">{{ basicInfo.population }}</el-descriptions-item>
                <el-descriptions-item label="年服务营业收入">{{ basicInfo.income }}</el-descriptions-item>
                <el-descriptions-item label="服务对象数">{{ basicInfo.serveNum }}</el-descriptions-item>
                <el-descriptions-item label="服务小农户数">{{ basicInfo.farmersNum }}</el-descriptions-item>
                <el-descriptions-item label="年服务面积">{{ basicInfo.serveArea }}</el-descriptions-item>
                <el-descriptions-item label="年畜牧服务量">{{ basicInfo.raiseNum }}</el-descriptions-item>
                <el-descriptions-item label="年水产服务量">{{ basicInfo.waterNum }}</el-descriptions-item>
                <el-descriptions-item label="其他行业服务总量">{{ basicInfo.otherNum }}</el-descriptions-item>
                <el-descriptions-item label="服务粮食作物面积">{{ basicInfo.cropArea }}</el-descriptions-item>

                <!-- Subject Situation -->
                <el-descriptions-item label="主体介绍">{{ basicInfo.introduce }}</el-descriptions-item>
                <el-descriptions-item label="主体Logo"> <image-preview :src="basicInfo.logo" :width="50" :height="50" />
                </el-descriptions-item>
                <el-descriptions-item label="主体视频"> <video :src="baseUrl + basicInfo.video" controls width="500"
                        height="200"></video>
                </el-descriptions-item>
                <el-descriptions-item label="营业执照">
                    <image-preview :src="basicInfo.manageCert" :width="100" :height="100" /></el-descriptions-item>
                <el-descriptions-item label="主体图片"><image-preview :src="basicInfo.pictureUrls" :width="100"
                        :height="100" /></el-descriptions-item>


            </el-descriptions>
            <!-- Agricultural Machinery Information -->


            <div v-for="(machine, index) in machineInfoList" :key="index">
                <el-descriptions border :column="2">
                    <el-descriptions-item label="农机名称">{{ machine.machineName }}</el-descriptions-item>
                    <el-descriptions-item label="农机型号">{{ machine.machineModel }}</el-descriptions-item>
                    <el-descriptions-item label="终端编号">{{ machine.terminalNumber }}</el-descriptions-item>
                    <el-descriptions-item label="生产厂家">{{ machine.manufacturer }}</el-descriptions-item>
                    <el-descriptions-item label="农机图片URL"><image-preview :src="machine.machineImageUrl" :width="50"
                            :height="50" /></el-descriptions-item>
                </el-descriptions>

            </div>
            <div class="cxsq">
                <el-button type="danger" @click="cancelApplication">撤销申请</el-button>

            </div>
        </div>
    </el-watermark>



    <!-- Approved Section -->
    <div v-else-if="status === 1" class="approved-content">
        <div class="certificate">
            <h3>证书编号：CERT-2024-001234</h3>
            <h3>区块哈希：0x9a8b7c6d5e4f3a2b1c0987d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6</h3>
            <h2>准入证书</h2>
            <el-descriptions border :column="2">
                <!-- Basic Information -->
                <el-descriptions-item label="主体名称">{{ basicInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="组织类型"> <dict-tag :options="es_org_type" :value="basicInfo.typeId" />
                </el-descriptions-item>
                <el-descriptions-item label="联系人电话">{{ basicInfo.accountPhone }}</el-descriptions-item>
                <el-descriptions-item label="法人代表">{{ basicInfo.corporate }}</el-descriptions-item>
                <el-descriptions-item label="经营状态">
                    <dict-tag :options="es_manage_status" :value="basicInfo.manageForm" />
                </el-descriptions-item>
                <el-descriptions-item label="详细地址">{{ basicInfo.regionXx }}</el-descriptions-item>
                <el-descriptions-item label="服务区域ID">{{ basicInfo.regionId }}</el-descriptions-item>

                <!-- Service Situation -->
                <el-descriptions-item label="从业人数">{{ basicInfo.population }}</el-descriptions-item>
                <el-descriptions-item label="年服务营业收入">{{ basicInfo.income }}</el-descriptions-item>
                <el-descriptions-item label="服务对象数">{{ basicInfo.serveNum }}</el-descriptions-item>
                <el-descriptions-item label="服务小农户数">{{ basicInfo.farmersNum }}</el-descriptions-item>
                <el-descriptions-item label="年服务面积">{{ basicInfo.serveArea }}</el-descriptions-item>
                <el-descriptions-item label="年畜牧服务量">{{ basicInfo.raiseNum }}</el-descriptions-item>
                <el-descriptions-item label="年水产服务量">{{ basicInfo.waterNum }}</el-descriptions-item>
                <el-descriptions-item label="其他行业服务总量">{{ basicInfo.otherNum }}</el-descriptions-item>
                <el-descriptions-item label="服务粮食作物面积">{{ basicInfo.cropArea }}</el-descriptions-item>

                <!-- Subject Situation -->
                <el-descriptions-item label="主体介绍">{{ basicInfo.introduce }}</el-descriptions-item>
                <el-descriptions-item label="主体Logo"> <image-preview :src="basicInfo.logo" :width="50" :height="50" />
                </el-descriptions-item>
                <el-descriptions-item label="主体视频"> <video :src="baseUrl + basicInfo.video" controls width="500"
                        height="200"></video>
                </el-descriptions-item>
                <el-descriptions-item label="营业执照">
                    <image-preview :src="basicInfo.manageCert" :width="100" :height="100" /></el-descriptions-item>
                <el-descriptions-item label="主体图片"><image-preview :src="basicInfo.pictureUrls" :width="100"
                        :height="100" /></el-descriptions-item>

            </el-descriptions>
            <div v-for="(machine, index) in machineInfoList" :key="index">
                <el-descriptions border :column="2">
                    <el-descriptions-item label="农机名称">{{ machine.machineName }}</el-descriptions-item>
                    <el-descriptions-item label="农机型号">{{ machine.machineModel }}</el-descriptions-item>
                    <el-descriptions-item label="终端编号">{{ machine.terminalNumber }}</el-descriptions-item>
                    <el-descriptions-item label="生产厂家">{{ machine.manufacturer }}</el-descriptions-item>
                    <el-descriptions-item label="农机图片URL"><image-preview :src="machine.machineImageUrl" :width="50"
                            :height="50" /></el-descriptions-item>
                </el-descriptions>

            </div>
            <p class="approval-mark">已准入</p>
        </div>
    </div>

    <el-dialog :close-on-click-modal="false" v-if="showSteps" title="申请准入" v-model="showSteps" width="50%">
        <el-steps :active="activeStep" finish-status="success" align-center style="margin-bottom: 20px;">
            <el-step title="基本信息"></el-step>
            <el-step title="服务情况"></el-step>
            <el-step title="主体情况"></el-step>
            <el-step title="添加农机信息"></el-step>
        </el-steps>

        <!-- Step 1: Basic Information -->
        <div v-if="activeStep === 0">
            <el-form :model="basicInfo">
                <el-form-item label="主体名称">
                    <el-input v-model="basicInfo.name" />
                </el-form-item>
                <el-form-item label="组织类型">
                    <el-select v-model="basicInfo.typeId" placeholder="请选择组织类型">
                        <el-option v-for="dict in es_org_type" :key="dict.value" :label="dict.label"
                            :value="parseInt(dict.value)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人电话">
                    <el-input v-model="basicInfo.accountPhone" />
                </el-form-item>
                <el-form-item label="法人代表">
                    <el-input v-model="basicInfo.corporate" />
                </el-form-item>
                <el-form-item label="经营状态">


                    <el-select v-model="basicInfo.manageForm" placeholder="请选择经营状态">
                        <el-option v-for="dict in es_manage_status" :key="dict.value" :label="dict.label"
                            :value="parseInt(dict.value)"></el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="basicInfo.regionId" />
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="basicInfo.regionXx" />
                </el-form-item>

            </el-form>
        </div>

        <!-- Step 2: Service Situation -->
        <div v-if="activeStep === 1">
            <el-form :model="basicInfo">
                <el-form-item label="从业人数">
                    <el-input v-model="basicInfo.population" />
                </el-form-item>
                <el-form-item label="年服务营业收入">
                    <el-input v-model="basicInfo.income" />
                </el-form-item>
                <el-form-item label="服务对象数">
                    <el-input v-model="basicInfo.serveNum" />
                </el-form-item>
                <el-form-item label="服务小农户数">
                    <el-input v-model="basicInfo.farmersNum" />
                </el-form-item>
                <el-form-item label="年服务面积">
                    <el-input v-model="basicInfo.serveArea" />
                </el-form-item>
                <el-form-item label="年畜牧服务量">
                    <el-input v-model="basicInfo.raiseNum" />
                </el-form-item>
                <el-form-item label="年水产服务量">
                    <el-input v-model="basicInfo.waterNum" />
                </el-form-item>
                <el-form-item label="其他行业服务总量">
                    <el-input v-model="basicInfo.otherNum" />
                </el-form-item>
                <el-form-item label="服务粮食作物面积">
                    <el-input v-model="basicInfo.cropArea" />
                </el-form-item>
            </el-form>
        </div>

        <!-- Step 3: Subject Situation -->
        <div v-if="activeStep === 2">
            <el-form :model="basicInfo">
                <div>
                    <!-- 一级分类多选框 -->
                    <el-checkbox-group v-model="selectedIds">
                        <el-checkbox v-for="item in rootOptions" :label="item.id" :key="item.id"
                            @change="handleRootChange(item)">
                            {{ item.name }}
                        </el-checkbox>
                    </el-checkbox-group>

                    <!-- 服务品种多选框 -->
                    <div v-for="(children, parentId) in selectedChildren" :key="parentId" class="child-options">
                        <el-checkbox-group v-model="selectedIds">
                            <el-checkbox v-for="child in children" :label="child.id" :key="child.id"
                                @change="handleChildChange(child)">
                                {{ child.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <!-- 输出选中项的ID路径 -->
                    <div>
                        <p>选中的服务类型ID路径:</p>
                        <p>{{ idPaths.join('：') }}</p>
                    </div>
                </div>
                <el-form-item label="主体介绍">
                    <el-input type="textarea" v-model="basicInfo.introduce" />
                </el-form-item>
                <el-form-item label="主体Logo">
                    <el-input v-model="basicInfo.logo" />
                </el-form-item>
                <el-form-item label="主体视频">
                    <el-input v-model="basicInfo.video" />
                </el-form-item>
                <el-form-item label="营业执照">
                    <el-input v-model="basicInfo.manageCert" />
                </el-form-item>
                <el-form-item label="主体图片URL">
                    <el-input type="textarea" v-model="basicInfo.pictureUrls" />
                </el-form-item>
            </el-form>
        </div>

        <!-- Step 4: Add Agricultural Machinery Information -->
        <div v-if="activeStep === 3">
            <div v-for="(machine, index) in machineInfoList" :key="index" class="machine-form">
                <el-form :model="machine">
                    <el-form-item label="农机名称">
                        <el-input v-model="machine.machineName" />
                    </el-form-item>
                    <el-form-item label="农机型号">
                        <el-input v-model="machine.machineModel" />
                    </el-form-item>
                    <el-form-item label="终端编号">
                        <el-input v-model="machine.terminalNumber" />
                    </el-form-item>
                    <el-form-item label="生产厂家">
                        <el-input v-model="machine.manufacturer" />
                    </el-form-item>
                    <el-form-item label="农机图片URL">
                        <el-input v-model="machine.machineImageUrl" />
                    </el-form-item>
                </el-form>
                <div class="delete">
                    <el-button type="danger" @click="removeMachineInfo(index)">删除</el-button>
                </div>
                <el-divider></el-divider>
            </div>

            <el-button type="primary" @click="addMachineInfo">添加农机信息</el-button>
        </div>

        <div class="dialog-footer">
            <el-button @click="previousStep" v-if="activeStep > 0">上一步</el-button>
            <el-button type="primary" @click="nextStep">{{ activeStep === 3 ? '提交审核' : '下一步' }}</el-button>
        </div>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import { getServicerByUserId } from '@/api/system/servicer'

const status = ref(0); // Could be 'notApplied', 'pending', or 'approved'
const showSteps = ref(false);
const activeStep = ref(0);
const { proxy } = getCurrentInstance();
const { es_is_auth, es_org_type, es_manage_status } = proxy.useDict('es_is_auth', 'es_org_type', 'es_manage_status');
const baseUrl = import.meta.env.VITE_APP_BASE_API;

const data = reactive({
    basicInfo: {
        name: '某某主体名称',
        typeId: 1,
        accountPhone: '13800138000',
        corporate: '张三',
        manageForm: 1,
        regionXx: '北京市海淀区XX街道',
        regionId: 101,
        population: 50,
        income: 200000.00,
        serveNum: 100,
        farmersNum: 20,
        serveArea: 500.50,
        raiseNum: 1500,
        waterNum: 200,
        otherNum: 300,
        cropArea: 800.75,
        introduce: '这是主体的介绍信息。',
        logo: '/path/to/logo.png',
        video: '/path/to/video.mp4',
        manageCert: '/path/to/manage_cert.png',
        pictureUrls: '/path/to/picture1.png,/path/to/picture2.png',

    },
    queryParams: {
        name: null,
        icon: null,
        pid: null,
        sorting: null,
        description: null,
        isActive: null,
        typePath: null
    },

    machineInfoList: [{
        machineName: '拖拉机',
        machineModel: 'X123',
        terminalNumber: 'A001',
        manufacturer: '农机厂',
        machineImageUrl: '/path/to/machine1.png'
    },
    {
        machineName: '播种机',
        machineModel: 'Y456',
        terminalNumber: 'A002',
        manufacturer: '农机厂',
        machineImageUrl: '/path/to/machine2.png'
    }]


});

const { basicInfo, machineInfoList, queryParams } = toRefs(data)


function fetchServicerByUserId() {
    getServicerByUserId().then(response => {
        basicInfo.value = response.data
        status.value = response.data.isAuth
    })
}
fetchServicerByUserId();




const addMachineInfo = () => {
    machineInfoList.value.push({
        machineName: '',
        machineModel: '',
        terminalNumber: '',
        manufacturer: '',
        machineImageUrl: '',
    });
};
const removeMachineInfo = (index) => {
    machineInfoList.value.splice(index, 1);
};


const startApplication = () => {
    showSteps.value = true;
};

const nextStep = () => {
    if (activeStep.value < 3) {
        activeStep.value++;
    } else {
        submitApplication();
    }
};

const previousStep = () => {
    if (activeStep.value > 0) {
        activeStep.value--;
    }
};

const submitApplication = () => {
    console.log("Basic Info:", basicInfo.value);

    // Logic to submit the application
    status.value = 2;
    showSteps.value = false;
};

const cancelApplication = () => {
    // Logic to cancel the application
    status.value = 1;
};
import { listType } from "@/api/system/type";
const typeList = ref([]);
const selectedIds = ref([]);  // 选中的ID列表
const selectedChildren = ref({});  // 动态显示的孩子节点
const rootOptions = ref([])
function getList() {
    listType(queryParams.value).then(response => {
        typeList.value = proxy.handleTree(response.data, "id", "pid");
        rootOptions.value = typeList.value.filter(item => item.pid === 0);
    });
}
getList();




// 根节点选项

// 处理根节点选择变化
const handleRootChange = (item) => {
    if (selectedIds.value.includes(item.id)) {
        selectedChildren.value[item.id] = item.children || [];
    } else {
        delete selectedChildren.value[item.id];
    }
};

// 处理孩子节点选择变化
const handleChildChange = (child) => {
    if (selectedIds.value.includes(child.id) && child.children) {
        selectedChildren.value[child.id] = child.children;
    } else {
        delete selectedChildren.value[child.id];
    }
};

// 计算选中ID的路径
const idPaths = computed(() => {
    const paths = [];

    for (const rootId in selectedChildren.value) {
        const childNodes = selectedChildren.value[rootId];
        childNodes.forEach(child => {
            if (selectedIds.value.includes(child.id)) {
                const grandChildNodes = selectedChildren.value[child.id] || [];
                grandChildNodes.forEach(grandChild => {
                    if (selectedIds.value.includes(grandChild.id)) {
                        paths.push(`${rootId},${child.id},${grandChild.id}`);
                    }
                });

                if (!grandChildNodes.length) {
                    paths.push(`${rootId},${child.id}`);
                }
            }
        });

        if (!childNodes.length) {
            paths.push(rootId);
        }
    }

    return paths;
});
</script>
<style scoped>
h2 {
    text-align: center;
}


.child-options {
    margin-top: 20px;
    padding-left: 20px;
}

.grandchild-options {
    margin-top: 10px;
    padding-left: 20px;
}


.centered-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

.pending-content {
    padding: 20px;
}

.approved-content {

    padding: 20px;
}

.certificate {
    position: relative;
    padding: 20px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.approval-mark {
    position: absolute;
    top: 20px;
    right: 100px;
    padding: 10px 20px;
    font-size: 80px;
    color: #28a745;
    border: 2px solid #28a745;
    border-radius: 10px;
    transform: rotate(-10deg);
    font-weight: bold;
    letter-spacing: 2px;
    background-color: rgba(40, 167, 69, 0.1);
    /* light green background */
    text-align: center;
}

.dialog-footer {
    text-align: right;
    margin-top: 20px;
}

.delete {
    width: 100%;
    text-align: right;
}

.cxsq {
    width: 100%;
    margin-top: 15px;
    text-align: center;
}
</style>
  