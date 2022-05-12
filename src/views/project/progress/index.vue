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
    <div class="header">
      <div class="global_text_style">项目进度</div>
    </div>
    <progressChart></progressChart>
    <div class="container">
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
  padding: 5px;
  //background-image: url(../../../assets/image/边框-大.png);
  //background-repeat: no-repeat;
  //background-size: 100% 100%;

  .container {
    height: calc(100% - 185px);
  }
}
</style>
