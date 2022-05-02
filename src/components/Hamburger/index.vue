<template>
  <div style="padding: 0 15px;" @click="toggleClick">
   <svg-icon icon-class="left" class="hamburger" :class="{'is-active':isActive}"></svg-icon>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  /* justify-content: center;
  display: flex;
  align-items: center; */
  width: 20px;
  height: 20px;
   color: #00FDF8;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
