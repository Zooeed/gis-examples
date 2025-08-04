<template>
  <div v-if="visible" :style="menuStyle" class="cesium-context-menu">
    <ul>
      <li @click="onAction('action1')">操作1</li>
      <li @click="onAction('action2')">操作2</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      menuStyle: { left: '0px', top: '0px' }
    };
  },
  methods: {
    showMenu(x, y) {
      this.menuStyle = { left: x + 'px', top: y + 'px', position: 'absolute', zIndex: 9999 };
      this.visible = true;
    },
    hideMenu() {
      this.visible = false;
    },
    onAction(action) {
      this.$emit('action', action);
      this.hideMenu();
    }
  }
};
</script>
<style scoped>
.cesium-context-menu {
  background: #fff;
  border: 1px solid #ccc;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.cesium-context-menu ul {
  margin: 0; padding: 0; list-style: none;
}
.cesium-context-menu li {
  padding: 8px 16px; cursor: pointer;
}
.cesium-context-menu li:hover {
  background: #f5f5f5;
}
</style>