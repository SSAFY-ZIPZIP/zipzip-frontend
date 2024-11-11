<template>
  <div class="navbar">
    <div class="logo" @click="goToMain">
      <img src="@/assets/zipzipLogo.png" alt="집.zip Logo" class="logo-image" />
      <span><h2>집.zip</h2></span>
    </div>
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
    <div class="user-icon-wrapper" v-click-outside="closePopover">
      <div class="user-icon" @click="togglePopover">
        <i class="fa fa-user-circle"></i>
      </div>

      <!-- Floating popover container -->
      <div v-if="isPopoverVisible" class="popover-container">
        <div class="popover-arrow"></div>
        <div class="popover" :class="{ show: isPopoverVisible }">
          <!-- Logged in state -->
          <div v-if="isAuthenticated" class="auth-popover">
            <div class="user-info">
              <div class="profile-icon">🦐</div>
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

          <!-- Not logged in state -->
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
import { ref, onMounted } from "vue"; // ref와 onMounted를 Vue로부터 가져옴
import { useRouter } from "vue-router"; // Vue Router 사용을 위해 useRouter 가져옴
import axios from "axios"; // HTTP 요청을 위한 axios 라이브러리 가져옴

export default {
  name: "Navbar", // 컴포넌트 이름 지정
  directives: {
    // 사용자 정의 디렉티브: 'click-outside'
    "click-outside": {
      mounted(el, binding) {
        // 요소에 클릭 이벤트를 등록하여 바인딩된 메서드가 외부 클릭 시 호출되도록 설정
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event); // 요소 외부 클릭 시 바인딩된 메서드 호출
          }
        };
        document.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        // 요소가 제거될 때, 클릭 이벤트 제거
        document.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
  setup() {
    const router = useRouter(); // 라우터 인스턴스 생성
    const isPopoverVisible = ref(false); // popover가 보이는지 여부를 나타내는 상태
    const isAuthenticated = ref(false); // 사용자 인증 상태를 나타내는 상태
    const username = ref(""); // 사용자 이름 상태
    const email = ref(""); // 사용자 이메일 상태
    const menuItems = ref(["매물.zip", "청약.zip", "우리.zip"]); // 네비게이션 메뉴 아이템
    const selectedMenu = ref(0); // 현재 선택된 메뉴 인덱스 상태
    const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

    // 사용자 인증 상태를 확인하는 함수
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken"); // localStorage에서 accessToken 가져옴
      const refreshToken = localStorage.getItem("refreshToken"); // localStorage에서 refreshToken 가져옴

      if (accessToken && refreshToken) {
        // 인증된 상태라면
        isAuthenticated.value = true; // 인증 상태 true로 설정
        username.value = localStorage.getItem("username") || "윤수빈"; // 사용자 이름 로드
        email.value = localStorage.getItem("email") || "subinzzang@naver.com"; // 사용자 이메일 로드
      } else {
        isAuthenticated.value = false; // 인증된 상태가 아니라면 false로 설정
      }
    };

    // 로그아웃 처리 함수
    const handleLogout = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // 서버에 로그아웃 요청
        await axios.post(`${baseUrl}/v1/oauth/logout`, null, {
          headers: {
            "X-Refresh": `${refreshToken}`,
          },
        });

        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 인증 상태 false로 설정
        isAuthenticated.value = false;

        // popover 닫기
        closePopover();

        // 메인 페이지로 리다이렉트
        router.push("/");
      } catch (error) {
        console.error("로그아웃 중 에러 발생:", error);
        // 에러 발생 시에도 로컬 토큰은 삭제하여 로그아웃 상태로 만듦
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        isAuthenticated.value = false;
      }
    };

    // popover 보이기/숨기기 토글 함수
    const togglePopover = () => {
      isPopoverVisible.value = !isPopoverVisible.value;
    };

    // popover 닫기 함수
    const closePopover = () => {
      isPopoverVisible.value = false;
    };

    // 로그인 페이지로 이동하는 함수
    const goToLogin = () => {
      router.push("/login"); // 라우터를 통해 로그인 페이지로 이동
      closePopover(); // popover 닫기
    };

    // 메인 페이지로 이동하는 함수
    const goToMain = () => {
      router.push("/"); // 라우터를 통해 메인 페이지로 이동
    };

    // 메뉴 선택 함수 (index는 메뉴의 인덱스를 의미)
    const selectMenu = (index) => {
      selectedMenu.value = index; // 선택된 메뉴의 인덱스를 업데이트
    };

    // 컴포넌트가 마운트될 때, 사용자 인증 상태 확인
    onMounted(() => {
      checkAuthStatus();
    });

    // setup 함수의 리턴 값: 템플릿에서 사용할 변수와 함수들
    return {
      isPopoverVisible,
      isAuthenticated,
      username,
      email,
      menuItems,
      selectedMenu,
      togglePopover,
      closePopover,
      goToLogin,
      goToMain,
      selectMenu,
      handleLogout, // handleLogout 함수 추가
    };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 20px;
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
  gap: 40px;
  justify-content: start;
  margin-left: 20px;
  flex-grow: 1;
}

.menu-item {
  font-weight: 500;
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

/* Popover container styling */
.popover-container {
  position: absolute;
  top: calc(100% + 10px);
  right: 20px;
  z-index: 1000;
}

/* Arrow styling */
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

/* Popover styling */
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

.profile-icon {
  font-size: 24px;
  margin-right: 12px;
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
