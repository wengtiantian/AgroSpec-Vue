<template>
    <el-cascader ref="content" :style="{ width: width }" v-model="localSelectedPath" :size="size" :options="options"
        :props="cascaderProps" @change="handleChange" :lazy="true" :lazy-load="loadData" clearable />
</template>
  
<script setup>

import { listRegion } from '@/api/system/region'; // 替换为你的API调用

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
const localSelectedPath = ref(props.modelValue);
const text = ref(props.text);

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

        // // 异步函数来判断是否有子节点
        // async function checkIfLeaf(item) {
        //     const childQueryParams = { parentId: item.id };
        //     const childResponse = await listRegion(childQueryParams);
        //     return childResponse.data.length === 0; // 没有子节点，则是叶子节点
        // }
        // // 映射数据，并设置 leaf 属性
        // const result = await Promise.all(
        //     data.map(async (item) => ({
        //         ...item,
        //         leaf: item.regionGrade > 2 ? await checkIfLeaf(item) : false,
        //     }))
        // );

        resolve(data);
    });
}

// 处理选择变化
function handleChange(value) {
    console.log(options)
    const node = content.value.getCheckedNodes();
    text.value = node[0].text;
}

// 通过路径恢复省市区镇信息
onMounted(() => {
    // restoreSelection(props.modelValue);
    // console.log(content)
    // nextTick(() => {
    //     const selectedNodes = content.value.getCheckedNodes();
    //     console.log(selectedNodes); // 检查是否正确选中
    // });
    const selectedNodes = content.value.getCheckedNodes();
    console.log(content.value); // 检查是否正确选中

});

// 恢复选择的路径
function restoreSelection(ids) {
    let currentNode = null;

    ids.forEach((id, index) => {
        loadData(currentNode, (data) => {
            const selectedNode = data.find((item) => item.id === parseInt(id));
            if (selectedNode) {
                if (index === 0) {
                    options.value = data;
                } else if (currentNode) {
                    currentNode.children = data;
                }
                currentNode = selectedNode;


            }
        });
    });

}

// 监听 localSelectedPath 的变化来更新 modelValue
watch(localSelectedPath, (newPath) => {
    if (newPath !== props.modelValue) {
        emits('update:modelValue', newPath);

    }
});

watch(text, (newText) => {
    if (newText !== props.text) {

        emits('update:text', newText.split("/").join('').replace(/\s+/g, ''));

    }
});
</script>
  