<template>
    <div>
        <!-- 第一层服务类型选择 -->
        <strong>服务种类：</strong>
        <el-checkbox-group v-model="selectedFirstLevelIds" @change="onFirstLevelChange">
            <el-checkbox v-for="item in typeList" :label="item.id" :key="item.id">
                {{ item.name }}
            </el-checkbox>
        </el-checkbox-group>

        <el-divider v-if="typeList.length"></el-divider>

        <!-- 第二层服务类型选择 -->
        <div v-if="selectedFirstLevelIds.length !== 0" class="second-level">
            <strong>服务品种：</strong>
            <div v-for="firstLevel in typeList" :key="firstLevel.id">
                <el-checkbox-group v-if="selectedFirstLevelIds.includes(firstLevel.id)"
                    v-model="selectedSecondLevelIds[firstLevel.id]" @change="onSecondLevelChange(firstLevel)">
                    <el-checkbox v-for="secondLevel in firstLevel.children" :label="secondLevel.id" :key="secondLevel.id">
                        {{ secondLevel.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </div>

        <el-divider v-if="selectedFirstLevelIds.length !== 0"></el-divider>

        <!-- 第三层服务类型选择 -->
        <div v-for="(secondLevelList, firstId) in selectedSecondLevelIds" :key="firstId">
            <div class="third-level" v-for="secondId in secondLevelList" :key="secondId">
                <strong>{{ getSecondLevelName(firstId, secondId) }}:</strong>
                <el-checkbox-group v-model="selectedThirdLevelIds[secondId]" @change="onThirdLevelChange">
                    <el-checkbox v-for="thirdLevel in getThirdLevelItems(firstId, secondId)" :label="thirdLevel.id"
                        :key="thirdLevel.id">
                        {{ thirdLevel.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { listType } from '@/api/system/type'
const { proxy } = getCurrentInstance();

// 组件的props和emits
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

// 状态变量
const typeList = ref([]);
const selectedFirstLevelIds = ref([]);
const selectedSecondLevelIds = ref({});
const selectedThirdLevelIds = ref({});

// 模拟 API 请求获取数据
function getList() {
    listType({
        name: null,
        icon: null,
        pid: null,
        sorting: null,
        description: null,
        isActive: null,
        typePath: null
    },
    ).then(response => {
        typeList.value = proxy.handleTree(response.data, "id", "pid");
        props.modelValue && restoreSelection(props.modelValue);

    });
}
getList();

// 计算属性，用于生成选中的路径
const selectedPaths = computed(() => {
    let paths = [];
    for (let firstId in selectedSecondLevelIds.value) {
        selectedSecondLevelIds.value[firstId].forEach((secondId) => {
            if (selectedThirdLevelIds.value[secondId]) {
                selectedThirdLevelIds.value[secondId].forEach((thirdId) => {
                    paths.push(`${firstId},${secondId},${thirdId}`);
                });
            } else {
                paths.push(`${firstId},${secondId}`);
            }
        });
    }
    return paths;
});

// 处理第一层选择变化
const onFirstLevelChange = () => {
    for (let id in selectedSecondLevelIds.value) {
        if (!selectedFirstLevelIds.value.includes(parseInt(id))) {
            delete selectedSecondLevelIds.value[id];
        }
    }

};

// 处理第二层选择变化
const onSecondLevelChange = (firstLevel) => {
    firstLevel.children.forEach((secondLevel) => {
        if (
            selectedSecondLevelIds.value[firstLevel.id] &&
            !selectedSecondLevelIds.value[firstLevel.id].includes(secondLevel.id)
        ) {
            delete selectedThirdLevelIds.value[secondLevel.id];
        }
    });

};

// 处理第三层选择变化
const onThirdLevelChange = () => {
    emit('update:modelValue', selectedPaths.value.join(':'));
};

// 获取第二层名称
const getSecondLevelName = (firstId, secondId) => {
    const firstLevel = typeList.value.find((item) => item.id === parseInt(firstId));
    const secondLevel = firstLevel.children.find((item) => item.id === secondId);
    return secondLevel.name;
};

// 获取第三层项
const getThirdLevelItems = (firstId, secondId) => {
    const firstLevel = typeList.value.find((item) => item.id === parseInt(firstId));
    const secondLevel = firstLevel.children.find((item) => item.id === secondId);
    return secondLevel.children || [];
};

// 还原选择
const restoreSelection = (paths) => {
    paths.split(':').forEach((path) => {
        const ids = path.split(',').map((id) => parseInt(id));

        // 第一层
        const firstLevelId = ids[0];
        if (!selectedFirstLevelIds.value.includes(firstLevelId)) {
            selectedFirstLevelIds.value.push(firstLevelId);
        }

        // 第二层
        const secondLevelId = ids[1];
        if (!selectedSecondLevelIds.value[firstLevelId]) {
            selectedSecondLevelIds.value[firstLevelId] = [];
        }
        if (!selectedSecondLevelIds.value[firstLevelId].includes(secondLevelId)) {
            selectedSecondLevelIds.value[firstLevelId].push(secondLevelId);
        }

        // 第三层
        if (ids[2]) {
            const thirdLevelId = ids[2];
            if (!selectedThirdLevelIds.value[secondLevelId]) {
                selectedThirdLevelIds.value[secondLevelId] = [];
            }
            if (!selectedThirdLevelIds.value[secondLevelId].includes(thirdLevelId)) {
                selectedThirdLevelIds.value[secondLevelId].push(thirdLevelId);
            }
        }
    });
};

</script>
  
<style scoped>
.second-level {
    margin-top: 20px;
}

.third-level {
    margin-top: 10px;
}

.el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
}

.el-checkbox-group .el-checkbox {
    margin-right: 20px;
}
</style>