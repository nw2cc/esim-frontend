import { http } from '@/core/utils/http/axios';
import { getAllPermissions } from '@/router';

export interface BasicResponseModel<T = any> {
    code: number;
    message: string;
    result?: T;
    token?: string;
}

export interface UserInfo {
    admin: boolean;
    avatar: string;
    nick_name: string;
    user_name: string;
}

export interface UserInfoResp {
    user: UserInfo;
    permissions: Indexable[];
}

/**
 * @description: 获取用户信息
 */
export async function getUserInfo(): Promise<UserInfoResp> {
    // const res: UserInfoResp = await http.request(
    //     {
    //         url: '/getInfo',
    //         method: 'get',
    //     },
    //     {
    //         isTransformResponse: false,
    //     }
    // );
    //
    // if (res.user.admin) {
    //     res.permissions = getAllPermissions();
    // } else {
    //     if (res.permissions) {
    //         res.permissions = getPermissionsByValues(res.permissions);
    //     }
    // }
    //
    // return res;
    // todo 用户信息
    return new Promise<UserInfoResp>((resolve) => {
        resolve({
            user: {
                admin: true,
                avatar: '',
                nick_name: 'William',
                user_name: 'William',
            },
            permissions: getAllPermissions(),
        });
    });
}

/**
 * @description: 用户登录
 */
export function login(params: any) {
    // return http.request<BasicResponseModel>(
    //     {
    //         url: '/login',
    //         method: 'POST',
    //         params,
    //     },
    //     {
    //         isTransformResponse: false,
    //     }
    // );
    // todo 登陆
    return new Promise<BasicResponseModel<UserInfo>>((resolve) => {
        resolve({
            code: 200,
            message: '',
            result: params,
            token: '123123123123123',
        });
    });
}

/**
 * @description: 用户退出登录
 */
export function userLogout() {
    return http.request({
        url: '/user/logout',
        method: 'get',
    });
}
