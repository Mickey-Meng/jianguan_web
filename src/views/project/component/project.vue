<template>
  <div class="wrapper">
    <div class="header">
      <div class="global_text_style">项目信息</div>
    </div>
    <div class="project_content">
      <div class="item" style="background-color: #B5E97D">
        <span class="num">{{ time }}</span>
        <span class="title-name">安全生产(天)</span>
      </div>
      <div class="item" style="background-color: #80C6FF">
        <span class="num">{{ companyData.inputscale }}</span>
        <span class="title-name">工程规模(km)</span>
      </div>
      <div class="item" style="background-color: #A1EBDC">
        <span class="num"
        >{{
            companyData.projectduration
          }}</span
        >
        <span class="title-name">合同工期(天)</span>

      </div>
      <div class="item" style="background-color: #B19BFF">
        <span class="num"
        >{{
            companyData.projectscale
          }}</span
        >
        <span class="title-name">投资规模(万元)</span>

      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentDate, diffDay } from "@/utils/date";
export default {
  name: "",
  props: {
    companyData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      time: null,
    };
  },
  watch: {
    companyData(n, o) {
      if (n.starttime) {
        this.initData();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      const time = getCurrentDate();
      const obj = Object.assign({}, this.companyData);
      const start = obj.starttime.split(" ")[0];
      this.time = diffDay(time, start);
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: 5px;

  .header {
    height: 30px;
  }

  .project_content {
    height: calc(100% - 30px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    .item {
      width: 49%;
      height: 48%;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .title-name {
        font-weight: 600;
      }

      .num {
        font-size: 24px;
        font-family: HuXiaoBo-NanShen;
        font-weight: 600;
        .numafter {
          font-size: 14px;
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
