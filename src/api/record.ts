import { http } from '@/core/utils/http/axios';
import axios from 'axios';

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

// 暂时不用封装的方法
export function getDeliverRecordExport(data: any) {
    return axios.post('/api/record/deliverRecord', data, {
        responseType: 'blob',
        withCredentials: true,
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
