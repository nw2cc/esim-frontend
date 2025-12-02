import { renderIcon } from '@/core/utils';
import { buildRoutes } from '@/router/generator';
import { Exchange, Log, Order, Setting, Shop, TwoDimensionalCodeTwo } from '@icon-park/vue-next';

export default buildRoutes('esim', 'ESIM业务', renderIcon(TwoDimensionalCodeTwo), 1, [
    {
        path: 'exchange',
        title: '兑换记录',
        icon: renderIcon(Exchange),
        component: () => import('@/views/esim/exchange.vue'),
    },
    {
        path: 'exchangeDetail/:id/:name',
        title: '兑换记录详情',
        icon: renderIcon(Exchange),
        component: () => import('@/views/esim/exchangeDetail.vue'),
        config: {
            hidden: true,
        },
    },
    {
        path: 'orders',
        title: '金蝶订单查询',
        icon: renderIcon(Order),
        component: () => import('@/views/esim/orders.vue'),
    },
    {
        path: 'batchRecord',
        title: 'BatchRecord',
        icon: renderIcon(Log),
        component: () => import('@/views/esim/batchRecord.vue'),
    },
    {
        path: 'skuReplace',
        title: 'SKU替换',
        icon: renderIcon(Setting),
        component: () => import('@/views/esim/sku.vue'),
    },
    {
        path: 'product',
        title: '商品管理',
        icon: renderIcon(Shop),
        component: () => import('@/views/esim/product.vue'),
    },
]);
