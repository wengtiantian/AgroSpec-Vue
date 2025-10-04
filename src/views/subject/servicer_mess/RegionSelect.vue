<template>
    <el-cascader ref="content" :style="{ width: width }" v-model="props.modelValue" :size="size" :options="options"
        :props="cascaderProps" @change="handleChange" clearable />
</template>
  
<script setup>

import { listRegion } from '@/api/base/region.js'; // 替换为你的API调用
import { nextTick, toRefs, watch } from 'vue';

// 接收 v-model 的绑定属性
const props = defineProps({
    modelValue: {
        type: Array,
        default: null,
    },
    width: {
        type: String,
        default: '',
    },
    text: {
        type: String,
        default: '',
    }
});

const emits = defineEmits(['update:modelValue', 'update:text']);
const content = ref(null)
// 本地维护的选中路径

const text = ref("");

// 级联选择器的选项数据
const options = ref([]);

// 级联选择器的属性
const cascaderProps = reactive({
    value: 'id',
    label: 'localName',
    children: 'children',
    level: 'regionGrade',
    lazy: true,
    lazyLoad: loadData,
});

// 懒加载函数，根据 parentId 获取下一级的数据
function loadData(node, resolve) {
    const queryParams = {
        parentId: node && node.value ? node.value : 0,
    };
    listRegion(queryParams).then((response) => {
        const data = response.data;
        resolve(data);
    });
}

// 处理选择变化
function handleChange(value) {
    const node = content.value.getCheckedNodes();
    console.log(node)
    emits('update:text', node[0].text.split("/").join('').replace(/\s+/g, ''));
    emits('update:modelValue', node[0].pathValues);
}




// Watch for changes in modelValue
watch(() => props.modelValue, (newValue) => {

    nextTick(() => {
        const panel = content.value.cascaderPanelRef;
        const intervalId = setInterval(() => {
            const checkedNodes = panel.getCheckedNodes();
            if (checkedNodes.length > 0) {
                emits('update:text', checkedNodes[0].text.split("/").join('').replace(/\s+/g, ''));
                clearInterval(intervalId);
            }
        }, 100);  // 每100ms检查一次
    })
}, { immediate: true }); // immediate ensures the watch is triggered initially



// watch(localSelectedPath, (newPath) => {
//     console.log(localSelectedPath)
//     if (newPath !== props.modelValue) {
//         emits('update:modelValue', JSON.stringify(newPath));

//     }
// });


</script>
  