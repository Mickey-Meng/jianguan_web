<template>
  <div class="wrapper">
    <div class="header">
      <div class="tabularDrawing-box">
        <!-- <el-button>形象完工</el-button>
        <el-button>所有</el-button> -->
        <el-select v-model="sendObj.projectid">
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
        <el-input placeholder="请输入编码" v-model="sendObj.code" clearable></el-input>
        <el-button class="active" @click="search">搜索</el-button>
        <el-button v-show="false" class="active" @click="exportTable">导出</el-button>
        <el-button v-show="false" class="active" @click="exportBottomTable"
          >导出桥梁下部结构</el-button
        >
      </div>
    </div>
    <div class="content">
      <div class="tree golbal_scrolling">
      <el-tree
        :data="nodes"
        highlight-current
        node-key="id"
        :default-expanded-keys="[1, 11]"
        :props="defaultProps"
        @node-click="nodeClick"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <svg-icon
              :icon-class="data.type === 'folder' ? 'folder' : 'coverage'"
            ></svg-icon
            >{{ node.label }}
          </span>
        </span>
      </el-tree>
    </div>
    <div class="table">
      <el-table
        :data="
          tableData.slice((currtPage - 1) * pageSize, currtPage * pageSize)
        "
        height="90%"
        border
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" type="index" width="80">
        </el-table-column>
        <el-table-column prop="gongqu" label="工区" align="center">
        </el-table-column>
        <el-table-column prop="danweigongcheng" label="单位工程" align="center"></el-table-column>
        <el-table-column prop="fenbugongcheng" label="分部工程" align="center"></el-table-column>
        <el-table-column prop="zifenbugongcheng" label="子分部工程" align="center"></el-table-column>
        <el-table-column prop="fenxianggongcheng" label="分项工程" align="center"></el-table-column>
        <el-table-column prop="goujian" label="构件" align="center"></el-table-column>
        <el-table-column prop="conponentlevel" label="节点级别" align="center">
          <template slot-scope="{ row }">
            {{row.conponentlevel?row.conponentlevel:'-' + "级"}}
          </template>
        </el-table-column>
<!--        <el-table-column
          prop="conponenttypename"
          label="构件类型"
          align="center"
        >
        </el-table-column>-->
        <!-- <el-table-column prop="address" label="墩号/孔号" align="center">
        </el-table-column> -->
        <el-table-column prop="conponentcode" label="构件编码" align="center">
        </el-table-column>
        <el-table-column prop="plansttime" label="计划开始" align="center">
        </el-table-column>
        <el-table-column prop="planendtime" label="计划完成" align="center">
        </el-table-column>
        <el-table-column prop="actulsttime" label="实际开始" align="center">
        </el-table-column>
        <el-table-column prop="actulendtime" label="实际完成" align="center">
        </el-table-column>
        <el-table-column prop="status" label="预警状态" align="center">
          <template slot-scope="{ row }">
            {{dict_process_warning[row.status]}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态提醒" align="center">
          <template slot-scope="{ row }">
            <div v-if="dict_process_warning_remark[row.status]" style="width: 10px; height: 10px; border-radius: 5px;margin: auto;" :style="'background: ' + dict_process_warning_remark[row.status]"></div>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" align="center"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,prev, pager, next,jumper"
        :total="tableData.length"
        :current-page="currtPage"
        :page-size="pageSize"
        @current-change="changePage"
      >
      </el-pagination>
    </div>
    </div>

  </div>
</template>

<script>
import { getComponentType } from "@/api/data";
import { getProgressWarningTableData, getProjectTypeData, getDictDataByType  } from "@/api/progress";
import Bus from "@/assets/eventBus";
import {mapGetters} from "vuex";

export default {
  name: "",

  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      timeVale: "",
      nodes: [],
      sendObj: {
        code: "",
        conponenttype: "",
        endtime: "",
        projectid: null,
        sttime: "",
        projectId: null
      },
      tableData: [],
      currtPage: 1,
      pageSize: 10,

      typeArr: [],
      dict_process_warning: {},
      dict_process_warning_remark: {},

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
  computed: {
    ...mapGetters(["project"])
  },
  created() {
    this.initData();
    this.sendObj.projectId = this.project.id;
    Bus.$on("search", () => {
      this.initTable();
    });
  },
  methods: {
    search() {
      this.initTable();
    },
    initData() {
      getComponentType(this.project.id).then((res) => {
        let data = res.data;
        let tree = [];
        for (let i in data) {
          let child = data[i];
          let obj = {
            name: i,
            type: "folder",
            children: child
          };
          tree.push(obj);
        }
        this.nodes = tree;
      });

      getProjectTypeData(this.project.id).then((res) => {
        let obj = {
          projectname: "所有工程",
          projectid: "",
        };
        let data = res.data || [];
        data.unshift(obj);
        this.typeArr = data;
        this.sendObj.projectid = data[0].projectid;

        this.initTable();
      });

      getDictDataByType({pageNum:1,pageSize:999,dictType:"jg_process_warning_status"}).then((res) => {
        let data = res.rows || [];
        const dict = {};
        const dict_remark = {};
        data.forEach(item => {
          dict[item.dictValue] = item.dictLabel
          dict_remark[item.dictValue] = item.remark
        });
        this.dict_process_warning = dict;
        this.dict_process_warning_remark = dict_remark
      });
      
    },
    initTable() {
      getProgressWarningTableData(this.sendObj).then((res) => {
        this.tableData = res.data;
      });
    },
    changePage(val) {
      this.currtPage = val;
    },
    nodeClick(node) {
      if (node.type && node.type !== "folder") {
        this.sendObj.conponenttype = node.type;
        this.initTable();
      } else if (node.type && node.type === "folder") {
        this.sendObj.conponenttype = "";
        this.initTable();
      }
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
  },
  watch: {
    timeVale(n, o) {
      if (n) {
        this.sendObj.sttime = n[0];
        this.sendObj.endtime = n[1];
      } else {
        this.sendObj.sttime = "";
        this.sendObj.endtime = "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {

  height: 100%;
  padding: 2px 5px 5px 5px;

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
    display: flex;
    .tree {
      width: 15%;
    }

    .table {
      width: 85%;
    }
  }
}
</style>
