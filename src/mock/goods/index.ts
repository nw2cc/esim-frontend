import Mock from 'mockjs';

// 商品列表（eSIM 相关商品）
const goodsList = Mock.mock({
    data: [
        {
            id: '1001',
            name: 'eSIM 欧洲全通套餐',
            category: '通信',
            price: 299,
            stock: 100,
            status: '在售',
            description: '适用于30天内多国漫游的eSIM套餐',
        },
        {
            id: '1002',
            name: 'eSIM 亚洲通行套餐',
            category: '通信',
            price: 249,
            stock: 80,
            status: '在售',
            description: '支持15个亚洲国家的eSIM套餐，30天有效',
        },
        {
            id: '1003',
            name: 'eSIM 美国全网通套餐',
            category: '通信',
            price: 199,
            stock: 150,
            status: '在售',
            description: '美国境内和周边区域支持的eSIM套餐',
        },
        {
            id: '1004',
            name: 'eSIM 全球数据套餐',
            category: '通信',
            price: 399,
            stock: 120,
            status: '在售',
            description: '覆盖全球50多个国家，提供稳定高速的数据服务',
        },
        {
            id: '1005',
            name: 'eSIM 欧洲+北美套餐',
            category: '通信',
            price: 329,
            stock: 95,
            status: '在售',
            description: '适用于欧洲和美国的eSIM套餐，支持漫游使用',
        },
        {
            id: '1006',
            name: 'eSIM 日本专享套餐',
            category: '通信',
            price: 189,
            stock: 200,
            status: '在售',
            description: '专为日本市场定制的eSIM套餐，30天有效期',
        },
        {
            id: '1007',
            name: 'eSIM 韩国流量套餐',
            category: '通信',
            price: 149,
            stock: 180,
            status: '在售',
            description: '针对韩国使用的eSIM套餐，提供高速数据流量',
        },
        {
            id: '1008',
            name: 'eSIM 澳大利亚漫游套餐',
            category: '通信',
            price: 229,
            stock: 110,
            status: '在售',
            description: '为澳大利亚及周边地区设计的eSIM套餐',
        },
        {
            id: '1009',
            name: 'eSIM 拉美地区套餐',
            category: '通信',
            price: 299,
            stock: 130,
            status: '在售',
            description: '专为拉美地区多国提供的eSIM套餐',
        },
        {
            id: '1010',
            name: 'eSIM 非洲大陆套餐',
            category: '通信',
            price: 269,
            stock: 60,
            status: '在售',
            description: '适用于非洲多个国家的eSIM套餐，包月流量',
        },
        {
            id: '1011',
            name: 'eSIM 欧洲短期套餐',
            category: '通信',
            price: 159,
            stock: 90,
            status: '在售',
            description: '适合短期欧洲旅游的eSIM套餐',
        },
        {
            id: '1012',
            name: 'eSIM 北美短期套餐',
            category: '通信',
            price: 199,
            stock: 50,
            status: '在售',
            description: '适合北美地区短期旅游的eSIM套餐',
        },
        {
            id: '1013',
            name: 'eSIM 东南亚多国套餐',
            category: '通信',
            price: 239,
            stock: 140,
            status: '在售',
            description: '涵盖东南亚多国的eSIM套餐',
        },
        {
            id: '1014',
            name: 'eSIM 中东地区套餐',
            category: '通信',
            price: 279,
            stock: 70,
            status: '在售',
            description: '中东国家范围内使用的eSIM套餐',
        },
        {
            id: '1015',
            name: 'eSIM 全球月度套餐',
            category: '通信',
            price: 499,
            stock: 50,
            status: '在售',
            description: '全球范围内的eSIM套餐，适用于长途旅行者',
        },
    ],
}).data;

// **查询商品列表（分页）**
Mock.mock(/\/api\/good\/list/, 'post', (options) => {
    const req = JSON.parse(options.body);
    const { pageNum = 1, pageSize = 10 } = req;

    // 计算分页
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const pageCount = Math.ceil(goodsList.length / pageSize);

    return {
        code: 200,
        message: 'success',
        list: goodsList.slice(start, end),
        page: pageNum,
        pageSize,
        pageCount,
        itemCount: goodsList.length,
    };
});

// **新增商品**
Mock.mock(/\/api\/good\/add/, 'post', (options) => {
    const body = JSON.parse(options.body);
    const newGood = {
        id: `10${goodsList.length + 1}`,
        ...body,
    };
    goodsList.push(newGood);
    return { code: 200, message: '新增成功', data: newGood };
});

// **更新商品**
Mock.mock(/\/api\/good\/update\/\d+/, 'post', (options) => {
    const id = options.url.split('/').pop();
    const body = JSON.parse(options.body);
    const good = goodsList.find((item) => item.id === id);

    if (good) {
        Object.assign(good, body);
        return { code: 200, message: '更新成功', data: good };
    } else {
        return { code: 404, message: '商品不存在' };
    }
});

// **删除商品**
Mock.mock(/\/api\/good\/delete\/\d+/, 'delete', (options) => {
    const id = options.url.split('/').pop();
    const index = goodsList.findIndex((item) => item.id === id);

    if (index !== -1) {
        goodsList.splice(index, 1);
        return { code: 200, message: '删除成功' };
    } else {
        return { code: 404, message: '商品不存在' };
    }
});
