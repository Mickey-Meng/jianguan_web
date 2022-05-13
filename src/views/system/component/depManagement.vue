<!--
 * @Descripttion:部门管理
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 16:30:16
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 16:30:27
-->
<template>
  <!--  <div class="dep_wrapper"></div>-->
  <el-container>
    <el-aside width="30%">
      <div class="btn_header">
        <el-button type="primary" @click="openDialog">新增顶级组织</el-button>
      </div>
      <div class="el_tree_box">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          accordion
          node-key="id"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span class="bth-box" v-if="data.pid === 0">
          <i class="el-icon-plus" @click="addSonDep(data)"></i>
                        <i class="el-icon-edit" @click="updateDep(data)"></i>
              <!--                        <i class="el-icon-delete" @click="deleteDep(node,data)"></i>-->

        </span>
          </div>
        </el-tree>
      </div>
      <div class="label">组织用户</div>
      <div class="table_box_wrapper">
        <el-table
          :data="newUserData"
          style="width: 100%"
          height="100%"
          class="have_scrolling"
          ref="multipleTableUser"
        >
          <el-table-column prop="username" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="rolename" label="岗位" align="center">
          </el-table-column>
          <el-table-column prop="personGroupName" label="组织" align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-aside>
    <el-container>
      <el-main class="main-content-box">
        <div class="project_tree">
          <el-tree
            :data="tree"
            :props="defaultProps"
            accordion
            @node-click="handleProjectNodeClick"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
          >
          </el-tree>
        </div>
        <div class="user_lists">
          <div class="search">
            <el-input placeholder="请输入姓名或者岗位" v-model="name">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchUser"
              ></el-button>
            </el-input>
          </div>
          <div class="table-w">
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
              <el-table-column prop="orgName" label="组织" align="center">
              </el-table-column>
            </el-table>
          </div>

        </div>
      </el-main>
      <el-footer style="line-height: 60px">
        <el-button type="primary" @click="submitBindInfo">提交</el-button>
      </el-footer>

    </el-container>

    <el-dialog
      :title="isCreate ? '新增组织信息' : '修改组织信息'"
      :visible.sync="dialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        v-if="dialogVisible"
        ref="form"
        size="small"
        label-position="right"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="组织名称" prop="name">
          <el-input placeholder="请输入组织名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="code">
          <el-input placeholder="请输入备注" v-model="form.code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="addInfo">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {
    addOrganization,
    deleteOrganization,
    getOrganization,
    updateOrganization,
    bindingUsersToOrganizations,
    getUserBindOrganizations
  } from "@/api/system";
  import {getGroupInfo, getUserByGroupId} from "@/api/user";
  import {disposeOrg} from "@/utils/disposeOrg";


  export default {
    data() {
      return {
        isCreate: true,
        dialogVisible: false,
        form: {},
        treeData: [],//组织树
        tree: [],//项目树
        userData: [],//用户数据
        newUserData: [],//当前组织的用户
        allUserData: [],//存储的用户数据
        selectUser: [],//选中的用户数据
        currentDepRow: null,//当前组织的id
        currentRow: null,//当前项目树的id
        defaultProps: {
          children: "children",
          label: "name"
        },
        name: "",
        rules: {
          name: [
            {required: true, message: "请输入组织名称", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.init();
    },
    components: {},
    computed: {},
    methods: {
      openDialog() {
        this.isCreate = true;
        this.form = {
          pid: 0
        };
        this.dialogVisible = true;

      },
      init() {
        //获取组织
        getOrganization().then(res => {
          this.treeData = res.data;
        });
        //获取项目树
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
              this.handleProjectNodeClick(item);
            }
            let node = findSon(item, data);
            if (node) {
              tree.push(node);
            }
          }
          this.tree = tree;
        });
      },
      //点击组织事件
      handleNodeClick(node, data) {
        getUserBindOrganizations().then(res => {
          console.log(res, node);
          this.newUserData = res.data.filter(e => e.personGroupid === node.id);
        });
        this.currentDepRow = node;
      },
      //新增
      addSonDep(data) {
        console.log(data, 99);
        this.isCreate = true;
        this.form = {
          pid: data.id
        };
        this.dialogVisible = true;
      },
      //更新组织打开弹框
      updateDep(data) {
        this.form = Object.assign({}, data);
        this.isCreate = false;
        this.dialogVisible = true;
      },
      //删除组织
      deleteDep(node, data) {

        if (data.children.length > 0) {
          this.$message({
            message: "存在子组织，请先删除子组织。",
            type: "warning",
            customClass: "message_override"
          });
          return false;

        } else {
          this.$confirm("删除信息？", "删除", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteOrganization(data.id).then((res) => {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                this.$message({
                  message: "删除成功",
                  type: "success",
                  customClass: "message_override"
                });
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        }
      },
      //点击项目树获取用户
      handleProjectNodeClick(row) {
        let {id, code} = row;
        this.currentRow = row;
        this.clearSelect();
        getUserByGroupId(id, code).then((res) => {
          if (res) {
            let data = res.data.getMe;
            let arr = data.filter((e) => ![1, 2, 3].includes(e.ID));
            if (arr.length > 0) {
              getUserBindOrganizations().then(res1 => {
                let org = [];
                if (res1.data) {
                  org = res1.data;
                }
                arr.forEach(item => {
                  let info = org.find(e => e.userid === item.ID);
                  if (info) {
                    item.orgName = info.personGroupName;
                  }
                });
                this.userData = arr;
                this.allUserData = arr;
              }).catch(() => {
                this.userData = arr;
                this.allUserData = arr;
              });
            }
          } else {
            this.userData = [];
          }
        });
      },
      //用户复选框事件
      handUserSelectionChange(val) {
        this.selectUser = val;
      },
      clearSelect() {
        this.selectUser = [];
        this.$refs.multipleTableUser.clearSelection();
      },
      //搜索用户
      searchUser() {
        this.clearSelect();
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
      //添加修改组织
      addInfo() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            if (this.isCreate) {
              addOrganization([obj]).then(res => {
                this.init();
                this.dialogVisible = false;
                this.$message({
                  message: "添加成功",
                  type: "success",
                  customClass: "message_override"
                });
              });

            } else {
              updateOrganization(obj).then(res => {
                this.init();
                this.dialogVisible = false;
                this.$message({
                  message: "添加成功",
                  type: "success",
                  customClass: "message_override"
                });
              });
            }
          } else {
            return false;
          }
        });
      },
      //用户组织关联
      submitBindInfo() {
        let {currentDepRow, selectUser} = this;
        if (currentDepRow && currentDepRow.pid !== 0) {
          if (selectUser.length > 0) {
            console.log(selectUser, currentDepRow);
            let {id, name} = currentDepRow;
            let data = this.selectUser.map(item => {
              return {
                personGroupName: name,
                personGroupid: id,
                userid: item.ID,
                username: item.NAME
              };
            });
            bindingUsersToOrganizations(data).then(res => {
              this.clearSelect();
              this.handleProjectNodeClick(this.currentRow);
              this.$message({
                message: "绑定成功",
                type: "success",
                customClass: "message_override"
              });

            });

          } else {
            this.$message({
              message: "请选择用户",
              type: "warning",
              customClass: "message_override"
            });
          }

        } else {
          this.$message({
            message: "组织不能为空,并且不能选择顶级组织",
            type: "warning",
            customClass: "message_override"
          });
        }
      }
    }
  };
</script>
<style lang='scss' scoped>
  .el-container {
    .el-aside {
      //display: flex;
      border: 1px solid #fff;

      .btn_header {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
        border-bottom: 1px solid #fff;
      }

      .label {
        height: 25px;
        line-height: 25px;
        font-weight: 600;
        padding: 0 5px;
      }

      .el_tree_box {
        height: calc(50%);
        padding: 5px;

      }

      .table_box_wrapper {
        height: calc(50% - 75px);
      }


    }

    .main-content-box {
      padding: 0 !important;
      display: flex;
      justify-content: space-around !important;

      > div {
        //flex: 1;
        width: 48%;
        margin-left: 20px;
        padding: 5px;
        border: 1px solid #fff;

        .search {
          height: 40px;
        }

        .table-w {
          margin-top: 5px;
          height: calc(100% - 45px);
        }
      }
    }
  }

  .custom-tree-node {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bth-box {
      i {
        margin: 0 5px;
      }
    }
  }
  .el-tree{
    height: 100%;
  }
</style>
