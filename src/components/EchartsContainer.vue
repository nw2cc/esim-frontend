<template>
    <div class="block">
        <div class="charts">
            <div class="body" ref="chartsElem"></div>
            <div class="mask" v-if="props.onlyShow"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue';
    import type { ECharts } from 'echarts';
    import { init } from 'echarts';

    const props = withDefaults(
        defineProps<{
            option: any;
            onlyShow?: boolean;
            forceUpdate?: boolean;
        }>(),
        {
            option: null,
            onlyShow: false,
            forceUpdate: false,
        }
    );

    const charts = shallowRef<ECharts>();
    const chartsElem = ref();

    function initCharts(option: any) {
        nextTick(() => {
            if (!charts.value) {
                charts.value = init(chartsElem.value);
            }
            charts.value.setOption(option, props.forceUpdate);
        });
    }

    watch(
        computed(() => props.option),
        (value) => {
            initCharts(value);
        }
    );

    onMounted(() => {
        if (props.option) {
            initCharts(props.option);
        }
    });
</script>

<style lang="less" scoped>
    .block {
        width: 100%;
        height: 100%;

        .charts {
            width: 100%;
            height: 100%;
            position: relative;

            & > .body {
                width: 100%;
                height: 100%;
            }

            & > .mask {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
</style>
