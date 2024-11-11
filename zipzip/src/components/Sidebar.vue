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
  data() {
    return {
      menus: [
        "위치로 검색하기",
        "아파트명으로 검색하기",
        "실거래가로 검색하기",
      ],
      selectedMenu: 0,
    };
  },
  methods: {
    selectMenu(index) {
      this.selectedMenu = index;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #ebf4fc;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
}

.menu-list {
  width: 100%;
  padding: 0;
  list-style-type: none;
  text-align: center;
}

.menu-item {
  margin: 10px 0;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
}

.menu-item.selected {
  color: #5592fb;
  font-weight: bold;
}
</style>
