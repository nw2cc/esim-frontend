<template>
    <n-card :bordered="false" class="proCard" title="兑换记录详情">
        <template #header-extra>
            <n-space>
                <n-button v-if="detail.platform_name === 'RT'" type="primary" @click="updateOrder">
                    <template #icon>
                        <n-icon>
                            <search theme="outline" size="20" :strokeWidth="3" />
                        </n-icon>
                    </template>
                    更新订单详情
                </n-button>
                <n-button type="success" @click="getEid">
                    <template #icon>
                        <n-icon>
                            <search theme="outline" size="20" :strokeWidth="3" />
                        </n-icon>
                    </template>
                    查询 EID
                </n-button>
            </n-space>
        </template>

        <n-descriptions label-placement="left" bordered :column="3" size="small">
            <n-descriptions-item label="金蝶订单号">{{ detail.code }}</n-descriptions-item>
            <n-descriptions-item label="平台订单号">{{ detail.sub_code }}</n-descriptions-item>
            <n-descriptions-item label="平台商品码">{{ detail.platform_code }}</n-descriptions-item>
            <n-descriptions-item label="SKU ID">{{ detail.sku_id }}</n-descriptions-item>
            <n-descriptions-item label="SKU 名称" :span="2">{{ detail.sku_name }}</n-descriptions-item>
            <n-descriptions-item label="天数">{{ detail.days }}</n-descriptions-item>
            <n-descriptions-item label="数量">{{ detail.qty }}</n-descriptions-item>
            <n-descriptions-item label="平台名称">{{ detail.platform_name }}</n-descriptions-item>
            <n-descriptions-item label="收货邮箱">{{ detail.email }}</n-descriptions-item>
            <n-descriptions-item label="语言">{{ detail.language }}</n-descriptions-item>
            <n-descriptions-item label="状态">
                <n-tag :type="statusType[detail.status]">{{ statusMap[detail.status] }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="BatchID">{{ detail.batch_id }}</n-descriptions-item>
            <n-descriptions-item label="创建时间" :span="2">{{ detail.create_time }}</n-descriptions-item>
            <n-descriptions-item label="ICCID">{{ detail.iccid }}</n-descriptions-item>
            <n-descriptions-item label="EID">{{ detail.eid }}</n-descriptions-item>
        </n-descriptions>

        <!-- RT 平台的 eSIM 列表 -->
        <n-card v-if="detail.platform_name === 'RT' && esimList.length > 0" title="eSIM 列表" style="margin-top: 20px">
            <n-data-table :columns="esimColumns" :data="esimList" :pagination="false" :bordered="true" size="small" />
        </n-card>

        <n-card title="API返回" style="margin-top: 20px">
            <pre>{{ res_json || '无' }}</pre>
        </n-card>

        <n-card title="回调参数" style="margin-top: 20px">
            <pre>{{ trade_json || '无' }}</pre>
        </n-card>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref, h } from 'vue';
    import { useRoute } from 'vue-router';
    import {
        fetchEid,
        getDeliverRecordDetail,
        updateOrderDetail,
        suspendEsim,
        unsuspendEsim,
        cancelEsim,
        revokeEsim,
    } from '@/api/record';
    import { Search } from '@icon-park/vue-next';
    import { useMessage, NButton, NSpace } from 'naive-ui';

    const message = useMessage();
    const statusMap = { '0': '未开卡', '1': '已开卡', '2': '已发货', '99': 'MB99异常' };
    const statusType = { '0': 'warning', '1': 'info', '2': 'success', '99': 'error' };

    const route = useRoute();
    const id = ref(route.params.id);
    const detail = ref({});

    const res_json = computed(() => {
        if ('api_response' in detail.value) {
            return JSON.stringify(JSON.parse(detail.value.api_response as string), null, 2);
        }
        return '';
    });

    const trade_json = computed(() => {
        if ('trade_callback' in detail.value) {
            return JSON.stringify(JSON.parse(detail.value.trade_callback as string), null, 2);
        }
        return '';
    });

    // eSIM 列表数据
    const esimList = computed(() => {
        if ('api_response' in detail.value) {
            try {
                const apiResponse = JSON.parse(detail.value.api_response as string);
                return apiResponse?.all_esim_list || [];
            } catch {
                return [];
            }
        }
        return [];
    });

    // 处理暂停套餐
    async function handleSuspend(row: any) {
        try {
            const res = await suspendEsim({ esim_tran_no: row.esimTranNo });
            if (res.success === false) {
                message.error(res.errorMsg);
            } else {
                message.success('操作成功');
                // 成功后更新订单详情
                await updateOrder();
            }
        } catch (error) {
            message.error('操作失败');
            console.error(error);
        }
    }

    // 处理重启套餐
    async function handleUnsuspend(row: any) {
        try {
            const res = await unsuspendEsim({ esim_tran_no: row.esimTranNo });
            if (res.success === false) {
                message.error(res.errorMsg);
            } else {
                message.success('操作成功');
                // 成功后更新订单详情
                await updateOrder();
            }
        } catch (error) {
            message.error('操作失败');
            console.error(error);
        }
    }

    // 处理取消套餐
    async function handleCancel(row: any) {
        try {
            const res = await cancelEsim({ esim_tran_no: row.esimTranNo });
            if (res.success === false) {
                message.error(res.errorMsg);
            } else {
                message.success('操作成功');
                // 成功后更新订单详情
                await updateOrder();
            }
        } catch (error) {
            message.error('操作失败');
            console.error(error);
        }
    }

    // 处理强制停卡
    async function handleRevoke(row: any) {
        try {
            const res = await revokeEsim({ esim_tran_no: row.esimTranNo });
            if (res.success === false) {
                message.error(res.errorMsg);
            } else {
                message.success('操作成功');
                // 成功后更新订单详情
                await updateOrder();
            }
        } catch (error) {
            message.error('操作失败');
            console.error(error);
        }
    }

    // 表格列定义
    const esimColumns = [
        {
            title: 'eSIM 交易号',
            key: 'esimTranNo',
            width: 150,
        },
        {
            title: 'ICCID',
            key: 'iccid',
            width: 200,
        },
        {
            title: 'EID',
            key: 'eid',
            width: 200,
        },
        {
            title: 'SMDP 状态',
            key: 'smdpStatus',
            width: 150,
        },
        {
            title: 'eSIM 状态',
            key: 'esimStatus',
            width: 150,
        },
        {
            title: '用量',
            key: 'orderUsage',
            width: 120,
        },
        {
            title: '总量',
            key: 'totalVolume',
            width: 120,
        },
        {
            title: '操作',
            key: 'actions',
            fixed: 'right' as const,
            width: 330,
            render(row: any) {
                return h(
                    NSpace,
                    {},
                    {
                        default: () => [
                            h(
                                NButton,
                                {
                                    size: 'small',
                                    type: 'warning',
                                    onClick: () => handleSuspend(row),
                                },
                                { default: () => '暂停套餐' }
                            ),
                            h(
                                NButton,
                                {
                                    size: 'small',
                                    type: 'success',
                                    onClick: () => handleUnsuspend(row),
                                },
                                { default: () => '重启套餐' }
                            ),
                            h(
                                NButton,
                                {
                                    size: 'small',
                                    type: 'error',
                                    onClick: () => handleCancel(row),
                                },
                                { default: () => '取消套餐' }
                            ),
                            h(
                                NButton,
                                {
                                    size: 'small',
                                    type: 'error',
                                    onClick: () => handleRevoke(row),
                                },
                                { default: () => '强制停卡' }
                            ),
                        ],
                    }
                );
            },
        },
    ];

    async function getEid() {
        detail.value = await fetchEid(id.value as string);
    }

    async function updateOrder() {
        try {
            // 从 api_response 中获取 order_no
            if (!detail.value.api_response) {
                message.error('无法获取订单信息');
                return;
            }

            const apiResponse = JSON.parse(detail.value.api_response as string);
            const orderNo = apiResponse?.order?.obj?.orderNo;

            if (!orderNo) {
                message.error('无法获取订单号');
                return;
            }

            const res = await updateOrderDetail({
                id: id.value,
                order_no: orderNo,
            });

            if (res.code === 200) {
                message.success(res.message || '更新成功');
                // 重新获取详情
                detail.value = await getDeliverRecordDetail(id.value as string);
            } else {
                message.error(res.message || '更新失败');
            }
        } catch (error) {
            message.error('更新失败');
            console.error(error);
        }
    }

    onMounted(async () => {
        detail.value = await getDeliverRecordDetail(id.value as string);
    });
</script>

<style lang="less" scoped></style>
