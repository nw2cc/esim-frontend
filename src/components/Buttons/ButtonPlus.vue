<template>
    <n-button :type="props.type">
        <template #icon>
            <n-icon>
                <plus theme="outline" size="20" :strokeWidth="3" />
            </n-icon>
        </template>
        <slot></slot>
    </n-button>
</template>

<script lang="ts" setup>
    import { Plus } from '@icon-park/vue-next';

    type Type = 'default' | 'tertiary' | 'primary' | 'info' | 'success' | 'warning' | 'error';

    const props = defineProps<{
        type: Type;
    }>();
</script>

<style lang="less" scoped></style>
