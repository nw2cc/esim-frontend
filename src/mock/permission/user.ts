import Mock from 'mockjs';
import { roleList } from './role'; // 引入角色数据

// 创建用户数据（确保 role_id 对应）
const userList = Mock.mock({
    'data|25': [
        {
            id: '@id',
            create_time: '@datetime',
            update_time: '@datetime',
            remark: '@sentence(5, 10)',
            user_name: '@cname',
            'role_id|1-3': 1, // 1~3 的随机 role_id
            role_name: function () {
                return roleList.find((r: any) => r.id === (this as any).role_id)?.role_name || '未知角色';
            },
            password: '@string(10)',
        },
    ],
}).data;

// **查询用户列表（分页）**
Mock.mock(/\/api\/user\/list/, 'post', (options) => {
    console.log(options);
    const req = JSON.parse(options.body);
    const { pageNum = 1, pageSize = 10 } = req;

    // 计算分页
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const pageCount = Math.ceil(userList.length / pageSize);

    return {
        code: 200,
        message: 'success',
        list: userList.slice(start, end),
        page: pageNum,
        pageSize,
        pageCount,
        itemCount: userList.length,
    };
});

// **新增用户**
Mock.mock('/api/user/add', 'post', (options) => {
    const body = JSON.parse(options.body);
    const roleMap = [
        { id: 1, role_name: '管理员' },
        { id: 2, role_name: '普通用户' },
        { id: 3, role_name: '访客' },
    ];
    const newUser = {
        id: Mock.Random.id(),
        create_time: Mock.Random.datetime(),
        update_time: Mock.Random.datetime(),
        role_name: roleMap.find((r) => r.id == body.role_id)?.role_name || '未知角色',
        ...body,
    };
    userList.unshift(newUser);
    return { code: 200, message: '新增成功', data: newUser };
});

// **更新用户**
Mock.mock(/\/api\/user\/update\/\d+/, 'post', (options) => {
    const id = options.url.split('/').pop();
    const body = JSON.parse(options.body);
    const user = userList.find((item) => item.id === id);

    if (user) {
        Object.assign(user, body, { update_time: Mock.Random.datetime() });
        return { code: 200, message: '更新成功', data: user };
    } else {
        return { code: 404, message: '用户不存在' };
    }
});

// **删除用户**
Mock.mock(/\/api\/user\/delete\/\d+/, 'delete', (options) => {
    const id = options.url.split('/').pop();
    const index = userList.findIndex((item) => item.id === id);

    if (index !== -1) {
        userList.splice(index, 1);
        return { code: 200, message: '删除成功' };
    } else {
        return { code: 404, message: '用户不存在' };
    }
});
