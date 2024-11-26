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
        @click="goToWorkspaceProperties(workspace)"
      >
        <!-- 미트볼 버튼이 위치할 카드 헤더 -->
        <div class="card-header" @click.stop>
          <button class="meatball-button" @click.stop="toggleMenu(index)">
            ⋮
          </button>
          <div
            v-if="visibleMenuIndex === index"
            ref="dropdownMenu"
            class="dropdown-menu"
          >
            <div class="menu-item" @click.stop="openEditModal(workspace)">
              ✏️ 수정하기
            </div>
            <div class="menu-item" @click.stop="deleteWorkspace(workspace.id)">
              🗑️ 삭제하기
            </div>
          </div>
        </div>
        <!-- 카드의 중앙 정렬 텍스트 -->
        <div class="card-content">
          <span>{{ workspace.name }}</span>
        </div>
      </div>
      <!-- 추가 카드 -->
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
        <h4 class="member-list-title">함께하는 사람</h4>
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
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { workspaceApi } from "@/apis/workspace";

export default {
  setup() {
    const router = useRouter();

    // State 정의
    const workspaces = ref([]);
    const isModalOpen = ref(false);
    const isEditModalOpen = ref(false);
    const newWorkspaceName = ref("");
    const editWorkspaceName = ref("");
    const editWorkspaceId = ref(null);
    const editWorkspaceMembers = ref([]);
    const visibleMenuIndex = ref(null);
    const isInviteModalOpen = ref(false);
    const inviteEmail = ref("");

    // 워크스페이스 목록 가져오기
    const fetchWorkspaces = async () => {
      try {
        const response = await workspaceApi.getUserWorkspaces();
        workspaces.value = response.data.map((workspace) => ({
          id: workspace.workspaceId,
          name: workspace.workspaceName,
        }));
      } catch (error) {
        console.error("워크스페이스 가져오기 실패:", error);
        alert("워크스페이스 데이터를 불러오는 데 실패했습니다.");
      }
    };

    // 워크스페이스 멤버 가져오기
    const fetchWorkspaceMembers = async (workspaceId) => {
      try {
        const response = await workspaceApi.getWorkspaceMembers(workspaceId);
        editWorkspaceMembers.value = response.data.filter(
          (member) => member.memberRole !== "OWNER"
        );
      } catch (error) {
        console.error("멤버 가져오기 실패:", error);
        alert("멤버 데이터를 불러오는 데 실패했습니다.");
      }
    };

    // 워크스페이스 상세 페이지로 이동
    const goToWorkspaceProperties = (workspace) => {
      router.push({
        name: "WorkspacePropertiesPage",
        params: {
          workspaceId: workspace.id,
          workspaceName: workspace.name,
        },
      });
    };

    // 수정 모달 열기
    const openEditModal = (workspace) => {
      editWorkspaceId.value = workspace.id;
      editWorkspaceName.value = workspace.name;
      fetchWorkspaceMembers(workspace.id);
      isEditModalOpen.value = true;
      visibleMenuIndex.value = null;
    };

    // 수정 모달 닫기
    const closeEditModal = () => {
      isEditModalOpen.value = false;
      editWorkspaceName.value = "";
      editWorkspaceMembers.value = [];
    };

    // 멤버 삭제
    const removeMember = (index) => {
      editWorkspaceMembers.value.splice(index, 1);
    };

    // 워크스페이스 업데이트
    const updateWorkspace = async () => {
      if (!editWorkspaceName.value.trim()) {
        alert("워크스페이스 이름을 입력해주세요.");
        return;
      }

      const memberIdList = editWorkspaceMembers.value.map(
        (member) => member.memberId
      );

      try {
        await workspaceApi.updateWorkspace(editWorkspaceId.value, {
          workspaceName: editWorkspaceName.value.trim(),
          memberIdList,
        });
        await fetchWorkspaces();
        closeEditModal();
        alert("워크스페이스가 성공적으로 수정되었습니다.");
      } catch (error) {
        console.error("워크스페이스 수정 실패:", error);
        alert("워크스페이스 수정 중 오류가 발생했습니다.");
      }
    };

    // 드롭다운 메뉴 토글
    const toggleMenu = (index) => {
      visibleMenuIndex.value = visibleMenuIndex.value === index ? null : index;
    };

    // 드롭다운 메뉴 닫기
    const closeMenu = () => {
      visibleMenuIndex.value = null;
    };

    // 외부 클릭 처리
    const handleOutsideClick = (event) => {
      const dropdown = document.querySelector(".dropdown-menu");
      if (dropdown && !dropdown.contains(event.target)) {
        closeMenu();
      }
    };

    // 워크스페이스 삭제
    const deleteWorkspace = async (workspaceId) => {
      if (!confirm("정말로 삭제하시겠습니까?")) return;

      try {
        await workspaceApi.deleteWorkspace(workspaceId);
        await fetchWorkspaces();
        visibleMenuIndex.value = null;
        alert("워크스페이스가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("워크스페이스 삭제 실패:", error);
        alert("워크스페이스 삭제 중 오류가 발생했습니다.");
      }
    };

    // 추가 모달 열기
    const openModal = () => {
      isModalOpen.value = true;
    };

    // 추가 모달 닫기
    const closeModal = () => {
      isModalOpen.value = false;
      newWorkspaceName.value = "";
    };

    // 워크스페이스 저장
    const saveWorkspace = async () => {
      if (!newWorkspaceName.value.trim()) {
        alert("워크스페이스 이름을 입력해주세요.");
        return;
      }

      try {
        await workspaceApi.createWorkspace(newWorkspaceName.value.trim());
        await fetchWorkspaces();
        closeModal();
        alert("워크스페이스가 성공적으로 추가되었습니다.");
      } catch (error) {
        console.error("워크스페이스 추가 실패:", error);
        alert("워크스페이스 추가 중 오류가 발생했습니다.");
      }
    };

    // 초대 모달 열기
    const openInviteModal = () => {
      isInviteModalOpen.value = true;
      closeEditModal();
    };

    // 초대 모달 닫기
    const closeInviteModal = () => {
      isInviteModalOpen.value = false;
      inviteEmail.value = "";
    };

    // 멤버 초대
    const inviteMember = async () => {
      if (!inviteEmail.value.trim()) {
        alert("초대할 이메일을 입력해주세요.");
        return;
      }

      try {
        await workspaceApi.inviteMember(editWorkspaceId.value, {
          email: inviteEmail.value.trim(),
        });
        alert("초대가 성공적으로 완료되었습니다.");
        closeInviteModal();
      } catch (error) {
        console.error("초대 실패:", error);
        alert("초대 중 오류가 발생했습니다.");
      }
    };

    // 외부 클릭 이벤트 등록 및 제거
    onMounted(() => {
      document.addEventListener("click", handleOutsideClick);
      fetchWorkspaces();
    });

    watch(
      () => visibleMenuIndex.value,
      () => {
        if (visibleMenuIndex.value === null) {
          closeMenu();
        }
      }
    );

    return {
      workspaces,
      isModalOpen,
      isEditModalOpen,
      newWorkspaceName,
      editWorkspaceName,
      editWorkspaceId,
      editWorkspaceMembers,
      visibleMenuIndex,
      isInviteModalOpen,
      inviteEmail,
      fetchWorkspaces,
      fetchWorkspaceMembers,
      goToWorkspaceProperties,
      openEditModal,
      closeEditModal,
      removeMember,
      updateWorkspace,
      toggleMenu,
      closeMenu,
      deleteWorkspace,
      openModal,
      closeModal,
      saveWorkspace,
      openInviteModal,
      closeInviteModal,
      inviteMember,
    };
  },
};
</script>

<style scoped>
.workspace-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
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
.workspace-grid {
  display: grid; /* 바둑판 스타일을 위한 grid 사용 */
  grid-template-columns: repeat(
    auto-fill,
    minmax(200px, 1fr)
  ); /* 카드 최소 크기 200px, 나머지는 균등 분배 */
  gap: 20px; /* 카드 간의 간격 */
  width: 100%; /* 부모 요소에 맞게 너비 설정 */
  margin-top: 50px;
}
.workspace-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 콘텐츠를 수직 중앙 정렬 */
  align-items: center; /* 콘텐츠를 가로 중앙 정렬 */
  position: relative; /* 미트볼 버튼 위치를 위한 relative */
  overflow: visible; /* 드롭다운 메뉴가 잘리지 않도록 */
  transition: transform 0.2s, box-shadow 0.2s;
}
.workspace-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.add-card {
  border: 2px dashed #ccc;
  color: #aaa;
  font-size: 24px;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-card:hover {
  background: #f5f5f5;
}

/* 카드 내부 헤더 */
.card-header {
  position: absolute; /* 카드 내부에서 고정 위치 */
  top: 10px; /* 카드 상단에서 10px 아래 */
  right: 10px; /* 카드 오른쪽에서 10px 안쪽 */
  display: flex;
  align-items: center;
  z-index: 10; /* 드롭다운 메뉴 우선순위 */
}
/* 카드 텍스트 중앙 정렬 */
.card-content {
  flex: 1; /* 남은 공간을 모두 차지 */
  display: flex; /* Flexbox를 사용하여 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  text-align: center; /* 텍스트 가운데 정렬 */
  width: 100%; /* 부모 카드 크기에 맞춤 */
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 0 10px; /* 텍스트 좌우 여백 */
  box-sizing: border-box;
}

/* 미트볼 버튼 */
.meatball-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #aaa;
  padding: 5px;
}

