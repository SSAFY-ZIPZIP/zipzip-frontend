<template>
  <div>
    <!-- 네비게이션 바 -->
    <Navbar :selectedMenu="1" />

    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <!-- 사이드바 -->
      <Sidebar :menus="sidebarMenus" @menu-select="handleSidebarSelect" />
      <!-- 청약 리스트 -->
      <SubscriptionList />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import SubscriptionList from "@/components/SubscriptionList.vue";

export default {
  name: "SubscriptionPage",
  components: {
    Navbar,
    Sidebar,
    SubscriptionList,
  },
  data() {
    return {
      sidebarMenus: ["나에게 맞는 청약", "관심있는 청약"], // 청약.zip 메뉴
    };
  },
  methods: {
    handleSidebarSelect(index) {
      console.log("Sidebar에서 선택된 메뉴:", index);
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  padding: 20px;
  gap: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}
</style>
