import axios from 'axios';

// **加载用户列表**
export async function loadUserList(req: any) {
    const res = await axios.post('/api/user/list', req);
    return res.data;
}

// **新增用户**
export async function addUser(req: any) {
    const res = await axios.post('/api/user/add', req);
    return res.data;
}

// **更新用户**
export async function updateUser(id: string, req: any) {
    const res = await axios.post(`/api/user/update/${id}`, req);
    return res.data;
}

// **删除用户**
export async function deleteUser(id: string) {
    const res = await axios.delete(`/api/user/delete/${id}`);
    return res.data;
}
