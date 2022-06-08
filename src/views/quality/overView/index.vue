<!--
 * @Descripttion:安全总览新页面
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 13:43:42
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-11 16:50:27
-->
<template>
  <div class="safe_overview_wrapper_box">
    <div class="safe_overview_wrapper" :class="{ hide_page: isHide }">
      <div class="safe_overview_wrapper_top">
        <qualityStatistic></qualityStatistic>
        <eventsStatistic></eventsStatistic>
      </div>
      <div class="safe_overview_wrapper_bottom">
        <watchKeep></watchKeep>
      </div>
    </div>
  </div>
</template>

<script>
import eventsStatistic from "@/views/quality/overView/component/eventsStatistic";
import watchKeep from "@/views/quality/overView/component/watchKeep";
import qualityStatistic from "@/views/quality/overView/component/qualityStatistic";
export default {
  data() {
    return {
      isHide: false,
    };
  },
  created() {},
  components: { eventsStatistic, watchKeep, qualityStatistic },
  computed: {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.safe_overview_wrapper_box {
  height: 100%;
}
.safe_overview_wrapper {
  padding: 5px;
  //background-color: #0f0d22;
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
    display: flex;
    justify-content: space-between;
    .safe_statistics {
      width: 1020px;
    }
    .event_statistics {
      width: calc(100% - 1025px);
    }
  }
}
.hide_page {
  transform: translateY(-100%);
  transition: transform 1s;
}
</style>
