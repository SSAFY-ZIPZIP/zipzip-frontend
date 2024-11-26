<!-- PropertyWorkspaceModal.vue -->
<template>
  <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>워크스페이스에 매물 추가</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div v-if="isLoading" class="loading-state">
          <span>워크스페이스 목록을 불러오는 중...</span>
        </div>

        <div v-else-if="error" class="error-state">
          <span>{{ error }}</span>
          <button @click="fetchWorkspaces" class="retry-button">
            다시 시도
          </button>
        </div>

        <div v-else class="workspace-list">
          <div class="create-workspace">
            <input
              v-model="newWorkspaceName"
              placeholder="새 워크스페이스 이름"
              class="workspace-input"
              @keyup.enter="handleCreateWorkspace"
            />
            <button
              @click="handleCreateWorkspace"
              class="create-button"
              :disabled="!newWorkspaceName.trim()"
            >
              생성
            </button>
          </div>

          <div
            v-for="workspace in workspaces"
            :key="workspace.workspaceId"
            class="workspace-item"
          >
            <span>{{ workspace.workspaceName }}</span>
            <button
              class="add-button"
              @click="addPropertyToWorkspace(workspace.workspaceId)"
              :disabled="isAddingProperty"
            >
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { workspaceApi } from "@/apis/workspace";

const props = defineProps({
  isOpen: Boolean,
  propertyDealId: Number,
});

const emit = defineEmits(["close"]);

const workspaces = ref([]);
const isLoading = ref(false);
const error = ref(null);
const newWorkspaceName = ref("");
const isAddingProperty = ref(false);

const fetchWorkspaces = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await workspaceApi.getUserWorkspaces();
    workspaces.value = response.data;
  } catch (err) {
    error.value = "워크스페이스 목록을 불러오는데 실패했습니다.";
    console.error("워크스페이스 조회 실패:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleCreateWorkspace = async () => {
  if (!newWorkspaceName.value.trim()) return;

  isLoading.value = true;
  error.value = null;

  try {
    await workspaceApi.createWorkspace(newWorkspaceName.value);
    await fetchWorkspaces();
    newWorkspaceName.value = "";
  } catch (err) {
    error.value = "워크스페이스 생성에 실패했습니다.";
    console.error("워크스페이스 생성 실패:", err);
  } finally {
    isLoading.value = false;
  }
};

const addPropertyToWorkspace = async (workspaceId) => {
  if (isAddingProperty.value) return;

  isAddingProperty.value = true;

  try {
    await workspaceApi.addProperty(workspaceId, props.propertyDealId);
    closeModal();
  } catch (err) {
    console.error("매물 추가 실패:", err);
    alert("매물 추가에 실패했습니다.");
  } finally {
    isAddingProperty.value = false;
  }
};

const closeModal = () => {
  newWorkspaceName.value = "";
  error.value = null;
  emit("close");
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      fetchWorkspaces();
    }
  }
);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
}

.workspace-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-workspace {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.workspace-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.create-button {
  padding: 8px 16px;
  background-color: #5592fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.workspace-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.add-button {
  padding: 6px 12px;
  background-color: #5592fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.retry-button {
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #5592fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
