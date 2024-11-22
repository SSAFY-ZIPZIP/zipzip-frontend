<template>
  <div class="workspace-container">
    <!-- 타이틀 -->
    <div class="title-container">
      <h1 class="title">매물 워크 스페이스</h1>
      <p class="subtitle">
        매물을 폴더별로 묶고 친구를 초대해 함께 집을 구할 수 있습니다!
      </p>
    </div>

    <!-- 워크스페이스 리스트 -->
    <div class="workspace-grid">
      <div
        v-for="(workspace, index) in workspaces"
        :key="index"
        class="workspace-card"
      >
        <div class="card-header">
          <button class="meatball-button" @click="toggleMenu(index)">⋮</button>
          <div v-if="visibleMenuIndex === index" class="dropdown-menu">
            <div class="menu-item" @click="openEditModal(workspace)">
              ✏️ 수정하기
            </div>
            <div class="menu-item" @click="deleteWorkspace(workspace.id)">
              🗑️ 삭제하기
            </div>
          </div>
        </div>
        <div class="card-content">
          <span>{{ workspace.name }}</span>
        </div>
      </div>

      <!-- 추가 버튼 -->
      <div class="workspace-card add-card" @click="openModal">
        <div class="card-content">
          <span class="add-icon">+</span>
        </div>
      </div>
    </div>

    <!-- 수정 모달 -->
    <div v-if="isEditModalOpen" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">매물 워크스페이스 수정</h3>
        <input
          type="text"
          v-model="editWorkspaceName"
          class="modal-input"
          placeholder="워크스페이스명 입력"
        />
        <h4>함께하는 사람</h4>
        <!-- 멤버 리스트 -->
        <div class="members-list">
          <template v-if="editWorkspaceMembers.length === 0">
            <div class="no-members-container">
              <p class="no-members-message">
                멤버가 한명도 없네요! 초대를 해보세요.
              </p>
              <button class="invite-button" @click="openInviteModal">
                초대하기
              </button>
            </div>
          </template>
          <template v-else>
            <div
              class="member-item"
              v-for="(member, index) in editWorkspaceMembers"
              :key="member.memberId"
            >
              <span>{{ member.memberNickname }}</span>
              <button class="remove-button" @click="removeMember(index)">
                X
              </button>
            </div>
          </template>
        </div>

        <div class="modal-actions">
          <button class="cancel-button" @click="closeEditModal">취소</button>
          <button class="save-button" @click="updateWorkspace">저장</button>
        </div>
      </div>
    </div>

    <!-- 추가 모달 -->
    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">매물 워크스페이스 추가</h3>
        <input
          type="text"
          v-model="newWorkspaceName"
          class="modal-input"
          placeholder="워크스페이스명 입력"
        />
        <div class="modal-actions">
          <button class="cancel-button" @click="closeModal">취소</button>
          <button class="save-button" @click="saveWorkspace">저장</button>
        </div>
      </div>
    </div>

    <!-- 초대 모달 -->
    <div v-if="isInviteModalOpen" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">우리.zip에 초대하기</h3>
        <p class="modal-description">이메일로 친구를 초대 해보세요!</p>
        <input
          type="email"
          v-model="inviteEmail"
          class="modal-input"
          placeholder="example@naver.com"
        />
        <div class="modal-actions">
          <button class="cancel-button" @click="closeInviteModal">취소</button>
          <button class="save-button" @click="inviteMember">초대</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workspaceApi } from "@/apis/workspace";

