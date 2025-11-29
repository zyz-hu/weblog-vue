<template>
    <!-- 固钉组件，通过设置 offset 属性来改变吸顶距离，默认值为 0。 -->
    <el-affix :offset="0">
        <div class="admin-header">
            <div class="flex items-center h-[72px] px-4 gap-3">
                <!-- 左边栏收缩、展开 -->
                <el-tooltip class="box-item" effect="dark" :content="menuStore.menuWidth == '250px' ? '折叠菜单' : '展开菜单'"
                    placement="bottom">
                    <div class="action-btn" @click="handleMenuWidth">
                        <el-icon>
                            <Fold v-if="menuStore.menuWidth == '250px'" />
                            <Expand v-else />
                        </el-icon>
                    </div>
                </el-tooltip>

                <!-- 品牌 Logo / 项目名 -->
                <div class="flex items-center gap-3 pr-4 border-r border-white/60">
                    <div class="brand-mark">
                        <span class="text-white font-semibold">WB</span>
                    </div>
                    <div class="leading-tight">
                        <p class="text-sm font-semibold text-slate-800">Weblog Admin</p>
                        <p class="text-xs text-slate-500">内容运营中心</p>
                    </div>
                </div>

                <!-- 全局搜索 -->
                <div class="flex-1 max-w-[520px] px-4">
                    <el-input v-model="searchValue" placeholder="搜索文章、用户或操作" clearable class="search-input"
                        :prefix-icon="Search" @keyup.enter="handleSearch" />
                </div>

                <!-- 右边容器 -->
                <div class="ml-auto flex items-center gap-2">
                    <!-- 消息入口 -->
                    <el-tooltip class="box-item" effect="dark" content="消息" placement="bottom">
                        <div class="action-btn" @click="handleOpenMessages">
                            <el-icon>
                                <ChatDotRound />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <!-- 通知入口 -->
                    <el-tooltip class="box-item" effect="dark" content="通知" placement="bottom">
                        <div class="action-btn" @click="handleOpenNotifications">
                            <el-icon>
                                <BellFilled />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <!-- 主题切换 -->
                    <el-tooltip class="box-item" effect="dark" :content="themeTooltip" placement="bottom">
                        <div class="action-btn" @click="handleToggleTheme">
                            <el-icon>
                                <Moon v-if="isDark" />
                                <Sunny v-else />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <!-- 点击刷新页面 -->
                    <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
                        <div class="action-btn" @click="handleRefresh">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <!-- 点击跳转前台首页 -->
                    <el-tooltip class="box-item" effect="dark" content="跳转前台" placement="bottom">
                        <div class="action-btn" @click="router.push('/')">
                            <el-icon>
                                <Monitor />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <!-- 点击全屏展示 -->
                    <el-tooltip class="box-item" effect="dark" content="全屏" placement="bottom">
                        <div class="action-btn" @click="toggle">
                            <el-icon>
                                <FullScreen v-if="!isFullscreen" />
                                <Aim v-else />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <!-- 登录用户头像 -->
                    <el-dropdown class="avatar-dropdown" @command="handleCommand">
                        <span class="el-dropdown-link flex items-center gap-3 text-gray-700 text-sm">
                            <div class="relative">
                                <el-avatar class="shadow" :size="38"
                                    src="https://avatars.githubusercontent.com/u/143480932?s=400&v=4" />
                                <span class="absolute -right-1 -bottom-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                            </div>
                            <div class="text-left leading-tight">
                                <p class="font-semibold text-slate-800">{{ userStore.userInfo.username }}</p>
                                <p class="text-xs text-slate-500">{{ userRole }} · {{ userSubtitle }}</p>
                            </div>
                            <el-icon class="el-icon--right text-slate-500">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>

        <!-- 修改密码 -->
        <FormDialog ref="formDialogRef" title="修改密码" destroyOnClose @submit="onSubmit">
            <el-form ref="formRef" :rules="rules" :model="form">
                <el-form-item label="用户名" prop="username" label-width="120px" size="large">
                    <!-- 输入框组件 -->
                    <el-input v-model="form.username" placeholder="请输入用户名" clearable disabled />
                </el-form-item>
                <el-form-item label="新密码" prop="password" label-width="120px" size="large">
                    <el-input type="password" v-model="form.password" placeholder="请输入新密码" clearable show-password />
                </el-form-item>
                <el-form-item label="确认新密码" prop="rePassword" label-width="120px" size="large">
                    <el-input type="password" v-model="form.rePassword" placeholder="请确认新密码" clearable show-password />
                </el-form-item>
            </el-form>
        </FormDialog>
    </el-affix>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { useUserStore } from '@/stores/user'
