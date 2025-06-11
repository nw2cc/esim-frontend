import { h, reactive, Ref, ref } from 'vue';
import { TableAction } from '@/components/Table';
import { Delete, Edit, Info, EmailBlock } from '@icon-park/vue-next';
import { deepCopy, StringKeyDict } from '@/core/utils/obj';
import { useRouter } from 'vue-router';
import {
    TableDataRequest,
    TableDataResponse,
    TableDataRow,
    TableDriver,
    TableDriverConfig,
} from '@/views/_base/tableDriver/tableTypes';

export function tableDriver<T extends TableDataRow>(config: TableDriverConfig<T>): TableDriver<T> {
    const router = useRouter();

    const formData = ref<T>(newData()) as Ref<T>;
    const searchData = ref<StringKeyDict>({});

    const showModal = ref(false);
    const actionStatus = ref(0);
    const actionColumn = reactive({
        title: '操作',
        width: config.actionWidth || '',
        key: 'action',
        fixed: 'right',
        render(record: T) {
            const actions = [...(config.actions ? config.actions(record) : [])];
            if (config.editRow) {
                actions.push({
                    label: '修改',
                    type: 'primary',
                    icon: h(Edit),
                    onClick: editData.bind(null, record),
                });
            }
            if (config.deleteRow) {
                actions.push({
                    label: '删除',
                    type: 'error',
                    icon: h(Delete),
                    onClick: config.deleteRow.bind(null, record),
                });
            }
            if (config.detailPage) {
                actions.push({
                    label: '查看详情',
                    icon: h(Info),
                    onClick: showDetail.bind(null, record),
                });
            }
            if (config.resend) {
                actions.push({
                    label: '重发邮箱',
                    icon: h(EmailBlock),
                    onClick: config.resend.bind(null, record),
                });
            }
            return h(TableAction as any, {
                style: 'button',
                actions: actions,
            });
        },
    });

    function newData() {
        return config.newForm ? config.newForm() : ({} as T);
    }

    function addData() {
        actionStatus.value = 0;
        formData.value = newData();
        showModal.value = true;
    }

    async function editData(record: T) {
        actionStatus.value = 1;
        let rec: T = deepCopy<T>(record);
        if (typeof config.editRow === 'function') {
            rec = await config.editRow(rec);
        }
        formData.value = rec;
        showModal.value = true;
    }

    async function showDetail(record: T) {
        let params = {};
        if (config.detailParams) {
            params = config.detailParams(record);
        }
        await router.push({
            name: config.detailPage,
            params: { id: record.id, ...params },
        });
    }

    async function loadDataTable(req: TableDataRequest): Promise<TableDataResponse<T>> {
        const params = {
            pageNum: req.page,
            pageSize: req.pageSize,
            ...searchData.value,
        };
        return await config.loadApi({ ...params });
    }

    async function exportDataTable(): Promise<Blob> {
        if (!config.exportApi) {
            throw new Error('exportApi is not defined');
        }
        const params = {
            export: true,
            ...searchData.value,
        };
        return await config.exportApi({ ...params });
    }

    return {
        table: config.table,
        setSearchData: (data: StringKeyDict) => {
            searchData.value = data;
        },
        formData,
        showModal,
        actionStatus,
        actionColumn,
        addData,
        editData,
        showDetail,
        loadDataTable,
        exportDataTable,
    };
}
