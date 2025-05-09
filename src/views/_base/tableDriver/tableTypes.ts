import { Ref } from 'vue';
import { StringKeyDict } from '@/core/utils/obj';

export type ColumnSearchType = 'input' | 'select' | 'datetime';

export interface TableDataRow {
    id?: string;
    remark?: string;
    create_time?: string;
    update_time?: string;

    [key: string]: any;
}

export interface TableDataColumnSearch {
    type?: ColumnSearchType;
    selectData?: { [key: string | number]: string };
    disabled?: boolean;
}

export interface TableDataColumn<T extends TableDataRow> {
    title: string;
    key: keyof T;
    search?: TableDataColumnSearch;

    [key: string]: any;
}

export interface TableDataRequest {
    page: number;
    pageSize: number;
}

export interface TableDataResponse<T extends TableDataRow> {
    list: T[];
    page: number;
    pageSize: number;
    pageCount: number;
    itemCount: number;
}

export interface ActionItem<T extends TableDataRow> {
    label: string;
    type?: string;
    icon: any;
    onClick: (record: T) => Promise<void>;
}

export interface TableDriverConfig<T extends TableDataRow> {
    table: Ref<any>;
    loadApi: (req: StringKeyDict) => Promise<TableDataResponse<T>>;
    newForm?: () => T;
    editRow?: boolean | ((record: T) => Promise<T>);
    deleteRow?: (record: T) => Promise<void>;
    detailPage?: string;
    detailParams?: (record: T) => Record<string, any>;
    actions?: (record: T) => ActionItem<T>[];
}

export interface TableDriver<T extends TableDataRow> {
    table: Ref<any>;
    setSearchData: (data: StringKeyDict) => void;
    formData: Ref<T>;
    showModal: Ref<boolean>;
    actionStatus: Ref<number>;
    actionColumn: any;
    addData: () => void;
    editData: (record: T) => Promise<void>;
    showDetail: (record: T) => Promise<void>;
    loadDataTable: (req: TableDataRequest) => Promise<TableDataResponse<T>>;
}

export function fixedTableColumn<T extends TableDataRow>(): TableDataColumn<T>[] {
    return [
        { title: '创建时间', key: 'create_time', search: { disabled: true } },
        { title: '修改时间', key: 'update_time', search: { disabled: true } },
        { title: '备注', key: 'remark', search: { type: 'input' } },
    ];
}
