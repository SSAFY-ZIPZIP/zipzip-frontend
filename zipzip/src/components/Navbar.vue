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
    <div class="user-icon" @click="goToLogin">
      <i class="fa fa-user-circle"></i>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "Navbar",
  setup() {
    const router = useRouter();

    const menuItems = ref(["매물.zip", "청약.zip", "우리.zip"]);
    const selectedMenu = ref(0); // 초기 선택된 메뉴 인덱스

    const selectMenu = (index) => {
      selectedMenu.value = index; // 선택된 메뉴 인덱스를 업데이트
    };

    const goToLogin = () => {
      router.push("/login"); // 로그인 페이지로 이동
    };

    const goToMain = () => {
      router.push("/");
    };

    return { menuItems, selectedMenu, selectMenu, goToLogin, goToMain };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f9fafb;
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
.user-icon {
  font-size: 24px;
  color: #5592fb;
  cursor: pointer;
  padding-right: 20px;
}
</style>
