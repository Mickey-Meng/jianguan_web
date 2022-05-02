<!--
 * @Descripttion:安全总览新页面
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 13:43:42
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-25 16:56:58
-->
<template>
  <div class="safe_overview_wrapper_box">
    <div class="safe_overview_wrapper" :class="{ hide_page: isHide }">
      <div class="safe_overview_wrapper_top">
        <safeStatistics title="安全总览"></safeStatistics>
        <eventStatistics></eventStatistics>
      </div>
      <div class="safe_overview_wrapper_bottom">
        <keppWatch></keppWatch>
      </div>
    </div>
  </div>
</template>

<script>
import safeStatistics from "@/views/project/component/safeStatistics";
import eventStatistics from "@/views/safetyCulture/component/eventStatistics";
import keppWatch from "@/views/safetyCulture/component/keppWatch";
export default {
  data() {
    return {
      isHide: false,
    };
  },
  created() {},
  components: { safeStatistics, eventStatistics, keppWatch },
  computed: {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.safe_overview_wrapper_box {
  height: 100%;
}
.safe_overview_wrapper {
  background-color: #0f0d22;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 1s;
  pointer-events: auto;
  > div {
    flex: 1;
  }
  .safe_overview_wrapper_top {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .safe_statistics {
      width: 62%;
    }
    .event_statistics {
      width: 37.5%;
    }
  }
}
.hide_page {
  transform: translateY(-100%);
  transition: transform 1s;
}
</style>
