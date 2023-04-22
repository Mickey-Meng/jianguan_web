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
        <indexSafeStatistics></indexSafeStatistics>
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
import indexSafeStatistics from "@/views/project/component/indexSafeStatistics";
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
    indexSafeStatistics
  },
  created() {
    console.log("/data-created");
    this.initData();
  },
  mounted() {},
  computed: {
    ...mapGetters(["project"]),
  },
  methods: {
    initData() {
      api.getEngCompany(this.project.id).then((res) => {
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
  padding: 20px;

  .index_left {
    width: 426px;
    display: flex;
    flex-direction: column;

    .pro_base {
      height: 30%;
    }

    .company {
      width: 100%;
      height: 35%;
      margin: 20px 0;
    }
    .video {
      height: calc(35% - 40px);
    }
  }
  .index_center {
    width: 640px;
  }

  .index_right {
    width: 495px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .news_box {
      height: 50%;
      margin-bottom: 20px;
    }

    .safe_box {
      //flex: 1;
      //height: 49%;
      height: calc(50% - 20px);
    }
  }
}
</style>
