<template>
  <div class="left_main_box">
    <div>
      <panelBox header_bg="投资情况报告">
        <nvestmentStatusReport></nvestmentStatusReport>
      </panelBox>
    </div>
    <div>
      <panelBox header_bg="投资管理">
        <investmentManagement></investmentManagement>
      </panelBox>
    </div>
    <div>
      <panelBox header_bg="质量安全">
        <qualitySafety></qualitySafety>
      </panelBox>
    </div>

  </div>
</template>

<script>
  import panelBox from "./panelBox";
  import qualitySafety from "@/views/screenWindow/components/components/qualitySafety";
  import investmentManagement from "@/views/screenWindow/components/components/investmentManagement";
  import nvestmentStatusReport from "@/views/screenWindow/components/components/nvestmentStatusReport";


  export default {
    props: [],
    watch: {},
    data() {
      return {};
    },
    created() {
    },
    mounted() {
    },
    methods: {},
    components: {panelBox, qualitySafety, investmentManagement, nvestmentStatusReport},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .left_main_box {
    height: 100%;
    display: flex;
    flex-direction: column;

    > div:nth-of-type(1) {
      height: 35%;
    }
    > div:nth-of-type(2) {
      height: 29%;
      margin: 10px 0;

    }
    > div:nth-of-type(3) {
      height: calc(36% - 20px);
    }

  }
</style>
