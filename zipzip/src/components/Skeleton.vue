<template>
  <div class="skeleton-list">
    <!-- 스켈레톤 테이블 헤더 -->
    <div class="table-row header-row">
      <div class="col col-deadline">접수 마감일</div>
      <div class="col col-name">아파트명</div>
      <div class="col col-type">공급 유형 / 지역</div>
      <div class="col col-location">공급 위치</div>
      <div class="col col-units">총 모집 가구 수</div>
      <div class="col col-actions">관심 청약</div>
      <div class="col col-announcement">모집 공고</div>
    </div>

    <!-- 스켈레톤 데이터 -->
    <div class="table-row data-row" v-for="i in 5" :key="i">
      <div class="col col-deadline">
        <div class="skeleton skeleton-text short"></div>
      </div>
      <div class="col col-name">
        <div class="skeleton skeleton-text medium"></div>
      </div>
      <div class="col col-type">
        <div class="skeleton skeleton-tag"></div>
        <div class="skeleton skeleton-tag"></div>
      </div>
      <div class="col col-location">
        <div class="skeleton skeleton-text long"></div>
      </div>
      <div class="col col-units">
        <div class="skeleton skeleton-text short"></div>
      </div>
      <div class="col col-actions">
        <div class="skeleton skeleton-circle"></div>
      </div>
      <div class="col col-announcement">
        <div class="skeleton skeleton-circle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 120px 200px 200px 1fr 120px 80px 80px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.col {
  padding: 0 8px;
}

/* 스켈레톤 기본 */
.skeleton {
  display: block;
  background: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

/* 텍스트 스켈레톤 */
.skeleton-text {
  height: 16px;
}

.skeleton-text.short {
  width: 40%;
}

.skeleton-text.medium {
  width: 70%;
}

.skeleton-text.long {
  width: 100%;
}

/* 태그 스켈레톤 */
.skeleton-tag {
  height: 20px;
  width: 60px;
  margin-right: 8px;
  display: inline-block;
}

/* 원형 스켈레톤 */
.skeleton-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

/* 애니메이션 */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
