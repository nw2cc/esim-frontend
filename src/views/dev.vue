<template>
    <n-card :bordered="false" class="proCard">
        <n-result status="404" title="此页面维护中，请等待更新" :description="desc">
            <template #footer>
                <div style="text-align: center">
                    <n-button @click="goHome">回到首页</n-button>
                </div>
            </template>
        </n-result>
    </n-card>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';
    import { computed } from 'vue';

    const router = useRouter();
    const words = [
        '生如朝露，惜时如金。',
        '心怀善念，路自宽广。',
        '逆境砺志，顺境养心。',
        '知足常乐，感恩前行。',
        '诚信为本，立身之道。',
        '勇者无惧，智者无忧。',
        '宽容待人，严于律己。',
        '梦想为帆，努力为桨。',
        '岁月静好，负重前行。',
        '生命不息，奋斗不止。',
    ];

    const desc = computed(() => {
        return words[Math.floor(Math.random() * words.length)];
    });

    function goHome() {
        router.push('/');
    }
</script>

<style lang="less" scoped></style>
