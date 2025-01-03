<template>
  <div class="navbar">
    <!-- 로고 클릭 시 메인으로 이동 -->
    <div class="logo" @click="goToMain">
      <img src="@/assets/zipzipLogo.png" alt="집.zip Logo" class="logo-image" />
      <span><h2>집.zip</h2></span>
    </div>

    <!-- 네비게이션 메뉴 -->
    <div class="menu">
      <span
        v-for="(item, index) in menuItems"
        :key="index"
        :class="['menu-item', { selected: selectedMenu === index }]"
        @click="selectMenu(index)"
      >
        {{ item }}
      </span>
    </div>

    <!-- 유저 프로필 -->
    <div class="user-icon-wrapper" v-click-outside="closePopover">
      <div class="user-icon" @click="togglePopover">
        <template v-if="isAuthenticated && !isLoading">
          <img
            v-if="profileImageUrl && profileImageUrl !== ''"
            :src="profileImageUrl"
            alt="Profile Icon"
            class="profile-image"
            @error="handleImageError"
          />
          <i v-else class="fa fa-user-circle"></i>
        </template>
        <i v-else class="fa fa-user-circle"></i>
      </div>

      <!-- 팝오버 -->
      <div v-if="isPopoverVisible" class="popover-container">
        <div class="popover-arrow"></div>
        <div class="popover" :class="{ show: isPopoverVisible }">
          <div v-if="isAuthenticated" class="auth-popover">
            <div class="user-info" v-if="!isLoading">
              <div class="profile-wrapper">
                <img
                  v-if="profileImageUrl && profileImageUrl !== ''"
                  :src="profileImageUrl"
                  alt="Profile Icon"
                  class="profile-image"
                  @error="handleImageError"
                />
                <i v-else class="fa fa-user-circle profile-icon"></i>
              </div>
              <div class="user-details">
                <div class="username">{{ username }}</div>
                <div class="email">{{ email }}</div>
              </div>
            </div>
            <div class="nav-link" @click="handleLogout">
              <img src="@/assets/btn_logout.png" alt="logout" class="icon" />
              <span>로그아웃</span>
            </div>
          </div>

          <div v-else class="non-auth-popover">
            <div class="login-message">아직 로그인 하지 않으셨네요!</div>
            <div class="nav-link" @click="goToLogin">
              <img src="@/assets/btn_login.png" alt="login" class="icon" />
              <span>로그인</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { memberApi } from "@/apis/member";
import { authApi } from "@/apis/auth";

export default {
  name: "Navbar",
  props: {
    selectedMenu: Number, // 부모에서 현재 선택된 메뉴 값 전달
  },
  emits: ["menu-select", "auth-status-update"], // 부모(MainPage 등)로 이벤트 전달
  setup(props, { emit }) {
    const router = useRouter();
    const isPopoverVisible = ref(false);
    const isAuthenticated = ref(false);
    const username = ref("");
    const email = ref("");
    const profileImageUrl = ref("");
    const menuItems = ["매물.zip", "청약.zip", "우리.zip"];
    const isLoading = ref(true);

    const handleImageError = (e) => {
      e.target.style.display = "none";
      profileImageUrl.value = "";
    };

    const checkAuthStatus = async () => {
      isLoading.value = true;

      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        isAuthenticated.value = true;

        try {
          const response = await memberApi.getUserInfo();
          profileImageUrl.value = response.data.profileImgUrl || "";
          username.value = response.data.nickname || "알 수 없는 사용자";
          email.value = response.data.email || "이메일 없음";
        } catch (error) {
          isAuthenticated.value = false;
        }
      } else {
        isAuthenticated.value = false;
      }

      emit("auth-status-update", isAuthenticated.value);
      isLoading.value = false;
    };

    const handleLogout = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        await authApi.logout(refreshToken);
        localStorage.clear();
        isAuthenticated.value = false;
        emit("auth-status-update", isAuthenticated.value);
        closePopover();
        router.push("/");
      } catch (error) {
        console.error("로그아웃 중 에러 발생:", error);
      }
    };

    const togglePopover = () => {
      isPopoverVisible.value = !isPopoverVisible.value;
    };

    const closePopover = () => {
      isPopoverVisible.value = false;
    };

    const goToLogin = () => {
      router.push("/login");
      closePopover();
    };

    const goToMain = () => {
      router.push("/");
    };

    const selectMenu = (index) => {
      emit("menu-select", index); // 부모로 선택된 메뉴 이벤트 전달
      if (index === 0) router.push("/");
      else if (index === 1) router.push("/cheongyak");
      else if (index === 2) router.push("/workspace");
    };

    onMounted(() => {
      checkAuthStatus();
    });

    return {
      isPopoverVisible,
      isAuthenticated,
      username,
      email,
      profileImageUrl,
      menuItems,
      isLoading,
      handleImageError,
      handleLogout,
      togglePopover,
      closePopover,
      goToLogin,
      goToMain,
      selectMenu,
    };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 20px 20px 20px 20px; /* 위, 오른쪽, 아래, 왼쪽 */
  background-color: #f9fafb;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  width: 240px;
  justify-content: center;
  cursor: pointer;
}

.logo-image {
  width: 24px;
  margin-right: 8px;
}

.menu {
  display: flex;
  gap: 70px;
  justify-content: start;
  margin-left: 65px;
  flex-grow: 1;
}

.menu-item {
  font-weight: 700;
  font-size: large;
  color: #666;
  cursor: pointer;
}

.menu-item.selected {
  color: #5592fb;
  font-weight: bold;
}

.user-icon-wrapper {
  position: relative;
}

.user-icon {
  font-size: 24px;
  color: #5592fb;
  cursor: pointer;
  padding-right: 20px;
}

.popover-container {
  position: absolute;
  top: calc(100% + 10px);
  right: 20px;
  z-index: 1000;
}

.popover-arrow {
  position: absolute;
  top: -8px;
  right: 13px;
  width: 16px;
  height: 16px;
  background-color: white;
  transform: rotate(45deg);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.popover {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 240px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

/* 프로필 이미지 관련 새로운 스타일 */
.profile-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.profile-image {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.user-icon .profile-image {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-icon {
  font-size: 35px;
  color: #5592fb;
  margin-right: 12px;
}

.user-icon .fa-user-circle {
  font-size: 35px;
  color: #5592fb;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.email {
  font-size: 12px;
  color: #666;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 0;
  font-size: 14px;
  color: #333;
}

.nav-link .icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.nav-link:hover {
  color: #5592fb;
}

.login-message {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.popover.show {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
