import { renderIcon } from '@/core/utils';
import { buildRoutes } from '@/router/generator';
import { SpeedOne } from '@icon-park/vue-next';

export default buildRoutes('dashboard', '首页', renderIcon(SpeedOne), 0, [
    {
        path: 'console',
        title: '主控台',
        icon: renderIcon(SpeedOne),
        component: () => import('@/views/dashboard/console.vue'),
        config: {
            affix: true,
        },
    },
]);
