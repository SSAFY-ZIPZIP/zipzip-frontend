<template>
  <div class="cheongyak-container">
    <h1 class="title">나에게 맞는 청약</h1>
    <p class="subtitle">나에게 맞는 진행 중인 청약을 한눈에 파악해 보세요!</p>

    <div class="cheongyak-actions">
      <button class="action-button">청약 알리미 신청</button>
      <button class="action-button">구조 청약 검색 필터</button>
    </div>

    <table class="cheongyak-table">
      <thead>
        <tr>
          <th>접수 마감일</th>
          <th>아파트명</th>
          <th>공급 유형 / 지역</th>
          <th>공급 위치</th>
          <th>총 모집 가구 수 (일반 / 특별)</th>
          <th>저장</th>
          <th>모집 공고 바로가기</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cheongyakList" :key="index">
          <td>{{ item.deadline }}</td>
          <td>{{ item.apartmentName }}</td>
          <td>{{ item.supplyType }} / {{ item.region }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.totalRecruitment }}</td>
          <td><button class="save-button">📂</button></td>
          <td><button class="view-button">▶</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "SubscriptionList",
  data() {
    return {
      cheongyakList: [
        {
          deadline: "2024.11.4",
          apartmentName: "강릉 아테라",
          supplyType: "특별공급",
          region: "강원",
          location: "강원 강릉시 회산동 536번지 일원",
          totalRecruitment: "202/127",
        },
        // 추가 데이터...
      ],
    };
  },
};
</script>

<style scoped>
.cheongyak-container {
  width: 100%;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.cheongyak-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 16px;
}

.action-button {
  padding: 8px 16px;
  background-color: #5592fb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cheongyak-table {
  width: 100%;
  border-collapse: collapse;
}

.cheongyak-table th,
.cheongyak-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.cheongyak-table th {
  background-color: #f9fafb;
  font-weight: bold;
}

.save-button,
.view-button {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
