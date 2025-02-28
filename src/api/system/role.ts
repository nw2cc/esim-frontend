import { http } from '@/core/utils/http/axios';

export function getAllRole() {
    return http.request({
        url: '/role/getAllRole',
        method: 'get',
    });
}

export function getRolePage(data: any) {
    return http.request({
        url: '/role/getRolePage',
        method: 'post',
        data,
    });
}

export function createRole(data: any) {
    return http.request({
        url: '/role/createRole',
        method: 'post',
        data,
    });
}

export function updateRole(data: any) {
    return http.request({
        url: '/role/updateRole',
        method: 'post',
        data,
    });
}

export function deleteRole(id: string) {
    return http.request({
        url: '/role/deleteRole',
        method: 'post',
        data: {
            id,
        },
    });
}
