import { renderIcon } from '@/core/utils';
import { buildRoutes } from '@/router/generator';
import { Consume, Sim, Transport } from '@icon-park/vue-next';

export default buildRoutes('sim', '实体卡业务', renderIcon(Sim), 2, [
    {
        path: 'delivery',
        title: '发货单查询',
        icon: renderIcon(Transport),
        component: () => import('@/views/sim/delivery.vue'),
    },
    {
        path: 'deliveryDetail/:iccid/:tab',
        title: '发货单详情',
        icon: renderIcon(Transport),
        component: () => import('@/views/sim/deliveryDetail.vue'),
        config: {
            hidden: true,
        },
    },
    {
        path: 'rechargeRecord',
        title: '充值记录',
        icon: renderIcon(Consume),
        component: () => import('@/views/sim/rechargeRecord.vue'),
    },
]);
