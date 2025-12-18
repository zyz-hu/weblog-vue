<template>
    <Header></Header>

    <section class="relative w-full h-[450px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900"></div>
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[128px] animate-pulse"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[128px] animate-pulse" style="animation-delay: 1s;"></div>
        
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div class="relative z-10 text-center max-w-4xl px-6 animate-fade-in-up">
            <h1 class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-indigo-400 mb-6 tracking-tight">
                探索代码与灵感的边界
            </h1>
            <p class="text-lg md:text-xl text-slate-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                记录技术点滴，分享生活感悟。在这里，我们用代码构建世界，用文字温暖人心。
            </p>
            <div class="flex justify-center gap-4">
                <a href="#articles" class="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1">
                    开始阅读
                </a>
                <a href="https://github.com/zyz-hu" target="_blank" class="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/10 transition-all">
                    访问 GitHub
                </a>
            </div>
        </div>
    </section>

    <main class="relative z-20 -mt-16 container max-w-screen-xl mx-auto px-4 sm:px-6 pb-20">
        
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-8 space-y-6">
                
                <template v-if="loading">
                    <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm h-48 animate-pulse border border-slate-100 dark:border-slate-700"></div>
                </template>

                <template v-else>
                    <div v-if="articles.length === 0" class="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700">
                        <p class="text-slate-500 text-lg">暂无文章，博主正在努力码字中...</p>
                    </div>

                    <article v-for="(article, index) in articles" :key="index" 
                        class="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 border border-slate-100 dark:border-slate-700/50 overflow-hidden flex flex-col md:flex-row h-auto md:h-60">
                        
                        <div class="md:w-5/12 w-full h-48 md:h-full relative overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-900" @click="goArticleDetailPage(article.id)">
                            <img v-if="article.cover" :src="article.cover" 
                                 class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
                            
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800 dark:to-slate-900" 
                                 :style="!article.cover ? 'display:flex' : 'display:none'">
                                <span class="text-4xl">📝</span>
                            </div>

                            <div class="absolute top-3 left-3">
                                <span class="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold uppercase tracking-wider text-indigo-600 rounded-md shadow-sm border border-indigo-100 dark:border-indigo-900/30">
                                    {{ article.category?.name || '未分类' }}
                                </span>
                            </div>
                        </div>

                        <div class="md:w-7/12 w-full p-6 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center text-xs text-slate-400 mb-2 space-x-3">
                                    <span class="flex items-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ article.createDate }}</span>
                                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span class="flex items-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> {{ article.readNum || 0 }}</span>
                                </div>
                                <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1" @click="goArticleDetailPage(article.id)">
                                    {{ article.title }}
                                </h2>
                                <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                    {{ article.summary || '这是一篇没有摘要的文章，点击查看详情阅读全文...' }}
                                </p>
                            </div>
                            
                            <div class="mt-4 flex items-center justify-between">
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="tag in article.tags" :key="tag.id" @click.stop="goTagArticleListPage(tag.id, tag.name)"
                                          class="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer transition">
                                        #{{ tag.name }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                </template>

                <div v-if="pages > 1" class="flex justify-center pt-8">
                    <nav class="inline-flex shadow-sm rounded-md isolate">
                        <button @click="getArticles(current - 1)" :disabled="current <= 1" class="relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700">上一页</button>
                        <button v-for="p in pages" :key="p" @click="getArticles(p)" 
                            :class="[p === current ? 'bg-indigo-600 text-white focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-white dark:ring-slate-700 dark:bg-slate-800', 'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20']">
                            {{ p }}
                        </button>
                        <button @click="getArticles(current + 1)" :disabled="current >= pages" class="relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700">下一页</button>
                    </nav>
                </div>
            </div>

            <aside class="col-span-12 lg:col-span-4 space-y-6">
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
                    <UserInfoCard></UserInfoCard>
                    <div class="mt-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">分类</h3>
                        <CategoryListCard></CategoryListCard>
                    </div>
                    <div class="mt-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">标签云</h3>
                        <TagListCard></TagListCard>
                    </div>
                </div>
            </aside>
        </div>
    </main>

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

const goCategoryArticleListPage = (id, name) => {
    router.push({path: '/category/article/list', query: {id, name}})
}

onMounted(() => {
    initTooltips();
})

const articles = ref([])
const loading = ref(true)
const current = ref(1)
const size = ref(10)
const total = ref(0)
const pages = ref(0)

function getArticles(currentNo) {
    if (currentNo < 1 || (pages.value > 0 && currentNo > pages.value)) return
    loading.value = true
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

const goArticleDetailPage = (articleId) => {
    router.push('/article/' + articleId)
}

const goTagArticleListPage = (id, name) => {
    router.push({path: '/tag/article/list', query: {id, name}})
}
</script>