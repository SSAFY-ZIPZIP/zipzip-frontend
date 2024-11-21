<template>
  <div>
    <Navbar
      :selectedMenu="selectedMenu"
      @menu-select="handleMenuSelect"
      @auth-status-update="handleAuthStatusUpdate"
    />
    <div class="main-container">
      <Sidebar v-if="selectedMenu !== 2" />
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
    };
  },
  methods: {
    handleMenuSelect(index) {
      this.selectedMenu = index;
    },
    handleAuthStatusUpdate(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
      console.log("MainPage 인증 상태:", this.isAuthenticated);
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
}
</style>
