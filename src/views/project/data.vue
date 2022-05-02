<template>
  <div class="module-box-wrapper index_wrapper">
    <!-- <el-row class="row-top">
      <el-col :span="5" class="row-top-left">
        <Project :companyData="companyData"></Project>
        <Company :companyData="companyData"></Company>
      </el-col>
      <el-col :span="10" class="roe-top-center">
        <ProjectProgress></ProjectProgress>
      </el-col>
      <el-col :span="9" class="row-top-right">
        <weeklyAndMonthly></weeklyAndMonthly>
      </el-col>
    </el-row>
    <el-row class="row-bottom" >
      <el-col :span="5" class="row-bottom-left">
         <videoMonitoring></videoMonitoring>
      </el-col>
      <el-col :span="10" class="row-bottom-center">
        <safetyCivilization></safetyCivilization>
      </el-col>
      <el-col :span="9">
        <newMsg></newMsg>
      </el-col>
    </el-row> -->
    <div class="index_left">
      <div class="pro_base">
        <Project :companyData="companyData"></Project>
      </div>
      <div class="company">
        <Company :companyData="companyData"></Company>
      </div>
      <div class="video">
        <videoMonitoring></videoMonitoring>
      </div>
    </div>
    <div class="index_center">
      <progressCom></progressCom>
    </div>
    <div class="index_right">
      <div class="news_box">
        <newMsg></newMsg>
      </div>
      <div class="safe_box">
        <safeStatistics title="安全文明"></safeStatistics>
      </div>
    </div>
  </div>
</template>

<script>
import Project from "./component/project";
import Company from "./component/company";
import ProjectProgress from "./component/projectProgress";
import videoMonitoring from "@/views/project/component/videoMonitoring";
import weeklyAndMonthly from "@/views/project/component/weeklyAndMonthly";
import safetyCivilization from "@/views/project/component/safetyCivilization";
import newMsg from "@/views/project/component/newMsg";
import safeStatistics from "@/views/project/component/safeStatistics";
import progressCom from "./progress/index.vue";
import { mapGetters } from "vuex";
import * as api from "@/api/data";
export default {
  name: "project",
  data() {
    return {
      companyData: {},
    };
  },
  components: {
    Project,
    Company,
    ProjectProgress,
    weeklyAndMonthly,
    videoMonitoring,
    safetyCivilization,
    newMsg,
    safeStatistics,
    progressCom,
  },
  created() {
    this.initData();
  },
  mounted() {},
  computed: {},
  methods: {
    initData() {
      api.getEngCompany().then((res) => {
        this.companyData = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// .module-box-wrapper{
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   .el-row{
//     height: 49%;
//     margin: 0 !important;
//   }
//   .row-top{
//     .el-col{
//       height: 100%;
//       box-sizing: border-box;
//     }
//     .row-top-left{
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//     }
//     .roe-top-center{
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//     }
//     .row-top-right{
//       background-image: url(../../assets/image/边框-大.png);
//       background-repeat: no-repeat;
//       background-size: 100% 100%;
//     }

//   }
//   .row-bottom{

//     .el-col{
//       height: 100%;
//       box-sizing: border-box;
//     }
//   }
// }
.index_wrapper {
  display: flex;
  justify-content: space-between;
  .index_left {
    width: 450px;
    // display: flex;
    .pro_base {
      height: 28%;
    }
    .company {
      margin: 10px 0;
      height: 26%;
    }
    .video {
      height: calc(46% - 20px);
    }
  }
  .index_center {
    width: 728px;
  }

  .index_right {
    width: 601px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .news_box {
      height: 50%;
    }
    .safe_box {
      height: 49%;
    }
  }
}
</style>
