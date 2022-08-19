<template>
  <el-container class="container-box">
    <el-header>
      <span>工区：</span>
      <el-select v-model="queryData.workAreaId" @change="changeArea">
        <el-option
          v-for="item in area"
          :key="item.sort"
          :value="item.sort"
          :label="item.name"
        ></el-option>
      </el-select>
      <span>单位工程：</span>
      <el-select v-model="queryData.unitProjectCode">
        <el-option
          v-for="item in typeArr"
          :key="item.projectid"
          :value="item.projectid"
          :label="item.projectname"
        ></el-option>
      </el-select>
      <span>审核时间：</span>
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
      />
      <el-button type="primary" style="margin-left: 10px" @click="initData">搜索</el-button>

      <div class="right-btns">

      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData.slice((pageNum-1)*pageSize,pageNum*pageSize)"
                  style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column
            label="工区"
            show-overflow-tooltip
            prop="workAreaName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="单位工程"
            show-overflow-tooltip
            prop="unitName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="构件编码"
            show-overflow-tooltip
            prop="conponentcode"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="构件名称"
            show-overflow-tooltip
            prop="conponentname"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="工序名称"
            show-overflow-tooltip
            prop="producename"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="填报人"
            show-overflow-tooltip
            prop="updateusername"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="填报时间"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.stime | format }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="审核人"
            show-overflow-tooltip
            prop="checkusername"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="审核时间"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.updatetime | format }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" class="primary_mini" @click="seeDetail(row)">详情</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pageNum" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length">
        </el-pagination>
      </div>
    </el-main>

    <el-drawer
      title="我是标题"
      :visible.sync="DrawerVisible"
      :with-header="false"
      custom-class="drawer-bottom-panel"
      append-to-body
      size="50%"
      :wrapperClosable="false"
      direction="btt"
    >
      <el-container>
        <el-header>
          <div class="link-info">
            类型：
            <span>{{ componentInfo.conponentname }}</span>
            编码：
            <span>{{ componentInfo.conponentcode }}</span>
            工序名称：
            <span>{{ componentInfo.producename }}</span>
          </div>
          <i class="el-icon-close" @click="DrawerVisible = false"></i>
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
                        <img :src="item" alt="" @click="seePicDetail(item)"/>
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
                    >预览附件
                    </el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-main>
        <div ref="viewer" v-viewer="{ movable: false }" style="display: none">
          <template v-for="src in showPic">
            <img v-if="src" :src="src" :key="src"/>
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

  </el-container>

</template>

<script>

  import {mapGetters} from "vuex";
  import {getAreaBySectionId} from "@/api/newProject";
  import {getProjectTypeData, getCopyInfos} from "@/api/progress";
  import {formatDate} from "@/utils/date";
  import * as api from "@/api/quality";
  import {validPicurl} from "@/utils/validate";
  import {downLoadFile} from "@/utils/download";


  export default {
    props: [],
    watch: {},
    data() {
      return {
        tableData: [],
        area: [],
        typeArr: [],
        timeValue: null,
        allProjectArr: [],
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        pageNum: 1,
        pageSize: 20,
        queryData: {
          workAreaId: "",
          unitProjectCode: "",
          projectId: "",
          startTime: "",
          endTime: ""
        },
        componentInfo: {},
        processRecordData: [],
        DrawerVisible: false,
        dialogVisible: false,
        showPic: [],
        recode: {},
        recodeUrl: ""
      };
    },
    computed: {
      ...mapGetters(["userInfo", "getUrl", "project"])
    },
    created() {
      this.recodeUrl = this.getUrl;
      this.initData();
      this.initArea();
    },
    mounted() {
    },
    methods: {
      initData() {
        let {timeValue, queryData} = this;
        let obj = Object.assign({}, queryData);
        obj.projectId = this.project.id;
        if (timeValue) {
          obj.startTime = timeValue[0];
          obj.endTime = timeValue[1];
        } else {
          obj.startTime = "";
          obj.endTime = "";
        }
        obj.workAreaId = obj.workAreaId === 95270 ? "" : obj.workAreaId;
        getCopyInfos(obj).then(res => {
          this.tableData = res.data;
        });
      },
      initArea() {
        getProjectTypeData(this.project.id).then((res) => {
          let obj = {
            projectname: "所有工程",
            projectid: "all"
          };
          let data = res.data || [];
          data.unshift(obj);
          this.typeArr = data;
          this.allProjectArr = data;
        });
        getAreaBySectionId(this.project.id).then((res) => {
          let aobj = {
            name: "所有工区",
            sort: 95270
          };
          let areaD = res.data;
          areaD.unshift(aobj);
          this.area = areaD || [];
          this.queryData.areaId = 95270;

        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.pageNum = val;
      },
      changeArea(val) {
        this.queryData.unitProjectCode = "";
        if (val === 95270) {
          this.typeArr = this.allProjectArr;
        } else {
          this.typeArr = this.allProjectArr.filter((e) => e.parentid === val);
        }
      },
      seeDetail(row) {
        this.componentInfo = row;
        this.processRecordData = [];
        api.getCurrentPdf(row.recodeid).then((res) => {
          let data = res.data;
          let {recode, produceandrecode} = data;
          let {accrecodeurl, remark, testurl, standbyrecode} = recode;
          let {updateusername, checkusername, stime, updatetime, checkresult} =
            produceandrecode;
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
              time: formatDate(stime)
            },
            {
              process: "工序审核",
              name: checkusername,
              image: checkresult === 1 ? checkUrl : "",
              pdf: checkresult === 1 ? checkPdf : "",
              time: checkresult === 1 ? formatDate(updatetime) : ""
            }
          ];
          this.processRecordData = arr;
          this.DrawerVisible = true;
        });
      },
      seePicDetail(row) {
        this.showPic = [];
        this.showPic.push(row);
        this.$refs.viewer.$viewer.show();
      },
      downloadImage(item) {
        let str = item.split("=")[1];
        downLoadFile(str);
      },
      seePdf(row) {
        this.recode = row;
        this.dialogVisible = true;
      }
    },
    components: {},
    beforeDestroy() {
    },
    filters: {
      format(val) {
        if (val) {
          return formatDate(val);
        } else {
          return "";
        }
      }
    }

  };
</script>

<style lang='scss' scoped>
  @import "../../assets/css/table.scss";
  @import "../../assets/css/dialog.scss";

  .container-box {
    .el-header {
      display: flex;
      align-items: center;

      span {
        margin-left: 5px;
      }

      .el-select {
        width: 200px;
      }


    }
  }

</style>
