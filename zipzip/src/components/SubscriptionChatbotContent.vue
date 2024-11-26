<template>
  <div class="main-content">
    <div class="header">
      <h1 class="title">청약 관련 AI 상담</h1>
      <p class="subtitle">청약 조건이나 추천에 대한 질문을 AI에게 해보세요!</p>
    </div>

    <div class="chatbot">
      <div class="chat-body">
        <div
          v-for="(message, index) in chatHistory"
          :key="index"
          :class="['chat-message', message.sender]"
        >
          {{ message.text }}
        </div>
        <div v-if="isLoading" class="chat-loading">
          <div class="spinner"></div>
          <span class="typing-animation"
            >AI가 답변을 작성 중입니다<span>.</span><span>.</span
            ><span>.</span></span
          >
        </div>
      </div>
      <div class="chat-footer">
        <input
          type="text"
          v-model="userMessage"
          @keydown.enter="sendMessage"
          placeholder="질문을 입력하세요..."
          class="chat-input"
        />
        <button @click="sendMessage" class="send-button" :disabled="isLoading">
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { subscriptionApi } from "@/apis/subscription"; // API 정의 파일 가져오기

const userMessage = ref("");
const chatHistory = ref([]);
const isLoading = ref(false);
let abortController = null; // 요청 관리용 AbortController

const sendMessage = async () => {
  if (!userMessage.value.trim()) return;

  // 사용자의 메시지를 추가
  chatHistory.value.push({ text: userMessage.value, sender: "user" });

  const messageToSend = userMessage.value;
  userMessage.value = "";
  isLoading.value = true;

  // 기존 요청 취소
  if (abortController) {
    abortController.abort(); // 이전 요청 취소
  }
  abortController = new AbortController(); // 새로운 AbortController 생성

  try {
    // API 호출
    const response = await subscriptionApi.chatbot(messageToSend);

    // GPT의 응답을 추가
    chatHistory.value.push({ text: response.data.result, sender: "ai" });
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("요청이 취소되었습니다.");
    } else {
      console.error("Error fetching chat response:", error);
      chatHistory.value.push({
        text: "AI 응답을 가져오는 중 오류가 발생했습니다.",
        sender: "error",
      });
    }
  } finally {
    isLoading.value = false;
    abortController = null; // 완료된 후 초기화
  }
};
</script>

<style scoped>
/* 기존 헤더 스타일 유지 */
.main-content {
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
  gap: 20px;
  min-height: 100vh;
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
}

.header {
  text-align: left;
  margin-bottom: 40px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 12px 0 0 0;
}

/* 챗봇 스타일 */
.chatbot {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  max-height: 600px;
}

.chat-message {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  max-width: 75%;
  word-wrap: break-word;
}

.chat-message.user {
  align-self: flex-end;
  background-color: #eef6ff;
  color: #333;
}

.chat-message.ai {
  align-self: flex-start;
  background-color: #e8e8e8;
  color: #333;
}

.chat-message.error {
  align-self: flex-start;
  background-color: #fdecea;
  color: #d9534f;
}

/* 로딩 애니메이션 */
.chat-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  font-style: italic;
  color: #888;
  margin-top: 16px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #ccc;
  border-top: 3px solid #5592fb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 글자 애니메이션 */
.typing-animation span {
  opacity: 0;
  animation: fade-in 1.5s infinite;
}

.typing-animation span:nth-child(1) {
  animation-delay: 0s;
}
.typing-animation span:nth-child(2) {
  animation-delay: 0.3s;
}
.typing-animation span:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.chat-footer {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #ddd;
}

.chat-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.send-button {
  padding: 12px 16px;
  background-color: #5592fb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
