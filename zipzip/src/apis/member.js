import { api } from "./index";

export const memberApi = {
  // 사용자 정보 관련
  getUserInfo: () => {
    const memberId = localStorage.getItem("memberId"); // 저장된 memberId 가져오기
    return api.get(`/v1/members/${memberId}/profile`);
  },
};
