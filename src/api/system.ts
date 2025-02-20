import Licence from '@/core/utils/licence';

export interface LicenceResp {
    licence: Licence | null;
    message: string;
    req: string;
    status: number;
}

// export function getLicence(): Promise<LicenceResp> {
export function getLicence() {
    // return http.request({
    //     url: '/app/getLicence',
    //     method: 'get',
    // });
    return new Promise((resolve) => {
        resolve({
            status: 1,
        });
    });
}