/* 드롭다운 메뉴 */
.dropdown-menu {
  top: 100%; /* 버튼 바로 아래 */
  right: 0; /* 오른쪽 정렬 */
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column; /* 세로로 정렬 */
  align-items: flex-start; /* 항목을 왼쪽으로 정렬 */
  padding: 5px 0; /* 드롭다운 안쪽 간격 */
}

/* 메뉴 아이템 스타일 */
.menu-item {
  padding: 10px 20px; /* 내부 여백 */
  font-size: 14px; /* 글자 크기 */
  color: #333; /* 텍스트 색상 */
  cursor: pointer; /* 클릭 가능한 커서 표시 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
  display: flex; /* Flexbox로 아이콘과 텍스트 정렬 */
  align-items: center; /* 아이콘과 텍스트 수직 정렬 */
  gap: 8px; /* 아이콘과 텍스트 사이 간격 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

/* Hover 효과 */
.menu-item:hover {
  background: #f5f5f5; /* Hover 시 배경색 */
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
  width: calc(100% - 24px); /* 좌우 패딩 포함하여 중앙에 정렬 */
  overflow-y: auto;
  border-radius: 4px;
  padding: 14px;
  border: 1px solid #e0e0e0;
  margin: 5px;
}
.member-list-title {
  margin: 7px;
}
.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
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
  margin: 10px 0; /* 위아래 여백 추가 */
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