export default {
  data() {
    return {
      workspaces: [], // 워크스페이스 데이터
      isModalOpen: false,
      isEditModalOpen: false,
      newWorkspaceName: "",
      editWorkspaceName: "",
      editWorkspaceId: null,
      editWorkspaceMembers: [], // 수정 모달에 표시될 멤버 데이터
      visibleMenuIndex: null, // 현재 열려 있는 드롭다운 메뉴의 인덱스
      isInviteModalOpen: false, // 초대 모달 상태
      inviteEmail: "", // 초대할 이메일
    };
  },
  methods: {
    async fetchWorkspaces() {
      try {
        const response = await workspaceApi.getUserWorkspaces();
        this.workspaces = response.data.map((workspace) => ({
          id: workspace.workspaceId,
          name: workspace.workspaceName,
        }));
      } catch (error) {
        console.error("워크스페이스 가져오기 실패:", error);
        alert("워크스페이스 데이터를 불러오는 데 실패했습니다.");
      }
    },
    async fetchWorkspaceMembers(workspaceId) {
      try {
        const response = await workspaceApi.getWorkspaceMembers(workspaceId);
        this.editWorkspaceMembers = response.data.filter(
          (member) => member.memberRole !== "OWNER"
        ); // OWNER 멤버 제외
      } catch (error) {
        console.error("멤버 가져오기 실패:", error);
        alert("멤버 데이터를 불러오는 데 실패했습니다.");
      }
    },
    openEditModal(workspace) {
      this.editWorkspaceId = workspace.id;
      this.editWorkspaceName = workspace.name;
      this.fetchWorkspaceMembers(workspace.id); // 멤버 데이터 요청
      this.isEditModalOpen = true;
      this.visibleMenuIndex = null; // 메뉴 닫기
    },
    closeEditModal() {
      this.isEditModalOpen = false;
      this.editWorkspaceName = "";
      this.editWorkspaceMembers = [];
    },
    removeMember(index) {
      this.editWorkspaceMembers.splice(index, 1); // 선택된 멤버 삭제
    },
    async updateWorkspace() {
      if (!this.editWorkspaceName.trim()) {
        alert("워크스페이스 이름을 입력해주세요.");
        return;
      }

      const memberIdList = this.editWorkspaceMembers.map(
        (member) => member.memberId
      ); // 수정 후 남은 멤버 ID 리스트

      try {
        await workspaceApi.updateWorkspace(this.editWorkspaceId, {
          workspaceName: this.editWorkspaceName.trim(),
          memberIdList,
        });
        await this.fetchWorkspaces(); // 갱신
        this.closeEditModal();
        alert("워크스페이스가 성공적으로 수정되었습니다.");
      } catch (error) {
        console.error("워크스페이스 수정 실패:", error);
        alert("워크스페이스 수정 중 오류가 발생했습니다.");
      }
    },
    toggleMenu(index) {
      this.visibleMenuIndex = this.visibleMenuIndex === index ? null : index;
    },
    async deleteWorkspace(workspaceId) {
      if (!confirm("정말로 삭제하시겠습니까?")) return;

      try {
        await workspaceApi.deleteWorkspace(workspaceId);
        await this.fetchWorkspaces();
        this.visibleMenuIndex = null; // 메뉴 닫기
        alert("워크스페이스가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("워크스페이스 삭제 실패:", error);
        alert("워크스페이스 삭제 중 오류가 발생했습니다.");
      }
    },
    // 추가 모달 열기
    openModal() {
      this.isModalOpen = true;
    },
    // 추가 모달 닫기
    closeModal() {
      this.isModalOpen = false;
      this.newWorkspaceName = ""; // 입력 필드 초기화
    },
    // 워크스페이스 저장
    async saveWorkspace() {
      if (!this.newWorkspaceName.trim()) {
        alert("워크스페이스 이름을 입력해주세요.");
        return;
      }

      try {
        await workspaceApi.createWorkspace(this.newWorkspaceName.trim());
        await this.fetchWorkspaces(); // 워크스페이스 목록 갱신
        this.closeModal(); // 모달 닫기
        alert("워크스페이스가 성공적으로 추가되었습니다.");
      } catch (error) {
        console.error("워크스페이스 추가 실패:", error);
        alert("워크스페이스 추가 중 오류가 발생했습니다.");
      }
    },
    openInviteModal() {
      this.isInviteModalOpen = true;
      this.closeEditModal();
    },
    closeInviteModal() {
      this.isInviteModalOpen = false;
      this.inviteEmail = ""; // 입력 필드 초기화
    },
    async inviteMember() {
      if (!this.inviteEmail.trim()) {
        alert("초대할 이메일을 입력해주세요.");
        return;
      }

      try {
        console.log(this.inviteEmail.trim());
        await workspaceApi.inviteMember(this.editWorkspaceId, {
          email: this.inviteEmail.trim(),
        });
        alert("초대가 성공적으로 완료되었습니다.");
        this.closeInviteModal(); // 모달 닫기
      } catch (error) {
        console.error("초대 실패:", error);
        alert("초대 중 오류가 발생했습니다.");
      }
    },
  },
  async created() {
    await this.fetchWorkspaces(); // 워크스페이스 데이터 로드
  },
};
</script>

<style scoped>
/* 전체 컨테이너 */
.workspace-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 타이틀 스타일 */
.title-container {
  text-align: center;
  margin-bottom: 32px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 14px;
  color: #666;
}

/* 워크스페이스 그리드 */
.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px; /* 카드 간 간격을 조금 늘림 */
}

/* 카드 스타일 */
.workspace-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 120px;
  cursor: pointer;
  padding: 16px; /* 내부 여백 추가 */
  transition: transform 0.2s, box-shadow 0.2s;
}
.workspace-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 카드 내부 헤더 */
.card-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  position: absolute;
  top: 8px;
  right: 8px;
}

/* 카드 텍스트 중앙 정렬 */
.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: center;
  padding: 0 8px; /* 텍스트가 카드 안에서 중앙에 위치하도록 조정 */
}

/* 미트볼 버튼 */
.meatball-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #aaa;
}

/* 드롭다운 메뉴 */
.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 8px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 120px;
  z-index: 100;
}
.menu-item {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}
.menu-item:hover {
  background: #f5f5f5;
}

/* 추가 버튼 카드 */
.add-card {
  border: 2px dashed #ccc;
  color: #aaa;
  font-size: 24px;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  transition: background 0.2s;
}
.add-card:hover {
  background: #f5f5f5;
}

/* 모달 스타일 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  border-radius: 8px;
  padding: 24px; /* 내부 여백 */
  width: 400px; /* 고정 너비 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* 패딩 포함한 전체 크기 설정 */
  display: flex; /* 요소를 수직 정렬 */
  flex-direction: column;
  align-items: center;
}
.modal-title {
  text-align: center; /* 텍스트 가운데 정렬 */
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}
.modal-input {
  width: calc(100% - 24px); /* 좌우 패딩 포함하여 중앙에 정렬 */
  margin: 16px 12px; /* 입력 필드 위아래 간격 및 좌우 여백 설정 */
  padding: 10px; /* 텍스트 필드 안쪽 여백 */
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box; /* 패딩 포함한 전체 크기 설정 */
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 12px; /* 입력 필드 위아래 간격 및 좌우 여백 설정 */
}
.cancel-button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.save-button {
  padding: 8px 16px;
  background: #5592fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.members-list {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
}
.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
.remove-button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
}
.member-item:last-child {
  border-bottom: none;
}
.no-members-message {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 16px 0; /* 위아래 여백 추가 */
  font-style: italic; /* 텍스트를 강조 */
}
.no-members-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.invite-button {
  padding: 8px 16px;
  background: #5592fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}
</style>
