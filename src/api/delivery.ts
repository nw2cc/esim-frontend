import { http } from '@/core/utils/http/axios';

export function getDeliveryItems(data: any) {
    return http.request({
        url: '/delivery/getDeliveryItems',
        method: 'post',
        data,
    });
}

export function getDeliveryDetail(id: string) {
    return http.request({
        url: '/delivery/getDeliveryDetail',
        method: 'post',
        data: {
            id,
        },
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
