<template>
  <div class="sidebar">
    <ul class="menu-list">
      <li
        v-for="(menu, index) in menus"
        :key="index"
        :class="['menu-item', { selected: selectedMenu === index }]"
        @click="selectMenu(index)"
      >
        {{ menu }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedMenu: 0,
    };
  },
  methods: {
    selectMenu(index) {
      this.selectedMenu = index;
      this.$emit("menu-select", index); // 부모 컴포넌트로 선택된 메뉴 전달
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-list {
  padding: 0;
  list-style-type: none;
  margin: 0;
}

.menu-item {
  margin: 10px 0;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  text-align: left;
  border-radius: 4px;
}

.menu-item:hover {
  background-color: #ebf4fc;
}

.menu-item.selected {
  color: #5592fb;
  font-weight: bold;
  background-color: #ebf4fc;
}
</style>
