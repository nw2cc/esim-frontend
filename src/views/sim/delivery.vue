<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns" :driver="driver" />
        <basic-table
            ref="table"
            :columns="buildCols()"
            :request="driver.loadDataTable"
            :actionColumn="driver.actionColumn"
            :row-key="(row: RowData) => row.id"
            :scroll-x="columns.length * 200 + driver.actionWidth"
        />
    </n-card>
</template>

<script lang="ts" setup>
    import { h, ref } from 'vue';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { ActionItem, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import { createRechargeOrder, getDeliveryItems } from '@/api/delivery';
    import { Wallet } from '@icon-park/vue-next';
    import { NSpace, NTag, useDialog } from 'naive-ui';

    const statusMap = { '0': '未充值', '1': '已充值' };
    const statusType = { '0': 'warning', '1': 'success' };

    interface RowData extends TableDataRow {
        iccid: string;
    }

    const table = ref();
    const columns = [
        { title: '金蝶订单号', render: (n: any) => n.detail.delivery.code, fixed: 'left' },
        {
            title: '平台订单号',
            key: 'platform_code',
            render: (n: any) => n.detail.platform_code,
            fixed: 'left',
            search: { type: 'input' },
        },
        { title: 'ICCID', key: 'iccid', fixed: 'left', search: { type: 'input' } },

        { title: '商品数量', render: (n: any) => n.detail.qty },
        { title: '实际单价', render: (n: any) => n.detail.price },
        { title: '商品总价', render: (n: any) => n.detail.amount },
        { title: '让利金额', render: (n: any) => n.detail.discount_fee },
        { title: '让利后金额', render: (n: any) => n.detail.amount_after },
        { title: '物流成本', render: (n: any) => n.detail.post_cost },
        { title: '商品代码', render: (n: any) => n.detail.item_code },
        { title: '商品名称', render: (n: any) => n.detail.item_name },
        { title: '组合商品代码', render: (n: any) => n.detail.combine_item_code_split },
        { title: '组合商品名称', render: (n: any) => n.detail.combine_item_name_split },
        { title: '平台商品名称', render: (n: any) => n.detail.platform_item_name },
        { title: '平台规格名称', render: (n: any) => n.detail.platform_sku_name },

        { title: '同步时间', render: (n: any) => n.detail.delivery.sync_time },
        { title: '创建时间', render: (n: any) => n.detail.delivery.create_date },
        { title: '修改时间', render: (n: any) => n.detail.delivery.modify_date },
        { title: '物流单打印时间', render: (n: any) => n.detail.delivery.express_print_date },
        { title: '发货时间', render: (n: any) => n.detail.delivery.delivery_date },
        { title: '收货地区', render: (n: any) => n.detail.delivery.area_name },
        { title: '店铺名称', render: (n: any) => n.detail.delivery.shop_name },
        { title: '仓库名称', render: (n: any) => n.detail.delivery.warehouse_name },
        { title: '平台类型', render: (n: any) => n.detail.delivery.from_type_name },
        { title: '订单类型', render: (n: any) => n.detail.delivery.order_type_name },
        { title: '买家留言', render: (n: any) => n.detail.delivery.buyer_memo },
        { title: '收货人姓名', render: (n: any) => n.detail.delivery.receiver_name },
        { title: '收货人电话', render: (n: any) => n.detail.delivery.receiver_phone },
        { title: '收货人手机', render: (n: any) => n.detail.delivery.receiver_mobile },
        { title: '收货邮编', render: (n: any) => n.detail.delivery.receiver_zip },
        { title: '收货地址', render: (n: any) => n.detail.delivery.receiver_address },
        { title: '快递单号', render: (n: any) => n.detail.delivery.express_no },

        { title: 'PIN', key: 'pin' },
        { title: 'PUK', key: 'puk' },
        { title: '手机号码', key: 'tel' },
        { title: '供应商', key: 'vendor' },
        { title: '采购批次', key: 'lot' },
        { title: '采购序号', key: 'psn' },
        { title: '有效期', key: 'exp' },
        {
            title: '状态',
            key: 'status',
            width: '100px',
            fixed: 'right',
            search: { type: 'select', selectData: statusMap },
            render(row: RowData) {
                return h(
                    NTag,
                    { type: statusType[row.status.toString()] },
                    {
                        default: () => statusMap[row.status.toString()],
                    }
                );
            },
        },
    ];

    function buildCols() {
        return columns.map((item, index) => {
            return { width: 200, key: `key${index}`, ...item };
        });
    }

    async function recharge(record: RowData) {
        dialog.info({
            title: `创建充值订单`,
            content: () => {
                return h('div', {}, [
                    h(NSpace, { align: 'center' }, [
                        h('span', {}, `是否为ICCID`),
                        h(NTag, { type: 'primary' }, record.iccid),
                        h('span', {}, `创建充值订单？`),
                    ]),
                    h('div', {}, `组合商品名称：`),
                    h('div', {}, record.detail.combine_item_name_split),
                ]);
            },
            positiveText: '确定',
            negativeText: '再想一想',
            onPositiveClick: async () => {
                await createRechargeOrder(record.iccid);
                table.value.reload();
            },
        });
    }

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: getDeliveryItems,
        actionWidth: 260,
        actions: (record: RowData) => {
            const actions: ActionItem<RowData>[] = [];

            if (record.status == 0) {
                actions.push({
                    label: '充值',
                    type: 'primary',
                    icon: h(Wallet),
                    onClick: recharge.bind(null, record),
                });
            }

            return actions;
        },
        detailPage: 'sim_deliveryDetail',
        detailParams: (record: RowData) => {
            return {
                iccid: record.iccid,
                tab: '1',
            };
        },
    });
</script>

<style lang="less" scoped></style>
