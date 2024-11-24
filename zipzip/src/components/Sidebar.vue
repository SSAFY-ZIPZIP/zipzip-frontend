<template>
  <div class="sidebar">
    <div
      v-for="(menu, index) in menus"
      :key="index"
      class="menu-item"
      :class="{ active: selectedSidebarIndex === index }"
      @click="$emit('menu-select', index)"
    >
      {{ menu }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menus: Array,
    selectedSidebarIndex: Number, // 선택된 사이드바 항목
  },
  emits: ["menu-select"],
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.menu-item {
  cursor: pointer;
  padding: 10px;
  transition: background-color 0.2s, color 0.2s;
}
.menu-item.active {
  background-color: #d3e9fb; /* 선택된 항목의 배경색 */
  color: #007bff; /* 선택된 항목의 텍스트 색 */
  font-weight: bold;
}
</style>
