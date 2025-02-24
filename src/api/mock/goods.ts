import axios from 'axios';

// **加载商品列表**
export async function loadGoodsList(req: any) {
    const res = await axios.post('/api/good/list', req);
    return res.data;
}

// **新增商品**
export async function addGood(req: any) {
    const res = await axios.post('/api/good/add', req);
    return res.data;
}

// **更新商品**
export async function updateGood(id: string, req: any) {
    const res = await axios.post(`/api/good/update/${id}`, req);
    return res.data;
}

// **删除商品**
export async function deleteGood(id: string) {
    const res = await axios.delete(`/api/good/delete/${id}`);
    return res.data;
}
