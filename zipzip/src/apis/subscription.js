import { api } from "./index";

// 청약 관련 API 정의
export const subscriptionApi = {
  // 청약 목록 가져오기
  getSubscriptions: (page = 0, size = 10) =>
    api.get(`/v1/subscriptions/me/list`, {
      params: { page, size },
    }),

  // 필터링 조건으로 목록 가져오기
  getFilterSubscriptions: (page, size, aptName, category, region) =>
    api.get(`/v1/subscriptions/list`, {
      params: {
        "apt-name": aptName,
        category: category,
        region: region,
        page: page,
        size: size,
      },
    }),

  // 즐겨찾기 등록
  addFavorite: (subscriptionId) =>
    api.post(`/v1/subscriptions/${subscriptionId}/me/favorite`),

  // 즐겨찾기 취소
  removeFavorite: (subscriptionId) =>
    api.delete(`/v1/subscriptions/${subscriptionId}/me/favorite`),

  // 청약 프로필 조회
  getProfile: () => api.get("/v1/subscriptions/profile/me"),

  // 청약 프로필 등록
  saveProfile: (profileData) =>
    api.post("/v1/subscriptions/profile/me", profileData),
};
