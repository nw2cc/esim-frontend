import { http } from '@/core/utils/http/axios';

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
    return http.request<Blob>(
        {
            url: '/product/getProductPage',
            method: 'post',
            data,
            responseType: 'blob',
            timeout: 600 * 1000, // 300秒超时，可根据需要调整
        },
        {
            isTransformResponse: false, // 不转换响应，直接返回 res.data (Blob)
        }
    );
}