import { useDark, useFullscreen, useToggle } from '@vueuse/core'
import { updateAdminPassword } from '@/api/admin/user'
import { showMessage, showModel } from '@/composables/util'
import { useRouter } from 'vue-router'
import FormDialog from '@/components/FormDialog.vue'
import { BellFilled, ChatDotRound, Moon, Search, Sunny } from '@element-plus/icons-vue'

const router = useRouter()

// isFullscreen 表示当前是否处于全屏；toggle 用于动态切换全屏、非全屏
const { isFullscreen, toggle } = useFullscreen()

// 主题切换
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 引入了菜单 Store
const menuStore = useMenuStore()
// 引入了用户 Store
const userStore = useUserStore()

// 头像展示信息
const userRole = computed(() => userStore.userInfo.role || '管理员')
const userSubtitle = computed(() => userStore.userInfo.title || '专注高效')

// 搜索内容
const searchValue = ref('')

// icon 点击事件
const handleMenuWidth = () => {
    menuStore.handleMenuWidth()
}

// 搜索
const handleSearch = () => {
    if (!searchValue.value) {
        showMessage('请输入搜索关键字', 'info')
        return
    }
    showMessage(`搜索 "${searchValue.value}"`, 'success')
}

// 主题切换
const handleToggleTheme = () => {
    toggleDark()
}

// 刷新页面
const handleRefresh = () => location.reload()

// 消息、通知入口
const handleOpenMessages = () => {
    showMessage('打开消息中心', 'info')
}

const handleOpenNotifications = () => {
    showMessage('查看通知提醒', 'info')
}

// 对话框是否显示
const formDialogRef = ref(false)

// 主题切换提示
const themeTooltip = computed(() => isDark.value ? '切换到浅色' : '切换到深色')

// 下拉菜单事件处理
const handleCommand = (command) => {
    // 更新密码
    if (command == 'updatePassword') {
        // 显示修改密码对话框
        formDialogRef.value.open()
    } else if (command == 'logout') { // 退出登录
        logout()
    }
}

// 退出登录
function logout() {
    showModel('是否确认要退出登录？').then(() => {
        userStore.logout()
        showMessage('退出登录成功！')
        // 跳转登录页
        router.push('/login')
    })
}

// 表单引用
const formRef = ref(null)

// 修改用户密码表单对象
const form = reactive({
    username: userStore.userInfo.username || '',
    password: '',
    rePassword: ''
})

// 监听Pinia store中的某个值的变化
watch(() => userStore.userInfo.username, (newValue, oldValue) => {
    // 在这里处理变化后的值
    console.log('新值:', newValue);
    console.log('旧值:', oldValue);

    // 可以在这里执行任何你需要的逻辑
    // 重新将新的值，设置会 form 对象中
    form.username = newValue
});

// 规则校验
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
    ],
    rePassword: [
        {
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur',
        },
    ]
}

const onSubmit = () => {
    // 先验证 form 表单字段
    formRef.value.validate((valid) => {
        if (!valid) {
            console.log('表单验证不通过')
            return false
        }

        if (form.password != form.rePassword) {
            showMessage('两次密码输入不一致，请检查！', 'warning')
            return
        }

        formDialogRef.value.showBtnLoading()
        // 调用修改用户密码接口
        updateAdminPassword(form).then((res) => {
            console.log(res)
            // 判断是否成功
            if (res.success == true) {
                showMessage('密码重置成功，请重新登录！')
                // 退出登录
                userStore.logout()

                // 隐藏对话框
                formDialogRef.value.close()

                // 跳转登录页
                router.push('/login')
            } else {
                // 获取服务端返回的错误消息
                let message = res.message
                // 提示消息
                showMessage(message, 'error')
            }
        }).finally(() => formDialogRef.value.closeBtnLoading())
    })
}

</script>

<style scoped>
.admin-header {
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.75));
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.7);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.action-btn {
    @apply w-11 h-11 flex items-center justify-center rounded-full bg-white/80 text-gray-700 shadow transition duration-200 ease-out transform hover:-translate-y-0.5 hover:shadow-lg hover:bg-white;
}

.brand-mark {
    @apply w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-400 flex items-center justify-center shadow-md;
}

.avatar-dropdown {
    @apply flex items-center rounded-full bg-white/80 px-3 py-2 shadow border border-white/60 transition hover:-translate-y-0.5 hover:shadow-lg;
}

.search-input :deep(.el-input__wrapper) {
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 20px rgba(15, 23, 42, 0.08);
}

.search-input :deep(.el-input__wrapper:hover) {
    border-color: #6366f1;
}

:global(.dark) .admin-header {
    background: linear-gradient(120deg, rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.75));
    border-bottom: 1px solid rgba(51, 65, 85, 0.8);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}
</style>
