<template>
  <div class="cheongyak-container">
    <!-- 상단 고정 영역 -->
    <div class="header">
      <h1 class="title">관심 있는 청약</h1>
      <p class="subtitle">
        스크랩 해둔 청약 정보를 확인하고 청약 알리미 신청을 통해 놓치지
        말아보세요 !
      </p>
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="content">
      <!-- 청약 리스트 -->
      <div class="cheongyak-list">
        <div class="table-container">
          <div class="table-row header-row">
            <div class="col col-deadline">접수 마감일</div>
            <div class="col col-name">아파트명</div>
            <div class="col col-type">공급 유형 / 지역</div>
            <div class="col col-location">공급 위치</div>
            <div class="col col-units">총 모집 가구 수</div>
            <div class="col col-actions">알림</div>
            <div class="col col-announcement">모집 공고</div>
          </div>

          <div
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
                class="alarm-button"
                @click="toggleAlarm(item)"
                :aria-label="
                  item.isSubscribedToNotification ? '알람 해제' : '알람 등록'
                "
              >
                <Bell
                  :class="{ 'icon-filled': item.isSubscribedToNotification }"
                  size="20"
                />
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
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { subscriptionApi } from "@/apis/subscription";
import { Bell, ArrowUpRight } from "lucide-vue-next";

export default {
  components: { Bell, ArrowUpRight },
  setup() {
    // 기본 상태 관리
    const cheongyakList = ref([]);

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

    // 청약 리스트 조회
    const fetchSubscriptions = async (page = 0, size = 10) => {
      try {
        const response = await subscriptionApi.getFavoriteSubscriptions(
          page,
          size
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
          isSubscribedToNotification: item.isSubscribedToNotification || false,
          url: item.url,
        }));
      } catch (error) {
        console.error("청약 데이터 불러오기 실패:", error);
        cheongyakList.value = [];
      }
    };

    // 알림 토글
    const toggleAlarm = async (item) => {
      try {
        if (item.isSubscribedToNotification) {
          await subscriptionApi.removeAlarm(item.subscriptionId);
          item.isSubscribedToNotification = false;
        } else {
          await subscriptionApi.addAlarm(item.subscriptionId);
          item.isSubscribedToNotification = true;
        }
      } catch (error) {
        console.error("알림 토글 실패:", error);
      }
    };

    // 모집공고 바로가기
    const openAnnouncement = (url) => {
      if (url) {
        window.open(url, "_blank");
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

    onMounted(fetchSubscriptions);

    return {
      cheongyakList,
      categories,
      regions,
      fetchSubscriptions,
      toggleAlarm,
      openAnnouncement,
    };
  },
};
</script>

<style scoped>
.cheongyak-container {
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

.alarm-button {
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

.alarm-button:hover {
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

/* 반응형 */
@media (max-width: 1024px) {
  .table-row {
    grid-template-columns: 100px 180px 200px 1fr 100px 90px;
    padding: 12px 16px;
  }
}

@media (max-width: 768px) {
  .main-container {
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
</style>
