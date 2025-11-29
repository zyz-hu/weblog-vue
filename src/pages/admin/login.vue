<template>
    <div class="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <div class="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_10%_20%,rgba(52,211,153,0.12),transparent_40%),radial-gradient(circle_at_90%_15%,rgba(79,70,229,0.16),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(56,189,248,0.12),transparent_40%)]"></div>
        <div class="absolute inset-x-10 top-20 h-[520px] rounded-[36px] bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/80 blur-3xl"></div>

        <div class="relative z-10 flex min-h-screen items-center justify-center px-4">
            <div class="grid w-full max-w-6xl grid-cols-1 gap-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:grid-cols-2 md:p-10">
                <div class="flex flex-col justify-between space-y-6 border-b border-white/5 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                    <div class="space-y-4">
                        <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-100 ring-1 ring-emerald-400/30">
                            <span class="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
                            实时守护 · 智能运营
                        </div>
                        <h1 class="text-4xl font-bold leading-tight">欢迎回到 Weblog</h1>
                        <p class="text-base text-slate-200/80">以 ChatGPT / Gemini 风格重塑的后台，带来更流畅、更沉浸的管理体验。继续登录，开启你的灵感空间。</p>
                        <div class="grid grid-cols-2 gap-3 text-sm text-slate-200/80">
                            <div class="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner shadow-emerald-500/10">
                                <p class="font-semibold text-white">无缝写作</p>
                                <p class="text-slate-300/80">沉浸式编辑、随时保存。</p>
                            </div>
                            <div class="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner shadow-indigo-500/10">
                                <p class="font-semibold text-white">素材中心</p>
                                <p class="text-slate-300/80">静态图片与封面精致呈现。</p>
                            </div>
                            <div class="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner shadow-cyan-500/10">
                                <p class="font-semibold text-white">数据透视</p>
                                <p class="text-slate-300/80">标签、分类一览无遗。</p>
                            </div>
                            <div class="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner shadow-violet-500/10">
                                <p class="font-semibold text-white">灵活导航</p>
                                <p class="text-slate-300/80">自适应暗色与全屏切换。</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-200/80">
                        <img src="@/assets/developer.png" class="h-14 w-auto drop-shadow-lg" alt="Login Illustration" />
                        <div>
                            <p class="font-semibold text-white">Weblog 博客登录</p>
                            <p class="text-slate-300/80">Spring Boot + MyBatis Plus + Vue 3.2 + Vite 4</p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col justify-center rounded-2xl bg-white text-slate-900 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-100">
                    <div class="space-y-2 px-8 pt-8 text-center">
                        <p class="text-sm font-semibold text-indigo-500">欢迎回来</p>
                        <h2 class="text-3xl font-bold tracking-tight">登录你的创作工作台</h2>
                        <p class="text-sm text-slate-500">请输入账号密码开始体验全新界面。</p>
                    </div>
                    <div class="px-8 pt-6 pb-8">
                        <el-form class="space-y-4" ref="formRef" :rules="rules" :model="form" label-position="top">
                            <el-form-item prop="username" label="用户名">
                                <el-input size="large" v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" clearable class="rounded-full" />
                            </el-form-item>
                            <el-form-item prop="password" label="密码">
                                <el-input size="large" type="password" v-model="form.password" placeholder="请输入密码" :prefix-icon="Lock" clearable show-password class="rounded-full" />
                            </el-form-item>
                            <div class="flex items-center justify-between text-xs text-slate-500">
                                <div class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-indigo-600 ring-1 ring-indigo-100">
                                    <span class="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                                    安全加密传输
                                </div>
                                <span>忘记密码？请联系管理员</span>
                            </div>
                            <el-button class="w-full rounded-full py-3 text-base" size="large" :loading="loading" type="primary" @click="onSubmit">登录</el-button>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 引入 Element Plus 中的用户、锁图标
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/admin/user'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { showMessage} from '@/composables/util'
import { setToken } from '@/composables/cookie'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 定义响应式的表单对象
const form = reactive({
    username: 'test',
    password: 'test'
})

const router = useRouter()
// 登录按钮加载
const loading = ref(false)

// 表单引用
const formRef = ref(null)
// 表单验证规则
const rules = {
    username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
        },
    ]
}

const onSubmit = () => {
    console.log('登录')
    // 先验证 form 表单字段
    formRef.value.validate((valid) => {
        if (!valid) {
            console.log('表单验证不通过')
            return false
        }
        // 开始加载
        loading.value = true

        // 调用登录接口
        login(form.username, form.password).then((res) => {
            console.log(res)
            // 判断是否成功
            if (res.success == true) {
                // 提示登录成功
                showMessage('登录成功')

                // 存储 Token 到 Cookie 中
                let token = res.data.token
                setToken(token)

                // 获取用户信息，并存储到全局状态中
                userStore.setUserInfo()

                // 跳转到后台首页
                router.push('/admin/index')
            } else {
                // 获取服务端返回的错误消息
                let message = res.message
                // 提示消息
                showMessage(message, 'error')
            }
        })
        .finally(() => {
            // 结束加载
            loading.value = false
        })
    })
}

// 按回车键后，执行登录事件
function onKeyUp(e) {
    console.log(e)
    if (e.key == 'Enter') {
        onSubmit()
    }
}

// 添加键盘监听
onMounted(() => {
    console.log('添加键盘监听')
    document.addEventListener('keyup', onKeyUp)
})

// 移除键盘监听
onBeforeUnmount(() => {
    document.removeEventListener('keyup', onKeyUp)
})


</script>