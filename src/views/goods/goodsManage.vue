<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns.slice(0, 2)" :driver="driver" />
        <basic-table
            ref="table"
            :columns="columns"
            :request="driver.loadDataTable"
            :row-key="(row: RowData) => row.id"
            :actionColumn="driver.actionColumn"
            :scroll-x="2000"
        >
            <template #tableTitle>
                <button-plus type="primary" @click="driver.addData">新建商品</button-plus>
            </template>
        </basic-table>
        <table-edit-modal
            :page-title="pageTitle"
            :driver="driver"
            @create-new-data="createNewData"
            @commit-edit-data="commitEditData"
            @modal-show="(val: boolean) => (driver.showModal.value = val)"
        >
            <n-form-item label="商品名称">
                <n-input v-model:value="formData.name" placeholder="请输入商品名称" />
            </n-form-item>

            <n-form-item label="商品类别">
                <n-select
                    :options="[
                        { label: 'eSIM 国际数据卡', value: 'eSIM 国际数据卡' },
                        { label: 'eSIM 海外上网卡', value: 'eSIM 海外上网卡' },
                        { label: 'eSIM 国内流量卡', value: 'eSIM 国内流量卡' },
                        { label: 'eSIM 套餐卡', value: 'eSIM 套餐卡' },
                        { label: 'eSIM 旅行套餐', value: 'eSIM 旅行套餐' },
                        { label: 'eSIM 全球数据卡', value: 'eSIM 全球数据卡' },
                        { label: 'eSIM 学生套餐', value: 'eSIM 学生套餐' },
                        { label: 'eSIM 无限流量卡', value: 'eSIM 无限流量卡' },
                        { label: 'eSIM 4G/5G 数据卡', value: 'eSIM 4G/5G 数据卡' },
                    ]"
                    v-model:value="formData.category"
                    placeholder="请选择商品类别"
                />
            </n-form-item>

            <n-form-item label="商品价格">
                <n-input-number v-model:value="formData.price" placeholder="请输入商品价格" :min="1" />
            </n-form-item>

            <n-form-item label="商品库存">
                <n-input-number v-model:value="formData.stock" placeholder="请输入商品库存" :min="1" />
            </n-form-item>

            <n-form-item label="商品状态">
                <n-select
                    :options="[
                        { label: '在售', value: '在售' },
                        { label: '下架', value: '下架' },
                    ]"
                    v-model:value="formData.status"
                    placeholder="请选择商品状态"
                />
            </n-form-item>

            <n-form-item label="商品描述">
                <n-input v-model:value="formData.description" placeholder="请输入商品描述" />
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
    import { loadGoodsList, addGood, updateGood, deleteGood } from '@/api/mock/goods';

    interface RowData extends TableDataRow {
        role_id: string;
        role_name?: string;
        user_name: string;
        password?: string;
    }

    const pageTitle = '商品管理';

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '商品编号', key: 'id' },
        { title: '商品名称', key: 'name' },
        { title: '类别', key: 'category' },
        { title: '价格', key: 'price' },
        { title: '库存', key: 'stock' },
        { title: '商品状态', key: 'status' },
        { title: '商品描述', key: 'description' },
        { title: '创建时间', key: 'create_time' },
        { title: '更新时间', key: 'update_time' },
        ...fixedTableColumn(), // 如果有额外的固定列
    ];

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: loadGoodsList,
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
                    await deleteGood(record?.id);
                    table.value.reload();
                },
            });
        },
    });
    const formData = computed(() => driver.formData.value);

    async function createNewData() {
        console.log('formData.value', formData.value);
        await addGood(formData.value);

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
                await updateGood(formData.value.id, { ...formData.value });

                driver.showModal.value = false;
                table.value.reload();
            },
        });
    }
</script>

<style lang="less" scoped></style>
