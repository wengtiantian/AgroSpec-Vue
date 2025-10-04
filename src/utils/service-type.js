export function mergeFruitData(arr) {
    // 防御性检查：确保输入是数组
    if (!Array.isArray(arr)) {
        console.warn('mergeFruitData: 输入参数不是数组', arr);
        return [];
    }
    
    // 过滤掉空值
    const validItems = arr.filter(item => item && typeof item === 'string');
    
    if (validItems.length === 0) {
        return [];
    }
    
    const result = validItems.reduce((acc, curr) => {
        try {
            const parts = curr.split(',');
            if (parts.length >= 3) {
                const key = parts[1];
                const value = parts[2];

                if (!acc[key]) {
                    acc[key] = value;
                } else if (!acc[key].includes(value)) {
                    acc[key] += `，${value}`;
                }
            }
        } catch (error) {
            console.warn('mergeFruitData: 处理项目时出错', curr, error);
        }

        return acc;
    }, {});

    return Object.entries(result)
        .map(([key, value]) => `${key}：${value}`);
}