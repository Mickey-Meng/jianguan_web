<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-09 13:46:00
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-26 16:25:10
-->
<template>
  <div class="wrapper">
    <el-row class="first-el-row">
      <el-col :span="12" class="first-el-col">
        <div class="pro-pre">
          <div class="header_g">
            <div class="title_item"></div>
            <div class="title_text">项目进度</div>
          </div>
          <progressChart></progressChart>
        </div>
        <div class="eng-pre">
          <progressChange></progressChange>
        </div>
      </el-col>
      <el-col :span="12">
        <!-- <reportAndBar></reportAndBar> -->
        <div class="allbg">
          <statisticsPage></statisticsPage>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import engProgress from "@/views/progress/indexComponent/cartogramComponent/engProgress";
// import projectProgress from "@/views/progress/indexComponent/cartogramComponent/projectProgress";
// import reportAndBar from "@/views/progress/indexComponent/cartogramComponent/reportAndBar";
import progressChart from "@/views/project/progress/chart.vue";
import progressChange from "@/views/progress/indexComponent/cartogramComponent/progressChange";
import statisticsPage from "@/views/project/progress/statisticsPage";
export default {
  name: "",
  components: { progressChart, progressChange, statisticsPage },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: 5px 0 !important;
  .first-el-row {
    height: 100%;
    .first-el-col {
      display: flex;
      flex-direction: column;
      .pro-pre {
        height: 32%;
        margin-bottom: 10px;
        margin-right: 10px;
        background-image: url("../../../assets/image/边框-小.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        // height: 100%;
      }
      .eng-pre {
        height: 68%;
        margin-right: 10px;
      }
    }
    > .el-col {
      height: 100%;
    }
  }
}
</style>
