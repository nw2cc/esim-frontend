<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns" :driver="driver" />
        <basic-table
            ref="table"
            :columns="buildCols()"
            :request="driver.loadDataTable"
            :row-key="(row: RowData) => row.id"
            :scroll-x="1090"
            virtual-scroll
        />
    </n-card>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import { getDeliveryItems } from '@/api/delivery';

    interface RowData extends TableDataRow {
        iccid: string;
    }

    const table = ref();
    const columns = [
        { title: 'code', render: (n: any) => n.detail.delivery.code },
        { title: 'create_date', render: (n: any) => n.detail.delivery.create_date },
        { title: 'modify_date', render: (n: any) => n.detail.delivery.modify_date },
        { title: 'express_print_date', render: (n: any) => n.detail.delivery.express_print_date },
        { title: 'delivery_date', render: (n: any) => n.detail.delivery.delivery_date },
        { title: 'area_name', render: (n: any) => n.detail.delivery.area_name },
        { title: 'shop_name', render: (n: any) => n.detail.delivery.shop_name },
        { title: 'warehouse_name', render: (n: any) => n.detail.delivery.warehouse_name },
        { title: 'from_type_name', render: (n: any) => n.detail.delivery.from_type_name },
        { title: 'order_type_name', render: (n: any) => n.detail.delivery.order_type_name },
        { title: 'buyer_memo', render: (n: any) => n.detail.delivery.buyer_memo },
        { title: 'receiver_name', render: (n: any) => n.detail.delivery.receiver_name },
        { title: 'receiver_phone', render: (n: any) => n.detail.delivery.receiver_phone },
        { title: 'receiver_mobile', render: (n: any) => n.detail.delivery.receiver_mobile },
        { title: 'receiver_zip', render: (n: any) => n.detail.delivery.receiver_zip },
        { title: 'receiver_address', render: (n: any) => n.detail.delivery.receiver_address },
        { title: 'express_no', render: (n: any) => n.detail.delivery.express_no },

        { title: 'platform_code', render: (n: any) => n.detail.platform_code },
        { title: 'qty', render: (n: any) => n.detail.qty },
        { title: 'price', render: (n: any) => n.detail.price },
        { title: 'amount', render: (n: any) => n.detail.amount },
        { title: 'discount_fee', render: (n: any) => n.detail.discount_fee },
        { title: 'amount_after', render: (n: any) => n.detail.amount_after },
        { title: 'post_cost', render: (n: any) => n.detail.post_cost },
        { title: 'item_code', render: (n: any) => n.detail.item_code },
        { title: 'item_name', render: (n: any) => n.detail.item_name },
        { title: 'platform_item_name', render: (n: any) => n.detail.platform_item_name },
        { title: 'platform_sku_name', render: (n: any) => n.detail.platform_sku_name },

        { title: 'iccid', key: 'iccid', search: { type: 'input' } },
        { title: 'pin', key: 'pin' },
        { title: 'puk', key: 'puk' },
        { title: 'tel', key: 'tel' },
        { title: 'vendor', key: 'vendor' },
        { title: 'lot', key: 'lot' },
        { title: 'psn', key: 'psn' },
        { title: 'exp', key: 'exp' },
    ];

    function buildCols(): TableDataColumn<RowData>[] {
        return columns.map((item, index) => {
            return { ...item, minWidth: 200, key: `key${index}` };
        });
    }

    const driver = tableDriver<RowData>({
        table,
        loadApi: getDeliveryItems,
    });
</script>

<style lang="less" scoped></style>
