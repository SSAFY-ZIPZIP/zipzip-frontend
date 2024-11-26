<template>
  <div class="main-content">
    <div class="header">
      <h1 class="title">위치로 검색하기</h1>
      <p class="subtitle">매물을 확인하고 싶은 위치를 기반으로 검색해보세요!</p>
    </div>

    <div class="filters">
      <select v-model="selectedSido" @change="fetchGugun" class="dropdown">
        <option value="">시/도 선택</option>
        <option v-for="sido in sidoList" :key="sido.name" :value="sido">
          {{ sido.name }}
        </option>
      </select>
      <select
        v-model="selectedGugun"
        @change="fetchDong"
        class="dropdown"
        :disabled="!selectedSido"
      >
        <option value="">구/군 선택</option>
        <option v-for="gugun in gugunList" :key="gugun.name" :value="gugun">
          {{ gugun.name }}
        </option>
      </select>
      <select
        v-model="selectedDong"
        class="dropdown"
        :disabled="!selectedGugun"
      >
        <option value="">동 선택 (선택사항)</option>
        <option v-for="dong in dongList" :key="dong.name" :value="dong">
          {{ dong.name }}
        </option>
      </select>
      <button
        class="search-button"
        :disabled="!selectedSido || !selectedGugun"
        @click="handleSearch"
      >
        검색
      </button>
    </div>

    <div class="content">
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

      <div class="scrollable-list">
        <SkeletonLoader v-if="isLoadingProperties" :rows="5" />
        <div v-else-if="properties.length > 0">
          <div
            v-for="property in properties"
            :key="property.propertyInfoId"
            class="property-item"
            @click="focusOnProperty(property)"
          >
            <div class="property-header">
              <h3 class="property-title">{{ property.aptName }}</h3>
              <button
                class="add-workspace-button"
                @click.stop="openWorkspaceModal(property.propertyDealId)"
              >
                +
              </button>
            </div>
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
                <span class="info-value">{{
                  formatAptSize(property.aptSize)
                }}</span>
              </div>
              <div class="info-group">
                <span class="info-label">거래일자</span>
                <span class="info-value">{{
                  formatDealDate(property.dealDate)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-list">매물이 없습니다.</div>
      </div>

      <div class="pagination" v-if="pageMeta.pageCount > 1">
        <button
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          이전
        </button>
        <span>{{ currentPage }} / {{ pageMeta.pageCount }}</span>
        <button
          :disabled="currentPage === pageMeta.pageCount"
          @click="handlePageChange(currentPage + 1)"
        >
          다음
        </button>
      </div>
    </div>
    <PropertyWorkspaceModal
      :is-open="isWorkspaceModalOpen"
      :property-deal-id="selectedPropertyDealId"
      @close="closeWorkspaceModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
} from "vue3-kakao-maps";
import { propertiesApi } from "@/apis/properties";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import PropertyWorkspaceModal from "@/components/WorkspacePropertyModal.vue";

const selectedSido = ref(null);
const selectedGugun = ref(null);
const selectedDong = ref(null);
const sidoList = ref([]);
const gugunList = ref([]);
const dongList = ref([]);
const properties = ref([]);
const isLoadingProperties = ref(false);
const coordinate = ref({ lat: 37.5665, lng: 126.978 });
const overlayStates = ref({});

const isWorkspaceModalOpen = ref(false);
const selectedPropertyDealId = ref(null);

const pageMeta = ref({
  itemCount: 0,
  pageCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
});
const currentPage = ref(1);

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

const openWorkspaceModal = (propertyDealId) => {
  selectedPropertyDealId.value = propertyDealId;
  isWorkspaceModalOpen.value = true;
};

const closeWorkspaceModal = () => {
  isWorkspaceModalOpen.value = false;
  selectedPropertyDealId.value = null;
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

const fetchLocationData = async () => {
  try {
    const response = await fetch("/locations.json");
    const data = await response.json();
    sidoList.value = data.map((location) => ({
      name: location.sido,
      gugunList: location.gugunList,
    }));
  } catch (error) {
    console.error("지역 데이터를 가져오는 중 오류 발생:", error);
  }
};

const fetchGugun = () => {
  if (!selectedSido.value) return;
  gugunList.value = selectedSido.value.gugunList.map((gugun) => ({
    name: gugun.gugun,
    dongList: gugun.dongList,
  }));
  selectedGugun.value = null;
  selectedDong.value = null;
  dongList.value = [];
};

const fetchDong = () => {
  if (!selectedGugun.value) return;
  dongList.value = selectedGugun.value.dongList;
  selectedDong.value = null;
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchProperties();
};

const handlePageChange = (page) => {
  if (page < 1 || page > pageMeta.value.pageCount) return;
  currentPage.value = page;
  fetchProperties();
};

const fetchProperties = async () => {
  if (!selectedSido.value || !selectedGugun.value) {
    alert("시/도와 구/군을 선택해주세요.");
    return;
  }

  isLoadingProperties.value = true;

  try {
    const response = await propertiesApi.getProperties({
      sido: selectedSido.value.name,
      gugun: selectedGugun.value.name,
      dong: selectedDong.value?.name,
      page: currentPage.value - 1,
    });

    if (response.data.content) {
      properties.value = response.data.content.map((property) => ({
        ...property,
        latitude: parseFloat(property.latitude),
        longitude: parseFloat(property.longitude),
      }));
      if (properties.value.length > 0) {
        coordinate.value.lat = properties.value[0].latitude;
        coordinate.value.lng = properties.value[0].longitude;
      }
    } else {
      properties.value = [];
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    alert("매물 정보를 가져오는데 실패했습니다.");
  } finally {
    isLoadingProperties.value = false;
  }
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
  fetchLocationData();
});
</script>

<style scoped>
/* 스타일은 이전과 동일 */
.main-content {
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
  gap: 20px;
  min-height: 100vh;
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
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

.filters {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.dropdown {
  width: 170px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  text-align: center;
}

.search-button {
  width: 170px;
  padding: 10px;
  background-color: #5592fb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.search-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-workspace-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #5592fb;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.info-card {
  background-color: #ffffff;
  border-radius: 12px; /* 둥근 모서리 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
  padding: 16px;
  max-width: 320px; /* 카드 너비 제한 */
  color: #333; /* 텍스트 색상 */
  font-family: Arial, sans-serif;
  font-size: 14px; /* 기본 텍스트 크기 */
}

.add-workspace-button:hover {
  background-color: #4477d1;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
  color: #666;
}

.map-info-window {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-width: 250px;
  z-index: 1000;
}

.property-detail {
  font-size: 14px;
  margin-bottom: 4px;
}

.close-button {
  background: none;
  border: none;
  color: #5592fb;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;
}

.empty-list {
  font-size: large;
  color: #666;
  text-align: center;
}
</style>
