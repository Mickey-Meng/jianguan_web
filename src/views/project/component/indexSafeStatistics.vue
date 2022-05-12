<!--
@name:
@description: 首页安全文明
@author: 王海林
@time: 2022-05-12 17:30:40
@modifier:
@modifierTime:
-->
<template>
  <div class="index_safe_statistics">
    <div class="header">
      <div class="global_text_style" style="margin: 12px 0">安全文明</div>
      <div class="check_box">
        <el-radio v-model="radio" label="1" @change="changeSelect"
        >近一个月
        </el-radio
        >
        <el-radio v-model="radio" label="3" @change="changeSelect"
        >近三个月
        </el-radio
        >
      </div>
    </div>
    <ul class="nav_menu">
      <li v-for="(item) in lists" :key="item.gongquid">{{ item.gongquname }}</li>
    </ul>
    <div class="chart_box">
      <div class="box"></div>

    </div>
    <ul class="card_box">
      <li style="background-color:#FBD97F ">
        <div class="value">1</div>
        <div class="text">提出整改(起)</div>
      </li>
      <li style="background-color:#B6E980 ">
        <div class="value">1</div>
        <div class="text">完成整改(起)</div>
      </li>
      <li style="background-color:#EE9090 ">
        <div class="value">1</div>
        <div class="text">已逾期(起)</div>
      </li>
    </ul>

  </div>
</template>

<script>
  import {getSafeChart} from "@/api/data";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        radio: "1",
        lists: []
      };
    },
    created() {
      this.init();
    },
    mounted() {
    },
    methods: {
      changeSelect() {
      },
      init() {
        getSafeChart(this.radio).then(res => {
          console.log(res);
          this.lists = res.data.total;

        });
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .index_safe_statistics {
    height: 100%;
    padding: 5px 5px 25px 5px;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .check_box {
    padding-right: 20px;
    display: flex;
    align-items: center;

    ::v-deep.el-radio {
      .el-radio__label {
        color: #85858F;
      }
    }
  }

  .nav_menu {
    display: flex;
    justify-content: space-around;
    overflow-x: auto;

    li {
      height: 34px;
      line-height: 34px;
      color: #85858F;
      border-radius: 20px;
      cursor: pointer;
      background-color: #FFFFFF;
      border: 1px solid #E8E8E8;
      padding: 0 10px;
    }
  }

  .chart_box {
    height: calc(100% - 210px);
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
      width: 99%;
      height: 90%;
      border: 1px solid #E8E8E8;
      border-radius: 10px;
    }

    //border: 1px solid #E8E8E8;
  }

  .card_box {
    height: 140px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    li {
      //width: 33%;
      width: 125px;
      height: 125px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: 600;

      .value {
        margin-bottom: 10px;
        font-size: 24px;
      }

      .text {
        font-size: 16px;
      }
    }
  }

</style>
