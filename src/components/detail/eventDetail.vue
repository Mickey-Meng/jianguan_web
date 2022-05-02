<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-03-16 14:56:37
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-18 19:20:08
-->
<template>
  <!-- <el-drawer
    title="详情页"
    :visible.sync="drawer"
    direction="ltr"
    size="40%"
    :modal="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="handleClose"
  >
    <span>我来啦!</span>
  </el-drawer> -->
  <el-dialog
    title="详情页"
    :visible.sync="drawer"
    width="50%"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
  >
    <div style="height: 600px">
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {};
  },
  created() {},
  components: {},
  computed: {},
  methods: {
    handleClose() {
      this.$emit("closeDrawer");
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
