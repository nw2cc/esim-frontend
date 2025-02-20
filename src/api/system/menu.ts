import { http } from '@/core/utils/http/axios';

export function adminMenus() {
    return http.request({
        url: '/menus',
        method: 'GET',
    });
}
