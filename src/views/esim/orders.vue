<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns" :driver="driver" />
        <basic-table
            ref="table"
            :columns="columns"
            :request="driver.loadDataTable"
            :row-key="(row: RowData) => row.id"
            :scroll-x="1090"
        />
    </n-card>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import { getKingdeeOrders } from '@/api/record';

    interface RowData extends TableDataRow {
        code: string;
        create_time: string;
        modify_time: string;
        deal_time: string;
        pay_time: string;
    }

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '金蝶订单号', key: 'code', search: { type: 'input' } },
        { title: '创建时间', key: 'create_time', search: { type: 'datetime' } },
        { title: '更新时间', key: 'modify_time', search: { type: 'datetime' } },
        { title: '交易开始时间', key: 'deal_time', search: { type: 'datetime' } },
        { title: '支付时间', key: 'pay_time', search: { type: 'datetime' } },
    ];

    const driver = tableDriver<RowData>({
        table,
        loadApi: getKingdeeOrders,
    });
</script>

<style lang="less" scoped></style>
