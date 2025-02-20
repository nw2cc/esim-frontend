import { TableDataResponse, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
import { StringKeyDict } from '@/core/utils/obj';

interface RemoteResp {
    code: number;
    msg: string;
    rows: TableDataRow[];
    total: string;
}

export function transListResp(params: StringKeyDict, res: RemoteResp): Promise<TableDataResponse<any>> {
    return new Promise((resolve) => {
        resolve({
            list: res.rows,
            page: params.pageNum,
            pageSize: params.pageSize,
            pageCount: Math.ceil(Number(res.total) / params.pageSize),
            itemCount: Number(res.total),
        });
    });
}
