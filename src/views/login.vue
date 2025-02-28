<template>
    <div class="view-account">
        <div class="view-account-header"></div>
        <div class="view-account-container">
            <div class="view-account-top">
                <div class="view-account-top-logo">
                    <img :src="websiteConfig.loginImage" alt="" style="width: 80px; padding-right: 20px" />
                    <div style="font-size: 30px">{{ websiteConfig.title }}</div>
                </div>
                <div class="view-account-top-desc">{{ websiteConfig.loginDesc }}</div>
            </div>
            <div class="view-account-form" v-if="ready" style="margin-top: 20px">
                <template v-if="licence?.status === 1">
                    <n-form
                        style="width: 350px"
                        ref="formRef"
                        label-placement="left"
                        size="large"
                        :model="formInline"
                        :rules="rules"
                    >
                        <n-form-item path="username">
                            <n-input v-model:value="formInline.username" placeholder="请输入用户名">
                                <template #prefix>
                                    <n-icon size="18" color="#808695" style="margin-right: 5px">
                                        <user />
                                    </n-icon>
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item path="password">
                            <n-input
                                v-model:value="formInline.password"
                                type="password"
                                showPasswordOn="click"
                                placeholder="请输入密码"
                            >
                                <template #prefix>
                                    <n-icon size="18" color="#808695" style="margin-right: 5px">
                                        <key />
                                    </n-icon>
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item>
                            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
                                登录
                            </n-button>
                        </n-form-item>
                    </n-form>
                </template>
                <template v-if="licence?.status === 0">
                    <div class="licence-info">
                        <div>
                            <n-qr-code
                                :size="150"
                                :value="licence?.req"
                                :icon-src="websiteConfig.loginImage"
                                :icon-size="50"
                                background-color="#f5f5f5"
                                class="qr-code"
                            />
                        </div>
                        <div style="padding-left: 20px">
                            <div style="font-size: 26px; color: red">{{ licence?.message }}</div>
                            <div style="padding-top: 20px">如需获取授权或帮助，请联系团队并发送此二维码。</div>
                            <div style="padding-top: 10px">
                                <div>咨询热线：</div>
                                官方网站：
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { nextTick, onMounted, reactive, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useUserStore } from '@/store/modules/user';
    import { useLicenceStore } from '@/store/modules/licence';
    import { useMessage } from 'naive-ui';
    import { Key, User } from '@icon-park/vue-next';
    import { PageEnum } from '@/core/enums/pageEnum';
    import { websiteConfig } from '@/core/config/website.config';
    import { LicenceResp } from '@/api/system';
    import { ResultEnum } from '@/core/enums/httpEnum';

    interface LoginInfo {
        username: string;
        password: string;
    }

    const formRef = ref();
    const message = useMessage();
    const ready = ref(false);
    const loading = ref(false);
    const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

    const licence = ref<LicenceResp>();

    const formInline = reactive({
        username: '',
        password: '',
        isCaptcha: true,
    });

    const rules = {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' },
    };

    const userStore = useUserStore();
    const licenceStore = useLicenceStore();

    const router = useRouter();
    const route = useRoute();

    async function handleSubmit(e) {
        e && e.preventDefault();
        if (loading.value) {
            return;
        }
        formRef.value.validate(async (errors: any) => {
            if (!errors) {
                const { username, password } = formInline;
                message.loading('登录中...');
                loading.value = true;

                const params: LoginInfo = {
                    username,
                    password,
                };

                try {
                    const { code, message: msg } = await userStore.login(params);
                    message.destroyAll();
                    if (code == ResultEnum.SUCCESS) {
                        message.success('登录成功，即将进入系统');
                        await enter();
                    } else {
                        message.info(msg || '登录失败');
                    }
                } finally {
                    loading.value = false;
                }
            } else {
                message.error('请填写完整信息，并且进行验证码校验');
            }
        });
    }

    async function enter() {
        const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
        if (route.name === LOGIN_NAME) {
            await router.replace('/');
        } else {
            await router.replace(toPath);
        }
    }

    onMounted(async () => {
        let res = await licenceStore.requestLicence();
        let canLogin = false;

        await nextTick(async () => {
            licence.value = res;
            ready.value = true;
            if (canLogin) {
                await nextTick(async () => {
                    await handleSubmit(null);
                });
            }
        });
    });
</script>

<style lang="less" scoped>
    .view-account {
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: auto;

        &-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px 0;
        }

        &-top {
            padding: 32px 0;
            text-align: center;

            &-logo {
                display: flex;
                align-items: center;
            }

            &-desc {
                font-size: 14px;
                color: #808695;
            }
        }

        &-other {
            width: 100%;
        }

        .default-color {
            color: #515a6e;

            .ant-checkbox-wrapper {
                color: #515a6e;
            }
        }
    }

    @media (min-width: 768px) {
        .view-account {
            background-image: url('../assets/images/login.svg');
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 100%;
        }

        .page-account-container {
            padding: 32px 0 24px 0;
        }
    }

    .licence-info {
        display: flex;
        align-items: center;
        margin-left: 150px;

        .qr-code {
            width: auto !important;
            height: auto !important;
        }
    }
</style>
