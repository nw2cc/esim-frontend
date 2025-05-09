import { http } from '@/core/utils/http/axios';
import { getAllPermissions, getPermissionsByValues } from '@/router';
import { ContentTypeEnum } from '@/core/enums/httpEnum';

export interface BasicResponseModel<T = any> {
    code: number;
    message: string;
    result?: T;
    access_token?: string;
    token_type?: string;
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

export async function getUserInfo(): Promise<UserInfoResp> {
    const res: UserInfoResp = await http.request({
        url: '/user/getUserInfo',
        method: 'get',
    });

    if (res.user.admin) {
        res.permissions = getAllPermissions();
    } else {
        if (res.permissions) {
            res.permissions = getPermissionsByValues(res.permissions);
        }
    }

    return res;
}

export function login(params: any) {
    const formData = new window.FormData();

    formData.append('grant_type', 'password');
    formData.append('username', params.username);
    formData.append('password', params.password);

    return http.request<BasicResponseModel>(
        {
            url: '/token',
            method: 'POST',
            data: formData,
            headers: {
                'Content-type': ContentTypeEnum.FORM_DATA,
            },
        },
        {
            isTransformResponse: false,
        }
    );
}

export function userLogout() {
    return http.request({
        url: '/user/logout',
        method: 'get',
    });
}

export function getUserPage(data: any) {
    return http.request({
        url: '/user/getUserPage',
        method: 'post',
        data,
    });
}

export function createUser(data: any) {
    return http.request({
        url: '/user/createUser',
        method: 'post',
        data,
    });
}

export function updateUser(data: any) {
    return http.request({
        url: '/user/updateUser',
        method: 'post',
        data,
    });
}

export function editUserPwd(data: any) {
    return http.request({
        url: '/user/editUserPwd',
        method: 'post',
        data,
    });
}

export function deleteUser(id: string) {
    return http.request({
        url: '/user/deleteUser',
        method: 'post',
        data: {
            id,
        },
    });
}
