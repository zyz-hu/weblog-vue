<template>
    <Header></Header>

    <!-- 主内容区域 -->
    <main class="container max-w-screen-xl mx-auto p-4 space-y-8">
        <!-- Hero 区域 -->
        <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-white/60 shadow-xl shadow-indigo-100/60 dark:shadow-slate-900/40">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.15),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.18),transparent_35%)]"></div>
            <div class="relative grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-10 md:px-12 md:py-14">
                <div class="space-y-4">
                    <p class="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 shadow-sm shadow-indigo-100 ring-1 ring-indigo-100 dark:bg-slate-800/70 dark:text-indigo-200 dark:ring-indigo-500/20">今日精选</p>
                    <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">探索每一篇灵感与洞见</h1>
                    <p class="text-base text-slate-600 dark:text-slate-300">在这里发现精选文章、标签与分类，开启你的阅读旅程。我们为你准备了精心推荐的内容与流畅的浏览体验。</p>
                    <div class="flex flex-wrap gap-3">
                        <a href="#articles" class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-white font-semibold shadow-lg shadow-indigo-200 transition hover:translate-y-[-2px] hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                            立即探索
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                        </a>
                        <button type="button" class="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2.5 text-indigo-700 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:bg-slate-800/80 dark:border-slate-700 dark:text-indigo-200 dark:hover:border-indigo-500/40">
                            订阅更新
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19c3.866 0 7-2.91 7-6.5S15.866 6 12 6 5 8.91 5 12.5 8.134 19 12 19Zm0 0v2m-3 0h6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="flex items-center justify-center">
                    <div class="relative w-full max-w-md">
                        <div class="absolute -inset-6 bg-gradient-to-br from-indigo-200/60 via-sky-100/60 to-purple-100/60 blur-3xl dark:from-indigo-500/10 dark:via-sky-500/10 dark:to-purple-500/10"></div>
                        <div class="relative rounded-2xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/70">
                            <div class="grid grid-cols-2 gap-3">
                                <div class="rounded-xl bg-gradient-to-br from-indigo-50 to-sky-50 p-4 text-sm font-semibold text-indigo-700 shadow-inner dark:from-slate-800 dark:to-slate-800/60 dark:text-indigo-200">热门标签</div>
                                <div class="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 p-4 text-sm font-semibold text-violet-700 shadow-inner dark:from-slate-800 dark:to-slate-800/60 dark:text-violet-200">精选分类</div>
                                <div class="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-sm font-semibold text-blue-700 shadow-inner dark:from-slate-800 dark:to-slate-800/60 dark:text-blue-200">新鲜文章</div>
                                <div class="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-sm font-semibold text-emerald-700 shadow-inner dark:from-slate-800 dark:to-slate-800/60 dark:text-emerald-200">畅销阅读</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- grid 表格布局，分为 4 列 -->
        <div id="articles" class="grid grid-cols-1 lg:grid-cols-4 gap-7">
            <!-- 左边栏，占用 3 列 -->
            <div class="col-span-4 lg:col-span-3 mb-3 space-y-6">
                <!-- 文章列表，grid 表格布局，分为 2 列 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <template v-if="loading">
                        <div v-for="index in 4" :key="index" class="col-span-1">
                            <div class="h-full rounded-2xl border border-slate-100/70 bg-white/70 p-4 shadow-lg shadow-indigo-50/40 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-900/50 animate-pulse">
                                <div class="h-40 rounded-xl bg-slate-200 dark:bg-slate-700 mb-4"></div>
                                <div class="flex flex-wrap gap-2 mb-3">
                                    <span class="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                    <span class="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                </div>
                                <div class="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-3"></div>
                                <div class="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 mb-2"></div>
                                <div class="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="articles.length === 0">
                        <div class="col-span-1 md:col-span-2">
                            <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center shadow-inner dark:border-slate-700 dark:bg-slate-900/60">
                                <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8m-3 8H6" />
                                    </svg>
                                </div>
                                <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-2">还没有文章</h3>
                                <p class="text-sm text-slate-500 dark:text-slate-300 mb-4">敬请期待更多内容，或尝试刷新页面。</p>
                                <button type="button" @click="getArticles(current)" class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">
                                    重新加载
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582M20 20v-5h-.581M4 9a8 8 0 0 1 13.657-5.657M20 15a8 8 0 0 1-13.657 5.657" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="(article, index) in articles" :key="index" class="col-span-1">
                            <div class="group relative h-full overflow-hidden rounded-2xl border border-slate-100/80 bg-white/80 shadow-xl shadow-indigo-50/60 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-100/70 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-900/60">
                                <!-- 背景光晕 -->
                                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-indigo-50/60 via-transparent to-sky-50/60 dark:from-indigo-500/10 dark:to-sky-500/10"></div>
                                <!-- 文章封面 -->
                                <a @click="goArticleDetailPage(article.id)" class="relative block cursor-pointer overflow-hidden">
                                    <img class="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                                        :src="article.cover" />
                                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                                </a>
                                <div class="relative p-5 space-y-3">
                                    <!-- 标签 -->
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="(tag, tagIndex) in article.tags" :key="tagIndex" @click="goTagArticleListPage(tag.id, tag.name)"
                                            class="cursor-pointer rounded-full bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm shadow-emerald-100 transition hover:-translate-y-0.5 hover:from-green-200 hover:via-emerald-100 hover:to-teal-200 dark:from-emerald-500/15 dark:via-emerald-500/10 dark:to-teal-500/15 dark:text-emerald-200">
                                            {{ tag.name }}
                                        </span>
                                    </div>
                                    <!-- 文章标题 -->
                                    <a @click="goArticleDetailPage(article.id)" class="cursor-pointer inline-block">
                                        <h2 class="mb-1 text-xl font-bold tracking-tight text-gray-900 transition group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200">
                                            {{ article.title }}</h2>
                                    </a>
                                    <!-- 文章摘要 -->
                                    <p v-if="article.summary" class="text-sm font-normal text-gray-600 line-clamp-2 dark:text-gray-300">{{ article.summary }}</p>
                                    <!-- 文章发布时间、所属分类 -->
                                    <p class="flex items-center font-normal text-gray-400 text-xs md:text-sm gap-3 flex-wrap dark:text-gray-400">
                                        <!-- 发布时间 -->
                                        <span class="inline-flex items-center gap-1">
                                            <svg class="inline w-4 h-4 text-gray-400 dark:text-white" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                                            </svg>
                                            {{ article.createDate }}
                                        </span>

                                        <!-- 所属分类 -->
                                        <span class="inline-flex items-center gap-1">
                                            <svg class="inline w-4 h-4 text-gray-400 dark:text-white" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M1 5v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H1Zm0 0V2a1 1 0 0 1 1-1h5.443a1 1 0 0 1 .8.4l2.7 3.6H1Z" />
                                            </svg>
                                            <a @click="goCategoryArticleListPage(article.category.id, article.category.name)" class="cursor-pointer text-gray-400 transition hover:text-indigo-600 hover:underline dark:hover:text-indigo-300">{{ article.category.name }}</a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <!-- 分页 -->
                <nav aria-label="Page navigation example" class="mt-4 flex justify-center" v-if="pages > 1">
                    <ul class="flex items-center gap-2 text-sm font-semibold">
                        <!-- 上一页 -->
                        <li>
                            <button @click="getArticles(current - 1)"
                                class="flex items-center gap-2 rounded-full px-3 py-2 text-indigo-600 ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:text-indigo-200 dark:ring-indigo-500/30 dark:hover:bg-indigo-500/10"
                                :disabled="current <= 1"
                                >
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="M5 1 1 5l4 4" />
                                </svg>
                                上一页
                            </button>
                        </li>
                        <!-- 页码 -->
                        <li v-for="(pageNo, index) in pages" :key="index">
                            <button @click="getArticles(pageNo)"
                                class="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-white text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
                                :class="[pageNo == current ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-500 dark:bg-indigo-500 dark:text-white' : '']"
                                >
                                {{ index + 1 }}
                            </button>
                        </li>
                        <!-- 下一页 -->
                        <li>
                            <button @click="getArticles(current + 1)"
                                class="flex items-center gap-2 rounded-full px-3 py-2 text-indigo-600 ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:text-indigo-200 dark:ring-indigo-500/30 dark:hover:bg-indigo-500/10"
                                :disabled="current >= pages"
                                >
                                下一页
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>


            <!-- 右边侧边栏，占用一列 -->
            <aside class="col-span-4 lg:col-span-1">
                <div class="sticky top-[5.5rem] space-y-4">
                    <!-- 博主信息 -->
                    <UserInfoCard></UserInfoCard>

                    <!-- 分类 -->
                    <CategoryListCard></CategoryListCard>

                    <!-- 标签 -->
                    <TagListCard></TagListCard>
                </div>
            </aside>
    </div>

    </main>

    <!-- 返回顶部 -->
    <ScrollToTopButton></ScrollToTopButton>

    <Footer></Footer>
