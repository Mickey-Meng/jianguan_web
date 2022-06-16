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
      <div class="right_content">
        <div class="header">
          <div class="search_b">
            <el-input placeholder="请输入姓名或者岗位" v-model="name">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchUser"
              ></el-button>
            </el-input>
          </div>
          <div class="search_b" style="margin-left: 10px">
            <el-select v-model="sectionId" placeholder="请选择" style="width: 100%" @change="changeSection">
              <el-option
                v-for="item in allSections"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="table_b_w">
          <div class="u_table">
            <el-table
              :data="userData"
              style="width: 100%"
              height="100%"
              class="have_scrolling"
              ref="multipleTableUser"
              @selection-change="handUserSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="NAME" label="姓名" align="center">
              </el-table-column>
              <el-table-column prop="NEWPOST" label="岗位" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button type="primary" size="mini" @click="seeAuthority(row)"
                  >查看权限
                  </el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="u_table" style="margin-left: 10px">
            <el-table
              :data="areaData"
              style="width: 100%"
              height="100%"
              class="have_scrolling"
              ref="multipleTableArea"
              @selection-change="handAreaSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="工区" align="center">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--      <div class="user_table">-->
      <!--        <div class="search" style="margin-bottom: 5px">-->

      <!--        </div>-->
      <!--        <div class="t_b"  style="height: 90%">-->

      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="user_table">-->
      <!--        <div class="search" style="margin-bottom: 5px">-->
      <!--          <div>-->

      <!--          </div>-->

      <!--        </div>-->
      <!--        <div class="t_b" style="height: 90%">-->

      <!--        </div>-->

      <!--      </div>-->
    </el-main>
    <el-footer
      ><el-button type="primary" @click="submit">提交</el-button></el-footer
    >
  </el-container>
</template>

<script>
  import {getWorkAreaByProjectId} from "@/api/workArea";
  import {getGroupInfo, getUserByGroupId, bindUserToGroup, getOrgInfo} from "@/api/user";
  import {mapGetters} from "vuex";
  import {getAllProject} from "@/api/project";

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
          label: "NAME"
        },
        name: "",
        allSections: [],
        sectionId: null
      };
    },
    created() {
      this.initData();
    },
    components: {},
    computed: {
      ...mapGetters(['project'])
    },
    methods: {
      initData() {
        getWorkAreaByProjectId(this.project.id).then((res) => {
          this.areaData = res.data;
          this.sectionId = this.project.id;
        });
        getAllProject().then(res => {
          this.allSections = res.data;
        });
        getOrgInfo().then(res => {
          let data = res.data.getMe;

          function getTree(ary, pid = -1) {
            if (!pid) {
              // 如果没有父id（第一次递归的时候）将所有父级查询出来
              return ary.filter(item => !item.PARENTID).map(item => {
                // 通过父节点ID查询所有子节点
                item.children = getTree(ary, item.ID);
                return item;
              });
            } else {
              return ary.filter(item => item.PARENTID === pid).map(item => {
                // 通过父节点ID查询所有子节点
                item.children = getTree(ary, item.ID);
                return item;
              });
            }
          }

          let tre = getTree(data);
          this.tree = tre;
        });
      },
      changeSection(val) {
        this.$refs.multipleTableArea.clearSelection();
        getWorkAreaByProjectId(val).then((res) => {
          this.areaData = res.data;
        });
      },

      handUserSelectionChange(val) {
        this.selectUser = val;
      },
      handAreaSelectionChange(val) {
        this.selectArea = val;
      },
      handleNodeClick(row) {
        let {ID, CODE} = row;
        getUserByGroupId(ID, CODE).then((res) => {
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

  .organizational_tree {
    width: 32%;
    margin-right: 10px;
  }

  .right_content {
    width: calc(68% - 10px) !important;

    .header {
      width: 100%;
      height: 45px;
      display: flex;

      .search_b {
        width: 50%;
      }
    }

    .table_b_w {
      width: 100%;
      margin-top: 10px;
      //height: calc(100% - 55px);
      height: 660px;
      display: flex;

      .u_table {
        width: 50%;
      }
    }
  }
}
</style>
