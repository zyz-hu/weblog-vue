<template>
  <div 
    class="h-screen w-screen flex overflow-hidden transition-colors duration-300"
    style="background-color: var(--app-bg); color: var(--app-text);"
  >
    <Sidebar :sidebarOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <div class="flex-1 flex flex-col h-full relative min-w-0 transition-all duration-300">
      <main class="flex-1 h-full overflow-hidden flex flex-col relative">
        <slot name="main-content"></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/ai-robot/Sidebar.vue';

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>
