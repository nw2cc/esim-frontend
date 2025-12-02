<template>
    <n-modal
        preset="dialog"
        v-model:show="show"
        :show-icon="false"
        :mask-closable="false"
        :title="`${driver.actionStatus.value === 0 ? '创建' : '编辑'}${pageTitle}`"
    >
        <n-card class="table-edit-modal">
            <n-form label-placement="left" label-width="auto" size="medium">
                <slot></slot>
                <n-form-item label=" " v-if="driver.actionStatus.value === 0">
                    <n-button type="success" @click="() => emit('createNewData')">
                        <template #icon>
                            <n-icon>
                                <add theme="outline" size="20" :strokeWidth="3" />
                            </n-icon>
                        </template>
                        创建{{ pageTitle.replace('管理', '') }}
                    </n-button>
                </n-form-item>
                <n-form-item label=" " v-else>
                    <n-button type="success" @click="() => emit('commitEditData')">
                        <template #icon>
                            <n-icon>
                                <edit theme="outline" size="20" :strokeWidth="3" />
                            </n-icon>
                        </template>
                        修改{{ pageTitle.replace('管理', '') }}
                    </n-button>
                </n-form-item>
            </n-form>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import { Add, Edit } from '@icon-park/vue-next';
    import { TableDriver } from '@/views/_base/tableDriver/tableTypes';

    const emit = defineEmits(['createNewData', 'commitEditData', 'modalShow']);
    const props = defineProps<{
        pageTitle: string;
        driver: TableDriver<any>;
    }>();

    const show = ref(false);

    watch(props.driver.showModal, (value) => {
        show.value = value;
    });

    watch(show, (value) => {
        emit('modalShow', value);
    });
</script>

<style lang="less" scoped>
    .table-edit-modal {
        min-width: 500px !important;
    }
</style>
