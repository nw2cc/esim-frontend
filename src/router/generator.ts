import { adminMenus } from '@/api/system/menu';
import { constantRouterIcon } from './icons';
import { RouteComponent, RouteRecordRaw } from 'vue-router';
import { Layout, ParentLayout } from '@/router/constant';
import type { AppRouteRecordRaw } from '@/router/types';

const Iframe = () => import('@/views/_base/baseComponents/iframe/index.vue');
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', Layout);
LayoutMap.set('IFRAME', Iframe);

interface RouteDict {
    path: string;
    title: string;
    icon: any;
    component: RouteComponent;
    config?: { [key: string]: any };
}

export const buildRoutes = (
    moduleName: string,
    title: string,
    icon: any,
    sort: number,
    functions: RouteDict[]
): RouteRecordRaw[] => {
    const children: RouteRecordRaw[] = [];
    const permissions: string[] = [moduleName];

    for (const item of functions) {
        children.push({
            path: item.path,
            name: `${moduleName}_${item.path.split('/')[0]}`,
            meta: {
                keepAlive: true,
                title: item.title,
                icon: item.icon,
                permissions: [`${moduleName}_${item.path}`],
                ...(item.config || {}),
            },
            component: item.component,
        });
        permissions.push(`${moduleName}_${item.path}`);
    }

    /**
     * @param name 路由名称, 必须设置,且不能重名
     * @param meta 路由元信息（路由附带扩展信息）
     * @param redirect 重定向地址, 访问这个路由时, 自定进行重定向
     * @param meta.disabled 禁用整个菜单
     * @param meta.title 菜单名称
     * @param meta.icon 菜单图标
     * @param meta.keepAlive 缓存该路由
     * @param meta.sort 排序越小越排前
     * */
    return [
        {
            path: `/${moduleName}`,
            name: moduleName,
            redirect: `/${moduleName}/${functions[0].path}`,
            component: Layout,
            meta: {
                title: title,
                icon: icon,
                sort: sort,
                permissions: permissions,
            },
            children,
        },
    ];
};

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generateRoutes = (routerMap, parent?): any[] => {
    return routerMap.map((item) => {
        const currentRoute: any = {
            // 路由地址 动态拼接生成如 /dashboard/workplace
            path: `${(parent && parent.path) ?? ''}/${item.path}`,
            // 路由名称，建议唯一
            name: item.name ?? '',
            // 该路由对应页面的 组件
            component: item.component,
            // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
            meta: {
                ...item.meta,
                label: item.meta.title,
                icon: constantRouterIcon[item.meta.icon] || null,
                permissions: item.meta.permissions || null,
            },
        };

        // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
        currentRoute.path = currentRoute.path.replace('//', '/');
        // 重定向
        item.redirect && (currentRoute.redirect = item.redirect);
        // 是否有子菜单，并递归处理
        if (item.children && item.children.length > 0) {
            //如果未定义 redirect 默认第一个子路由为 redirect
            !item.redirect && (currentRoute.redirect = `${item.path}/${item.children[0].path}`);
            // Recursion
            currentRoute.children = generateRoutes(item.children, currentRoute);
        }
        return currentRoute;
    });
};

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generateDynamicRoutes = async (): Promise<RouteRecordRaw[]> => {
    const result = await adminMenus();
    const router = generateRoutes(result);
    asyncImportRoute(router);
    return router;
};

/**
 * 查找views中对应的组件文件
 * */
let viewsModules: Record<string, () => Promise<Recordable>>;
export const asyncImportRoute = (routes: AppRouteRecordRaw[] | undefined): void => {
    viewsModules = viewsModules || import.meta.glob('../views/**/*.{vue,tsx}');
    if (!routes) return;
    routes.forEach((item) => {
        if (!item.component && item.meta?.frameSrc) {
            item.component = 'IFRAME';
        }
        const { component, name } = item;
        const { children } = item;
        if (component) {
            const layoutFound = LayoutMap.get(component as string);
            if (layoutFound) {
                item.component = layoutFound;
            } else {
                item.component = dynamicImport(viewsModules, component as string);
            }
        } else if (name) {
            item.component = ParentLayout;
        }
        children && asyncImportRoute(children);
    });
};

/**
 * 动态导入
 * */
export const dynamicImport = (viewsModules: Record<string, () => Promise<Recordable>>, component: string) => {
    const keys = Object.keys(viewsModules);
    const matchKeys = keys.filter((key) => {
        let k = key.replace('../views', '');
        const lastIndex = k.lastIndexOf('.');
        k = k.substring(0, lastIndex);
        return k === component;
    });
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0];
        return viewsModules[matchKey];
    }
    if (matchKeys?.length > 1) {
        console.warn(
            'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
        );
        return;
    }
};
