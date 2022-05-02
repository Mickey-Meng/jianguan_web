<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-03-09 14:55:09
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-14 14:40:35
-->
<template>
  <!-- <div class="authprity_wrapper"> -->

  <!-- </div> -->
  <el-container>
    <el-main>
      <div class="organizational_tree">
        <el-tree
          :data="tree"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
          default-expand-all
          :expand-on-click-node="false"
        >
        </el-tree>
      </div>
      <div class="user_table">
        <div class="search">
          <el-input placeholder="请输入姓名或者角色名" v-model="name">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button>
          </el-input>
        </div>
        <div class="t_b">
          <el-table
            :data="userData"
            style="width: 100%"
            height="100%"
            class="have_scrolling"
            ref="multipleTableUser"
            @selection-change="handUserSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="NAME" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="NEWPOST" label="角色" align="center">
            </el-table-column>
            <el-table-column label="操做" align="center">
              <template slot-scope="{ row }">
                <el-button type="primary" size="mini" @click="seeAuthority(row)"
                  >查看权限</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="area_table">
        <el-table
          :data="areaData"
          style="width: 100%"
          height="100%"
          class="have_scrolling"
          ref="multipleTableArea"
          @selection-change="handAreaSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="工区" align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-footer
      ><el-button type="primary" @click="submit">提交</el-button></el-footer
    >
  </el-container>
</template>

<script>
import { getWorkArea } from "@/api/workArea";
import { getGroupInfo, getUserByGroupId, bindUserToGroup } from "@/api/user";
export default {
  data() {
    return {
      userData: [],
      areaData: [],
      tree: [],
      selectArea: [],
      selectUser: [],
      allUserData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      name: "",
    };
  },
  created() {
    this.initData();
  },
  components: {},
  computed: {},
  methods: {
    initData() {
      getWorkArea().then((res) => {
        this.areaData = res.data;
      });
      getGroupInfo().then((res) => {
        const findSon = function (item, data) {
          if (item.parentid == -1) {
            let children = data.filter((e) => e.parentid === item.id);
            if (children && children.length > 0) {
              item.children = findDescendant(children, data);
            } else {
              item.children = [];
            }
            return item;
          }
        };
        const findDescendant = function (children, data) {
          let arr = [];
          for (let i = 0; i < children.length; i++) {
            let item = children[i];
            let node = data.filter((e) => e.parentid === item.id);
            if (node && node.length > 0) {
              item.children = findDescendant(node, data);
            } else {
              item.children = [];
            }
            arr.push(item);
          }
          return arr;
        };

        let data = res.data;
        let tree = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.parentid == -1) {
            this.handleNodeClick(item);
          }
          let node = findSon(item, data);
          if (node) {
            tree.push(node);
          }
        }
        this.tree = tree;
      });
    },
    handUserSelectionChange(val) {
      this.selectUser = val;
    },
    handAreaSelectionChange(val) {
      this.selectArea = val;
    },
    handleNodeClick(row) {
      let { id, code } = row;
      getUserByGroupId(id, code).then((res) => {
        if (res) {
          let data = res.data.getMe;
          let arr = data.filter((e) => ![1, 2, 3].includes(e.ID));
          this.userData = arr;
          this.allUserData = arr;
        } else {
          this.userData = [];
        }
      });
    },
    submit() {
      if (this.selectUser.length === 0) {
        this.$message({
          type: "info",
          message: "请选择用户",
        });
        return false;
      }
      this.$confirm("绑定工区权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let userIds = this.selectUser.map((item) => {
            return item.ID;
          });
          let groupsIds = this.selectArea.map((item) => {
            return item.id;
          });
          bindUserToGroup({ userIds, groupsIds }).then((res) => {
            this.selectArea = [];
            this.selectUser = [];
            this.$refs.multipleTableUser.clearSelection();
            this.$refs.multipleTableArea.clearSelection();
            this.$message({
              type: "success",
              message: "绑定成功",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    seeAuthority(row) {
      this.$refs.multipleTableArea.clearSelection();
      this.selectArea = [];
      getGroupInfo(row.ID).then((res) => {
        if (res.data.length > 0) {
          this.$nextTick(() => {
            res.data.forEach((row) => {
              let obj = this.areaData.find((e) => e.id === row.groupid);
              if (obj) {
                this.$refs.multipleTableArea.toggleRowSelection(obj, true);
              }
            });
          });
        }
      });
    },
    searchUser() {
      if (this.name) {
        this.userData = this.allUserData.filter((e) => {
          e.NAME = e.NAME ? e.NAME : "";
          e.NEWPOST = e.NEWPOST ? e.NEWPOST : "";
          return (
            e.NAME.indexOf(this.name) != -1 ||
            e.NEWPOST.indexOf(this.name) != -1
          );
        });
      } else {
        this.userData = this.allUserData;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.el-main {
  height: 100%;
  display: flex;
  justify-content: space-around;
  > div {
    width: 32%;
    border: 1px solid floralwhite;
  }
  .user_table {
    .search {
      height: 40px;
    }
    .t_b {
      margin-top: 5px;
      height: calc(100% - 45px);
    }
  }
}
</style>
