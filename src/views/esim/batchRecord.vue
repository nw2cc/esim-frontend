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
    import { getBatchRecord } from '@/api/record';

    interface RowData extends TableDataRow {
        batch_id: string;
        sub_codes: string;
    }

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: 'batch_id', key: 'batch_id', search: { type: 'input' } },
        { title: 'sub_codes', key: 'sub_codes', search: { type: 'input' } },
    ];

    const driver = tableDriver<RowData>({
        table,
        loadApi: getBatchRecord,
    });
</script>

<style lang="less" scoped></style>
