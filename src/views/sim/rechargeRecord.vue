<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns" :driver="driver" />
        <basic-table
            ref="table"
            :columns="columns"
            :request="driver.loadDataTable"
            :actionColumn="driver.actionColumn"
            :row-key="(row: RowData) => row.id"
            :scroll-x="1090"
        />
    </n-card>
</template>

<script lang="ts" setup>
    import { h, ref } from 'vue';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import { getRechargeList } from '@/api/delivery';
    import { NTag } from 'naive-ui';

    interface RowData extends TableDataRow {
        code: string;
        platform_code: string;
        iccid: string;
        auto: number;
        status: number;
        create_time: string;
    }

    const autoMap = { '0': '人工充值', '1': '自动充值' };
    const autoType = { '0': 'warning', '1': 'success' };
    const statusMap = { '0': '失败', '1': '成功' };
    const statusType = { '0': 'error', '1': 'success' };

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '金蝶订单号', key: 'code', search: { type: 'input' } },
        { title: '平台订单号', key: 'platform_code', search: { type: 'input' } },
        { title: 'ICCID', key: 'iccid', search: { type: 'input' } },
        {
            title: '充值方式',
            key: 'auto',
            search: { type: 'select', selectData: autoMap },
            render(row: RowData) {
                return h(
                    NTag,
                    { type: autoType[row.auto.toString()] },
                    {
                        default: () => autoMap[row.auto.toString()],
                    }
                );
            },
        },
        {
            title: '充值结果',
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
        { title: '充值时间', key: 'create_time', search: { type: 'datetime' } },
    ];

    const driver = tableDriver<RowData>({
        table,
        loadApi: getRechargeList,
        actionWidth: 180,
        detailPage: 'sim_deliveryDetail',
        detailParams: (record: RowData) => {
            return {
                iccid: record.iccid,
                tab: '2',
            };
        },
    });
</script>

<style lang="less" scoped></style>
