<template>
  <div class="allbg">
    <div class="wrapper">
      <div class="title">
        <div class="titlecontent">
          <div class="titleitem" />
          <div class="titletext">构件进度</div>
        </div>
        <ul class="header">
          <li
            :class="{ active: currentView == 'Bridge' }"
            @click="changeView('Bridge')"
          >
            桥梁工程
          </li>
          <li
            :class="{ active: currentView == 'Road' }"
            @click="changeView('Road')"
          >
            道路工程
          </li>
          <li
            :class="{ active: currentView == 'tunneling' }"
            @click="changeView('tunneling')"
          >
            隧道工程
          </li>
        </ul>
      </div>

      <div class="card-panel">
        <keep-alive>
          <component :is="currentView" :engineering="engineering" />
        </keep-alive>
      </div>
      <div class="select-box">
        <div class="select-left">
          <!--          <el-select-->
          <!--            v-model="typeKey"-->
          <!--          >-->
          <!--            <el-option v-for="item in typeArr" :key="item.key" :value="item.key" :label="item.name"></el-option>-->
          <!--          </el-select>-->
          <el-select
            v-model="bridgeComponentType"
            placeholder="请选择"
            @change="bridgeTypeChange"
          >
            <el-option
              v-for="(item, index) in bridgeType"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </div>
        <div class="select-right">
          <el-button
            v-for="(item, index) in lists"
            :key="index"
            size="mini"
            class="type-btn"
            :class="{ active: item.value === currentType }"
            @click="changeList(item.value)"
            >{{ item.name }}</el-button
          >
        </div>
      </div>
      <div class="chart-box">
        <progressBar :line-chart-data="lineChartData" />
      </div>
    </div>
  </div>
</template>

<script>
import Bridge from "@/views/project/component/Bridge";
import Road from "@/views/project/component/Road";
import tunneling from "@/views/project/component/tunneling";

import progressBar from "@/views/progress/indexComponent/cartogramComponent/progressBar";
import {
  getFinishConponent,
  getComponentType,
  getCountConponent,
  getCountIncresConponent,
  getMiddleData,
} from "@/api/data";

export default {
  name: "",
  components: { Bridge, Road, progressBar, tunneling },
  data() {
    return {
      typeKey: 1,
      currentView: "Bridge",
      engineering: {},
      bridgeType: [],
      lineChartData: [],
      bridgeComponentType: "累计完成统计",
      currentType: "month",
      typeArr: [
        {
          key: 1,
          name: "累计完成统计",
        },
        {
          key: 2,
          name: "单位工程进度统计",
        },
      ],
      lists: [
        {
          name: "周",
          value: "week",
        },
        {
          name: "月",
          value: "month",
        },
        {
          name: "季",
          value: "season",
        },
      ],
    };
  },
  created() {
    this.initData();
    getComponentType().then((res) => {
      const obj = res.data.child.find((e) => e.code === "QL");
      const type = {
        code: "all",
        name: "所有类型",
      };
      obj.child.unshift(type);
      this.bridgeType = obj.child;
    });
  },
  mounted() {
    this.initBottomData();
  },
  methods: {
    changeView(val) {
      if (this.currentView != val) {
        this.currentView = val;
      }
    },
    initData() {
      getMiddleData().then((res) => {
        this.engineering = res.data;
      });
    },
    initBottomData() {
      const obj = {
        projectCode: "QL",
        type: this.currentType,
        conponentType: this.bridgeComponentType,
      };
      getCountIncresConponent(obj).then((res) => {
        this.lineChartData = res.data;
      });
    },
    changeList(val) {
      if (this.currentType != val) {
        this.currentType = val;
        this.initBottomData();
      }
    },
    bridgeTypeChange() {
      this.initBottomData();
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: 16px;
  .title {
    display: flex;
    justify-content: space-between;
    .titlecontent {
      display: flex;
      justify-content: flex-start;
      .titletext {
        margin-left: 16px;
      }
    }

    .header {
      display: flex;
      li {
        height: 24px;
        line-height: 24px;
        padding: 0 40px;
        cursor: pointer;
        background-image: url(../../../../assets/image/tab.png);
        margin-right: 15px;
      }
      .active {
        // background-color: rgb(51, 133, 255);
        background-image: url(../../../../assets/image/tab-bg.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .card-panel {
    height: 100px;
    margin: 20px 0;
  }
  .select-box {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .select-left {
      ::v-deep .el-select {
        margin-right: 5px;
        width: 158px;
        text-indent: 0;
        //height: 35px !important;
        .el-input {
          .el-input__inner {
            height: 30px !important;
            line-height: 30px;
            // background-color: #060C26 !important;
            background-image: url(../../../../assets/image/日期选择.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            color: #fff;
            border: none;
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
    .select-right {
      .el-button {
        border: none;
        background-color: transparent !important;
        background-image: url(../../../../assets/image/tab.png);
        color: #fff;
        padding: 7px 30px;
      }
      .active {
        background-color: transparent !important;
        background-image: url(../../../../assets/image/tab-bg.png);
        color: #ffffff;
      }
    }
  }
  .chart-box {
    height: calc(100% - 160px);
  }
}
</style>
