<template>
  <Layout>
    <template #main-content>
      <div class="h-full flex flex-col relative w-full max-w-full">
        <div class="flex-1 overflow-y-auto scroll-smooth custom-scrollbar w-full" ref="chatContainer">
          <div class="max-w-3xl mx-auto pt-10 pb-60 px-4 md:px-6 w-full flex flex-col gap-8">
            <div v-if="chatList.length === 0" class="text-center mt-32 opacity-40 select-none transition-opacity duration-300">
              <SvgIcon name="ai-robot-logo" customCss="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600 transition-colors duration-300" />
              <p class="text-xl font-medium text-gray-400 transition-colors duration-300">你好，我是周元智 AI</p>
            </div>

            <template v-for="(chat, index) in chatList" :key="index">
              <div v-if="chat.role === 'user'" class="flex justify-end w-full pl-12">
                <div class="whitespace-pre-wrap bg-[#f3f4f6] dark:bg-[#2f2f2f] text-gray-800 dark:text-gray-100 px-5 py-3.5 rounded-[20px] rounded-tr-sm max-w-full text-[15px] leading-relaxed break-words transition-colors duration-300">
                  {{ chat.content }}
                </div>
              </div>

              <div v-else class="flex gap-4 w-full pr-2 group">
                <div class="flex-shrink-0 mt-1">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-100 dark:bg-[#1e1f20] dark:border-gray-700 overflow-hidden transition-colors duration-300">
                    <SvgIcon name="deepseek-logo" customCss="w-5 h-5 transition-transform duration-300" />
                  </div>
                </div>

                <div class="flex-1 min-w-0 overflow-hidden">
                  <div class="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1.5 ml-1 select-none transition-colors duration-300">
                    DeepSeek
                  </div>

                  <div class="prose-content text-gray-800 dark:text-gray-100 text-[15px] leading-7 transition-colors duration-300">
                    <ReasoningBlock
                      v-if="chat.reasoning_content"
                      :content="chat.reasoning_content"
                      :loading="chat.loading && chat.is_reasoning"
                      :startTime="chat.startTime"
                    />

                    <LoadingDots v-if="chat.loading && !chat.content && !chat.reasoning_content" />
                    
                    <StreamMarkdownRender :content="chat.content" />
                  </div>

                  <div v-if="chat.error" class="mt-3 flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg w-fit transition-colors duration-300">
                    <span>⚠ {{ chat.errorMessage }}</span>
                    <button @click="retryMessage(index)" class="underline hover:text-red-600 ml-2 transition-colors duration-300">重试</button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 w-full z-20">
          <div 
            class="h-16 w-full pointer-events-none bg-white dark:bg-[#131314] transition-colors duration-300"
            style="mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%); -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%);"
          ></div>
          
          <div class="bg-white dark:bg-[#131314] px-4 pb-8 pt-2 transition-colors duration-300">
            <div class="max-w-3xl mx-auto">
              <ChatInputBox
                v-model="message"
                :loading="isGlobalLoading"
                @sendMessage="sendMessage"
                @stopGeneration="handleStopGeneration"
              />
              <div class="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-3 select-none transition-colors duration-300">
                AI 生成内容可能不准确，请仔细甄别
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue';
import SvgIcon from '@/components/ai-robot/SvgIcon.vue';
import StreamMarkdownRender from '@/components/ai-robot/StreamMarkdownRender.vue';
import LoadingDots from '@/components/ai-robot/LoadingDots.vue';
import ReasoningBlock from '@/components/ai-robot/ReasoningBlock.vue';
import Layout from '@/layouts/ai-robot/Layout.vue';
import ChatInputBox from '@/components/ai-robot/ChatInputBox.vue';
import { useRoute } from 'vue-router';
import { useAiChatStore } from '@/stores/ai-robot/chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { findChatMessagePageList } from '@/api/ai-robot/chat';
import { getToken } from '@/composables/cookie';

const chatStore = useAiChatStore();
const route = useRoute();

const message = ref(history.state?.firstMessage || '');
const chatContainer = ref(null);
const chatList = ref([]);
const chatId = ref(route.params.chatId || null);
const current = ref(1);
const size = ref(20); 
const hasMore = ref(true);
const isLoadingMore = ref(false);
let abortController = null; 

const isGlobalLoading = computed(() => chatList.value.some(chat => chat.loading));

watch(() => route.params.chatId, (newChatId) => {
  if (newChatId) {
    chatId.value = newChatId;
    chatList.value = [];
    current.value = 1;
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    loadHistoryMessages();
  }
});

onMounted(() => {
  loadHistoryMessages();
  if (chatContainer.value) chatContainer.value.addEventListener('scroll', handleScroll);
  
  if (history.state?.firstMessage) {
    message.value = history.state.firstMessage;
    sendMessage({ selectedModel: chatStore.selectedModel, isNetworkSearch: chatStore.isNetworkSearchSelected });
    if (history.replaceState) {
      const newState = { ...history.state }; delete newState.firstMessage;
      history.replaceState(newState, document.title);
    }
  }
});

onBeforeUnmount(() => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  if (chatContainer.value) chatContainer.value.removeEventListener('scroll', handleScroll);
});

