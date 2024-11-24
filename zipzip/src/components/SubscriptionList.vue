<template>
  <div class="cheongyak-container">
    <!-- 상단 고정 영역 -->
    <div class="header">
      <h1 class="title">나에게 맞는 청약</h1>
      <p class="subtitle">나에게 맞는 진행 중인 청약을 한눈에 파악해 보세요!</p>
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="content">
      <!-- 프로필이 없는 경우 -->
      <div v-if="isProfileMissing" class="no-profile-container">
        <p class="no-profile-message">아직 나의 정보를 입력 하시지 않았네요!</p>
        <p class="no-profile-submessage">
          나의 정보를 입력하고 맞춤 청약 정보를 확인해보세요!
        </p>
        <button class="action-button" @click="openProfileModal">
          지금 입력하기
        </button>
      </div>

      <!-- 청약 리스트 -->
      <div v-else class="cheongyak-list">
        <div class="list-header">
          <div class="list-actions">
            <button class="primary-button">청약 알리미 신청</button>
            <button class="outline-button" @click="openFilterModal">
              청약 검색 필터
            </button>
          </div>
        </div>

        <div class="table-container">
          <div class="table-row header-row">
            <div class="col col-deadline">접수 마감일</div>
            <div class="col col-name">아파트명</div>
            <div class="col col-type">공급 유형 / 지역</div>
            <div class="col col-location">공급 위치</div>
            <div class="col col-units">총 모집 가구 수</div>
            <div class="col col-actions">관심 청약</div>
            <div class="col col-announcement">모집 공고</div>
          </div>

          <div v-if="cheongyakList.length === 0" class="empty-message">
            등록된 청약 정보가 없습니다.
          </div>

          <div
            v-else
            v-for="item in cheongyakList"
            :key="item.subscriptionId"
            class="table-row data-row"
          >
            <div class="col col-deadline">{{ item.deadline }}</div>
            <div class="col col-name">{{ item.aptName }}</div>
            <div class="col col-type">
              <div class="type-tags">
                <span class="type-tag supply-tag">{{ item.category }}</span>
                <span class="type-tag region-tag">{{ item.region }}</span>
              </div>
            </div>
            <div class="col col-location">{{ item.address }}</div>
            <div class="col col-units">
              {{ item.generalHouseHold }}/{{ item.specialHouseHold }}
            </div>
            <div class="col col-actions">
              <button
                class="like-button"
                @click="toggleFavorite(item)"
                :aria-label="item.isFavorite ? '관심 해제' : '관심 등록'"
              >
                <Star :class="{ 'icon-filled': item.isFavorite }" size="20" />
              </button>
            </div>
            <div class="col col-announcement">
              <button
                class="announcement-button"
                @click="openAnnouncement(item.url)"
                aria-label="모집공고 바로가기"
              >
                <ArrowUpRight size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 검색 필터 모달 -->
    <div v-if="isFilterModalOpen" class="modal-backdrop">
      <div class="modal filter-modal">
        <h3 class="modal-title">필터 검색</h3>
        <div class="modal-content">
          <input
            v-model="filter.aptName"
            type="text"
            class="search-input"
            placeholder="아파트명 검색"
          />
          <div class="input-group">
            <label for="filterCategory">공급 대상</label>
            <select
              id="filterCategory"
              v-model="filter.category"
              class="dropdown"
            >
              <option value="">전체</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
          <div class="input-group">
            <label for="filterRegion">공급 지역</label>
            <select id="filterRegion" v-model="filter.region" class="dropdown">
              <option value="">전체</option>
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="closeFilterModal">취소</button>
          <button class="save-button" @click="applyFilters">검색</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { subscriptionApi } from "@/apis/subscription";
import { Star, ArrowUpRight } from "lucide-vue-next";

