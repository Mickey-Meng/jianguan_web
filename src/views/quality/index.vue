<template>
  <div class="wrapper">
    <div class="content">
      <div class="golbal_scrolling tree_wrapper_box">
        <el-tree
          ref="tree"
          :data="treeData"
          accordion
          class="tree-box"
          highlight-current
          node-key="id"
          :default-expanded-keys="[2]"
          :expand-on-click-node="false"
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
      <div class="table-content">
        <div class="header">
          <span>工区</span>
          <el-select v-model="areaId" @change="changeArea">
            <el-option
              v-for="item in area"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
          <span>单位工程：</span>
          <el-select v-model="typeKey">
            <el-option
              v-for="item in typeArr"
              :key="item.projectid"
              :value="item.projectid"
              :label="item.projectname"
            ></el-option>
          </el-select>
          <span>形象完成：</span>
          <el-date-picker
            v-model="timeValue"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="timeChange"
          />
          <span>编码：</span>
          <el-input v-model="postData.code" placeholder="请输入构件编码" />
          <el-button class="active" @click="queryData">搜索</el-button>
        </div>
        <div class="table_contet">
          <el-table
            :data="tableData"
            height="100%"
            class="have_scrolling"
            border
            ref="tableBox"
            style="width: 100%"
          >
            <el-table-column
              v-for="(value, index) in headerData"
              :key="index + value.name"
              :label="value.name"
              align="center"
            >
              <template slot-scope="{ row }">
                <svg-icon
                  v-if="dynamicData.includes(value.code)"
                  class="svg-class svg-btn"
                  :key="index + value.name"
                  :class="
                    row[value.code + '_status'] == '3'
                      ? 'submit'
                      : row[value.code + '_status'] === '2'
                      ? 'reject'
                      : row[value.code + '_status'] === '1'
                      ? 'finish'
                      : 'error'
                  "
                  icon-class="seeDetail"
                  @click="seeDetail(row, value)"
                />
                <span v-else>{{
                  row[value.code] === "null" ? "" : row[value.code]
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
              v-if="[2].includes(groupId)"
            >
              <template slot-scope="{ row }">
                <el-button
                  type="danger"
                  size="mini"
                  @click="showDeleteDialog(row)"
                  >删除工序</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-drawer
      title="我是标题"
      :visible.sync="drawerVisible"
      :with-header="false"
      custom-class="drawer-bottom-panel"
      size="50%"
      :wrapper-closable="false"
      direction="btt"
    >
      <el-container>
        <el-header>
          <div class="link-info">
            类型：
            <span>{{ rowdata.conponenttypename }}</span>
            编码：
            <span>{{ rowdata.conponentcode }}</span>
            工序名称：
            <span>{{ rowdata.precessName }}</span>
          </div>
          <i class="el-icon-close" @click="drawerVisible = false" />
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="processRecordData"
                style="width: 100%"
                border
                height="100%"
              >
                <el-table-column
                  prop="process"
                  label="流程"
                  align="center"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="执行人员"
                  align="center"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="time"
                  width="180"
                  align="center"
                  label="执行时间"
                >
                </el-table-column>
                <el-table-column align="center" label="举牌照片">
                  <template slot-scope="{ row }">
                    <div class="image-box">
                      <div v-for="(item, index) in row.image" :key="index">
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div @click="downloadImage(item)">下载</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="附件">
                  <template slot-scope="{ row }">
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="row.pdf"
                      @click="seePdf(row)"
                      >预览附件</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <!-- <el-col :span="12" class="accept">
              <div>
                <ul>
                  <li>验收记录</li>
                  <li>关键数据</li>
                </ul>
                <div class="record-box">
                  <div class="img">
                    <div
                      v-if="
                        (acceptData && acceptData.accrecodeurl.length === 0) ||
                        !acceptData
                      "
                      class="empty-text"
                    >
                      暂无数据
                    </div>
                    <div v-else class="img-box">
                      <div
                        v-for="(item, index) in acceptData.accrecodeurl"
                        :key="index"
                      >
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div>下载</div>
                      </div>
                    </div>
                  </div>
                  <div class="text">
                    <div
                      v-if="(acceptData && !acceptData.keydata) || !acceptData"
                      class="empty-text"
                    >
                      暂无数据
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ul>
                  <li>测试报告</li>
                  <li>旁站记录</li>
                </ul>
                <div class="record-box">
                  <div class="img">
                    <div
                      v-if="
                        (acceptData && acceptData.testurl.length === 0) ||
                        !acceptData
                      "
                      class="empty-text"
                    >
                      暂无数据
                    </div>
                    <div v-else class="img-box">
                      <div
                        v-for="(item, index) in acceptData.testurl"
                        :key="index"
                      >
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div>下载</div>
                      </div>
                    </div>
                  </div>
                  <div class="text" />
                </div>
              </div>
            </el-col> -->
          </el-row>
        </el-main>
        <div ref="viewer" v-viewer="{ movable: false }" style="display: none">
          <template v-for="src in showPic">
            <img v-if="src" :key="src" :src="src" />
          </template>
        </div>
      </el-container>
    </el-drawer>
    <el-dialog :visible.sync="dialogVisible" width="80%" class="top_dialog">
      <div v-if="false" slot="title"></div>
      <iframe
        v-if="dialogVisible"
        :src="recode.pdf"
        width="100%"
        height="600"
      ></iframe>
    </el-dialog>
    <el-dialog
      :title="
        '删除工序:' +
        '(' +
        deleteInfo.conponenttypename +
        ':' +
        deleteInfo.conponentcode +
        ')'
      "
      :visible.sync="processDialogVisible"
      custom-class="dialog-panel"
      :append-to-body="true"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-select
        v-model="deleteRecodeid"
        clearable
        placeholder="请选择要删除的工序记录"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :value="item.recodeid"
          :label="item.name"
          :disabled="!item.recodeid"
        />
      </el-select>
      <div style="text-align: right">
        <el-button plain size="mini" class="btn-bg" @click="deleteProcdess"
          >提交</el-button
        >
        <el-button
          plain
          size="mini"
          class="btn-bg"
          @click="processDialogVisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/quality";
import { getComponentType } from "@/api/data";
import {
  getProjectTypeData,
  getProgressTableData,
  deleteProduceInfo,
} from "@/api/progress";
import { formatDate } from "@/utils/date";
import { getWorkArea } from "@/api/workArea";
import { mapGetters } from "vuex";
import { validPicurl } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import { downLoadFile } from "@/utils/download";
export default {
  name: "",
  data() {
    return {
      dynamicData: ["one", "two", "three", "four", "five", "six", "seven"],
      groupId: null,
      all: true,
      drawerVisible: false,
      timeValue: "",
      typeKey: "",
      postData: {
        code: "",
        endtime: "",
        gongquid: "",
        list: [],
        sttime: "",
        type: "ZJ",
      },
      dialogVisible: false,
      recode: {}, //工序pdf记录
      recodeUrl: "",
      typeArr: [], //项目数据
      allProjectArr: [], //暂存的所有项目数据
      tableData: [],
      headerData: {},
      treeData: [],
      processData: [],
      area: [], //工区数据
      areaId: null, //选中的工区
      rowdata: {},
      processDialogVisible: false, //删除工序
      options: [],
      deleteRecodeid: "",
      deleteInfo: {},
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
      defaultProps: {
        children: "children",
        label: "name",
      },
      // drawer数据
      showPic: [],
      processRecordData: [],
      acceptData: null,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "getUrl"]),
  },
  created() {
    this.groupId = getToken("groupId");
    this.initData();
    this.recodeUrl = this.getUrl;
  },
  methods: {
    init() {
      api.getNewCheckViewTable(this.postData).then((res) => {
        if (res.data) {
          this.headerData = [];
          this.headerData = res.data.head;
          let lists = res.data.list;
          lists.forEach((item) => {
            if (item.one) {
              item.one_status = item.one.split("_")[1];
            }
            if (item.two) {
              item.two_status = item.two.split("_")[1];
            }
            if (item.three) {
              item.three_status = item.three.split("_")[1];
            }
            if (item.four) {
              item.four_status = item.four.split("_")[1];
            }
            if (item.five) {
              item.five_status = item.five.split("_")[1];
            }
            if (item.six) {
              item.six_status = item.six.split("_")[1];
            }
            if (item.seven) {
              item.seven_status = item.seven.split("_")[1];
            }
          });
          this.tableData = lists;
          this.rowdata = {};
          this.$nextTick(() => {
            //在数据加载完，重新渲染表格
            this.$refs["tableBox"].doLayout();
          });
        }
      });
    },
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
        this.treeData = tree;
      });
      this.init();
      getProjectTypeData().then((res) => {
        let obj = {
          projectname: "所有工程",
          projectid: "all",
        };
        let data = res.data || [];
        data.unshift(obj);
        this.typeArr = data;
        this.allProjectArr = data;
      });
      getWorkArea().then((res) => {
        let aobj = {
          name: "所有工区",
          id: 95270,
        };
        let areaD = res.data;
        areaD.unshift(aobj);
        this.area = areaD;
        this.areaId = 95270;
      });
    },
    changeArea(val) {
      this.typeKey = "";
      if (val === 95270) {
        this.typeArr = this.allProjectArr;
      } else {
        this.typeArr = this.allProjectArr.filter((e) => e.parentid === val);
      }
    },
    timeChange() {},
    nodeClick(node) {
      if (node.type !== "folder") {
        this.postData.type = node.type;
        this.init();
      }
      // else {
      //   this.postData.type = "";
      //   this.init();
      // }
    },
    seeDetail(row, value) {
      this.rowdata = Object.assign({}, row);
      this.rowdata.precessName = value.name;
      // this.processRecordData = [];
      // this.acceptData = null;
      // const val = value + ".0";
      // if (row[val]) {
      //   api.getProcessRecordsById(row[val]).then((res) => {
      //     const { check, fillin, produceandrecode, recode } = res.data;
      //     if (fillin) {
      //       fillin.picurl = validPicurl(fillin.picurl);
      //       fillin.name = "工序填报";
      //       fillin.user = produceandrecode.updateusername;
      //       this.processRecordData.push(fillin);
      //     }
      //     if (check) {
      //       check.picurl = validPicurl(check.picurl);
      //       check.name = "工序审核";
      //       check.user = produceandrecode.checkusername;
      //       this.processRecordData.push(check);
      //     }
      //     if (recode) {
      //       const obj = Object.assign({}, recode);
      //       obj.accrecodeurl = validPicurl(obj.accrecodeurl);
      //       obj.testurl = validPicurl(obj.testurl);
      //       this.acceptData = obj;
      //     }
      //     this.drawerVisible = true;
      //   });
      // } else {
      //   this.$message({
      //     message: "暂未上传数据",
      //     type: "warning",
      //     customClass: "message_override",
      //   });
      // }
      let status = row[value.code];
      if (status) {
        let id = status.split("_")[0];
        api.getCurrentPdf(id).then((res) => {
          // let data = res.data;
          // let { recode } = data;
          // let obj = Object.assign(data, recode);
          // obj.pdf = this.recodeUrl + obj.remark;
          // this.recode = obj;
          // this.dialogVisible = true;

          this.processRecordData = [];

          let data = res.data;
          let { recode, produceandrecode } = data;
          let { accrecodeurl, remark, testurl, standbyrecode } = recode;
          let {
            updateusername,
            checkusername,
            stime,
            updatetime,
            checkresult,
          } = produceandrecode;
          let uploadUrl = validPicurl(accrecodeurl);
          let uploadPdf = remark ? this.recodeUrl + remark : "";
          let checkUrl = validPicurl(testurl);
          let checkPdf = standbyrecode ? this.recodeUrl + standbyrecode : "";
          let arr = [
            {
              process: "工序填报",
              name: updateusername,
              image: uploadUrl,
              pdf: uploadPdf,
              time: formatDate(stime),
            },
            {
              process: "工序审核",
              name: checkresult === 1 ? checkusername : "",
              image: checkresult === 1 ? checkUrl : "",
              pdf: checkresult === 1 ? checkPdf : "",
              time: checkresult === 1 ? formatDate(updatetime) : "",
            },
          ];
          this.processRecordData = arr;
          this.drawerVisible = true;
        });
      } else {
        this.$message({
          message: "暂未上传数据",
          type: "warning",
          customClass: "message_override",
        });
      }
    },
    seePicDetail(row) {
      this.showPic = [];
      this.showPic.push(row);
      this.$refs.viewer.$viewer.show();
    },
    seePdf(row) {
      this.recode = row;
      this.dialogVisible = true;
    },
    downloadImage(item) {
      let str = item.split("=")[1];
      downLoadFile(str);
    },
    changeView(val) {},
    queryData() {
      let { timeValue, postData, typeKey } = this;
      if (timeValue) {
        postData.sttime = timeValue[0];
        postData.endtime = timeValue[1];
      } else {
        postData.sttime = "";
        postData.endtime = "";
      }
      postData.list = [];
      if (typeKey && typeKey !== "all") {
        postData.list.push(typeKey);
      }
      if (this.areaId === 95270) {
        postData.gongquid = "";
      } else {
        postData.gongquid = this.areaId;
      }
      this.init();
    },
    cloumnWidth(value) {
      const arr = [0.2, 0.5, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0];
      if (arr.includes(value)) {
        return 200;
      } else if (value === 0.1) {
        return 80;
      } else {
        return 180;
      }
    },
    //删除工序
    showDeleteDialog(row) {
      this.$confirm("是否删除?", "删除工序", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "ceshi",
        type: "warning",
      }).then(() => {
        this.deleteInfo = row;
        this.deleteRecodeid = "";
        let options = this.headerData.filter((item) => {
          if (this.dynamicData.includes(item.code)) {
            return item;
          }
        });
        let { one, two, three } = row;
        let info = { one, two, three };
        options.forEach((e) => {
          e.recodeid = info[e.code];
          e.conponentid = row.conponentid;
        });
        this.options = options;
        if (options.length > 0) {
          this.processDialogVisible = true;
        } else {
          this.$message({
            message: "没有可删除的工序记录",
            type: "info",
            customClass: "message_override",
          });
        }
      });
    },
    deleteProcdess() {
      if (this.deleteRecodeid) {
        let obj = this.options.find((e) => e.recodeid == this.deleteRecodeid);
        let index = this.options.findIndex((e) => e.recodeid === obj.recodeid);
        let leng = this.options.length;
        let lastindex = index + 1;
        let recodeid = parseInt(obj.recodeid.split("_")[0]);
        let conponentid = obj.conponentid;
        if (lastindex === leng) {
          this.rundelete({ conponentid, recodeid });
        } else {
          let info = this.options[lastindex];
          if (info.recodeid) {
            this.$message({
              message: "请先删除下一个工序记录",
              type: "warning",
              customClass: "message_override",
            });
          } else {
            //执行删除
            this.rundelete({ conponentid, recodeid });
          }
        }
      } else {
        this.$message({
          message: "请选择要删除的工序记录",
          type: "warning",
          customClass: "message_override",
        });
      }
    },
    rundelete(obj) {
      deleteProduceInfo(obj).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
          customClass: "message_override",
        });
        this.processDialogVisible = false;
        this.init();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: 2px 5px 10px 5px;

  .content {
    height: 100%;
    display: flex;
    .tree_wrapper_box{
      width: 300px;
    }
    .table-content {
      background-color: #FFFFFF;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: calc(100% - 305px);
      margin-left: 5px;
      overflow: auto;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #4B5973;
      .header {
        display: flex;
        align-items: center;
        height: 50px;


        ::v-deep .el-select {
          width: 240px;
          height: 28px;
          line-height: 28px;
          margin: 0 10px;
          background-color: rgba(128, 142, 169, .14);
          .el-input__inner {
            background-color: transparent;
            border: none;
            height: 28px;
            line-height: 28px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #2D405E;
          }
          .el-input__suffix {
            .el-input__icon {
              line-height: 28px;
            }
          }
        }

        ::v-deep .el-date-editor {
          height: 28px;
          line-height: 28px;
          margin-right: 10px;
          text-align: center;
          font-family: PingFang SC;
          font-weight: 500;
          color: #2D405E;
          .el-range-separator {
            color: #2D405E;
            line-height: 28px;
            height: 28px;
          }
          .el-range-input {
            color: #2D405E;
          }
          .el-range__icon {
            height: 28px;
            line-height: 28px;
          }
        }
        ::v-deep .el-input__inner {
          //background-image: url(../../assets/image/日期选择.png);
          background-color: rgba(128, 142, 169, .14);
          border: none;
          height: 28px;
          input {
            background-color: transparent;
          }
        }
        .el-input {
          width: 150px;
          margin-right: 5px;
        }

        .el-button {
          width: 64px;
          height: 28px;
          background: #4f71ff;
          border-radius: 2px;
          border: none;
          color: #fff;
          padding: 5px;
        }
      }
      .table_contet {
        height: calc(100% - 50px);
      }
      // ::v-deep .el-table {
      //   background-color: transparent;
      //   border: none;
      //   .el-table__body-wrapper {
      //     overflow: auto;
      //     &::-webkit-scrollbar {
      //       width: 10px !important;
      //       height: 10px !important;
      //       background-color: #fff;
      //     }
      //     &::-webkit-scrollbar-thumb {
      //       width: 10px;
      //       border-radius: 5px;
      //       background-color: #eeeeee !important;
      //     }
      //   }
      //   &::before {
      //     background-color: transparent;
      //   }
      //   &::after {
      //     background-color: transparent;
      //   }
      // }
      .svg-icon {
        // color: brown;
        color: #8f9c07;
      }
      .submit {
        color: #4f71ff !important;
      }
      .finish {
        color: #0dfa72 !important;
      }
    }
  }
}

::v-deep .tree-box {
  height: 100%;
  background-color: #FFFFFF;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #4B5973;

  .el-tree-node {
    .el-tree-node__content {
      //background-color: #060c26;

      &:hover {
        //border: 1px solid #1e374b;
        //background-color: #1e374b;
      }
    }
  }

  .is-current {
    //当前选中的节点
    > .el-tree-node__content {
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #4B5973;
    padding-right: 8px;
    overflow: auto;
    .svg-class {
      margin-right: 5px;
    }

    .tree_btn {
      font-size: 12px;
      color: #3995fb;

      + .el-button {
        margin-left: 10px;
      }
    }
  }
}
.top_dialog {
  z-index: 10000000007 !important;
}
</style>
