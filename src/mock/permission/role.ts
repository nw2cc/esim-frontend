import Mock from 'mockjs';

// 角色列表（与用户表的 role_id 对应）
export const roleList = Mock.mock({
    data: [
        {
            id: 1,
            role_name: '管理员',
            create_time: '@datetime',
            update_time: '@datetime',
            remark: '系统最高权限',
            is_admin: true,
            permissions: ['dashboard_console', 'permission_user', 'permission_role'],
        },
        {
            id: 2,
            role_name: '普通用户',
            create_time: '@datetime',
            update_time: '@datetime',
            remark: '基础访问权限',
            is_admin: false,
            permissions: ['dashboard_console'],
        },
        {
            id: 3,
            role_name: '访客',
            create_time: '@datetime',
            update_time: '@datetime',
            remark: '仅能浏览部分内容',
            is_admin: false,
            permissions: ['dashboard_console'],
        },
    ],
}).data;

// **查询角色列表（分页）**
Mock.mock(/\/api\/role\/list/, 'post', (options) => {
    const req = JSON.parse(options.body);
    const { pageNum = 1, pageSize = 10 } = req;

    // 计算分页
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const pageCount = Math.ceil(roleList.length / pageSize);

    return {
        code: 200,
        message: 'success',
        list: roleList.slice(start, end),
        page: pageNum,
        pageSize,
        pageCount,
        itemCount: roleList.length,
    };
});

// **新增角色**
Mock.mock('/api/role/add', 'post', (options) => {
    const body = JSON.parse(options.body);
    const newRole = {
        id: roleList.length + 1, // 角色 ID 自增
        create_time: Mock.Random.datetime(),
        update_time: Mock.Random.datetime(),
        ...body,
    };
    roleList.push(newRole);
    return { code: 200, message: '新增成功', data: newRole };
});

// **更新角色**
Mock.mock(/\/api\/role\/update\/\d+/, 'post', (options) => {
    const id = Number(options.url.split('/').pop());
    const body = JSON.parse(options.body);
    const role = roleList.find((item) => item.id === id);

    if (role) {
        Object.assign(role, body, { update_time: Mock.Random.datetime() });
        return { code: 200, message: '更新成功', data: role };
    } else {
        return { code: 404, message: '角色不存在' };
    }
});

// **删除角色**
Mock.mock(/\/api\/role\/delete\/\d+/, 'delete', (options) => {
    const id = Number(options.url.split('/').pop());
    const index = roleList.findIndex((item) => item.id === id);

    if (index !== -1) {
        roleList.splice(index, 1);
        return { code: 200, message: '删除成功' };
    } else {
        return { code: 404, message: '角色不存在' };
    }
});
