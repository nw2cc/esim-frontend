import { http } from '@/core/utils/http/axios';
import axios from 'axios';
import { useUser } from '@/store/modules/user';

const userStore = useUser();
const token = userStore.getToken;

export function getProductPage(data: any) {
    return http.request({
        url: '/product/getProductPage',
        method: 'post',
        data,
    });
}

export function getProductDetail(product_id: number) {
    return http.request({
        url: '/product/getProductDetail',
        method: 'get',
        params: { product_id },
    });
}

export function createProduct(data: any) {
    return http.request({
        url: '/product/createProduct',
        method: 'post',
        data,
    });
}

export function updateProduct(data: any) {
    return http.request({
        url: '/product/updateProduct',
        method: 'post',
        data,
    });
}

export function deleteProduct(id: number) {
    return http.request({
        url: '/product/deleteProduct',
        method: 'post',
        data: {
            id,
        },
    });
}

export function importProduct(file: File) {
    const formData = new window.FormData();
    formData.append('file', file);
    return http.uploadFile(
        {
            url: '/api/product/importProduct',
        },
        {
            file,
            name: 'file',
        }
    );
}

// 导出功能
export function getProductExport(data: any): Promise<Blob> {
    return axios
        .post('/api/product/getProductPage', data, {
            responseType: 'blob',
            withCredentials: true,
            timeout: 600 * 1000, // 导出功能设置60秒超时
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.data);
}
