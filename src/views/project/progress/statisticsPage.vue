<!--
 * @Descripttion:首页中间页面和进度总览右侧页面
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-26 15:57:58
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-24 16:42:02
-->
<template>
  <div class="statistics_page">
    <div class="new_ui_header">
      <div class="left">
        <div class="header_line"></div>
        <div class="header_text">项目统计</div>
      </div>
      <ul>
        <li
          v-for="(item, index) in nav"
          :key="index"
          :class="{ active: currentView == item.key }"
          @click="changeModel(item.key)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="area_select">
      <div class="area_date">
        <ul v-if="radio === '1'">
          <li v-for="(item,index) in areaLists" :key="index"
              :class="{active:item.gongqucode=== currentAreaInfo.gongqucode}" @click="changeArea(item)">
            {{ item.gongquname }}
          </li>
        </ul>
        <div v-if="radio === '2'" class="port_box">
          <el-select v-model="timeKey">
            <el-option
              v-for="item in sectionData"
              :key="item.key"
              :value="item.key"
              :label="item.name"
            />
          </el-select>
        </div>


      </div>
      <div class="area_check">
        <el-radio v-model="radio" label="1">统计模式</el-radio>
        <el-radio v-model="radio" label="2">报表模式</el-radio>
      </div>
    </div>
    <div class="progress_content">
      <weeklyAndMonthly
        v-if="radio === '2'"
        :currentView="currentView"
        :timeKey="timeKey"
      ></weeklyAndMonthly>
      <statisticsChart
        v-if="radio === '1'"
        :currentAreaInfo="currentAreaInfo"
      ></statisticsChart>
    </div>
  </div>
</template>

<script>
import weeklyAndMonthly from "@/views/project/component/weeklyAndMonthly";
import statisticsChart from "@/views/project/progress/statisticsChart";
import {getHomeBottomChart} from "@/api/data";

export default {
  data() {
    return {
      radio: "1",
      currentView: "QL",
      timeKey: 3,
      nav: [
        {
          name: "桥梁",
          key: "QL"
        },
        {
          name: "道路",
          key: "DL"
        },
        {
          name: "隧道",
          key: "SD"
        },
        {
          name: "其它",
          key: "other"
        }
      ],
      sectionData: [
        {
          name: "周报",
          key: 3
        },
        {
          name: "月报",
          key: 4
        }
      ],
      areaLists: [],
      currentAreaInfo: null
    };
  },
  created() {
    this.init();
  },
  components: {weeklyAndMonthly, statisticsChart},
  computed: {},
  methods: {
    init() {
      getHomeBottomChart(this.currentView).then(res => {
        let data = res.data || [];
        this.currentAreaInfo = null;
        if (data && data.length > 0) {
          data.sort((a, b) => a.gongqucode - b.gongqucode);
          this.currentAreaInfo = data[0];
        }
        this.areaLists = data;
      });
    },
    changeModel(item) {
      this.currentView = item;
      this.init();
    },
    changeArea(item) {
      this.currentAreaInfo = item;
    }
  }
};
</script>
<style lang='scss' scoped>
.statistics_page {
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 15px;

  .new_ui_header {
    display: flex;
    align-items: center;
    padding: 20px 0px 10px 20px;

    .left {
      display: flex;
      align-items: center;

      .header_line {
        width: 4px;
        height: 16px;
        background-color: #1E6EEB;
        margin-right: 8px;
        border-radius: 3px;
      }

      .header_text {
        color: #2D405E;
        font-size: 18px;
        font-weight: bold;
        font-family: PingFang SC;
      }
    }

    ul {
      display: flex;

      li {
        text-align: center;
        margin-left: 20px;
        width: 68px;
        height: 28px;
        line-height: 28px;
        //border-radius: 20px;
        background: url("../../../assets/newUi/nav.png") no-repeat;
        cursor: pointer;
        background-size: 100%;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #808EA9;
        //background-color: #FFFFFF;
        //border: 1px solid #E8E8E8;
      }

      .active {
        font-size: 14px;
        font-family: PingFang SC;
        background: url("../../../assets/newUi/nav_active.png") no-repeat;
        background-size: 100%;
        font-weight: 500;
        color: #1E6EEB;
      }
    }


  }

  .area_select {
    padding: 14px 24px 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 58px;

    .area_check {
      ::v-deep.el-radio {
        margin-right: 20px;

        .el-radio__label {
          cfont-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #808EA9;
        }
      }

      ::v-deep.el-radio.is-checked {
        .el-radio__label {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #2D405E;
        }

      }
    }

    .port_box {
      ::v-deep .el-select {
        width: 158px;

        .el-input {
          .el-input__inner {
            height: 30px !important;
            line-height: 30px;
          }

          input {
            background: transparent;
          }

          .el-input__suffix {
            .el-input__icon {
              line-height: 30px;
            }
          }
        }
      }
    }

    .area_date {
      flex: 1;
    }

    ul {
      display: flex;
      align-items: center;
      overflow-x: auto;

      li {
        background: url("../../../assets/newUi/area_bg.png") no-repeat;
        width: 76px;
        text-align: center;
        background-size: 100%;
        height: 28px;
        line-height: 28px;
        font-weight: 500;
        color: #808EA9;
        cursor: pointer;
        margin-right: 20px;
      }

      .active {
        font-size: 14px;
        font-family: PingFang SC;
        background: url("../../../assets/newUi/area_active_bg.png") no-repeat;
        background-size: 100%;
        font-weight: 500;
        color: #1E6EEB;
      }
    }
  }


  .progress_content {
    height: calc(100% - 125px);
  }
}
</style>
