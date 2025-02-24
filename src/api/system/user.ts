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
    const { username, password } = params;
    if (username === 'william' && password === 'qwer123456') {
        return new Promise<BasicResponseModel<UserInfo>>((resolve) => {
            resolve({
                code: 200,
                message: '',
                result: params,
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwMDMxMjAwLCJpYXQiOjE3Mzk5NDQ4MDAsImp0aSI6IjEyNDU1OTg5YWZhMjQyOGViZjhiY2Y2YzE5ZDUwMDlkIiwidXNlcl9pZCI6MX0.AdemqleiI64DIo9nyhc0zPBef5SLQ7thTukfMAbVvaU',
            });
        });
    } else {
        return Promise.resolve({
            code: 500,
            message: '用户名或密码错误',
            result: params,
            token: '',
        });
    }
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
