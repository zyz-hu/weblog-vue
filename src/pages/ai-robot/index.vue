<template>
  <Layout>
    <template #main-content>
      <div class="flex items-center justify-center flex-1 relative">
        <div class="max-w-3xl w-full px-4">
          <div class="text-center mb-10">
            <div class="flex items-center justify-center mb-3">
              <SvgIcon name="ai-robot-logo" customCss="w-10 h-10 text-gray-700 mr-3" />
              <h2 class="text-2xl text-gray-800">我是周元智AI机器人，很高兴见到你</h2>
            </div>
            <p class="text-gray-500">我可以帮你写代码、写作各种创意内容，请把你的任务交给我吧~</p>
          </div>

          <ChatInputBox
            v-model="userMessage"
            @sendMessage="sendMessage"
          />
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { ref, watch } from 'vue';
import Layout from '@/layouts/ai-robot/Layout.vue';
import SvgIcon from '@/components/ai-robot/SvgIcon.vue';
import ChatInputBox from '@/components/ai-robot/ChatInputBox.vue';
import { newChat } from '@/api/ai-robot/chat';
import { useRouter } from 'vue-router';

const router = useRouter();
const userMessage = ref('');

watch(userMessage, (newText) => {
  console.log(`收到输入: ${newText}`);
});

const sendMessage = (payload) => {
  if (!userMessage.value.trim()) return;

  const userMessageTemp = userMessage.value.trim();
  newChat(userMessageTemp).then(res => {
    if (res.success) {
        router.push({
          name: 'AiRobotChatPage',
          params: {
            chatId: res.data.uuid,
          },
          state: {
            firstMessage: userMessageTemp,
          },
        });
    }
  });
};
</script>
