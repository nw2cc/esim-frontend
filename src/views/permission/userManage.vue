<template>
    <n-card :bordered="false" class="proCard">
        <table-search :columns="columns" :driver="driver" />
        <basic-table
            ref="table"
            :columns="columns"
            :request="driver.loadDataTable"
            :row-key="(row: RowData) => row.id"
            :actionColumn="driver.actionColumn"
            :scroll-x="1090"
        >
            <template #tableTitle>
                <button-plus type="primary" @click="driver.addData"> 新建{{ pageTitle }}</button-plus>
            </template>
        </basic-table>
        <table-edit-modal
            :page-title="pageTitle"
            :driver="driver"
            @create-new-data="createNewData"
            @commit-edit-data="commitEditData"
            @modal-show="(val: boolean) => (driver.showModal.value = val)"
        >
            <n-form-item label="绑定角色">
                <n-select
                    :options="[
                        { label: '管理员', value: 1 },
                        { label: '普通用户', value: 2 },
                        { label: '访客', value: 3 },
                    ]"
                    v-model:value="formData.role_id"
                    placeholder="请选择角色"
                />
            </n-form-item>
            <n-form-item label="用户名">
                <n-input v-model:value="formData.user_name" />
            </n-form-item>
        </table-edit-modal>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useDialog } from 'naive-ui';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { fixedTableColumn, TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { fakeCreateApi, fakeDeleteApi, fakeEditApi, fakeLoadApi } from '@/api/testing';
    import { BasicTable } from '@/components/Table';
    import ButtonPlus from '@/components/Buttons/ButtonPlus.vue';
    import TableEditModal from '@/views/_base/tableDriver/components/TableEditModal.vue';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';

    // mock
    import { loadUserList, addUser, updateUser, deleteUser } from '@/api/mock/user';

    interface RowData extends TableDataRow {
        role_id: string;
        role_name?: string;
        user_name: string;
        password?: string;
    }

    const pageTitle = '用户配置';

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '用户名称', key: 'user_name' },
        { title: '系统角色', key: 'role_name' },
        ...fixedTableColumn(),
    ];

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: loadUserList,
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
                    await deleteUser(record?.id);
                    table.value.reload();
                },
            });
        },
    });
    const formData = computed(() => driver.formData.value);

    async function createNewData() {
        await addUser(formData.value);

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
                await updateUser(formData.value.id, { ...formData.value });

                driver.showModal.value = false;
                table.value.reload();
            },
        });
    }
</script>

<style lang="less" scoped></style>
