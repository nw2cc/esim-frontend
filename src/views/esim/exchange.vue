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
        />
    </n-card>
    <n-modal v-model:show="showResendDialog" preset="dialog" title="重发邮箱">
        <n-form
            style="width: 350px"
            ref="resendFormRef"
            :model="resendForm"
            :rules="resendFormRules"
            label-placement="top"
        >
            <n-form-item label="邮箱" path="email">
                <n-input v-model:value="resendForm.email" :placeholder="currentRecord?.email || '请输入邮箱（可选）'" />
            </n-form-item>
        </n-form>
        <div style="color: #888; font-size: 13px; margin-bottom: 16px">如不填写邮箱，将默认使用原本的邮箱</div>

        <div style="display: flex; justify-content: flex-end; margin-top: 16px">
            <n-button @click="showResendDialog = false">取消</n-button>
            <n-button type="primary" @click="handleResendConfirm" :loading="loading" style="margin-left: 12px"
                >确认
            </n-button>
        </div>
    </n-modal>
</template>

<script lang="ts" setup>
    import { h, reactive, ref as vueRef, ref } from 'vue';
    import { tableDriver } from '@/views/_base/tableDriver';
    import { TableDataColumn, TableDataRow } from '@/views/_base/tableDriver/tableTypes';
    import { BasicTable } from '@/components/Table';
    import TableSearch from '@/views/_base/tableDriver/components/TableSearch.vue';
    import { getDeliverRecord, getDeliverRecordExport, resendEmail } from '@/api/record';
    import { FormInst, FormItemRule, NButton, NForm, NFormItem, NInput, NTag } from 'naive-ui';

    interface RowData extends TableDataRow {
        code: string;
        sub_code: string;
        platform_code: string;
        platform_name: string;
        sku_id: string;
        sku_name: string;
        days: string;
        qty: string;
        email: string;
        language: string;
        status: string;
        batch_id: string;
        create_time: string;
    }

    const $message = window['$message'];

    const statusMap = { '0': '未开卡', '1': '已开卡', '2': '已发货' };
    const statusType = { '0': 'warning', '1': 'info', '2': 'success' };

    const table = ref();
    const columns: TableDataColumn<RowData>[] = [
        { title: '金蝶订单号', key: 'code', search: { type: 'input' } },
        { title: '渠道订单号', key: 'sub_code', search: { type: 'input' } },
        { title: '渠道商品码', key: 'platform_code', search: { type: 'input' } },
        { title: 'SKU ID', key: 'sku_id', search: { type: 'input' } },
        { title: 'SKU 名称', key: 'sku_name', search: { type: 'input' } },
        { title: '天数', key: 'days', search: { type: 'input' } },
        { title: '数量', key: 'qty', search: { type: 'input' } },
        { title: '邮箱', key: 'email', search: { type: 'input' } },
        {
            title: '状态',
            key: 'status',
            search: { type: 'select', selectData: statusMap },
            render(row: RowData) {
                return h(
                    NTag,
                    { type: statusType[row.status.toString()] },
                    {
                        default: () => statusMap[row.status.toString()],
                    }
                );
            },
        },
        { title: '创建时间', key: 'create_time', search: { type: 'datetime' } },
    ];

    const showResendDialog = vueRef(false);
    const resendFormRef = vueRef<FormInst | null>(null);
    const resendForm = reactive({ email: '' });
    const resendFormRules = {
        email: [
            {
                validator(rule: FormItemRule, value: string) {
                    if (!value) return true;
                    // 简单邮箱正则
                    return /\S+@\S+\.\S+/.test(value);
                },
                message: '请输入正确的邮箱',
                trigger: 'blur',
            },
        ],
    };
    let currentRecord: RowData | null = null;
    const loading = ref(false);
    const handleResend = async (record: RowData) => {
        currentRecord = record;
        resendForm.email = '';
        showResendDialog.value = true;
    };

    const handleResendConfirm = () => {
        resendFormRef.value?.validate(async (errors) => {
            console.log(errors);
            if (!errors) {
                // 这里触发接口，接口参数：resendForm.email || currentRecord?.email
                loading.value = true;
                const res = await resendEmail({
                    id: currentRecord?.id,
                    email: resendForm.email || currentRecord?.email,
                });
                console.log(res);
                if (res.code !== 200) {
                    $message.error(res.message);
                } else {
                    $message.success('重发成功');
                    showResendDialog.value = false;
                }
                loading.value = false;
            }
        });
    };

    const driver = tableDriver<RowData>({
        table,
        loadApi: getDeliverRecord,
        exportApi: getDeliverRecordExport,
        detailPage: 'esim_exchangeDetail',
        detailParams: (record: RowData) => {
            return {
                name: record.sub_code,
            };
        },
        resend: handleResend,
        actionWidth: '238px',
    });
</script>

<style lang="less" scoped></style>
