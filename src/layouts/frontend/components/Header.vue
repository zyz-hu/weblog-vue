<template>
  <header class="sticky top-0 z-50 w-full transition-all duration-300" :class="{'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm': isScrolled, 'bg-transparent': !isScrolled}">
    <nav class="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <a href="/" class="flex items-center gap-3 group">
          <div class="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg transform group-hover:rotate-6 transition-all duration-300">
            <img :src="blogSettingsStore.blogSettings.logo" class="w-full h-full object-cover" alt="Logo" />
          </div>
          <span class="self-center text-xl font-bold whitespace-nowrap text-slate-800 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">
            {{ blogSettingsStore.blogSettings.name }}
          </span>
        </a>

        <div class="hidden md:flex items-center space-x-8">
          <a v-for="(item, index) in navItems" :key="index" @click="router.push(item.path)"
             class="text-sm font-medium transition-colors cursor-pointer relative py-2"
             :class="[isActiveNav(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white']">
            {{ item.name }}
            <span v-if="isActiveNav(item.path)" class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
          </a>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative hidden md:block">
            <input type="text" 
              class="w-40 focus:w-60 transition-all duration-300 py-1.5 pl-9 pr-4 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder-slate-400"
              placeholder="搜索..." />
            <svg class="w-4 h-4 absolute left-3 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <button @click="router.push('/ai-robot')" class="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"></path><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle></svg>
            AI 机器人
          </button>

          <div v-if="!isLogined">
            <button @click="$router.push('/login')" class="px-5 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-indigo-600 rounded-full hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              登录
            </button>
          </div>
          
          <div v-else class="relative group">
            <button class="flex items-center gap-2 focus:outline-none">
              <img class="w-9 h-9 rounded-full ring-2 ring-white dark:ring-slate-700 shadow-md object-cover" :src="blogSettingsStore.blogSettings.avatar" alt="user photo">
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 transform origin-top-right border border-slate-100 dark:border-slate-700">
              <a @click="router.push('/admin/index')" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>后台管理</span>
              </a>
              <a @click="logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 cursor-pointer">
                <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>退出登录</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useBlogSettingsStore } from '@/stores/blogsettings';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';
import { showMessage } from '@/composables/util';

const router = useRouter();
const route = useRoute();
const currPath = ref(route.path);
const blogSettingsStore = useBlogSettingsStore();
const userStore = useUserStore();
const isLogined = ref(Object.keys(userStore.userInfo).length > 0);
const isScrolled = ref(false);

const navItems = [
  { name: '首页', path: '/' },
  { name: '分类', path: '/category/list' },
  { name: '标签', path: '/tag/list' },
  { name: '归档', path: '/archive/list' },
  { name: 'AI 机器人', path: '/ai-robot' },
];

const isActiveNav = (path) => currPath.value === path || currPath.value.startsWith(path + '/');

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20;
  });
});

watch(() => route.path, (newPath) => {
  currPath.value = newPath;
});

const logout = () => {
  userStore.logout();
  isLogined.value = false;
  showMessage('退出登录成功');
};
</script>
