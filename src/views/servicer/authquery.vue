<template>
    <el-watermark v-if="status === 0" content="未准入" :font="{ fontSize: 24 }">
        <div class="centered-content">
            <p>您还没有申请准入，点击下方开始按钮进行准入申请</p>
            <el-button type="primary" @click="startApplication">开始</el-button>
        </div>
    </el-watermark>
    <el-watermark v-else-if="status === 2" :content="process.auditResult ? '审核不通过' : '待审核'" :font="{ fontSize: 24 }">
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
            <div v-if="process.auditResult && process.auditResult == 1" class="cxsq">
                <el-descriptions title="审核结果" border :column="2">
                    <el-descriptions-item label="评语">{{ process.comments }}
                    </el-descriptions-item>
                    <el-descriptions-item label="结果">
                        <dict-tag :options="sys_common_status" :value="process.auditResult" />

                    </el-descriptions-item>

                </el-descriptions>


                <el-button type="danger" style="margin-top:10px" @click="handleSubmit">重新填写</el-button>
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
                <el-descriptions-item label="主体Logo">
                    <image-preview :src="basicInfo.logo && basicInfo.logo" :width="50" :height="50" />
                </el-descriptions-item>
                <el-descriptions-item label="主体视频"> <video :src="basicInfo.video && (baseUrl + basicInfo.video)" controls
                        width="500" height="200"></video>
                </el-descriptions-item>


                <el-descriptions-item label="营业执照">
                    <image-preview :src="basicInfo.manageCert && basicInfo.manageCert" :width="100" :height="100" />
                </el-descriptions-item>


                <el-descriptions-item label="主体图片">
                    <image-preview :src="basicInfo.pictureUrls && basicInfo.pictureUrls" :width="100" :height="100" />
                </el-descriptions-item>


                <el-descriptions-item label="服务范围">
                    <ServiceTypeSelector :disabled="true" v-model="storedPaths" />
                </el-descriptions-item>

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
                    <RegionCascader :width="'100%'" v-model:text="basicInfo.regionXx" v-model="selectedRegionPath" />
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
                <ServiceTypeSelector v-model="storedPaths" />
                <el-divider></el-divider>

                <el-form-item label="主体介绍">
                    <editor v-model="basicInfo.introduce" :min-height="192" />

                </el-form-item>
                <el-form-item label="主体Logo">
                    <image-upload v-model="basicInfo.logo" />
                </el-form-item>
                <el-form-item label="主体视频">
                    <file-upload :limit="1" :fileSize="100" :fileType="['mp4']" v-model="basicInfo.video" />
                </el-form-item>
                <el-form-item label="营业执照">
                    <image-upload v-model="basicInfo.manageCert" />
                </el-form-item>
                <el-form-item label="主体图片URL">
                    <image-upload v-model="basicInfo.pictureUrls" />
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
                    <el-form-item label="农机图片">
                        <image-upload v-model="machine.machineImageUrl" />
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
import { ref, watch } from 'vue';
import { getServicerByUserId, editStatus } from '@/api/system/servicer'
import { submit, listAll } from '@/api/system/process'
import ServiceTypeSelector from './TypeSelect.vue';
import RegionCascader from './RegionSelect.vue';
const status = ref(null); // Could be 'notApplied', 'pending', or 'approved'
const showSteps = ref(false);
const activeStep = ref(0);
const selectedRegionPath = ref()
const { proxy } = getCurrentInstance();
const { es_is_auth, es_org_type, es_manage_status, sys_common_status } = proxy.useDict('es_is_auth', 'es_org_type', 'es_manage_status', 'sys_common_status');
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const storedPaths = ref('');
const text = ref('');

const data = reactive({
    basicInfo: {
        id: null,
        name: null,
        typeId: null,
        accountPhone: null,
        corporate: null,
        manageForm: null,
        regionXx: null,
        regionId: null,
        population: null,
        income: null,
        serveNum: null,
        farmersNum: null,
        serveArea: null,
        raiseNum: null,
        waterNum: null,
        otherNum: null,
        cropArea: null,
        introduce: null,
        logo: null,
        video: null,
        manageCert: null,
        pictureUrls: null,

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

    process: {
        id: null,
        servicerId: null,
        auditContent: null,
        auditResult: null,
        comments: null,
        auditorId: null,
        auditTime: null,
        createTime: null,
        updateTime: null,
        deletedAt: null
    },

    machineInfoList: []


});

const { basicInfo, machineInfoList, queryParams, process } = toRefs(data)


function fetchServicerByUserId() {
    getServicerByUserId().then(response => {
        status.value = response.data.isAuth
        if (status.value === 0) {
            //未申请
            basicInfo.value = response.data

        } else if (status.value === 1) {
            //已准入
            // basicInfo.value = response.data
            process.value.servicerId = response.data.id;
            //待审核
            listAll(process.value).then(res => {
                process.value = res.data[res.data.length - 1];
                const data = JSON.parse(res.data[res.data.length - 1].auditContent);
                basicInfo.value = data.basicInfo;
                machineInfoList.value = data.machineInfoList;
                storedPaths.value = data.type;

            })

        } else if (status.value === 2) {
            process.value.servicerId = response.data.id;
            //待审核
            listAll(process.value).then(res => {
                process.value = res.data[res.data.length - 1];
                const data = JSON.parse(res.data[res.data.length - 1].auditContent);
                basicInfo.value = data.basicInfo;
                machineInfoList.value = data.machineInfoList;
                storedPaths.value = data.type;

            })

        }

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
    console.log("process.value:", process.value);
    process.value = {
        id: null,
        servicerId: null,
        auditContent: null,
        auditResult: null,
        comments: null,
        auditorId: null,
        auditTime: null,
        createTime: null,
        updateTime: null,
        deletedAt: null
    }
    process.value.servicerId = basicInfo.value.id;
    process.value.auditContent = JSON.stringify({ basicInfo: basicInfo.value, machineInfoList: machineInfoList.value, type: storedPaths.value })
    console.log(process.value);
    submit(process.value).then(res => {
        editStatus({ id: process.value.servicerId, isAuth: 2 }).then(res2 => {
            fetchServicerByUserId();
            showSteps.value = false;
        })
    });
}

const cancelApplication = () => {
    // Logic to cancel the application
    status.value = 1;
};

const handleSubmit = () => {
    showSteps.value = true;


}
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
  