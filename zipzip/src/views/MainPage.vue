<template>
  <div>
    <Navbar :selectedMenu="selectedMenu" @menu-select="handleMenuSelect" />
    <div class="main-container">
      <MainContent
        v-if="selectedMenu === 0 && selectedSidebarIndex === 0"
        class="main-content"
      />
      <SubscriptionList
        v-if="selectedMenu === 1 && selectedSidebarIndex === 0"
      />
      <FavoriteSubscriptionList
        v-if="selectedMenu === 1 && selectedSidebarIndex === 1"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import MainContent from "@/components/MainContent.vue";
import SubscriptionList from "@/components/SubscriptionList.vue";
import FavoriteSubscriptionList from "@/components/FavoriteSubscriptionList.vue";

export default {
  components: {
    Navbar,
    MainContent,
    SubscriptionList,
    FavoriteSubscriptionList,
  },
  data() {
    return {
      selectedMenu: 0, // 선택된 네비게이션 메뉴
      selectedSidebarIndex: 0, // 선택된 사이드바 메뉴
      sidebarMenusMap: {
        0: ["위치로 검색하기"], // 매물.zip 메뉴
        1: ["나에게 맞는 청약", "관심있는 청약"], // 청약.zip 메뉴
      },
    };
  },
  computed: {
    currentSidebarMenus() {
      return this.sidebarMenusMap[this.selectedMenu] || [];
    },
  },
  methods: {
    handleMenuSelect(index) {
      this.selectedMenu = index;
      this.selectedSidebarIndex = 0; // 사이드바 초기화
      if (index === 0) this.$router.push("/search");
      if (index === 1) this.$router.push("/cheongyak");
      if (index === 2) this.$router.push("/workspace");
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
  gap: 20px;
  padding: 20px;
}
.main-content {
  flex: 1;
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
}
</style>
