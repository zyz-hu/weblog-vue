<template>
    <Header></Header>

    <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div class="absolute -top-32 -left-10 w-96 h-96 bg-indigo-500/30 blur-[140px] rounded-full"></div>
        <div class="absolute top-10 right-10 w-72 h-72 bg-emerald-400/25 blur-[120px] rounded-full"></div>
        <div class="page-shell relative z-10 pt-10 pb-16">
            <div class="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
                <div class="space-y-6 text-white">
                    <p class="text-sm uppercase tracking-[0.4em] text-white/60">Personal weblog</p>
                    <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">
                        把代码、想法和日常灵感串成一条更轻松的时间线
                    </h1>
                    <p class="text-lg text-white/80 leading-relaxed max-w-2xl">
                        不是商业站点，而是自己的网络花园。更开阔的留白、更舒展的节奏，让阅读像翻开一本随笔本。
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <button @click="scrollToArticles"
                           class="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-slate-900 font-semibold shadow-lg shadow-white/20 hover:-translate-y-0.5 transition">
                            开始阅读
                        </button>
                        <button @click="router.push('/ai-robot')"
                            class="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition">
                            探索 AI 实验室
                        </button>
                    </div>
                    <div class="flex items-center gap-4 text-white/70 pt-2">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            持续更新
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-sky-300"></span>
                            保留一点私人的温度
                        </div>
                    </div>
                </div>
                <div class="glass-card bg-white text-slate-900 dark:bg-slate-800 dark:text-white p-6 flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <p class="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">最新文章</p>
                        <span class="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-700 dark:border-slate-600 dark:text-slate-200 bg-white dark:bg-slate-700">夜读清单</span>
                    </div>
                    <div class="space-y-3 max-h-[340px] overflow-hidden">
                        <div v-for="(article, index) in articles.slice(0, 4)" :key="index"
                            class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-700/80 dark:border-slate-700">
                            <div class="w-12 h-12 rounded-xl bg-white/10 overflow-hidden">
                                <img v-if="article.cover" :src="article.cover" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-semibold line-clamp-1">{{ article.title || '未命名' }}</p>
                                <p class="text-xs text-slate-500 dark:text-slate-300">{{ article.createDate }}</p>
                            </div>
                            <button class="text-xs text-indigo-600 dark:text-emerald-200 hover:underline" @click="goArticleDetailPage(article.id)">阅读全文</button>
                        </div>
                        <p v-if="!articles.length" class="text-sm text-slate-500 dark:text-slate-200">还没有文章，等我写点东西再来吧。</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <main id="articles" class="page-shell -mt-10 pb-16 relative z-10">
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-8 space-y-6">
                <template v-if="loading">
                    <div v-for="i in 3" :key="i" class="glass-card h-44 animate-pulse bg-white/60"></div>
                </template>

                <template v-else>
                    <div v-if="articles.length === 0" class="glass-card p-10 text-center">
                        <p class="text-slate-500 text-lg">暂无文章，等我写点有趣的再来。</p>
                    </div>

                    <div class="stream-grid">
                        <article v-for="(article, index) in articles" :key="index"
                            class="glass-card overflow-hidden hover:-translate-y-1 transition duration-300">
                            <div class="relative aspect-[4/3] bg-slate-900/5 cursor-pointer" @click="goArticleDetailPage(article.id)">
                                <img v-if="article.cover" :src="article.cover"
                                    class="w-full h-full object-cover transition duration-500 hover:scale-105" />
                                <div v-else class="w-full h-full flex items-center justify-center text-4xl text-slate-400">✏️</div>
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                <div class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/85 text-slate-800">
                                    {{ article.category?.name || '未分类' }}
                                </div>
                            </div>

                            <div class="p-6 space-y-3">
                                <div class="flex items-center text-xs text-slate-500 gap-3">
                                    <span class="inline-flex items-center gap-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                            </path>
                                        </svg>
                                        {{ article.createDate }}
                                    </span>
                                    <span class="inline-flex items-center gap-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                            </path>
                                        </svg>
                                        {{ article.readNum || 0 }}
                                    </span>
                                </div>
                                <h2 class="text-xl font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600"
                                    @click="goArticleDetailPage(article.id)">
                                    {{ article.title }}
                                </h2>
                                <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                                    {{ article.summary || '这篇文章还没有摘要，点击阅读正文吧。' }}
                                </p>
                                <div class="flex flex-wrap gap-2 pt-1">
                                    <span v-for="tag in article.tags" :key="tag.id" @click.stop="goTagArticleListPage(tag.id, tag.name)"
                                        class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-slate-900 text-white cursor-pointer">
                                        #{{ tag.name }}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>
                </template>

                <div v-if="pages > 1" class="flex justify-center pt-4">
                    <div class="inline-flex items-center gap-2 bg-white/70 border border-slate-200 rounded-full px-2 py-1 shadow-sm">
                        <button @click="getArticles(current - 1)" :disabled="current <= 1"
                            class="px-3 py-2 rounded-full text-sm font-semibold"
                            :class="current <= 1 ? 'text-slate-400' : 'text-slate-700 hover:text-indigo-600'">上一页</button>
                        <button v-for="p in pages" :key="p" @click="getArticles(p)"
                            class="w-9 h-9 rounded-full text-sm font-semibold"
                            :class="p === current ? 'bg-slate-900 text-white shadow' : 'text-slate-700 hover:bg-slate-100'">
                            {{ p }}
                        </button>
                        <button @click="getArticles(current + 1)" :disabled="current >= pages"
                            class="px-3 py-2 rounded-full text-sm font-semibold"
                            :class="current >= pages ? 'text-slate-400' : 'text-slate-700 hover:text-indigo-600'">下一页</button>
                    </div>
                </div>
            </div>

            <aside class="col-span-12 lg:col-span-4 space-y-4">
                <UserInfoCard></UserInfoCard>
                <CategoryListCard></CategoryListCard>
                <TagListCard></TagListCard>
            </aside>
        </div>
    </main>

    <ScrollToTopButton></ScrollToTopButton>
    <Footer></Footer>
</template>

<script setup>
import Header from '@/layouts/frontend/components/Header.vue';
import Footer from '@/layouts/frontend/components/Footer.vue';
import UserInfoCard from '@/layouts/frontend/components/UserInfoCard.vue';
import CategoryListCard from '@/layouts/frontend/components/CategoryListCard.vue';
import TagListCard from '@/layouts/frontend/components/TagListCard.vue';
import ScrollToTopButton from '@/layouts/frontend/components/ScrollToTopButton.vue';
import { initTooltips } from 'flowbite';
import { onMounted, ref } from 'vue';
import { getArticlePageList } from '@/api/frontend/article';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
    initTooltips();
});

const articles = ref([]);
const loading = ref(true);
const current = ref(1);
const size = ref(10);
const total = ref(0);
const pages = ref(0);

function getArticles(currentNo) {
    if (currentNo < 1 || (pages.value > 0 && currentNo > pages.value)) return;
    loading.value = true;
    getArticlePageList({ current: currentNo, size: size.value }).then((res) => {
        if (res.success) {
            articles.value = res.data;
            current.value = res.current;
            size.value = res.size;
            total.value = res.total;
            pages.value = res.pages;
        }
    }).finally(() => {
        loading.value = false;
    });
}
getArticles(current.value);

const goArticleDetailPage = (articleId) => {
    router.push('/article/' + articleId);
};

const goTagArticleListPage = (id, name) => {
    router.push({ path: '/tag/article/list', query: { id, name } });
};

const scrollToArticles = () => {
    const el = document.getElementById('articles');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
</script>
