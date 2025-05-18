import { computed, ComputedRef, onMounted, ref, unref, watch, watchEffect } from 'vue';
import type { BasicTableProps } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import { isBoolean, isFunction } from '@/core/utils/is';
import { APISETTING } from '../const';
import { saveAs } from 'file-saver';

export function useDataSource(
    propsRef: ComputedRef<BasicTableProps>,
    { getPaginationInfo, setPagination, setLoading, tableData },
    emit
) {
    const dataSourceRef = ref<Recordable[]>([]);

    watchEffect(() => {
        tableData.value = unref(dataSourceRef);
    });

    watch(
        () => unref(propsRef).dataSource,
        () => {
            const { dataSource }: any = unref(propsRef);
            dataSource && (dataSourceRef.value = dataSource);
        },
        {
            immediate: true,
        }
    );

    const getRowKey = computed(() => {
        const { rowKey }: any = unref(propsRef);
        return rowKey
            ? rowKey
            : () => {
                  return 'key';
              };
    });

    const getDataSourceRef = computed(() => {
        const dataSource = unref(dataSourceRef);
        if (!dataSource || dataSource.length === 0) {
            return unref(dataSourceRef);
        }
        return unref(dataSourceRef);
    });

    async function fetch(opt?) {
        try {
            setLoading(true);
            const { request, pagination, beforeRequest, afterRequest }: any = unref(propsRef);
            if (!request) return;
            //组装分页信息
            const pageField = APISETTING.pageField;
            const sizeField = APISETTING.sizeField;
            const totalField = APISETTING.totalField;
            const listField = APISETTING.listField;
            const itemCount = APISETTING.countField;
            let pageParams = {};
            const { page = 1, pageSize = 10 } = unref(getPaginationInfo) as PaginationProps;

            if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
                pageParams = {};
            } else {
                pageParams[pageField] = (opt && opt[pageField]) || page;
                pageParams[sizeField] = pageSize;
            }

            let params = {
                ...pageParams,
                ...opt,
            };
            if (beforeRequest && isFunction(beforeRequest)) {
                // The params parameter can be modified by outsiders
                params = (await beforeRequest(params)) || params;
            }
            const res = await request(params);
            const resultTotal = res[totalField];
            const currentPage = res[pageField];
            const total = res[itemCount];
            // const results = res[listField] ? res[listField] : [];

            // 如果数据异常，需获取正确的页码再次执行
            if (resultTotal) {
                const currentTotalPage = Math.ceil(total / pageSize);
                if (page > currentTotalPage) {
                    setPagination({
                        page: currentTotalPage,
                        itemCount: total,
                    });
                    return await fetch(opt);
                }
            }
            let resultInfo = res[listField] ? res[listField] : [];
            if (afterRequest && isFunction(afterRequest)) {
                // can modify the data returned by the interface for processing
                resultInfo = (await afterRequest(resultInfo)) || resultInfo;
            }
            dataSourceRef.value = resultInfo;
            setPagination({
                page: currentPage,
                pageCount: resultTotal,
                itemCount: total,
            });
            if (opt && opt[pageField]) {
                setPagination({
                    page: opt[pageField] || 1,
                });
            }
            emit('fetch-success', {
                items: unref(resultInfo),
                resultTotal,
            });
        } catch (error) {
            console.error(error);
            emit('fetch-error', error);
            dataSourceRef.value = [];
            setPagination({
                pageCount: 0,
            });
        } finally {
            setLoading(false);
        }
    }

    onMounted(() => {
        setTimeout(() => {
            fetch();
        }, 16);
    });

    function setTableData(values) {
        dataSourceRef.value = values;
    }

    function getDataSource(): any[] {
        return getDataSourceRef.value;
    }

    async function reload(opt?) {
        await fetch(opt);
    }

    /**
     * 导出数据（后端返回二进制流，自动下载 xlsx 文件）
     * @param {Object} params - 导出参数
     * @param {String} filename - 下载文件名（可选，默认 export.xlsx）
     */
    async function exportData(filename = `${Date.now().valueOf()}.xlsx`) {
        setLoading(true);
        try {
            const { export: exportApi }: any = unref(propsRef);
            // fetchExportApi 需返回二进制流
            const response = await exportApi();
            console.log(response);
            // 兼容 axios/fetch 返回
            let blob;
            if (response instanceof Blob) {
                blob = response;
            } else if (response.data instanceof Blob) {
                blob = response.data;
            } else if (response instanceof ArrayBuffer) {
                blob = new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
            } else if (response.data instanceof ArrayBuffer) {
                blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
            } else {
                // fallback: try to create blob from response
                blob = new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
            }
            saveAs(blob, filename);
        } catch (error) {
            console.error('导出失败', error);
        } finally {
            setLoading(false);
        }
    }

    return {
        fetch,
        getRowKey,
        getDataSourceRef,
        getDataSource,
        setTableData,
        reload,
        exportData,
    };
}
