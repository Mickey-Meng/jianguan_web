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

    <Notification ref="notification" placement="bottomRight" :duration="null" :top="30" @close="onClose" />

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
import Notification from "@/components/Notification/Notification";
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
    indexSafeStatistics,
    Notification
  },
  created() {
    console.log("/data-created");
    this.initData();
  },
  mounted() { },
  computed: {
    ...mapGetters(["project"]),
  },
  methods: {
    initData() {
      api.getEngCompany(this.project.id).then((res) => {
        this.companyData = res.data;
      });
      // 加载未处理的待审批流程
      api.getExpiryRemindersList().then((res) => {
        var description = '如下任务即将在5天后到期,请尽快处理。<br/>';
        if (res.data.certificatePhotosCount > 0) {
          description += "证照管理:" + res.data.certificatePhotos + ";<br/>";
        }
        if (res.data.constructionDesignCount > 0) {
          description += "施工图设计:" + res.data.constructionDesign + ";<br/>";
        }
        if (res.data.constructionPlanCount > 0) {
          description += "施工方案设计:" + res.data.constructionPlan + ";";
        }
        if (res.data.certificatePhotosCount > 0 &&
          res.data.constructionDesignCount > 0) {
          setTimeout(() => {
            this.$refs.notification.info(
              {
                title: '到期任务提醒',
                description: description
              }
            ) // 默认使用
            // this.$refs.notification.info(notification) // info调用
            // this.$refs.notification.success(notification) // success调用
            // this.$refs.notification.error(notification) // error调用
            // this.$refs.notification.warn(notification) // warning调用
          }, 200);
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.index_wrapper {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #F1F3F9;

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
      height: 45%;
      margin-bottom: 20px;
    }

    .safe_box {
      //flex: 1;
      //height: 49%;
      height: calc(55% - 20px);
    }
  }
}
</style>
