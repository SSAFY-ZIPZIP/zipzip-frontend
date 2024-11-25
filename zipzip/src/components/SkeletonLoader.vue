<template>
  <div class="skeleton-loader">
    <!-- 리스트 아이템 스켈레톤 -->
    <div v-for="n in rows" :key="n" class="skeleton-list-item">
      <div class="skeleton-text skeleton-title"></div>
      <div class="skeleton-text skeleton-location"></div>
      <div class="skeleton-text skeleton-deal-amount"></div>
      <div class="skeleton-text skeleton-size"></div>
      <div class="skeleton-text skeleton-date"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rows: {
      type: Number,
      default: 5, // 기본적으로 5개의 스켈레톤 항목 생성
    },
  },
};
</script>

<style scoped>
/* 공통 스켈레톤 스타일 */
.skeleton-text {
  background: linear-gradient(90deg, #f4f4f4 25%, #e0e0e0 50%, #f4f4f4 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-loader {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 리스트 아이템 스켈레톤 레이아웃 */
.skeleton-list-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 스켈레톤 항목별 스타일 */
.skeleton-title {
  height: 20px;
  width: 60%;
}

.skeleton-location {
  height: 16px;
  width: 50%;
}

.skeleton-deal-amount {
  height: 16px;
  width: 40%;
}

.skeleton-size {
  height: 16px;
  width: 50%;
}

.skeleton-date {
  height: 16px;
  width: 50%;
}

/* 로딩 애니메이션 */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
