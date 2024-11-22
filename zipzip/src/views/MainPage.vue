<template>
  <div>
    <Navbar
      :selectedMenu="selectedMenu"
      @menu-select="handleMenuSelect"
      @auth-status-update="handleAuthStatusUpdate"
    />
    <div class="main-container">
      <Sidebar
        v-if="selectedMenu !== 2"
        :menus="currentSidebarMenus"
        @menu-select="handleSidebarSelect"
      />
      <div class="main-content">
        <Workspace v-if="selectedMenu === 2" />
        <MainContent v-else />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import MainContent from "@/components/MainContent.vue";
import Workspace from "@/components/Workspace.vue";
import { watch } from "vue";

export default {
  name: "MainPage",
  components: {
    Navbar,
    Sidebar,
    MainContent,
    Workspace,
  },
  data() {
    return {
      selectedMenu: 0,
      isAuthenticated: false,
      currentSidebarMenus: [],
      sidebarMenusMap: {
        0: ["위치로 검색하기", "아파트명으로 검색하기", "실거래가로 검색하기"],
        1: ["나에게 맞는 청약", "관심있는 청약"],
      },
    };
  },
  methods: {
    handleMenuSelect(index) {
      this.selectedMenu = index;

      if (index !== 2) {
        this.currentSidebarMenus = this.sidebarMenusMap[index] || [];
      }

      if (index === 1) {
        this.$router.push("/cheongyak");
      } else if (index === 2) {
        this.$router.push("/workspace");
      }
    },
    handleAuthStatusUpdate(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    handleSidebarSelect(menuIndex) {
      console.log("Sidebar 선택된 메뉴:", menuIndex);
    },
  },
  mounted() {
    const currentPath = this.$router.currentRoute.value.path;
    if (currentPath === "/") {
      this.selectedMenu = 0;
    } else if (currentPath === "/cheongyak") {
      this.selectedMenu = 1;
    } else if (currentPath === "/workspace") {
      this.selectedMenu = 2;
    }
    this.currentSidebarMenus = this.sidebarMenusMap[this.selectedMenu];
  },
  watch: {
    "$router.currentRoute.value.path"(newPath) {
      if (newPath === "/") {
        this.selectedMenu = 0;
      } else if (newPath === "/cheongyak") {
        this.selectedMenu = 1;
      } else if (newPath === "/workspace") {
        this.selectedMenu = 2;
      }
      if (this.selectedMenu !== 2) {
        this.currentSidebarMenus =
          this.sidebarMenusMap[this.selectedMenu] || [];
      }
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  padding: 20px;
}

.main-content {
  flex: 1;
  display: flex; /* 추가 */
  flex-direction: column; /* 추가 */
}
</style>
