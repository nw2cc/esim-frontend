import { http } from '@/core/utils/http/axios';
import axios from 'axios';
import { useUser } from '@/store/modules/user';

const userStore = useUser();
const token = userStore.getToken;

export function getDeliverRecord(data: any) {
    return http.request({
        url: '/record/deliverRecord',
        method: 'post',
        data,
    });
}

export function getDeliverRecordDetail(id: string) {
    return http.request({
        url: '/record/deliverRecordDetail',
        method: 'get',
        params: { record_id: id },
    });
}

export function fetchEid(id: string) {
    return http.request({
        url: '/record/fetchEid',
        method: 'get',
        params: { record_id: id },
    });
}

export function resendEmail(data: any) {
    return http.request({
        url: '/trade/resendEmail',
        method: 'post',
        data,
    });
}

// 暂时不用封装的方法
export function getDeliverRecordExport(data: any) {
    return axios.post('/api/record/deliverRecord', data, {
        responseType: 'blob',
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function getBatchRecord(data: any) {
    return http.request({
        url: '/record/batchRecord',
        method: 'post',
        data,
    });
}

export function getKingdeeOrders(data: any) {
    return http.request({
        url: '/record/kingdeeOrders',
        method: 'post',
        data,
    });
}
