import Mock from 'mockjs';
import orderData from './data.json';

// 生成 2024-10-25 至 2025-03-14 之间的随机日期
function getRandomDate() {
    const start = new Date('2024-10-25').getTime();
    const end = new Date('2025-03-14').getTime();
    const randomTime = start + Math.random() * (end - start);
    const randomDate = new Date(randomTime);

    // 格式化为 yyyy-MM-dd
    const year = randomDate.getFullYear();
    const month = (randomDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需+1
    const day = randomDate.getDate().toString().padStart(2, '0'); // 日需要补零
    return `${year}-${month}-${day}`;
}

function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，所以需要 +1
    const day = today.getDate().toString().padStart(2, '0'); // 确保日期是两位数

    return `${year}-${month}-${day}`;
}

// 遍历 JSON 数据，修改 `usageDate`
const orderList = (orderData as any).map((order: Record<string, any>) => ({
    ...order,
    usageDate: getRandomDate(),
}));

console.log('orderList:', orderList);

// **查询订单列表（分页）**
Mock.mock(/\/api\/order\/list/, 'post', (options) => {
    const req = JSON.parse(options.body);
    const { pageNum = 1, pageSize = 10 } = req;

    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const pageCount = Math.ceil(orderList.length / pageSize);

    return {
        code: 200,
        message: 'success',
        list: orderList.slice(start, end),
        page: pageNum,
        pageSize,
        pageCount,
        itemCount: orderList.length,
    };
});

// **新增订单**
Mock.mock('/api/order/add', 'post', (options) => {
    const body = JSON.parse(options.body);
    const newOrder = {
        id: Mock.Random.id(),
        ...body,
        // 今天日期的 yyyy-dd-mm
        usageDate: getToday(),
    };
    orderList.unshift(newOrder);
    return { code: 200, message: '新增成功', data: newOrder };
});

// **更新订单**
Mock.mock(/\/api\/order\/update\/\d+/, 'post', (options) => {
    const id = options.url.split('/').pop();
    const body = JSON.parse(options.body);
    const order = orderList.find((o) => o.id === id);

    if (order) {
        Object.assign(order, body);
        return { code: 200, message: '更新成功', data: order };
    } else {
        return { code: 404, message: '订单不存在' };
    }
});

// **删除订单**
Mock.mock(/\/api\/order\/delete\/\d+/, 'delete', (options) => {
    const id = options.url.split('/').pop();
    const index = orderList.findIndex((o) => o.id === id);

    if (index !== -1) {
        orderList.splice(index, 1);
        return { code: 200, message: '删除成功' };
    } else {
        return { code: 404, message: '订单不存在' };
    }
});
