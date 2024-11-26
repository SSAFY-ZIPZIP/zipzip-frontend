<template>
  <div class="main-content">
    <div class="header">
      <h1 class="title">{{ workspaceName }}</h1>
    </div>

    <div class="content">
      <!-- 지도 컨테이너 -->
      <div class="map-container">
        <KakaoMap
          :lat="coordinate.lat"
          :lng="coordinate.lng"
          :level="4"
          :draggable="true"
          :width="'100%'"
          :height="'100%'"
          class="map-container"
        >
          <KakaoMapMarker
            v-for="property in properties"
            :key="property.propertyInfoId"
            :lat="property.latitude"
            :lng="property.longitude"
            :clickable="true"
            @onClickKakaoMapMarker="toggleOverlay(property.propertyInfoId)"
          />
          <KakaoMapCustomOverlay
            v-for="property in properties"
            :key="'overlay-' + property.propertyInfoId"
            :lat="property.latitude"
            :lng="property.longitude"
            :yAnchor="1.4"
            :visible="isOverlayVisible(property.propertyInfoId)"
            :content="generateInfoWindow(property)"
          />
        </KakaoMap>
      </div>

      <!-- 스크롤 가능한 리스트 -->
      <div class="scrollable-list">
        <SkeletonLoader v-if="listLoading" :rows="5" />
        <!-- 데이터가 있을 때만 리스트 렌더링 -->
        <div v-else-if="properties.length > 0">
          <div
            v-for="property in properties"
            :key="property.propertyInfoId"
            class="property-item"
            @click="focusOnProperty(property)"
          >
            <h3 class="property-title">{{ property.aptName }}</h3>
            <div class="property-info-grid">
              <div class="info-group">
                <span class="info-label">위치</span>
                <span class="info-value">
                  {{ property.sidoName }} {{ property.gugunName }}
                  {{ property.dongName }}
                </span>
              </div>
              <div class="info-group">
                <span class="info-label">거래금액</span>
                <span class="info-value highlight">
                  {{ formatDealAmount(property.dealAmount) }}
                </span>
              </div>
              <div class="info-group">
                <span class="info-label">전용면적</span>
                <span class="info-value">
                  {{ formatAptSize(property.aptSize) }}
                </span>
              </div>
              <div class="info-group">
                <span class="info-label">거래일자</span>
                <span class="info-value">
                  {{ formatDealDate(property.dealDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 데이터가 없을 때 -->
        <div v-else class="empty-list">매물이 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { workspaceApi } from "@/apis/workspace";
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
} from "vue3-kakao-maps";
import SkeletonLoader from "@/components/SkeletonLoader.vue";

const route = useRoute();
const workspaceId = route.params.workspaceId;
const workspaceName = route.params.workspaceName;

const properties = ref([]);
const listLoading = ref(false);
const isLoadingProperties = ref(false);
const coordinate = ref({ lat: 37.5665, lng: 126.978 });
const overlayStates = ref({});

const isOverlayVisible = (propertyId) => !!overlayStates.value[propertyId];

const toggleOverlay = (propertyId) => {
  overlayStates.value[propertyId] = !overlayStates.value[propertyId];
};

const generateInfoWindow = (property) => {
  return `
    <div
      style="
        padding: 16px;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        max-width: 320px;
        color: #333;
        z-index: 1000;
      "
    >
      <div
        style="
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #222;
        "
      >
        ${property.aptName}
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 12px; color: #666;">위치</span>
          <span style="font-size: 12px; color: #333;">
            ${property.sidoName} ${property.gugunName} ${property.dongName}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 14px; color: #666;">거래금액</span>
          <span style="font-size: 14px; color: #007bff; font-weight: bold;">
            ${formatDealAmount(property.dealAmount)}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 14px; color: #666;">전용면적</span>
          <span style="font-size: 14px; color: #333;">
            ${formatAptSize(property.aptSize)}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 14px; color: #666;">거래일자</span>
          <span style="font-size: 14px; color: #333;">
            ${formatDealDate(property.dealDate)}
          </span>
        </div>
      </div>
    </div>
  `;
};

const fetchProperties = async () => {
  listLoading.value = true; // 로딩 상태 시작

  try {
    // API 호출
    const response = await workspaceApi.getWorkspaceProperties(workspaceId);

    // 데이터 매핑
    properties.value = response.data.content.map((property) => ({
      ...property,
      latitude: parseFloat(property.latitude), // 문자열을 숫자로 변환
      longitude: parseFloat(property.longitude),
    }));

    // 첫 번째 매물 데이터를 기준으로 지도 좌표 설정
    if (properties.value.length > 0) {
      coordinate.value.lat = properties.value[0].latitude;
      coordinate.value.lng = properties.value[0].longitude;
    }
  } catch (error) {
    console.error("데이터 가져오기 실패:", error);
    alert("데이터를 가져오는 중 문제가 발생했습니다.");
  } finally {
    listLoading.value = false; // 로딩 상태 종료
  }
};

const focusOnProperty = (property) => {
  if (!property.latitude || !property.longitude) {
    alert("해당 매물의 위치 정보가 없습니다.");
    return;
  }
  coordinate.value = {
    lat: property.latitude,
    lng: property.longitude,
  };
};

const formatDealAmount = (amount) => {
  if (!amount) return "가격 정보 없음";
  // 쉼표를 제거하고 숫자로 변환
  const numericAmount = parseInt(amount.replace(/,/g, ""));
  return `${numericAmount.toFixed(0)}만원`;
};

const formatAptSize = (size) => {
  if (!size) return "정보 없음";
  return `${size.toFixed(2)}㎡`;
};

const formatDealDate = (date) => {
  if (!date) return "정보 없음";
  const [year, month, day] = date.split("-");
  return `${year}년 ${month}월 ${day}일`;
};

onMounted(() => {
  fetchProperties();
});

watch(() => workspaceId, fetchProperties);
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
  gap: 20px;
  min-height: 100vh;
}

.content {
  display: flex;
  gap: 24px;
  position: relative;
  height: calc(100vh - 200px); /* 헤더와 필터 높이를 제외한 높이 */
}

.sticky-map-container {
  position: sticky;
  top: 20px; /* 상단에서 20px 떨어진 위치에서 고정 */
  width: 60%;
  height: calc(100vh - 240px); /* 적절한 높이 설정 */
}

.map-container {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.scrollable-list {
  width: 40%;
  height: 100%;
  overflow-y: auto;
  padding-right: 12px; /* 스크롤바 여백 */
}

/* 스크롤바 스타일링 */
.scrollable-list::-webkit-scrollbar {
  width: 6px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: #555;
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

.property-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease-in-out;
  margin-bottom: 20px;
}

.property-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.property-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.property-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
}

.info-value.highlight {
  color: #5592fb;
  font-weight: 600;
  font-size: 16px;
}

.empty-list {
  font-size: large;
  color: #666;
  text-align: center;
}
</style>
