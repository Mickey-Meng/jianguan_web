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
        <el-table-column prop="gongquname" label="工区" align="center">
        </el-table-column>
        <el-table-column prop="projectname" label="路段" align="center">
        </el-table-column>
        <el-table-column
          prop="conponenttypename"
          label="构件类型"
          align="center"
        >
        </el-table-column>
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
        <el-table-column prop="address" label="完成状态" align="center">
          <template slot-scope="{ row }">
            {{ row.actulendtime ? "完成" : "未完成" }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="工程量/m3" align="center">
        </el-table-column> -->
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
import { getProgressTableData } from "@/api/progress";
import Bus from "@/assets/eventBus";

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
      },
      tableData: [],
      currtPage: 1,
      pageSize: 10,
    };
  },
  created() {
    this.initData();
    Bus.$on("search", () => {
      this.initTable();
    });
  },
  methods: {
    initData() {
      getComponentType().then((res) => {
        let data = res.data;
        let tree = [];
        for (let i in data) {
          let child = data[i];
          let obj = {
            name: i,
            type: "folder",
            children: child,
          };
          tree.push(obj);
        }
        this.nodes = tree;
      });
      this.initTable();
    },
    initTable() {
      getProgressTableData(this.sendObj).then((res) => {
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
