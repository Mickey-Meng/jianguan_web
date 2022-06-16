<template>
  <el-container class="container-box">
    <el-header>
      <div class="title">质量记录</div>
      <el-select v-model="typeKey" @change="changeValue"  style="width: 300px">
        <el-option
          v-for="item in typeArr"
          :key="item.projectid"
          :value="item.groupid"
          :label="item.projectname"
        ></el-option>
      </el-select>
    </el-header>
    <el-main>
      <!-- <div class="filter"></div> -->
      <div class="container">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          height="100%"
          class="have_scrolling"
        >
          <el-table-column type="index" width="50" align="center" label="序号">
          </el-table-column>
          <el-table-column
            prop="gq"
            align="center"
            label="工区"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="pro"
            align="center"
            label="项目名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="qualityfirstname"
            align="center"
            label="质量大项"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="qualitysecondname"
            align="center"
            label="质量小项"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="uploadname"
            align="center"
            label="检查人员"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="uploadtime"
            align="center"
            label="检查日期"
            sortable
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            prop="uploadremark"
            align="center"
            label="质量描述"
            show-overflow-tooltip
          >
          </el-table-column> -->
          <!-- <el-table-column align="center" label="检查照片">
            <template slot-scope="{ row }">
              <svg-icon
                v-if="row.uploadurl.length > 0"
                icon-class="photoimg"
                class="msg_icon"
                @click="seeImage(row.uploadurl)"
              />
              <span v-else>无照片</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="modifyname"
            align="center"
            label="整改人员"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="modifydate"
            align="center"
            label="整改期限(天)"
          >
          </el-table-column>
          <!--
          <el-table-column
            prop="delayday"
            align="center"
            label="延期申请"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="delayreason"
            align="center"
            label="延期原因"
            show-overflow-tooltip
          >
          </el-table-column> -->
          <el-table-column
            prop="modifytime"
            align="center"
            label="整改日期"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            prop="modifyremark"
            align="center"
            label="整改描述"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="dodelayreason"
            align="center"
            label="驳回意见"
            show-overflow-tooltip
          >
          </el-table-column> -->
          <el-table-column
            align="center"
            label="事件状态"
            show-overflow-tooltip
            :filters="[
              { text: '待审核', value: '1' },
              { text: '待整改', value: '2' },
              { text: '确认整改', value: '3' },
            ]"
            :filter-method="filterTag"
          >
            <template slot-scope="{ row }">
              <span>{{ row.status | getStatus }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="整改照片">
            <template slot-scope="{ row }">
              <svg-icon
                v-if="row.modifyurl.length > 0"
                icon-class="photoimg"
                class="msg_icon"
                @click="seeImage(row.modifyurl)"
              />
              <span v-else>无照片</span>
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                class="primary_mini"
                @click="seeDetail(row, $index)"
                >详情</el-button
              >
              <el-button
                v-if="[2].includes(groupId)"
                type="danger"
                size="mini"
                @click="deleteInfo(row, $index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <!-- <el-footer> </el-footer> -->
    <div ref="viewer" v-viewer="{ movable: false }" style="display: none">
      <template v-for="src in photoLists">
        <img v-if="src" :src="src" :key="src" />
      </template>
    </div>
    <eventDetail
      :drawer="drawer"
      @closeDrawer="drawer = false"
      :detalRow="detalRow"
    >
      <div class="detail_div">
        <label>基本信息</label>
        <ul class="base_info">
          <li>
            <div class="title">工区:</div>
            <div class="content">{{ detalRow.gq }}</div>
          </li>
          <li>
            <div class="title">项目:</div>
            <div class="content">{{ detalRow.pro }}</div>
          </li>
        </ul>
        <label>问题内容</label>
        <ul class="event_content normal_ul">
          <li>
            <div class="title">问题类别:</div>
            <div class="content">
              {{ detalRow.qualityfirstname }} ->
              {{ detalRow.qualitysecondname }}
            </div>
          </li>
          <li>
            <div class="title">问题描述:</div>
            <div class="content">{{ detalRow.uploadremark }}</div>
          </li>
          <li>
            <div class="title">检查时间:</div>
            <div class="content">{{ detalRow.uploadtime }}</div>
          </li>
          <li>
            <div class="title">延期申请:</div>
            <div class="content">
              {{ detalRow.delayday ? detalRow.delayday + "天" : "" }}
            </div>
          </li>
          <li>
            <div class="title">延期原因:</div>
            <div class="content">
              {{ detalRow.delayreason }}
            </div>
          </li>
          <li>
            <div class="title">整改期限:</div>
            <div class="content">
              {{ detalRow.finalTime }}
            </div>
          </li>
          <li class="event_photo">
            <div class="title">问题照片:</div>
            <el-button type="primary" size="mini" @click="downLoadAll(1)"
              >下载全部</el-button
            >
          </li>
        </ul>
        <div class="event_photo_box">
          <div v-for="(item, index) in detalRow.uploadurl" :key="index">
            <img :src="item" alt="" />
            <svg-icon
              icon-class="blowup"
              class="blowup"
              @click="preview(item)"
            ></svg-icon>
            <svg-icon
              icon-class="download"
              class="download"
              @click="downLoadImage(item)"
            ></svg-icon>
          </div>
        </div>
        <label>问题处理</label>
        <ul class="result_of_handling normal_ul">
          <li>
            <div class="title">整改描述:</div>
            <div class="content">{{ detalRow.modifyremark }}</div>
          </li>
          <li>
            <div class="title">整改时间:</div>
            <div class="content">{{ detalRow.modifytime }}</div>
          </li>
          <li class="event_photo">
            <div class="title">整改照片:</div>
            <el-button type="primary" size="mini" @click="downLoadAll(2)"
              >下载全部</el-button
            >
          </li>
        </ul>
        <div class="event_photo_box">
          <div v-for="(item, index) in detalRow.modifyurl" :key="index">
            <img :src="item" alt="" />
            <svg-icon
              icon-class="blowup"
              class="blowup"
              @click="preview(item)"
            ></svg-icon>
            <svg-icon
              icon-class="download"
              class="download"
              @click="downLoadImage(item)"
            ></svg-icon>
          </div>
        </div>
      </div>
    </eventDetail>
  </el-container>
</template>

<script>
  import {validPicurl} from "@/utils/validate";
  import * as api from "@/api/quality";
  import {getProjectTypeData} from "@/api/progress";
  import {getWorkArea} from "@/api/workArea";
  import {getToken} from "@/utils/auth";
  import eventDetail from "@/components/detail/eventDetail";
  import {downLoadFile} from "@/utils/download";
  import {addAnyDays} from "@/utils/date";
  import {getAreaBySectionId} from "@/api/newProject";
  import {mapGetters} from "vuex";

  export default {
    name: "",
    data() {
      return {
        tableData: [],
        typeKey: "",
        typeArr: [],
        area: [],
        areaId: null,
        groupId: null,
        photoLists: [],
        drawer: false,
        detalRow: {}
      };
    },
    computed: {
      ...mapGetters(["project"])
    },
    created() {
      this.groupId = getToken("groupId");
      this.initData();
    },
    components: {eventDetail},
    methods: {
      initData() {
        getProjectTypeData(this.project.id).then((res) => {
          let obj = {
            projectname: "所有工程",
          groupid: "all",
        };
        let data = res.data || [];
        data.unshift(obj);
        this.typeArr = data;
        this.typeKey = "all";
          getAreaBySectionId(this.project.id).then((res1) => {
            let aobj = {
              name: "所有工区",
              id: 9527
            };
            let areaD = res1.data;
            areaD.unshift(aobj);
            this.area = areaD;
            api.getAllQualityEvents(this.project.id).then((res3) => {
              if (res3.data) {
                let data = res3.data;
              data.forEach((item) => {
                let gq = this.area.find((e) => e.sort === item.gongquid);
                let pro = this.typeArr.find(
                  (e) => e.groupid === item.singleProjectId
                );
                item.modifyurl = validPicurl(item.modifyurl);
                item.uploadurl = validPicurl(item.uploadurl);
                item.gq = gq?.name;
                item.pro = pro?.projectname;
              });
              this.tableData = data;
            }
          });
        });
      });
    },
    seeImage(lists) {
      if (lists.length > 0) {
        this.photoLists = lists;
        this.$refs.viewer.$viewer.show();
      } else {
        this.$message({
          type: "info",
          message: "没有照片",
        });
      }
    },
    changeValue(value) {
      if (value === "all") {
        api.getAllQualityEvents(this.project.id).then((res) => {
          if (res.data) {
            let data = res.data;
            data.forEach((item) => {
              let gq = this.area.find((e) => e.sort === item.gongquid);
              let pro = this.typeArr.find((e) => e.groupid === item.singleProjectId);
              item.modifyurl = validPicurl(item.modifyurl);
              item.uploadurl = validPicurl(item.uploadurl);
              item.gq = gq?.name;
              item.pro = pro?.projectname;
            });
            this.tableData = data;
          }
        });
      } else {
        api.getAllQualityEvents(this.project.id, value).then((res) => {
          if (res.data) {
            let data = res.data;
            data.forEach((item) => {
              let gq = this.area.find((e) => e.sort === item.gongquid);
              let pro = this.typeArr.find((e) => e.groupid === item.singleProjectId);
              item.modifyurl = validPicurl(item.modifyurl);
              item.uploadurl = validPicurl(item.uploadurl);
              item.gq = gq?.name;
              item.pro = pro?.projectname;
            });
            this.tableData = data;
          }
        });
      }
    },
    deleteInfo(row, index) {
      this.$confirm("删除信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.deleteQualityEvent({ gids: `${row.id}` }).then((res) => {
            let i = this.tableData.findIndex((e) => e.id === row.id);
            this.tableData.splice(i, 1);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    seeDetail(row) {
      this.detalRow = Object.assign({}, row);
      if (row.delayday) {
        this.detalRow.finalTime = addAnyDays(row.delayday, row.uploadtime);
      } else {
        this.detalRow.finalTime = addAnyDays(row.modifydate, row.uploadtime);
      }
      this.drawer = true;
    },
    preview(item) {
      this.photoLists = [item];
      this.$refs.viewer.$viewer.show();
    },
    downLoadImage(item) {
      let str = item.split("=")[1];
      downLoadFile(str);
    },
    downLoadAll(n) {
      if (n === 1) {
        if (this.detalRow.uploadurl.length > 0) {
          this.detalRow.uploadurl.forEach((item) => {
            let str = item.split("=")[1];
            downLoadFile(str);
          });
        }
      } else {
        if (this.detalRow.modifyurl.length > 0) {
          this.detalRow.modifyurl.forEach((item) => {
            let str = item.split("=")[1];
            downLoadFile(str);
          });
        }
      }
    },
    filterTag(value, row) {
      if (value == "1") {
        return row.status == 2
      } else if (value == "2") {
        return row.status == 1 ||  row.status == 0
      } else if (value == "3") {
        return row.status == value;
      }
    },
  },
  filters: {
    getStatus(val) {
      let str = "提交事件";
      switch (val) {
        case 0:
          str = "提交事件";
          break;
        case 1:
          str = "申请延期";
          break;
        case 2:
          str = "提交整改";
          break;
        case 3:
          str = "确认整改";
          break;
      }
      return str;
    },
  },
};
</script>

<style scoped lang="scss">
.container-box {
  background-color: #ebecee;
  padding: 0 5px 20px 5px;
  .el-header {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    .title {
      width: 106px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      background-color: #1E6EEB;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 20px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
  .el-main {
    padding: 0;
    margin-top: 10px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    .filter {
      height: 40px;
    }
    .container {
      flex: 1;
    }
  }
}
</style>
