<template>
  <div class="module-box-wrapper index_wrapper">
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
.index_wrapper {
  display: flex;
  justify-content: space-between;
  .index_left {
    width:400px;
    // display: flex;
    .pro_base {
      height: 28%;
    }
    .company {
      width: 100%;
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
