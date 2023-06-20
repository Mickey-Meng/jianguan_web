<template>
  <div class="wrapper">
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
        <el-table-column prop="danweigongcheng" label="节点级别" align="center"></el-table-column>
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

        </el-table-column>
        <el-table-column prop="status" label="状态提醒" align="center">

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
</template>

<script>
import { getComponentType } from "@/api/data";
import { getProgressWarningTableData  } from "@/api/progress";
import Bus from "@/assets/eventBus";
import {mapGetters} from "vuex";

export default {
  name: "",
  props: ["timeVale", "code", "typeKey"],

  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
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
      pageSize: 10
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
      this.initTable();
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
    code(n, o) {
      if (n) {
        this.sendObj.code = n;
      } else {
        this.sendObj.code = "";
      }
    },
    typeKey(n, o) {
      if (n && n !== "all") {
        this.sendObj.projectid = n;
      } else {
        this.sendObj.projectid = "";
      }
    },
  },
  destroyed() {
    Bus.$off("search");
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  background-color: #ffffff;
  display: flex;

  .tree {
    width: 15%;
  }

  .table {
    width: 85%;
  }
}
</style>
