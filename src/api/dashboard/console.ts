import { http } from '@/core/utils/http/axios';

export function getConsoleInfo() {
    return http.request({
        url: '/dashboard/console',
        method: 'get',
    });
}
