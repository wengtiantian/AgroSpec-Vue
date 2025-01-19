export function mergeFruitData(arr) {
    const result = arr.reduce((acc, curr) => {
        const parts = curr.split(',');
        const key = parts[1];
        const value = parts[2];

        if (!acc[key]) {
            acc[key] = value;
        } else if (!acc[key].includes(value)) {
            acc[key] += `，${value}`;
        }

        return acc;
    }, {});

    return Object.entries(result)
        .map(([key, value]) => `${key}：${value}`);
}