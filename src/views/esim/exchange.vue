<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns" :driver="driver" />
        <basic-table
            ref="table"
            :columns="columns"
            :request="driver.loadDataTable"
            :export="driver.exportDataTable"
            :row-key="(row: RowData) => row.id"
            :actionColumn="driver.actionColumn"
            :scroll-x="1090"
            :exportable="true"
        />
    </n-card>
</template>

<script lang="ts" setup>
    import { h, ref } from 'vue';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import { getDeliverRecord, getDeliverRecordExport } from '@/api/record';
    import { NTag } from 'naive-ui';

    interface RowData extends TableDataRow {
        code: string;
        sub_code: string;
        platform_code: string;
        platform_name: string;
        sku_id: string;
        sku_name: string;
        days: string;
        qty: string;
        email: string;
        language: string;
        status: string;
        batch_id: string;
        create_time: string;
    }

    const statusMap = { '0': '未开卡', '1': '已开卡', '2': '已发货' };
    const statusType = { '0': 'warning', '1': 'info', '2': 'success' };

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '金蝶订单号', key: 'code', search: { type: 'input' } },
        { title: '渠道订单号', key: 'sub_code', search: { type: 'input' } },
        { title: '渠道商品码', key: 'platform_code', search: { type: 'input' } },
        { title: 'SKU ID', key: 'sku_id', search: { type: 'input' } },
        { title: 'SKU 名称', key: 'sku_name', search: { type: 'input' } },
        { title: '天数', key: 'days', search: { type: 'input' } },
        { title: '数量', key: 'qty', search: { type: 'input' } },
        { title: '邮箱', key: 'email', search: { type: 'input' } },
        {
            title: '状态',
            key: 'status',
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
        { title: '创建时间', key: 'create_time', search: { type: 'datetime' } },
    ];

    const driver = tableDriver<RowData>({
        table,
        loadApi: getDeliverRecord,
        exportApi: getDeliverRecordExport,
        detailPage: 'esim_exchangeDetail',
        detailParams: (record: RowData) => {
            return {
                name: record.sub_code,
            };
        },
    });
</script>

<style lang="less" scoped></style>
