<template>
  <div
    class="wrapper"
    :class="{
      other: currentView == 'tabularDrawing' || currentView == 'gantt',
    }"
  >
    <div class="header">
      <ul>
        <li
          :class="{ active: currentView == 'cartogram' }"
          @click="changeView('cartogram')"
        >
          统计图
        </li>
        <li
          :class="{ active: currentView == 'tabularDrawing' }"
          @click="changeView('tabularDrawing')"
        >
          表格图
        </li>
        <!-- <li
          :class="{ active: currentView == 'gantt' }"
          @click="changeView('gantt')"
        >
          甘特图
        </li> -->
      </ul>
      <div class="tabularDrawing-box" v-if="currentView == 'tabularDrawing'">
        <!-- <el-button>形象完工</el-button>
        <el-button>所有</el-button> -->
        <el-select v-model="typeKey">
          <el-option
            v-for="item in typeArr"
            :key="item.projectid"
            :value="item.projectid"
            :label="item.projectname"
          ></el-option>
        </el-select>
        <span>实际完成：</span>
        <el-date-picker
          v-model="timeVale"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>

        <span>编码：</span>
        <el-input placeholder="请输入编码" v-model="code" clearable></el-input>
        <el-button class="active" @click="search">搜索</el-button>
        <el-button class="active" @click="exportTable">导出</el-button>
        <el-button class="active" @click="exportBottomTable"
          >导出桥梁下部结构</el-button
        >
      </div>
      <div class="gantt-box" v-if="currentView == 'gantt'">
        <el-button size="mini">月</el-button>
        <el-button size="mini">周</el-button>
        <el-button size="mini">日</el-button>
      </div>
    </div>
    <div class="content">
      <!-- <keep-alive> -->
      <component
        v-bind:is="currentView"
        :timeVale="timeVale"
        :code="code"
        :typeKey="typeKey"
      ></component>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
// import gantt from "@/views/progress/indexComponent/gantt";
import tabularDrawing from "@/views/progress/indexComponent/tabularDrawing";
import cartogram from "@/views/progress/indexComponent/cartogram";
import { getProjectTypeData, getProgressTableData } from "@/api/progress";
import Bus from "@/assets/eventBus";
import {mapGetters} from "vuex";

export default {
  name: "",
  components: {  tabularDrawing, cartogram },
  data() {
    return {
      currentView: "cartogram",
      timeVale: "",
      typeKey: "",
      code: "",
      typeArr: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.initData();
  },
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    changeView(val) {
      if (this.currentView != val) {
        this.currentView = val;
      }
    },
    initData() {
      getProjectTypeData(this.project.id).then((res) => {
        let obj = {
          projectname: "所有工程",
          projectid: "all",
        };
        let data = res.data || [];
        data.unshift(obj);
        this.typeArr = data;
      });
    },
    exportTable() {
      this.$message({
        message: "加急开发中",
        type: "info",
        customClass: "message_override",
      });
    },
    exportBottomTable() {
      this.$message({
        message: "加急开发中",
        type: "info",
        customClass: "message_override",
      });
    },
    search() {
      Bus.$emit("search");
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: 2px 5px 5px 5px;
  //padding: 5px;
  //background-color: #FFFFFF;
  .header {
    height: 70px;
    background-color: #FFFFFF;
    display: flex;
    .tabularDrawing-box {
      margin-left: 10px;
      flex: 1;
      display: flex;
      align-items: center;
      .el-select {
        margin-left: 10px;
        width: 250px;
      }
      span {
        color: #000000;
        margin: 0 5px;
      }
      .el-input {
        width: 200px;
        margin-right: 5px;
      }
      .el-button {
      }
      .active {
        border: 1px solid rgb(51, 133, 255);
        background-color: rgb(51, 133, 255);
        color: #ffffff;
      }
    }
    .gantt-box {
      margin-left: 20px;
      flex: 1;
      line-height: 70px;
      .el-button {
        padding: 7px 25px;
        border: 1px solid rgb(51, 133, 255);
      }
    }
    ul {
      display: flex;
      align-items: center;
      margin-left: 20px;

      li {
        //height: 50px;
        padding: 15px 30px;
        //border: 1px solid rgb(51, 133, 255);
        background-color: rgba(128, 142, 169, .16);
        cursor: pointer;
        color: #4B5973;
        font-family: PingFang SC;
        border-radius: 6px;
        margin-right: 20px;
      }

      .active {
        background: #1E6EEB;
        color: #FFFFFF;
      }
    }
  }

  .content {
    margin-top: 5px;
    height: calc(100% - 75px);
  }
}
.other {
  background-color: #edeff8;
  .header {
    background-color: #ffffff;
    ul {
      li {
        color: #000000;
      }
      .active {
        color: #ffffff;
      }
    }
  }
}
</style>
