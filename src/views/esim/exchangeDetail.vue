<template>
    <n-card :bordered="false" class="proCard" title="兑换记录详情">
        <template #header-extra>
            <n-button type="success" @click="getEid">
                <template #icon>
                    <n-icon>
                        <search theme="outline" size="20" :strokeWidth="3" />
                    </n-icon>
                </template>
                查询 EID
            </n-button>
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

        <n-card title="API返回" style="margin-top: 20px">
            <pre>{{ res_json || '无' }}</pre>
        </n-card>

        <n-card title="回调参数" style="margin-top: 20px">
            <pre>{{ trade_json || '无' }}</pre>
        </n-card>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { fetchEid, getDeliverRecordDetail } from '@/api/record';
    import { Search } from '@icon-park/vue-next';

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

    async function getEid() {
        detail.value = await fetchEid(id.value as string);
    }

    onMounted(async () => {
        detail.value = await getDeliverRecordDetail(id.value as string);
    });
</script>

<style lang="less" scoped></style>
