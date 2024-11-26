<template>
  <div>
    <!-- 네비게이션 바 -->
    <Navbar :selectedMenu="2" />

    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <!-- 동적으로 렌더링될 콘텐츠 -->
      <WorkspaceContent
        :workspaceId="workspaceId"
        :workspaceName="workspaceName"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import WorkspaceContent from "@/components/WorkspaceContent.vue";

export default {
  name: "WorkspacePropertiesPage",
  components: {
    WorkspaceContent,
    Navbar,
  },
  props: ["workspaceId", "workspaceName"], // Props 받아오기
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
