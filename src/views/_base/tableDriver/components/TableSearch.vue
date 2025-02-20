<template>
    <n-form class="form" label-placement="left" label-width="auto" size="small" inline :model="formValue" v-if="ready">
        <template v-for="item in props.columns" :key="item.key">
            <n-form-item :label="item.title" v-if="!item.search?.disabled">
                <template v-if="item.search?.type === 'datetime'">
                    <n-date-picker v-model:value="formValue[item.key]" type="datetimerange" clearable />
                </template>
                <template v-else>
                    <n-input v-model:value="formValue[item.key]" :placeholder="'请输入' + item.title" />
                </template>
            </n-form-item>
        </template>
        <n-form-item>
            <n-button type="info" @click="doSearch">
                <n-icon>
                    <search theme="outline" size="20" :strokeWidth="3" />
                </n-icon>
                搜索
            </n-button>
            <n-button style="margin-left: 10px" @click="init">
                <n-icon>
                    <refresh theme="outline" size="20" :strokeWidth="3" />
                </n-icon>
                重置
            </n-button>
        </n-form-item>
    </n-form>
</template>

<script lang="ts" setup>
    import { TableDataColumn, TableDataColumnSearch, TableDriver } from '@/views/_base/tableDriver/tableTypes';
    import { computed, onMounted, ref } from 'vue';
    import { Refresh, Search } from '@icon-park/vue-next';

    const emit = defineEmits(['search']);
    const props = defineProps<{
        columns: TableDataColumn<any>[];
        driver: TableDriver<any>;
    }>();
    const ready = computed(() => Object.keys(formValue.value).length > 0);

    const formValue = ref({});

    function doSearch() {
        const value = {};
        for (const key in formValue.value) {
            if (formValue.value[key]) {
                value[key] = formValue.value[key];
            }
        }
        props.driver.setSearchData(value);
        props.driver.table.value.reload();
    }

    function init() {
        const value = {};
        for (const item of props.columns) {
            let config: TableDataColumnSearch | undefined = item.search;
            if (!config) {
                config = {
                    type: 'input',
                };
            }
            if (!config.disabled) {
                value[item.key] = ((conf: TableDataColumnSearch) => {
                    switch (conf.type) {
                        case 'datetime':
                            return null;
                        default:
                            return '';
                    }
                })(config);
            }
        }
        formValue.value = value;
        props.driver.setSearchData({});
        props.driver.table.value.reload();
    }

    onMounted(() => {
        init();
    });
</script>

<style lang="less" scoped>
    .form {
        flex-wrap: wrap;
    }
</style>
