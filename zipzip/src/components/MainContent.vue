<template>
  <div class="main-content">
    <div class="header">
      <h1 class="title">위치로 검색하기</h1>
      <p class="subtitle">매물을 확인하고 싶은 위치를 기반으로 검색해보세요!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainContent",
};
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 40px;
}
.header {
  text-align: left;
  margin-bottom: 40px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 12px 0 0 0;
}
</style>
