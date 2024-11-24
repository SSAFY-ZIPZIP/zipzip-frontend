<template>
  <div>
    <Navbar :selectedMenu="selectedMenu" @menu-select="handleMenuSelect" />

    <div class="main-container">
      <Sidebar
        :menus="currentSidebarMenus"
        :selectedSidebarIndex="selectedSidebarIndex"
        @menu-select="handleSidebarSelect"
        class="sidebar"
      />
      <div class="content">
        <component :is="currentContentComponent" />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import MainContent from "@/components/MainContent.vue";
import SubscriptionList from "@/components/SubscriptionList.vue";
import FavoriteSubscriptionList from "@/components/FavoriteSubscriptionList.vue";

export default {
  components: {
    Navbar,
    Sidebar,
    MainContent,
    SubscriptionList,
    FavoriteSubscriptionList,
  },
  data() {
    return {
      selectedMenu: 0, // Navbar에서 선택된 메뉴
      selectedSidebarIndex: 0, // Sidebar에서 선택된 메뉴
      sidebarMenusMap: {
        0: ["위치로 검색하기", "아파트명으로 검색하기", "실거래가로 검색하기"], // MainPage Sidebar
        1: ["나에게 맞는 청약", "관심있는 청약"], // SubscriptionPage Sidebar
      },
    };
  },
  computed: {
    currentSidebarMenus() {
      return this.sidebarMenusMap[this.selectedMenu] || [];
    },
    currentContentComponent() {
      // Sidebar 선택에 따라 렌더링할 컴포넌트 반환
      if (this.selectedMenu === 0 && this.selectedSidebarIndex === 0)
        return "MainContent";
      if (this.selectedMenu === 1 && this.selectedSidebarIndex === 0)
        return "SubscriptionList";
      if (this.selectedMenu === 1 && this.selectedSidebarIndex === 1)
        return "FavoriteSubscriptionList";
      return null;
    },
  },
  methods: {
    handleMenuSelect(index) {
      this.selectedMenu = index;
      this.selectedSidebarIndex = 0; // Sidebar 선택 초기화
    },
    handleSidebarSelect(index) {
      this.selectedSidebarIndex = index;
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
