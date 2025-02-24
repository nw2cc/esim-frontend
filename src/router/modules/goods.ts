import { renderIcon } from '@/core/utils';
import { buildRoutes } from '@/router/generator';
import { AdProduct, HealthProducts } from '@icon-park/vue-next';

export default buildRoutes('goods', '商品管理', renderIcon(AdProduct), 1, [
    {
        path: 'manage',
        title: 'Esim 商品',
        icon: renderIcon(HealthProducts),
        component: () => import('@/views/goods/goodsManage.vue'),
    },
]);