export default {
  components: { Star, ArrowUpRight },
  setup() {
    // 기본 상태 관리
    const cheongyakList = ref([]);
    const isProfileMissing = ref(true);
    const isModalOpen = ref(false);
    const isFilterModalOpen = ref(false); // 필터 모달 열림 상태
    const profile = ref({
      memberCategory: "",
      memberRegion: "",
    });
    const filter = ref({
      aptName: "",
      category: "",
      region: "",
    });

    // 카테고리 및 지역 데이터
    const categories = [
      "신혼부부",
      "다자녀",
      "생애최초",
      "청년",
      "노부모부양",
      "신생아",
      "기관추천",
      "이전기관",
      "일반",
    ];
    const regions = [
      "서울",
      "광주",
      "대구",
      "대전",
      "부산",
      "세종",
      "울산",
      "인천",
      "강원",
      "경기",
      "경남",
      "경북",
      "전남",
      "전북",
      "제주",
      "충남",
      "충북",
    ];

    // 프로필 조회
    const fetchProfile = async () => {
      try {
        const response = await subscriptionApi.getProfile();
        isProfileMissing.value = response.status === 204;

        if (!isProfileMissing.value && response.data) {
          profile.value = response.data;
          await fetchSubscriptions();
        }
      } catch (error) {
        console.error("프로필 정보 불러오기 실패:", error);
        isProfileMissing.value = true;
      }
    };

    // 청약 리스트 조회
    const fetchSubscriptions = async (page = 0, size = 10) => {
      try {
        const response = await subscriptionApi.getSubscriptions(page, size);
        cheongyakList.value = (response.data.content || []).map((item) => ({
          subscriptionId: item.subscriptionId,
          deadline: formatDate(item.deadline),
          aptName: item.aptName,
          category: item.category,
          region: item.region,
          address: item.address,
          generalHouseHold: item.generalHouseHold || 0,
          specialHouseHold: item.specialHouseHold || 0,
          isFavorite: item.isFavorite || false,
          url: item.url,
        }));
      } catch (error) {
        console.error("청약 데이터 불러오기 실패:", error);
        cheongyakList.value = [];
      }
    };

    // 관심 토글
    const toggleFavorite = async (item) => {
      try {
        if (item.isFavorite) {
          await subscriptionApi.removeFavorite(item.subscriptionId);
          item.isFavorite = false;
        } else {
          await subscriptionApi.addFavorite(item.subscriptionId);
          item.isFavorite = true;
        }
      } catch (error) {
        console.error("즐겨찾기 토글 실패:", error);
      }
    };

    // 모집공고 바로가기
    const openAnnouncement = (url) => {
      if (url) {
        window.open(url, "_blank");
      }
    };

    // 필터 모달 열기/닫기
    const openFilterModal = () => (isFilterModalOpen.value = true);
    const closeFilterModal = () => (isFilterModalOpen.value = false);

    // 필터 적용
    const applyFilters = async () => {
      try {
        const response = await subscriptionApi.getFilterSubscriptions(
          0, // page
          10, // size
          filter.value.aptName || "", // aptName
          filter.value.category || "", // category
          filter.value.region || "" // region
        );
        cheongyakList.value = (response.data.content || []).map((item) => ({
          subscriptionId: item.subscriptionId,
          deadline: formatDate(item.deadline),
          aptName: item.aptName,
          category: item.category,
          region: item.region,
          address: item.address,
          generalHouseHold: item.generalHouseHold || 0,
          specialHouseHold: item.specialHouseHold || 0,
          isFavorite: item.isFavorite || false,
          url: item.url,
        }));
        closeFilterModal();
      } catch (error) {
        console.error("필터 적용 실패:", error);
      }
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}.${String(date.getDate()).padStart(2, "0")}`;
    };

    onMounted(fetchProfile);

    return {
      cheongyakList,
      isProfileMissing,
      isModalOpen,
      isFilterModalOpen,
      profile,
      filter,
      categories,
      regions,
      openFilterModal,
      closeFilterModal,
      applyFilters,
      fetchSubscriptions,
      toggleFavorite,
      openAnnouncement,
    };
  },
};
</script>

<style scoped>
/* 기본 레이아웃 */
.cheongyak-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
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

/* 콘텐츠 스타일 */
.content {
  flex: 1;
}

.list-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.list-actions {
  display: flex;
  gap: 12px;
}

.primary-button {
  padding: 10px 20px;
  background-color: #4b89dc;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.outline-button {
  padding: 10px 20px;
  background-color: white;
  color: #4b89dc;
  border: 1px solid #4b89dc;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.table-container {
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

.header-row {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.data-row:hover {
  background-color: #f8f9fa;
}

.col-deadline {
  color: #4b89dc;
  font-weight: 500;
}

.col-actions,
.col-announcement {
  display: flex;
  justify-content: center;
}

.announcement-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: #868e96;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.announcement-button:hover {
  background-color: #f1f3f5;
  color: #4b89dc;
}

.arrow-icon {
  color: #868e96;
  font-size: 20px;
}

/* 관심 아이콘 스타일 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.like-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: #adb5bd;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.like-button:hover {
  background-color: #f1f3f5;
  color: #4b89dc;
}

.icon-filled {
  color: #feee3c;
  fill: currentColor;
}

/* 필터 태그 */
.type-tags {
  display: flex;
  gap: 8px;
  align-items: center;
}

.type-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.supply-tag {
  background-color: #edf2ff;
  color: #4b89dc;
}

.region-tag {
  background-color: #e9faf1;
  color: #40c057;
}

/* 모달 관련 스타일 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #1a1a1a;
}

.modal-content {
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

.dropdown {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #495057;
  background-color: white;
}

.dropdown:focus {
  outline: none;
  border-color: #4b89dc;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.cancel-button,
.save-button {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #e9ecef;
  color: #495057;
}

.cancel-button:hover {
  background-color: #dee2e6;
}

.save-button {
  background-color: #4b89dc;
  color: white;
}

.save-button:hover {
  background-color: #3b79cc;
}

/* 반응형 */
@media (max-width: 1024px) {
  .table-row {
    grid-template-columns: 100px 180px 200px 1fr 100px 90px;
    padding: 12px 16px;
  }
}

@media (max-width: 768px) {
  .cheongyak-container {
    padding: 20px;
  }

  .table-row {
    grid-template-columns: 90px 150px 180px 1fr 90px 80px;
    font-size: 13px;
  }

  .type-tag {
    padding: 3px 8px;
    font-size: 11px;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.filter-modal {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.dropdown {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.cancel-button {
  background-color: #e9ecef;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #4b89dc;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
