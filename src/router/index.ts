import { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { RedirectRoute } from '@/router/base';
import { PageEnum } from '@/core/enums/pageEnum';
import { createRouterGuards } from './guards';
import type { IModuleType, PermissionTreeData } from './types';

const modules = import.meta.glob<IModuleType>('./modules/**/*.ts', { eager: true });

const routeModuleList: RouteRecordRaw[] = Object.keys(modules).reduce((list, key) => {
    const mod = modules[key].default ?? {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    return [...list, ...modList];
}, []);

function sortRoute(a, b) {
    return (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0);
}

routeModuleList.sort(sortRoute);

export const RootRoute: RouteRecordRaw = {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_HOME,
    meta: {
        title: 'Root',
    },
};

export const LoginRoute: RouteRecordRaw = {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: {
        title: '登录',
    },
};

//需要验证权限
export const asyncRoutes = [...routeModuleList];

//普通路由 无需验证权限
export const constantRouter: RouteRecordRaw[] = [LoginRoute, RootRoute, RedirectRoute];

console.log(constantRouter);

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRouter,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
    app.use(router);
    // 创建路由守卫
    createRouterGuards(router);
}

export function getAllPermissions() {
    const permissions: PermissionTreeData[] = [];
    for (const route of asyncRoutes) {
        if (route.children) {
            for (const item of route.children) {
                permissions.push({
                    label: item.meta?.title as string,
                    value: item.meta?.permissions ? item.meta?.permissions[0] : '',
                });
            }
        }
    }
    return permissions;
}

export function getPermissionsByValues(values: Indexable[]) {
    const permissions: PermissionTreeData[] = [];
    for (const route of asyncRoutes) {
        if (route.children) {
            for (const item of route.children) {
                const code = item.meta?.permissions ? item.meta?.permissions[0] : '';
                if (values.indexOf(code) !== -1) {
                    permissions.push({
                        label: item.meta?.title as string,
                        value: code,
                    });
                }
            }
        }
    }
    return permissions;
}

export function getPermissionTree(routes?: RouteRecordRaw[]) {
    if (!routes) {
        routes = asyncRoutes;
    }
    const permissions: PermissionTreeData[] = [];
    for (const route of routes) {
        permissions.push({
            label: route.meta?.title as string,
            value: route.meta?.permissions ? route.meta?.permissions[0] : '',
            ...(route.children
                ? {
                      children: getPermissionTree(route.children),
                  }
                : {}),
        });
    }
    return permissions;
}

export default router;
