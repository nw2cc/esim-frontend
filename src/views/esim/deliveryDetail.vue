<template>
    <n-card :bordered="false" class="proCard" title="发货单详情">
        <n-button-group>
            <n-button type="primary">创建充值订单</n-button>
        </n-button-group>
        <n-descriptions label-placement="left" bordered :column="3" size="small">
            <n-descriptions-item label="金蝶订单号">{{ detail.detail.delivery.code }}</n-descriptions-item>
            <n-descriptions-item label="平台订单号">{{ detail.detail.platform_code }}</n-descriptions-item>
            <n-descriptions-item label="充值状态">
                <n-tag :type="statusType[detail.status]">{{ statusMap[detail.status] }}</n-tag>
            </n-descriptions-item>
        </n-descriptions>
        <n-descriptions label-placement="left" bordered :column="3" size="small">
            <n-descriptions-item label="创建时间">{{ detail.detail.delivery.create_date }}</n-descriptions-item>
            <n-descriptions-item label="修改时间">{{ detail.detail.delivery.modify_date }}</n-descriptions-item>
            <n-descriptions-item label="物流单打印时间"
                >{{ detail.detail.delivery.express_print_date }}
            </n-descriptions-item>
            <n-descriptions-item label="发货时间">{{ detail.detail.delivery.delivery_date }}</n-descriptions-item>
            <n-descriptions-item label="收货地区">{{ detail.detail.delivery.area_name }}</n-descriptions-item>
            <n-descriptions-item label="店铺名称">{{ detail.detail.delivery.shop_name }}</n-descriptions-item>
            <n-descriptions-item label="仓库名称">{{ detail.detail.delivery.warehouse_name }}</n-descriptions-item>
            <n-descriptions-item label="平台类型">{{ detail.detail.delivery.from_type_name }}</n-descriptions-item>
            <n-descriptions-item label="订单类型">{{ detail.detail.delivery.order_type_name }}</n-descriptions-item>
            <n-descriptions-item label="买家留言">{{ detail.detail.delivery.buyer_memo }}</n-descriptions-item>
            <n-descriptions-item label="收货人姓名">{{ detail.detail.delivery.receiver_name }}</n-descriptions-item>
            <n-descriptions-item label="收货人电话">{{ detail.detail.delivery.receiver_phone }}</n-descriptions-item>
            <n-descriptions-item label="收货人手机">{{ detail.detail.delivery.receiver_mobile }}</n-descriptions-item>
            <n-descriptions-item label="收货邮编">{{ detail.detail.delivery.receiver_zip }}</n-descriptions-item>
            <n-descriptions-item label="收货地址">{{ detail.detail.delivery.receiver_address }}</n-descriptions-item>
            <n-descriptions-item label="快递单号">{{ detail.detail.delivery.express_no }}</n-descriptions-item>
        </n-descriptions>
        <n-descriptions label-placement="left" bordered :column="3" size="small">
            <n-descriptions-item label="商品数量">{{ detail.detail.qty }}</n-descriptions-item>
            <n-descriptions-item label="实际单价">{{ detail.detail.price }}</n-descriptions-item>
            <n-descriptions-item label="商品总价">{{ detail.detail.amount }}</n-descriptions-item>
            <n-descriptions-item label="让利金额">{{ detail.detail.discount_fee }}</n-descriptions-item>
            <n-descriptions-item label="让利后金额">{{ detail.detail.amount_after }}</n-descriptions-item>
            <n-descriptions-item label="物流成本">{{ detail.detail.post_cost }}</n-descriptions-item>
            <n-descriptions-item label="商品代码">{{ detail.detail.item_code }}</n-descriptions-item>
            <n-descriptions-item label="商品名称">{{ detail.detail.item_name }}</n-descriptions-item>
            <n-descriptions-item label="平台商品名称">{{ detail.detail.platform_item_name }}</n-descriptions-item>
            <n-descriptions-item label="平台规格名称">{{ detail.detail.platform_sku_name }}</n-descriptions-item>
        </n-descriptions>
        <n-descriptions label-placement="left" bordered :column="3" size="small">
            <n-descriptions-item label="ICCID">{{ detail.iccid }}</n-descriptions-item>
            <n-descriptions-item label="PIN">{{ detail.pin }}</n-descriptions-item>
            <n-descriptions-item label="PUK">{{ detail.puk }}</n-descriptions-item>
            <n-descriptions-item label="手机号码">{{ detail.tel }}</n-descriptions-item>
            <n-descriptions-item label="供应商">{{ detail.vendor }}</n-descriptions-item>
            <n-descriptions-item label="采购批次">{{ detail.lot }}</n-descriptions-item>
            <n-descriptions-item label="采购序号">{{ detail.psn }}</n-descriptions-item>
            <n-descriptions-item label="有效期">{{ detail.exp }}</n-descriptions-item>
        </n-descriptions>
    </n-card>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { getDeliveryDetail } from '@/api/delivery';

    const statusMap = { '0': '未充值', '1': '已充值' };
    const statusType = { '0': 'warning', '1': 'success' };

    const route = useRoute();
    const id = ref(route.params.id);
    const detail = ref({
        detail: {
            delivery: {},
        },
    });

    onMounted(async () => {
        detail.value = await getDeliveryDetail(id.value as string);
    });
</script>

<style lang="less" scoped>
    .n-descriptions {
        margin-top: 20px;
    }
</style>