</template>

<script setup>
import Header from '@/layouts/frontend/components/Header.vue'
import Footer from '@/layouts/frontend/components/Footer.vue'
import UserInfoCard from '@/layouts/frontend/components/UserInfoCard.vue'
import CategoryListCard from '@/layouts/frontend/components/CategoryListCard.vue'
import TagListCard from '@/layouts/frontend/components/TagListCard.vue'
import ScrollToTopButton from '@/layouts/frontend/components/ScrollToTopButton.vue'
import { initTooltips } from 'flowbite'
import { onMounted, ref } from 'vue'
import { getArticlePageList } from '@/api/frontend/article'
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转分类文章列表页
const goCategoryArticleListPage = (id, name) => {
    // 跳转时通过 query 携带参数（分类 ID、分类名称）
    router.push({path: '/category/article/list', query: {id, name}})
}


// initialize components based on data attribute selectors
onMounted(() => {
    initTooltips();
})

// 文章集合
const articles = ref([])
// 加载状态
const loading = ref(true)
// 当前页码
const current = ref(1)
// 每页显示的文章数
const size = ref(10)
// 总文章数
const total = ref(0)
// 总共多少页
const pages = ref(0)


function getArticles(currentNo) {
    // 上下页是否能点击判断，当要跳转上一页且页码小于 1 时，则不允许跳转；当要跳转下一页且页码大于总页数时，则不允许跳转
    if (currentNo < 1 || (pages.value > 0 && currentNo > pages.value)) return
    loading.value = true
    // 调用分页接口渲染数据
    getArticlePageList({current: currentNo, size: size.value}).then((res) => {
        if (res.success) {
            articles.value = res.data
            current.value = res.current
            size.value = res.size
            total.value = res.total
            pages.value = res.pages
        }
    }).finally(() => {
        loading.value = false
    })
}
getArticles(current.value)

// 跳转文章详情页
const goArticleDetailPage = (articleId) => {
    router.push('/article/' + articleId)
}

// 跳转标签文章列表页
const goTagArticleListPage = (id, name) => {
    // 跳转时通过 query 携带参数（标签 ID、标签名称）
    router.push({path: '/tag/article/list', query: {id, name}})
}
</script>
