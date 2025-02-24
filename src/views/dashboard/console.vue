<template>
    <div>
        <div class="statistics">
            <n-card size="small" title="本日新顾客">
                <count-to class="big-int" :end-val="countInfo.stations" />
            </n-card>
            <n-card size="small" title="本日咨询">
                <count-to class="big-int" :end-val="countInfo.devices" />
            </n-card>
            <n-card size="small" title="订单数量">
                <template #header-extra>
                    <n-tag type="error">今日</n-tag>
                </template>
                <!-- <count-to class="big-int hl" :end-val="countInfo.completeCount" /> -->
                <count-to class="big-int hl" :end-val="150" />
            </n-card>
            <n-card size="small" title="浏览数量">
                <template #header-extra>
                    <n-tag type="error">今日</n-tag>
                </template>
                <count-to class="big-int hl" :end-val="countInfo.tightenCount" />
            </n-card>
            <n-card size="small" title="本日退件">
                <template #header-extra>
                    <n-tag type="error">今日</n-tag>
                </template>
                <count-to class="big-int ng" :end-val="countInfo.defectCount" />
            </n-card>
            <n-card size="small" title="访问率">
                <template #header-extra>
                    <n-tag type="error">今日</n-tag>
                </template>
                <div class="big-int ok">
                    <count-to :end-val="countInfo.passRate" />
                    %
                </div>
            </n-card>
        </div>
        <div class="charts-panel">
            <n-card title="访问率" size="small" :segmented="seg">
                <div class="charts-content">
                    <echarts-container :option="passRateCharts" />
                </div>
            </n-card>
            <n-card title="订单数量" size="small" :segmented="seg">
                <div class="charts-content">
                    <echarts-container :option="tightenCountCharts" />
                </div>
            </n-card>
            <n-card title="浏览数量" size="small" :segmented="seg">
                <div class="charts-content">
                    <echarts-container :option="defectCountCharts" />
                </div>
            </n-card>
            <n-card title="订单占比" size="small" :segmented="seg">
                <div class="charts-content">
                    <echarts-container :option="defectTypeCharts" />
                </div>
            </n-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import CountTo from '@/components/CountTo/CountTo.vue';
    import EchartsContainer from '@/components/EchartsContainer.vue';

    const seg = {
        content: true,
        footer: 'soft',
    };
    const countInfo = ref({
        stations: 10,
        devices: 8,
        completeCount: 1234,
        tightenCount: 123123,
        defectCount: 0,
        passRate: 98,
    });
    const passRateCharts = ref({
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['LINE1', 'LINE2'],
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%',
            },
        },
        series: [
            {
                name: 'LINE1',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
                name: 'LINE2',
                type: 'line',
                data: [220, 182, 191, 234, 290, 330, 310],
            },
        ],
    });
    const tightenCountCharts = ref({
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                label: {
                    show: true,
                    position: 'top',
                },
            },
        ],
    });
    const defectCountCharts = ref({
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'type1',
                data: [120, 200, 150, 80, 70, 110, 130],
                stack: 'total',
                type: 'bar',
            },
            {
                name: 'type2',
                data: [120, 200, 150, 80, 70, 110, 130],
                stack: 'total',
                type: 'bar',
            },
            {
                name: 'type3',
                data: [120, 200, 150, 80, 70, 110, 130],
                stack: 'total',
                type: 'bar',
            },
        ],
    });
    const defectTypeCharts = ref({
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'eSIM 日本流量套餐' },
                    { value: 735, name: 'eSIM 韩国流量套餐' },
                    { value: 580, name: 'eSIM 美国流量套餐' },
                    { value: 484, name: 'eSIM 印尼流量套餐' },
                    { value: 300, name: 'eSIM 新加坡流量套餐' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    });
</script>

<style lang="less" scoped>
    .statistics {
        display: flex;
        margin-top: 10px;
        margin-bottom: 20px;

        .n-card:not(:last-child) {
            margin-right: 20px;
        }

        .big-int {
            font-weight: bold;
            font-size: 25px;
            display: flex;
        }

        .hl {
            color: #1976d2;
        }

        .ok {
            color: #009688;
        }

        .ng {
            color: #e91e63;
        }
    }

    .charts-panel {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .n-card {
            width: calc(100% / 2 - 10px);
            margin-bottom: 20px;
        }

        .charts-content {
            height: 300px;
        }
    }
</style>
