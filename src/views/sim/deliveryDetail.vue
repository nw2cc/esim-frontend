<template>
    <n-card :bordered="false" class="proCard" title="发货单详情">
        <n-descriptions label-placement="left" bordered :column="2" size="small">
            <n-descriptions-item label="金蝶订单号">{{ detail.detail.delivery.code }}</n-descriptions-item>
            <n-descriptions-item label="平台订单号">{{ detail.detail.platform_code }}</n-descriptions-item>
            <n-descriptions-item label="ICCID">{{ detail.iccid }}</n-descriptions-item>
            <n-descriptions-item label="最后同步时间">{{ detail.detail.delivery.sync_time }}</n-descriptions-item>
            <n-descriptions-item label="充值状态">
                <n-tag :type="statusType[detail.status]">{{ statusMap[detail.status] }}</n-tag>
            </n-descriptions-item>
        </n-descriptions>
        <n-tabs type="line" animated v-model:value="tab">
            <n-tab-pane name="1" tab="发货单详情">
                <n-button style="margin: 5px 0 10px" type="success" @click="reSync">
                    <template #icon>
                        <n-icon>
                            <refresh theme="outline" size="20" :strokeWidth="3" />
                        </n-icon>
                    </template>
                    重新同步
                </n-button>
                <n-descriptions label-placement="left" bordered :column="3" size="small">
                    <n-descriptions-item label="创建时间">{{ detail.detail.delivery.create_date }}</n-descriptions-item>
                    <n-descriptions-item label="修改时间">{{ detail.detail.delivery.modify_date }}</n-descriptions-item>
                    <n-descriptions-item label="物流单打印时间"
                        >{{ detail.detail.delivery.express_print_date }}
                    </n-descriptions-item>
                    <n-descriptions-item label="发货时间"
                        >{{ detail.detail.delivery.delivery_date }}
                    </n-descriptions-item>
                    <n-descriptions-item label="收货地区">{{ detail.detail.delivery.area_name }}</n-descriptions-item>
                    <n-descriptions-item label="店铺名称">{{ detail.detail.delivery.shop_name }}</n-descriptions-item>
                    <n-descriptions-item label="仓库名称"
                        >{{ detail.detail.delivery.warehouse_name }}
                    </n-descriptions-item>
                    <n-descriptions-item label="平台类型"
                        >{{ detail.detail.delivery.from_type_name }}
                    </n-descriptions-item>
                    <n-descriptions-item label="订单类型"
                        >{{ detail.detail.delivery.order_type_name }}
                    </n-descriptions-item>
                    <n-descriptions-item label="买家留言">{{ detail.detail.delivery.buyer_memo }}</n-descriptions-item>
                    <n-descriptions-item label="收货人姓名"
                        >{{ detail.detail.delivery.receiver_name }}
                    </n-descriptions-item>
                    <n-descriptions-item label="收货人电话"
                        >{{ detail.detail.delivery.receiver_phone }}
                    </n-descriptions-item>
                    <n-descriptions-item label="收货人手机"
                        >{{ detail.detail.delivery.receiver_mobile }}
                    </n-descriptions-item>
                    <n-descriptions-item label="收货邮编"
                        >{{ detail.detail.delivery.receiver_zip }}
                    </n-descriptions-item>
                    <n-descriptions-item label="收货地址"
                        >{{ detail.detail.delivery.receiver_address }}
                    </n-descriptions-item>
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
                    <n-descriptions-item label="组合商品代码"
                        >{{ detail.detail.combine_item_code_split }}
                    </n-descriptions-item>
                    <n-descriptions-item label="组合商品名称"
                        >{{ detail.detail.combine_item_name_split }}
                    </n-descriptions-item>
                    <n-descriptions-item label="平台商品名称"
                        >{{ detail.detail.platform_item_name }}
                    </n-descriptions-item>
                    <n-descriptions-item label="平台规格名称"
                        >{{ detail.detail.platform_sku_name }}
                    </n-descriptions-item>
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
            </n-tab-pane>
            <n-tab-pane name="2" tab="充值记录">
                <n-button style="margin: 5px 0 10px" type="primary" @click="recharge" :disabled="isSuccess">
                    <template #icon>
                        <n-icon>
                            <wallet theme="outline" size="20" :strokeWidth="3" />
                        </n-icon>
                    </template>
                    人工充值
                </n-button>
                <n-table :bordered="false" :single-line="false">
                    <thead>
                        <tr>
                            <th>充值方式</th>
                            <th>充值结果</th>
                            <th>时间</th>
                            <th>API返回</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in records" :key="index">
                            <td>
                                <n-tag type="success" v-if="item.auto">自动充值</n-tag>
                                <n-tag type="warning" v-else>人工充值</n-tag>
                            </td>
                            <td>
                                <n-tag :bordered="false" type="success" v-if="item.status">成功</n-tag>
                                <n-tag :bordered="false" type="error" v-else>失败</n-tag>
                            </td>
                            <td>
                                <div style="white-space: nowrap">{{ item.create_time }}</div>
                            </td>
                            <td>{{ item.api_response }}</td>
                        </tr>
                    </tbody>
                </n-table>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, h, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { createRechargeOrder, getDeliveryDetail, refreshDeliveryDetail } from '@/api/delivery';
    import { NSpace, NTag, useDialog } from 'naive-ui';
    import { Refresh, Wallet } from '@icon-park/vue-next';

    const statusMap = { '0': '未充值', '1': '已充值' };
    const statusType = { '0': 'warning', '1': 'success' };

    const route = useRoute();
    const dialog = useDialog();

    const tab = ref(route.params.tab);
    const iccid = ref(route.params.iccid);
    const detail = ref({
        iccid: '',
        detail: {
            combine_item_name_split: '',
            delivery: {
                code: '',
            },
        },
    });
    const records = ref([]);
    const isSuccess = computed(() => {
        for (const item of records.value) {
            if (item.status) {
                return true;
            }
        }
        return false;
    });

    async function recharge() {
        dialog.info({
            title: `创建充值订单`,
            content: () => {
                return h('div', {}, [
                    h(NSpace, { align: 'center' }, [
                        h('span', {}, `是否为ICCID`),
                        h(NTag, { type: 'primary' }, detail.value.iccid),
                        h('span', {}, `创建充值订单？`),
                    ]),
                    h('div', {}, `组合商品名称：`),
                    h('div', {}, detail.value.detail.combine_item_name_split),
                ]);
            },
            positiveText: '确定',
            negativeText: '再想一想',
            onPositiveClick: async () => {
                try {
                    await createRechargeOrder(detail.value.iccid);
                } catch (e) {
                    console.log(e);
                } finally {
                    await getDetail();
                }
            },
        });
    }

    async function reSync() {
        await refreshDeliveryDetail(detail.value.detail.delivery.code);
        await getDetail();
    }

    async function getDetail() {
        const res = await getDeliveryDetail(iccid.value as string);

        detail.value = res.detailItem;
        records.value = res.rechargeRecords;
    }

    onMounted(async () => {
        await getDetail();
    });
</script>

<style lang="less" scoped>
    .n-descriptions {
        margin-bottom: 20px;
    }
</style>
