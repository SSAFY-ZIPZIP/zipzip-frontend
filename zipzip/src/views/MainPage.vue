<template>
  <div>
    <Navbar />
    <div class="main-container">
      <Sidebar />
      <MainContent />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import MainContent from "@/components/MainContent.vue";

export default {
  name: "MainPage",
  components: {
    Navbar,
    Sidebar,
    MainContent,
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  padding: 20px;
}
</style>
