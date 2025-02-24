<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns.slice(0, 2)" :driver="driver" />
        <basic-table
            ref="table"
            :columns="columns"
            :request="driver.loadDataTable"
            :row-key="(row: RowData) => row.id"
            :actionColumn="driver.actionColumn"
            :scroll-x="2700"
        >
            <template #tableTitle>
                <button-plus type="primary" @click="driver.addData">新建订单</button-plus>
            </template>
        </basic-table>
        <table-edit-modal
            :page-title="pageTitle"
            :driver="driver"
            @create-new-data="createNewData"
            @commit-edit-data="commitEditData"
            @modal-show="(val: boolean) => (driver.showModal.value = val)"
        >
            <n-form-item label="订单编号">
                <n-input v-model:value="formData.orderId" placeholder="请输入订单编号" />
            </n-form-item>

            <n-form-item label="店铺名称">
                <n-input v-model:value="formData.shop" placeholder="请输入店铺名称" />
            </n-form-item>

            <n-form-item label="订单方式">
                <n-select
                    :options="[
                        { label: '线上', value: '线上' },
                        { label: '线下', value: '线下' },
                    ]"
                    v-model:value="formData.orderMethod"
                    placeholder="请选择订单方式"
                />
            </n-form-item>

            <n-form-item label="套餐方案">
                <n-input v-model:value="formData.packageMethod" placeholder="请输入套餐方案" />
            </n-form-item>

            <n-form-item label="商品选项货号">
                <n-input v-model:value="formData.productCode" placeholder="请输入商品选项货号" />
            </n-form-item>

            <n-form-item label="ICCID">
                <n-input v-model:value="formData.iccid" placeholder="请输入ICCID" />
            </n-form-item>

            <n-form-item label="启用码">
                <n-input v-model:value="formData.activationCode" placeholder="请输入启用码" />
            </n-form-item>

            <n-form-item label="使用日期">
                <n-date-picker
                    v-model:value="formData.usageDate"
                    placeholder="请选择使用日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                />
            </n-form-item>

            <n-form-item label="邮箱">
                <n-input v-model:value="formData.email" placeholder="请输入邮箱" />
            </n-form-item>

            <n-form-item label="订单金额">
                <n-input v-model:value="formData.orderAmount" placeholder="请输入订单金额" />
            </n-form-item>

            <n-form-item label="换算人民币">
                <n-input v-model:value="formData.convertedRMB" placeholder="请输入换算人民币" />
            </n-form-item>

            <n-form-item label="充值金额">
                <n-input v-model:value="formData.rechargeAmount" placeholder="请输入充值金额" />
            </n-form-item>

            <n-form-item label="开启状态">
                <n-select
                    :options="[
                        { label: '已发送激活', value: '已发送激活' },
                        { label: '未激活', value: '未激活' },
                    ]"
                    v-model:value="formData.status"
                    placeholder="请选择开启状态"
                />
            </n-form-item>
        </table-edit-modal>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useDialog } from 'naive-ui';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { fixedTableColumn, TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import ButtonPlus from '@/components/Buttons/ButtonPlus.vue';
    import TableEditModal from '@/views/_base/tableDriver/components/TableEditModal.vue';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';

    // mock
    import { loadOrderList, addOrder, updateOrder, deleteOrder } from '@/api/mock/order';

    interface RowData extends TableDataRow {
        role_id: string;
        role_name?: string;
        user_name: string;
        password?: string;
    }

    const pageTitle = '订单管理';

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '订单编号', key: 'orderId' },
        { title: '店铺名称', key: 'shop' },
        { title: '订单方式', key: 'orderMethod' },
        { title: '套餐方案', key: 'packageMethod' },
        { title: '商品选项货号', key: 'productCode' },
        { title: 'ICCID', key: 'iccid' },
        { title: '启用码', key: 'activationCode' },
        { title: '使用日期', key: 'usageDate' },
        { title: '邮箱', key: 'email' },
        { title: '订单金额', key: 'orderAmount' },
        { title: '换算人民币', key: 'convertedRMB' },
        { title: '充值金额', key: 'rechargeAmount' },
        { title: '开启状态', key: 'status' },
        ...fixedTableColumn(), // 如果有额外的固定列
    ];

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: loadOrderList,
        newForm: () => {
            return {
                role_id: '',
                user_name: '',
            };
        },
        editRow: true,
        deleteRow: async (record: RowData) => {
            dialog.warning({
                title: `删除${pageTitle}`,
                content: `确定${pageTitle}？`,
                positiveText: '确定',
                negativeText: '再想一想',
                onPositiveClick: async () => {
                    await deleteOrder(record?.id);
                    table.value.reload();
                },
            });
        },
    });
    const formData = computed(() => driver.formData.value);

    async function createNewData() {
        console.log('formData.value', formData.value);
        await addOrder(formData.value);

        driver.showModal.value = false;
        table.value.reload();
    }

    async function commitEditData() {
        dialog.warning({
            title: `修改${pageTitle}`,
            content: `确定修改${pageTitle}？`,
            positiveText: '确定',
            negativeText: '再想一想',
            onPositiveClick: async () => {
                console.log('formData.value', formData.value);
                await updateOrder(formData.value.id, { ...formData.value });

                driver.showModal.value = false;
                table.value.reload();
            },
        });
    }
</script>

<style lang="less" scoped></style>
