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
                <button-plus type="primary" @click="driver.addData"> 新建{{ pageTitle }} </button-plus>
            </template>
        </basic-table>
        <table-edit-modal
            :page-title="pageTitle"
            :driver="driver"
            @create-new-data="createNewData"
            @commit-edit-data="commitEditData"
            @modal-show="(val: boolean) => (driver.showModal.value = val)"
        >
            <div class="role-edit">
                <div>
                    <n-form-item label="角色名称">
                        <n-input v-model:value="formData.role_name" />
                    </n-form-item>
                    <n-form-item label="超级管理员">
                        <n-switch v-model:value="formData.is_admin" />
                    </n-form-item>
                </div>
                <div class="permission-tree">
                    <n-transfer
                        v-model:value="formData.permissions"
                        :options="allData"
                        :render-source-list="renderSourceList"
                        source-filterable
                    />
                </div>
            </div>
        </table-edit-modal>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, h, ref } from 'vue';
    import { NTree, TransferRenderSourceList, TreeOption, useDialog } from 'naive-ui';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { fixedTableColumn, TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { fakeCreateApi, fakeLoadApi } from '@/api/testing';
    import { BasicTable } from '@/components/Table';
    import ButtonPlus from '@/components/Buttons/ButtonPlus.vue';
    import TableEditModal from '@/views/_base/tableDriver/components/TableEditModal.vue';
    import { getAllPermissions, getPermissionTree } from '@/router';
    import { PermissionTreeData } from '@/router/types';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';

    interface RowData extends TableDataRow {
        role_name: string;
        is_admin: boolean;
        permissions: string[];
    }

    const pageTitle = '角色配置';

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [{ title: '角色名称', key: 'role_name' }, ...fixedTableColumn()];

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: fakeLoadApi,
        newForm: () => {
            return {
                role_name: '',
                is_admin: false,
                permissions: [],
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
                    // await deleteApi(record);
                    table.value.reload();
                },
            });
        },
    });
    const formData = computed(() => driver.formData.value);

    const allData: PermissionTreeData[] = getAllPermissions();
    const treeData: PermissionTreeData[] = getPermissionTree();
    const renderSourceList: TransferRenderSourceList = function ({ onCheck, pattern }) {
        return h(NTree, {
            style: 'margin: 0 4px;',
            keyField: 'value',
            checkable: true,
            selectable: false,
            blockLine: true,
            expandOnClick: true,
            data: treeData as unknown as TreeOption[],
            pattern,
            checkedKeys: formData.value.permissions,
            onUpdateCheckedKeys: (checkedKeys: string[]) => {
                onCheck(checkedKeys);
            },
        });
    };

    async function createNewData() {
        await fakeCreateApi(formData.value);

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
                // await editApi({ ...driver.formData.value });

                driver.showModal.value = false;
                table.value.reload();
            },
        });
    }
</script>

<style lang="less" scoped>
    .role-edit {
        display: flex;
        margin-bottom: 20px;
    }

    .permission-tree {
        margin-left: 20px;
        width: 500px;
    }
</style>

<style lang="less">
    .permission-tree {
        .n-tree-node-switcher:not(.n-tree-node-switcher--hide) {
            & + .n-tree-node-checkbox {
                display: none;
            }
        }
    }
</style>
