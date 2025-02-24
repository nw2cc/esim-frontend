import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED, TABS_ROUTES } from '@/store/mutation-types';
import { ResultEnum } from '@/core/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/core/utils/storage';

export interface IUserState {
    token: string;
    avatar: string;
    username: string;
    permissions: any[];
}

export const useUserStore = defineStore({
    id: 'app-user',
    state: (): IUserState => ({
        token: storage.get(ACCESS_TOKEN, ''),
        avatar: '',
        username: '',
        permissions: [],
    }),
    getters: {
        getToken(): string {
            return this.token;
        },
        getAvatar(): string {
            return this.avatar;
        },
        getUsername(): string {
            return this.username;
        },
        getPermissions(): [any][] {
            return this.permissions;
        },
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setAvatar(avatar: string) {
            this.avatar = avatar;
        },
        setUsername(username: string) {
            this.username = username;
        },
        setPermissions(permissions: Indexable[]) {
            this.permissions = permissions;
        },
        // 登录
        async login(params: any) {
            const response = await login(params);
            console.log(response);
            const { token, code } = response;
            if (code === ResultEnum.SUCCESS) {
                const ex = 7 * 24 * 60 * 60;
                storage.set(ACCESS_TOKEN, token, ex);
                storage.set(IS_SCREENLOCKED, false);
                this.setToken(token as string);
                await this.getInfo();
            }
            return response;
        },

        // 获取用户信息
        async getInfo() {
            const result = await getUserInfoApi();
            if (result.permissions.length) {
                this.setUsername(result.user.nick_name);
                this.setPermissions(result.permissions);
            } else {
                throw new Error('getInfo: permissionsList must be a non-null array !');
            }
            this.setAvatar(result.user.avatar);
            return result;
        },

        // 登出
        async logout() {
            this.setPermissions([]);
            storage.remove(ACCESS_TOKEN);
            storage.remove(CURRENT_USER);
            localStorage.removeItem(TABS_ROUTES);
        },
    },
});

// Need to be used outside the setup
export function useUser() {
    return useUserStore(store);
}
