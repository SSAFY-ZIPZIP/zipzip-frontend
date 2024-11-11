<template>
  <div class="main-content">
    <h1>위치로 검색하기</h1>
    <p>매물을 확인하고 싶은 위치를 기반으로 검색해보세요!</p>
  </div>
</template>

<script>
export default {
  name: "MainContent",
};
</script>

<style scoped>
.main-content {
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  margin-left: 20px;
  flex: 1;
}
h1 {
  font-size: 24px;
  font-weight: bold;
}
p {
  color: #666;
}
</style>
