import { listRegion } from '@/api/system/region'; // 替换为你的API调用

// 根据路径 ids 获取地区文本
export async function getRegionTextByPath(ids) {
    let currentNode = null;
    let text = [];

    // 递归地获取每一级节点的文本
    for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        // 根据当前节点的父节点 id 获取子节点
        const data = await loadData(currentNode ? currentNode.id : 0);

        // 查找匹配的节点
        const selectedNode = data.find((item) => item.id === parseInt(id));

        if (selectedNode) {
            // 保存当前节点的名称
            text.push(selectedNode.localName);
            // 设置当前节点为下一个的父节点
            currentNode = selectedNode;
        } else {
            break; // 如果找不到匹配的节点，停止递归
        }
    }

    // 返回通过路径拼接的文本
    return text.join('/');
}

// 加载数据，模拟懒加载函数
function loadData(parentId) {
    const queryParams = {
        parentId: parentId || 0,
    };
    return listRegion(queryParams).then((response) => {
        return response.data;
    });
}
