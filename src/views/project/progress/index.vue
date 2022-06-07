<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 09:50:22
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-26 16:08:27
-->
<template>
  <div class="progress_box">
    <div class="top">
      <progressChart></progressChart>
    </div>
    <div class="bottom">
      <statisticsPage></statisticsPage>
    </div>
  </div>
</template>

<script>
import progressChart from "./chart.vue";
import statisticsPage from "@/views/project/progress/statisticsPage";
export default {
  data() {
    return {};
  },
  created() {},
  components: { progressChart, statisticsPage },
  computed: {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.progress_box {
  height: 100%;

  .top {
    height: 30%;
    margin-bottom: 20px;

  }

  .bottom {
    height: calc(70% - 20px);

  }
}
</style>
