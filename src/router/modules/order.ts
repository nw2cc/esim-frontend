import { renderIcon } from '@/core/utils';
import { buildRoutes } from '@/router/generator';
import { OrderedList, Order } from '@icon-park/vue-next';

export default buildRoutes('order', '订单管理', renderIcon(OrderedList), 1, [
    {
        path: 'manage',
        title: 'Esim 订单',
        icon: renderIcon(OrderedList),
        component: () => import('@/views/order/orderManage.vue'),
    },
]);
