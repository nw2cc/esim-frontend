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
        >
            <template #tableTitle>
                <button-plus type="primary" @click="driver.addData">新建{{ pageTitle }}</button-plus>
            </template>
        </basic-table>
        <table-edit-modal
            :page-title="pageTitle"
            :driver="driver"
            @create-new-data="createNewData"
            @commit-edit-data="commitEditData"
            @modal-show="(val: boolean) => (driver.showModal.value = val)"
        >
            <n-form-item label="SKU字符串" path="sku_str">
                <n-input v-model:value="formData.sku_str" placeholder="请输入SKU字符串" />
            </n-form-item>
            <n-form-item label="替换字符串" path="replace_str">
                <n-input v-model:value="formData.replace_str" placeholder="请输入替换字符串" />
            </n-form-item>
            <n-form-item label="启用状态" path="enable">
                <n-select v-model:value="formData.enable" :options="enableOptions" placeholder="请选择启用状态" />
            </n-form-item>
            <n-form-item label="备注" path="remark">
                <n-input
                    v-model:value="formData.remark"
                    type="textarea"
                    placeholder="请输入备注"
                    :rows="3"
                    :maxlength="500"
                    show-count
                />
            </n-form-item>
        </table-edit-modal>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useDialog, NTag } from 'naive-ui';
    import { h } from 'vue';
    import dayjs from 'dayjs';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import ButtonPlus from '@/components/Buttons/ButtonPlus.vue';
    import TableEditModal from '@/views/_base/tableDriver/components/TableEditModal.vue';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import {
        createSkuReplace,
        deleteSkuReplace,
        getSkuReplacePage,
        updateSkuReplace,
        getSkuReplaceExport,
    } from '@/api/sku';

    interface RowData extends TableDataRow {
        sku_str: string;
        replace_str: string;
        enable: number;
        remark?: string;
    }

    const pageTitle = 'SKU替换';

    const $message = window['$message'];

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: 'SKU字符串', key: 'sku_str', search: { type: 'input' } },
        { title: '替换字符串', key: 'replace_str', search: { type: 'input' } },
        {
            title: '启用状态',
            key: 'enable',
            search: { type: 'select', selectData: { '1': '启用', '0': '禁用' } },
            render(row: RowData) {
                return h(
                    NTag,
                    { type: row.enable === 1 ? 'success' : 'error' },
                    {
                        default: () => (row.enable === 1 ? '启用' : '禁用'),
                    }
                );
            },
        },
        {
            title: '创建时间',
            key: 'create_time',
            search: { disabled: true },
            render(row: RowData) {
                return row.create_time ? dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss') : '-';
            },
        },
        {
            title: '修改时间',
            key: 'update_time',
            search: { disabled: true },
            render(row: RowData) {
                return row.update_time ? dayjs(row.update_time).format('YYYY-MM-DD HH:mm:ss') : '-';
            },
        },
        { title: '备注', key: 'remark', search: { type: 'input' } },
    ];

    const enableOptions = [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
    ];

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: getSkuReplacePage,
        exportApi: getSkuReplaceExport,
        newForm: () => {
            return {
                sku_str: '',
                replace_str: '',
                enable: 1,
                remark: '',
            };
        },
        editRow: true,
        deleteRow: async (record: RowData) => {
            dialog.warning({
                title: `删除${pageTitle}`,
                content: `确定删除${pageTitle}？`,
                positiveText: '确定',
                negativeText: '再想一想',
                onPositiveClick: async () => {
                    try {
                        await deleteSkuReplace(Number(record.id));
                        $message.success('删除成功');
                        table.value.reload();
                    } catch (error: any) {
                        $message.error(error.message || '删除失败');
                    }
                },
            });
        },
    });
    const formData = computed(() => driver.formData.value);

    async function createNewData() {
        try {
            await createSkuReplace(formData.value);
            $message.success('创建成功');
            driver.showModal.value = false;
            table.value.reload();
        } catch (error: any) {
            $message.error(error.message || '创建失败');
        }
    }

    async function commitEditData() {
        dialog.warning({
            title: `修改${pageTitle}`,
            content: `确定修改${pageTitle}？`,
            positiveText: '确定',
            negativeText: '再想一想',
            onPositiveClick: async () => {
                try {
                    await updateSkuReplace(formData.value);
                    $message.success('修改成功');
                    driver.showModal.value = false;
                    table.value.reload();
                } catch (error: any) {
                    $message.error(error.message || '修改失败');
                }
            },
        });
    }
</script>

<style lang="less" scoped></style>