const loadHistoryMessages = async () => {
  try {
    isLoadingMore.value = true;
    const res = await findChatMessagePageList(current.value, size.value, chatId.value);
    
    if (res.success) {
      const rawList = res.data || res.records || res.list || [];
      
      const totalPages = res.pages || Math.ceil((res.total || 0) / size.value);
      hasMore.value = totalPages > current.value;

      if (rawList && rawList.length > 0) {
        const formattedMessages = rawList.map(msg => {
          let safeRole = (msg.role || 'user').trim().toLowerCase();
          if (safeRole !== 'assistant' && safeRole !== 'system' && safeRole !== 'function') {
            safeRole = 'user';
          }

          return {
            ...msg,
            uuid: msg.id ? String(msg.id) : `temp-${Date.now()}-${Math.random()}`,
            role: safeRole, 
            loading: false, 
            paused: false,
            error: false,
            errorMessage: msg.errorMessage || '',
            reasoning_content: msg.reasoningContent || msg.reasoning_content || '', 
            content: msg.content || '',
            createTime: msg.createTime || msg.create_time || '',
          };
        });

        if (formattedMessages.length > 1) {
          const firstTime = new Date(formattedMessages[0].createTime || '').getTime();
          const lastTime = new Date(formattedMessages[formattedMessages.length - 1].createTime || '').getTime();
          if (firstTime && lastTime && firstTime > lastTime) {
            formattedMessages.reverse();
          }
        }

        chatList.value.unshift(...formattedMessages);
      }
      
      if (current.value === 1) scrollToBottom();
    }
  } catch (error) {
    console.error('加载失败:', error);
  } finally {
    isLoadingMore.value = false;
  }
};

const sendMessage = async (payload) => {
  const textToSend = payload?.text || message.value.trim();
  if (!textToSend) return;

  chatList.value.push({ role: 'user', content: textToSend });
  message.value = ''; 

  await nextTick();
  scrollToBottom();

  const assistantMessage = { 
    role: 'assistant', content: '', reasoning_content: '', 
    loading: true, is_reasoning: false, startTime: Date.now(),
    error: false, errorMessage: '', paused: false,
  };
  chatList.value.push(assistantMessage);
  const currentMsgRef = chatList.value[chatList.value.length - 1];

  try {
    const selectedModel = payload?.selectedModel || chatStore.selectedModel;
    abortController = new AbortController();
    const token = getToken();

    await fetchEventSource('/robot/chat/completion', {
      method: 'POST',
      signal: abortController.signal,
      openWhenHidden: true,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message: textToSend,
        chatId: chatId.value,
        modelName: selectedModel?.name || 'deepseek-chat',
        networkSearch: !!payload?.isNetworkSearch,
        temperature: selectedModel?.temperature ?? 0.7,
      }),
      async onopen(response) {
        if (!response.ok) throw new Error(`请求失败: ${response.status}`);
      },
      onmessage(msg) {
        if (!msg.data) return;
        try {
          const parseJson = JSON.parse(msg.data);
          const { v, type } = parseJson;
          if (type === 'reasoning') {
            currentMsgRef.reasoning_content += v;
            currentMsgRef.is_reasoning = true;
          } else if (type === 'ping') {
            // 心跳
          } else {
            currentMsgRef.content += v;
            currentMsgRef.is_reasoning = false;
          }
          scrollToBottom();
        } catch (e) { console.error("SSE Error:", e); }
      },
      onclose() { throw new Error('StreamComplete'); },
      onerror(err) {
        if (err.message === 'StreamComplete' || err.name === 'AbortError') throw err;
        currentMsgRef.error = true;
        currentMsgRef.errorMessage = '连接中断';
        throw err; 
      },
    });
  } catch (error) {
    currentMsgRef.loading = false;
    if (error.name !== 'AbortError' && error.message !== 'StreamComplete') {
      currentMsgRef.error = true;
      currentMsgRef.errorMessage = error.message || '请求失败';
    }
  } finally {
     if (abortController) abortController = null;
  }
};

const handleStopGeneration = () => {
  if (abortController) {
    const lastAssistant = [...chatList.value].reverse().find(msg => msg.role === 'assistant' && msg.loading);
    if (lastAssistant) {
      lastAssistant.loading = false;
      lastAssistant.paused = true;
    }
    abortController.abort();
  }
};

const retryMessage = (index) => {
  const userMsgIndex = index - 1;
  if (userMsgIndex >= 0) {
    const userMsg = chatList.value[userMsgIndex];
    chatList.value.splice(userMsgIndex, 2); 
    sendMessage({ text: userMsg.content });
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' });
  }
};

const handleScroll = () => {
  if (chatContainer.value && chatContainer.value.scrollTop < 50 && hasMore.value && !isLoadingMore.value) {
    const oldScrollHeight = chatContainer.value.scrollHeight;
    current.value += 1;
    loadHistoryMessages().then(() => {
      nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight - oldScrollHeight;
        }
      });
    });
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
</style>
