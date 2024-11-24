<template>
  <div>
    <!-- 네비게이션 바 -->
    <Navbar :selectedMenu="1" />

    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <!-- 사이드바 -->
      <Sidebar
        :menus="sidebarMenus"
        :selectedSidebarIndex="selectedSidebarIndex"
        @menu-select="handleSidebarSelect"
        class="sidebar"
      />

      <!-- 동적으로 렌더링될 콘텐츠 -->
      <div class="content">
        <SubscriptionList v-if="selectedSidebarIndex === 0" />
        <FavoriteSubscriptionList v-if="selectedSidebarIndex === 1" />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import SubscriptionList from "@/components/SubscriptionList.vue";
import FavoriteSubscriptionList from "@/components/FavoriteSubscriptionList.vue";

export default {
  name: "SubscriptionPage",
  components: {
    Navbar,
    Sidebar,
    SubscriptionList,
    FavoriteSubscriptionList,
  },
  data() {
    return {
      selectedSidebarIndex: 0, // 현재 선택된 사이드바 메뉴
      sidebarMenus: ["나에게 맞는 청약", "관심있는 청약"], // 사이드바 메뉴 리스트
    };
  },
  methods: {
    // 사이드바 메뉴 클릭 시 호출
    handleSidebarSelect(index) {
      this.selectedSidebarIndex = index; // 선택된 메뉴 업데이트
    },
  },
  mounted() {
    // URL에 따라 기본값 설정
    const currentPath = this.$router.currentRoute.value.path;
    if (currentPath === "/cheongyak") {
      this.selectedSidebarIndex = 0; // 기본값: 나에게 맞는 청약
    }
  },
  watch: {
    // 라우팅 경로 변경 시 동작
    "$router.currentRoute.value.path"(newPath) {
      if (newPath === "/cheongyak") {
        this.selectedSidebarIndex = 0; // 기본값으로 초기화
      }
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  gap: 20px; /* 사이드바와 콘텐츠 간 간격 */
  padding: 20px;
  background-color: #f9fafb;
}

.sidebar {
  width: 250px; /* 사이드바 너비 */
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
