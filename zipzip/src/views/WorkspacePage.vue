<template>
  <div>
    <!-- 네비게이션 바 -->
    <Navbar :selectedMenu="2" />

    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <!-- Workspace 컴포넌트 -->
      <Workspace />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Workspace from "@/components/Workspace.vue";

export default {
  name: "WorkspacePage",
  components: {
    Navbar,
    Workspace, // Workspace 컴포넌트 등록
  },
};
</script>

<style scoped>
.main-container {
  display: block;
  flex-direction: column; /* 세로 정렬 유지 */
  padding: 20px;
  gap: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 100vh;
  width: 100%; /* 부모 요소의 너비를 100%로 설정 */
  justify-content: flex-start; /* 상단 정렬 */
  align-items: stretch; /* 좌우 너비를 부모 요소에 맞게 확장 */
}
</style>
