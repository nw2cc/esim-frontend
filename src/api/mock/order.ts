import axios from 'axios';

// **加载订单列表**
export async function loadOrderList(req: any) {
    const res = await axios.post('/api/order/list', req);
    return res.data;
}

// **新增订单**
export async function addOrder(req: any) {
    const res = await axios.post('/api/order/add', req);
    return res.data;
}

// **更新订单**
export async function updateOrder(id: string, req: any) {
    const res = await axios.post(`/api/order/update/${id}`, req);
    return res.data;
}

// **删除订单**
export async function deleteOrder(id: string) {
    const res = await axios.delete(`/api/order/delete/${id}`);
    return res.data;
}
