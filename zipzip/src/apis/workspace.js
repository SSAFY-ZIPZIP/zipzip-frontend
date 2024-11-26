import { api } from "./index";

export const workspaceApi = {
  // 사용자 워크스페이스 가져오기
  getUserWorkspaces: () => {
    return api.get("/v1/workspaces/me");
  },

  // 워크스페이스 생성
  createWorkspace: (workspaceName) => {
    return api.post("/v1/workspaces/me", { workspaceName });
  },

  // 워크스페이스 삭제
  deleteWorkspace: (workspaceId) => {
    return api.delete(`/v1/workspaces/me/${workspaceId}`);
  },

  // 워크스페이스 수정
  updateWorkspace: (workspaceId, payload) => {
    return api.patch(`/v1/workspaces/me/${workspaceId}`, payload);
  },

  // 워크스페이스 멤버 가져오기
  getWorkspaceMembers: (workspaceId) => {
    return api.get(`/v1/workspaces/${workspaceId}/members`);
  },

  // 워크스페이스 멤버 초대하기
  inviteMember(workspaceId, requestBody) {
    return api.post(`/v1/workspaces/${workspaceId}/invite`, requestBody);
  },

  // 워크스페이스별 부동산 리스트 조회
  getWorkspaceProperties: (workspaceId) =>
    api.get(`/v1/workspaces/${workspaceId}/properties`, {
      params: { page: 0, size: 10 },
    }),

  // 워크스페이스에 부동산 추가
  addProperty: (workspaceId, propertyDealId) => {
    return api.post(`/v1/workspaces/${workspaceId}/properties`, {
      propertyDealId,
    });
  },
};
