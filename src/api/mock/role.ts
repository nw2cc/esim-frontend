import axios from 'axios';

// **加载角色列表**
export async function loadRoleList(req: any) {
    const res = await axios.post('/api/role/list', req);
    return res.data;
}

// **新增角色**
export async function addRole(req: any) {
    const res = await axios.post('/api/role/add', req);
    return res.data;
}

// **更新角色**
export async function updateRole(id: number, req: any) {
    const res = await axios.post(`/api/role/update/${id}`, req);
    return res.data;
}

// **删除角色**
export async function deleteRole(id: number) {
    const res = await axios.delete(`/api/role/delete/${id}`);
    return res.data;
}
