import { renderIcon } from '@/core/utils';
import { buildRoutes } from '@/router/generator';
import { PeopleSafeOne, Permissions, User } from '@icon-park/vue-next';

export default buildRoutes('permission', '权限管理', renderIcon(Permissions), 2, [
    {
        path: 'user',
        title: '用户管理',
        icon: renderIcon(User),
        component: () => import('@/views/permission/userManage.vue'),
    },
    {
        path: 'role',
        title: '角色管理',
        icon: renderIcon(PeopleSafeOne),
        component: () => import('@/views/permission/roleManage.vue'),
    },
]);
