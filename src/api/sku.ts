import { http } from '@/core/utils/http/axios';
import axios from 'axios';
import { useUser } from '@/store/modules/user';

const userStore = useUser();
const token = userStore.getToken;

export function getSkuReplacePage(data: any) {
    return http.request({
        url: '/sku/getSkuReplacePage',
        method: 'post',
        data,
    });
}

export function getSkuReplaceDetail(sku_id: number) {
    return http.request({
        url: '/sku/getSkuReplaceDetail',
        method: 'get',
        params: { sku_id },
    });
}

export function createSkuReplace(data: any) {
    return http.request({
        url: '/sku/createSkuReplace',
        method: 'post',
        data,
    });
}

export function updateSkuReplace(data: any) {
    return http.request({
        url: '/sku/updateSkuReplace',
        method: 'post',
        data,
    });
}

export function deleteSkuReplace(id: number) {
    return http.request({
        url: '/sku/deleteSkuReplace',
        method: 'post',
        data: {
            id,
        },
    });
}

// 导出功能
export function getSkuReplaceExport(data: any): Promise<Blob> {
    return axios
        .post('/api/sku/getSkuReplacePage', data, {
            responseType: 'blob',
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data);
}
