import { http } from '@/core/utils/http/axios';

export function getDeliveryItems(data: any) {
    return http.request({
        url: '/delivery/getDeliveryItems',
        method: 'post',
        data,
    });
}

export function getDeliveryDetail(iccid: string) {
    return http.request({
        url: '/delivery/getDeliveryDetail',
        method: 'post',
        data: {
            iccid,
        },
    });
}

export function refreshDeliveryDetail(code: string) {
    return http.request({
        url: '/delivery/refreshDeliveryDetail',
        method: 'post',
        data: {
            code,
        },
    });
}

export function getRechargeList(data: any) {
    return http.request({
        url: '/delivery/getRechargeList',
        method: 'post',
        data,
    });
}

export function createRechargeOrder(iccid: string) {
    return http.request({
        url: '/delivery/createRechargeOrder',
        method: 'post',
        data: {
            iccid,
        },
    });
}
