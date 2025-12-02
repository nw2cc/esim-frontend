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
            :scroll-x="columns.length * 120"
            :exportable="true"
        >
            <template #tableTitle>
                <n-space>
                    <button-plus type="primary" @click="driver.addData">创建商品</button-plus>
                    <n-upload
                        :file-list="fileList"
                        :max="1"
                        accept=".xlsx,.xls,.csv"
                        :show-file-list="false"
                        :custom-request="handleImport"
                        :disabled="importLoading"
                        @change="handleFileChange"
                    >
                        <n-button type="info" :loading="importLoading">
                            <template #icon>
                                <n-icon>
                                    <Upload theme="outline" size="20" :strokeWidth="3" />
                                </n-icon>
                            </template>
                            导入商品
                        </n-button>
                    </n-upload>
                </n-space>
            </template>
        </basic-table>
        <table-edit-modal
            :page-title="pageTitle"
            :driver="driver"
            @create-new-data="createNewData"
            @commit-edit-data="commitEditData"
            @modal-show="(val: boolean) => (driver.showModal.value = val)"
        >
            <template #default>
                <n-collapse :default-expanded-names="['basic', 'spec', 'price']">
                    <n-collapse-item title="基本信息" name="basic">
                        <n-form-item label="商品编码" path="product_code">
                            <n-input v-model:value="formData.product_code" placeholder="请输入商品编码" />
                        </n-form-item>
                        <n-form-item label="商品名称" path="product_name">
                            <n-input v-model:value="formData.product_name" placeholder="请输入商品名称" />
                        </n-form-item>
                        <n-form-item label="商品简称" path="product_simple_name">
                            <n-input v-model:value="formData.product_simple_name" placeholder="请输入商品简称" />
                        </n-form-item>
                        <n-form-item label="商品备注" path="sku_note">
                            <n-input
                                v-model:value="formData.sku_note"
                                type="textarea"
                                placeholder="请输入商品备注"
                                :rows="3"
                            />
                        </n-form-item>
                        <n-form-item label="商品状态" path="status">
                            <n-select
                                v-model:value="formData.status"
                                :options="statusOptions"
                                placeholder="请选择商品状态"
                            />
                        </n-form-item>
                        <n-form-item label="平台" path="platform">
                            <n-input v-model:value="formData.platform" placeholder="请输入平台" />
                        </n-form-item>
                        <n-form-item label="供应商" path="supplier">
                            <n-input v-model:value="formData.supplier" placeholder="请输入供应商" />
                        </n-form-item>
                        <n-form-item label="商品分类" path="category">
                            <n-input v-model:value="formData.category" placeholder="请输入商品分类" />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="规格信息" name="spec">
                        <n-form-item label="商品规格" path="specification">
                            <n-input v-model:value="formData.specification" placeholder="请输入商品规格" />
                        </n-form-item>
                        <n-form-item label="规格代码" path="spec_code">
                            <n-input v-model:value="formData.spec_code" placeholder="请输入规格代码" />
                        </n-form-item>
                        <n-form-item label="规格名称" path="spec_name">
                            <n-input v-model:value="formData.spec_name" placeholder="请输入规格名称" />
                        </n-form-item>
                        <n-form-item label="单位" path="unit">
                            <n-input v-model:value="formData.unit" placeholder="请输入单位" />
                        </n-form-item>
                        <n-form-item label="规格备注" path="spec_remark">
                            <n-input
                                v-model:value="formData.spec_remark"
                                type="textarea"
                                placeholder="请输入规格备注"
                                :rows="3"
                            />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="价格信息" name="price">
                        <n-form-item label="标准售价" path="standard_price">
                            <n-input-number
                                v-model:value="formData.standard_price"
                                placeholder="请输入标准售价"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="标准成本" path="standard_cost">
                            <n-input-number
                                v-model:value="formData.standard_cost"
                                placeholder="请输入标准成本"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="标准进价" path="standard_purchase_price">
                            <n-input-number
                                v-model:value="formData.standard_purchase_price"
                                placeholder="请输入标准进价"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="成本价" path="cost_price">
                            <n-input-number
                                v-model:value="formData.cost_price"
                                placeholder="请输入成本价"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="售价" path="sale_price">
                            <n-input-number
                                v-model:value="formData.sale_price"
                                placeholder="请输入售价"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="代理售价" path="agent_price">
                            <n-input-number
                                v-model:value="formData.agent_price"
                                placeholder="请输入代理售价"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="最低售价" path="min_price">
                            <n-input-number
                                v-model:value="formData.min_price"
                                placeholder="请输入最低售价"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="仓库信息" name="warehouse">
                        <n-form-item label="默认仓库" path="default_warehouse">
                            <n-input v-model:value="formData.default_warehouse" placeholder="请输入默认仓库" />
                        </n-form-item>
                        <n-form-item label="仓库" path="warehouse">
                            <n-input v-model:value="formData.warehouse" placeholder="请输入仓库" />
                        </n-form-item>
                        <n-form-item label="库存状态" path="stock_status">
                            <n-input v-model:value="formData.stock_status" placeholder="请输入库存状态" />
                        </n-form-item>
                        <n-form-item label="供应商货号" path="supplier_code">
                            <n-input v-model:value="formData.supplier_code" placeholder="请输入供应商货号" />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="尺寸重量" name="size">
                        <n-form-item label="重量" path="weight">
                            <n-input-number
                                v-model:value="formData.weight"
                                placeholder="请输入重量"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="体积" path="volume">
                            <n-input-number
                                v-model:value="formData.volume"
                                placeholder="请输入体积"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="长" path="length">
                            <n-input-number
                                v-model:value="formData.length"
                                placeholder="请输入长度"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="宽" path="width">
                            <n-input-number
                                v-model:value="formData.width"
                                placeholder="请输入宽度"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="高" path="height">
                            <n-input-number
                                v-model:value="formData.height"
                                placeholder="请输入高度"
                                :precision="2"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="积分信息" name="points">
                        <n-form-item label="打包积分" path="package_points">
                            <n-input-number
                                v-model:value="formData.package_points"
                                placeholder="请输入打包积分"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="销售积分" path="sales_points">
                            <n-input-number
                                v-model:value="formData.sales_points"
                                placeholder="请输入销售积分"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="税务信息" name="tax">
                        <n-form-item label="商品税号" path="tax_code">
                            <n-input v-model:value="formData.tax_code" placeholder="请输入商品税号" />
                        </n-form-item>
                        <n-form-item label="商品税率" path="tax_rate">
                            <n-input-number
                                v-model:value="formData.tax_rate"
                                placeholder="请输入商品税率"
                                :precision="2"
                                :min="0"
                                :max="100"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="原产地" path="origin">
                            <n-input v-model:value="formData.origin" placeholder="请输入原产地" />
                        </n-form-item>
                        <n-form-item label="税收分类编码" path="tax_classification_code">
                            <n-input
                                v-model:value="formData.tax_classification_code"
                                placeholder="请输入税收分类编码"
                            />
                        </n-form-item>
                        <n-form-item label="税收优惠政策内容" path="tax_preference_content">
                            <n-input
                                v-model:value="formData.tax_preference_content"
                                type="textarea"
                                placeholder="请输入税收优惠政策内容"
                                :rows="3"
                            />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item style="margin-bottom: 20px" title="其他信息" name="other">
                        <n-form-item label="商品建档日期" path="create_date">
                            <n-date-picker
                                :value="getDatePickerValue()"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请选择商品建档日期"
                                clearable
                                style="width: 100%"
                                @update:value="handleDateChange"
                            />
                        </n-form-item>
                        <n-form-item label="保质期" path="shelf_life">
                            <n-input-number
                                v-model:value="formData.shelf_life"
                                placeholder="请输入保质期（天）"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="预警天数" path="warning_days">
                            <n-input-number
                                v-model:value="formData.warning_days"
                                placeholder="请输入预警天数"
                                :min="0"
                                style="width: 100%"
                            />
                        </n-form-item>
                        <n-form-item label="货主名称" path="owner_name">
                            <n-input v-model:value="formData.owner_name" placeholder="请输入货主名称" />
                        </n-form-item>
                        <n-form-item label="箱规" path="box_spec">
                            <n-input v-model:value="formData.box_spec" placeholder="请输入箱规" />
                        </n-form-item>
                    </n-collapse-item>
                </n-collapse>
            </template>
        </table-edit-modal>
    </n-card>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useDialog, NTag, NUpload, UploadFileInfo, NIcon } from 'naive-ui';
    import { h } from 'vue';
    import dayjs from 'dayjs';
    import { Upload } from '@icon-park/vue-next';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import ButtonPlus from '@/components/Buttons/ButtonPlus.vue';
    import TableEditModal from '@/views/_base/tableDriver/components/TableEditModal.vue';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import {
        createProduct,
        deleteProduct,
        getProductPage,
        updateProduct,
        getProductExport,
        importProduct,
    } from '@/api/product';

    interface RowData extends TableDataRow {
        product_code?: string;
        product_name: string;
        product_simple_name?: string;
        sku_note?: string;
        status: number;
        specification?: string;
        spec_code?: string;
        spec_name?: string;
        unit?: string;
        platform?: string;
        supplier?: string;
        category?: string;
        default_warehouse?: string;
        warehouse?: string;
        stock_status?: string;
        supplier_code?: string;
        standard_price?: number;
        standard_cost?: number;
        standard_purchase_price?: number;
        cost_price?: number;
        sale_price?: number;
        agent_price?: number;
        min_price?: number;
        weight?: number;
        volume?: number;
        length?: number;
        width?: number;
        height?: number;
        package_points?: number;
        sales_points?: number;
        spec_remark?: string;
        create_date?: string;
        tax_code?: string;
        tax_rate?: number;
        origin?: string;
        tax_classification_code?: string;
        tax_preference_content?: string;
        shelf_life?: number;
        warning_days?: number;
        owner_name?: string;
        box_spec?: string;
    }

    const pageTitle = '商品管理';

    const $message = window['$message'];

    const table = ref();
    const fileList = ref<UploadFileInfo[]>([]);
    const importLoading = ref(false);
    const columns: TableDataColumn<RowData>[] = [
        { title: '商品编码', key: 'product_code', search: { type: 'input' }, width: 150 },
        { title: '商品名称', key: 'product_name', search: { type: 'input' }, width: 200 },
        { title: '商品简称', key: 'product_simple_name', search: { type: 'input' }, width: 150 },
        { title: '商品备注', key: 'sku_note', width: 250 },
        {
            title: '商品状态',
            key: 'status',
            search: { type: 'select', selectData: { '1': '启用', '0': '禁用' } },
            width: 100,
            render(row: RowData) {
                return h(
                    NTag,
                    { type: row.status === 1 ? 'success' : 'error' },
                    {
                        default: () => (row.status === 1 ? '启用' : '禁用'),
                    }
                );
            },
        },
        { title: '平台', key: 'platform', search: { type: 'input' }, width: 120 },
        { title: '供应商', key: 'supplier', search: { type: 'input' }, width: 120 },
        { title: '商品分类', key: 'category', search: { type: 'input' }, width: 120 },
        { title: '商品规格', key: 'specification', width: 120 },
        { title: '规格代码', key: 'spec_code', width: 120 },
        { title: '规格名称', key: 'spec_name', width: 120 },
        { title: '单位', key: 'unit', width: 80 },
        { title: '默认仓库', key: 'default_warehouse', width: 120 },
        { title: '仓库', key: 'warehouse', width: 120 },
        { title: '库存状态', key: 'stock_status', width: 120 },
        { title: '供应商货号', key: 'supplier_code', width: 120 },
        { title: '标准售价', key: 'standard_price', width: 100 },
        { title: '标准成本', key: 'standard_cost', width: 100 },
        { title: '标准进价', key: 'standard_purchase_price', width: 100 },
        { title: '成本价', key: 'cost_price', width: 100 },
        { title: '售价', key: 'sale_price', width: 100 },
        { title: '代理售价', key: 'agent_price', width: 100 },
        { title: '最低售价', key: 'min_price', width: 100 },
        { title: '重量', key: 'weight', width: 100 },
        { title: '体积', key: 'volume', width: 100 },
        { title: '长', key: 'length', width: 100 },
        { title: '宽', key: 'width', width: 100 },
        { title: '高', key: 'height', width: 100 },
        { title: '打包积分', key: 'package_points', width: 100 },
        { title: '销售积分', key: 'sales_points', width: 100 },
        { title: '规格备注', key: 'spec_remark', width: 150 },
        {
            title: '商品建档日期',
            key: 'create_date',
            width: 180,
            render(row: RowData) {
                return row.create_date ? dayjs(row.create_date).format('YYYY-MM-DD HH:mm:ss') : '-';
            },
        },
        { title: '商品税号', key: 'tax_code', width: 120 },
        { title: '商品税率', key: 'tax_rate', width: 100 },
        { title: '原产地', key: 'origin', width: 120 },
        { title: '税收分类编码', key: 'tax_classification_code', width: 150 },
        { title: '税收优惠政策内容', key: 'tax_preference_content', width: 200 },
        { title: '保质期', key: 'shelf_life', width: 100 },
        { title: '预警天数', key: 'warning_days', width: 100 },
        { title: '货主名称', key: 'owner_name', width: 120 },
        { title: '箱规', key: 'box_spec', width: 120 },
        {
            title: '创建时间',
            key: 'create_time',
            search: { disabled: true },
            width: 180,
            render(row: RowData) {
                return row.create_time ? dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss') : '-';
            },
        },
        {
            title: '更新时间',
            key: 'update_time',
            search: { disabled: true },
            width: 180,
            render(row: RowData) {
                return row.update_time ? dayjs(row.update_time).format('YYYY-MM-DD HH:mm:ss') : '-';
            },
        },
    ];

    const statusOptions = [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
    ];

    const dialog = useDialog();
    const driver = tableDriver<RowData>({
        table,
        loadApi: getProductPage,
        exportApi: getProductExport,
        newForm: () => {
            return {
                product_code: '',
                product_name: '',
                product_simple_name: '',
                sku_note: '',
                status: 1,
                specification: '',
                spec_code: '',
                spec_name: '',
                unit: '',
                platform: '',
                supplier: '',
                category: '',
                default_warehouse: '',
                warehouse: '',
                stock_status: '',
                supplier_code: '',
                standard_price: undefined,
                standard_cost: undefined,
                standard_purchase_price: undefined,
                cost_price: undefined,
                sale_price: undefined,
                agent_price: undefined,
                min_price: undefined,
                weight: undefined,
                volume: undefined,
                length: undefined,
                width: undefined,
                height: undefined,
                package_points: undefined,
                sales_points: undefined,
                spec_remark: '',
                create_date: '',
                tax_code: '',
                tax_rate: undefined,
                origin: '',
                tax_classification_code: '',
                tax_preference_content: '',
                shelf_life: undefined,
                warning_days: undefined,
                owner_name: '',
                box_spec: '',
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
                        await deleteProduct(Number(record.id));
                        $message.success('删除成功');
                        table.value.reload();
                    } catch (error: any) {
                        $message.error(error.message || '删除失败');
                    }
                },
            });
        },
        actionWidth: 240,
    });
    const formData = computed(() => driver.formData.value);

    // 获取日期选择器的值（转换为时间戳）
    function getDatePickerValue(): number | null {
        if (!formData.value.create_date) return null;
        if (typeof formData.value.create_date === 'number') return formData.value.create_date;
        const dateValue = dayjs(formData.value.create_date);
        return dateValue.isValid() ? dateValue.valueOf() : null;
    }

    // 处理日期选择器的值转换
    function handleDateChange(value: number | null) {
        if (value) {
            formData.value.create_date = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        } else {
            formData.value.create_date = '';
        }
    }

    async function createNewData() {
        try {
            await createProduct(formData.value);
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
                    await updateProduct(formData.value);
                    $message.success('修改成功');
                    driver.showModal.value = false;
                    table.value.reload();
                } catch (error: any) {
                    $message.error(error.message || '修改失败');
                }
            },
        });
    }

    function handleFileChange(data: { fileList: UploadFileInfo[] }) {
        if (data.fileList.length > 0) {
            const file = data.fileList[data.fileList.length - 1];
            if (file.status === 'pending') {
                // 文件刚选择，开始上传
                handleImport({
                    file,
                    onFinish: () => {
                        fileList.value = [];
                    },
                    onError: () => {
                        fileList.value = [];
                    },
                });
            }
        }
    }

    async function handleImport(options: {
        file: UploadFileInfo;
        onFinish?: () => void;
        onError?: (error: Error) => void;
    }) {
        const { file, onFinish, onError } = options;
        if (!file.file) {
            $message.error('请选择文件');
            onError?.(new Error('请选择文件'));
            return;
        }
        importLoading.value = true;
        try {
            const result: any = await importProduct(file.file as File);
            const { data: res } = result;
            if (res.code !== 200) {
                $message.error(res.message || '导入失败');
                onError?.(new Error(res.message || '导入失败'));
            } else {
                $message.success(res.message || '导入成功');
                table.value.reload();
                onFinish?.();
            }
            fileList.value = [];
        } catch (error: any) {
            const errorMsg = error.message || '导入失败';
            $message.error(errorMsg);
            onError?.(new Error(errorMsg));
            fileList.value = [];
        } finally {
            importLoading.value = false;
        }
    }
</script>

<style lang="less" scoped></style>
