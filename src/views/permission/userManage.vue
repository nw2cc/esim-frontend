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
            <n-form-item label="绑定角色">
                <n-select :options="rolesOptions" v-model:value="formData.role_id" placeholder="请选择角色" />
            </n-form-item>
            <n-form-item label="用户名">
                <n-input v-model:value="formData.username" />
            </n-form-item>
        </table-edit-modal>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { useDialog } from 'naive-ui';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { fixedTableColumn, TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import ButtonPlus from '@/components/Buttons/ButtonPlus.vue';
    import TableEditModal from '@/views/_base/tableDriver/components/TableEditModal.vue';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import { createUser, deleteUser, getUserPage, updateUser } from '@/api/system/user';
    import { getAllRole } from '@/api/system/role';
    import { listToOptions, SelectorOption } from '@/core/utils/options';

    interface RowData extends TableDataRow {
        role_id: string;
        role_name?: string;
        username: string;
        password?: string;
    }

    const pageTitle = '用户配置';

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '用户名称', key: 'username' },
        { title: '系统角色', key: 'role_name' },
        ...fixedTableColumn(),
    ];

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: getUserPage,
        newForm: () => {
            return {
                role_id: '',
                username: '',
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
                    await deleteUser(record.id as string);
                    table.value.reload();
                },
            });
        },
    });
    const formData = computed(() => driver.formData.value);
    const rolesOptions = ref<SelectorOption[]>();

    async function createNewData() {
        await createUser(formData.value);

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
                await updateUser(formData.value);

                driver.showModal.value = false;
                table.value.reload();
            },
        });
    }

    onMounted(async () => {
        const roles = await getAllRole();
        rolesOptions.value = listToOptions(roles, 'id', 'role_name');
    });
</script>

<style lang="less" scoped></style>
