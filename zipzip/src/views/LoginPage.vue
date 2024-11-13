<!-- src/views/LoginPage.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo -->
      <div class="logo">
        <img
          src="@/assets/zipzipLogo.png"
          alt="집.zip Logo"
          class="logo-image"
        />
        <h1>집.zip</h1>
      </div>

      <!-- Main Text -->
      <div class="login-text">
        <h2>간편하게 로그인하고</h2>
        <h2>다양한 서비스를 이용하세요.</h2>
      </div>

      <!-- Login Buttons -->
      <div class="login-buttons">
        <button class="kakao-login" @click="loginWithKakao">
          <img src="@/assets/kakao.png" alt="Kakao" />
          카카오톡으로 시작
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { authApi } from "@/apis/auth";

export default {
  name: "LoginPage",
  methods: {
    loginWithKakao() {
      const kakaoAuthUrl = authApi.getKakaoLoginUrl();
      window.location.href = kakaoAuthUrl; // Kakao 인증 페이지로 리디렉션
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 40px 20px;
  text-align: center;
}

.logo {
  margin-bottom: 40px;
}

.logo-image {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.logo h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.login-text {
  margin-bottom: 40px;
}

.login-text h2 {
  font-size: 24px;
  color: #333;
  margin: 5px 0;
  font-weight: 500;
}

.login-buttons {
  margin-bottom: 40px;
}

.kakao-login {
  width: 100%;
  padding: 15px;
  background-color: #fee500;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.kakao-login img {
  width: 20px;
  height: 20px;
}

.other-logins {
  text-align: center;
}

.other-logins p {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.social-btn:hover {
  background-color: #f5f5f5;
}
</style>
