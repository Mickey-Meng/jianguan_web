<template>
  <el-container>
    <el-header>
      <div>
        <el-date-picker
          v-model="timeValue"
          type="date"
          value-format="yyyy-MM-dd"
          :clearable="false"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" style="margin-left: 10px" @click="init">查询</el-button>
        <el-button type="primary" @click="exportExcel">导出</el-button>
      </div>

    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        class="have_scrolling"
        ref="multipleTableUser"
      >
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="time" label="上线时间" align="center">
        </el-table-column>
        <!--        <el-table-column label="操作" align="center">-->

        <!--        </el-table-column>-->
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
  import {getDayOnLineData} from "@/api/user";
  import {getCurrentDate, formatDate} from "@/utils/date";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        tableData: [],
        userAll: [11, 14],
        timeValue: null
      };
    },
    created() {
      this.timeValue = getCurrentDate();
      this.init();
    },
    mounted() {
    },
    methods: {
      init() {
        getDayOnLineData(this.timeValue).then(res => {
          if (res && res.data.length > 0) {
            this.tableData = res.data.filter(e => {
              e.time = formatDate(e.updateTime);
              return !this.userAll.includes(e.userId);
            });
          } else {
            this.tableData = [];
          }
        });
      },
      exportExcel() {
        if (!this.timeValue) {
          this.$message({
            message: "请选择导出时间",
            type: "info",
            customClass: "message_override"
          });
          return false;
        }
        let link = document.createElement("a"); // 创建a标签
        link.style.display = "none"; //ZhuJiRoad/mong/preview?fileid=
        link.href = "/ZhuJiRoad/user/exportOnlineCount?date" + this.timeValue; // 设置下载地址
        link.setAttribute("download", ""); // 添加downLoad属性
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>

</style>
