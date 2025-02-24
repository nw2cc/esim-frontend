import { renderIcon } from '@/core/utils';
import { buildRoutes } from '@/router/generator';
import { SalesReport, Add, Reduce } from '@icon-park/vue-next';

export default buildRoutes('inventory', '进销存', renderIcon(SalesReport), 1, [
    {
        path: 'inbound',
        title: '入库',
        icon: renderIcon(Add),
        component: () => import('@/views/inventory/inbound.vue'),
    },
    {
        path: 'outbound',
        title: '出库',
        icon: renderIcon(Reduce),
        component: () => import('@/views/inventory/outbound.vue'),
    },
]);
