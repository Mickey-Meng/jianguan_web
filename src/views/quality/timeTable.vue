<template>
  <div class="wrapper">
    <div class="header">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="btn-box">
        <el-button type="primary" size="mini" @click="getPre">上一月</el-button>
        <el-button type="primary" size="mini" @click="getNex">下一月</el-button>
        <el-date-picker
          v-model="month"
          type="month"
          :clearable="false"
          value-format="yyyy-MM"
          placeholder="选择月"
        >
        </el-date-picker>

      </div>

    </div>
    <div class="main">
      <el-table
        :data="tableData"
        height="100%"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="gongqu"
          label="工区"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          width="30px"
          align="center"
          v-for="(item,index) in currentMonth" :key="index" :label="item.week"
        >
          <el-table-column
            :label="item.date"
            width="30px"
            align="center"
          >
            <template slot-scope="{row}">
              <div :class="{'have-thing':row[item.date]}" class="no-thing" @click="geiDetailInfo(row,item.date)"></div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <ul class="footer">
      <li></li>
      <li>无记录</li>
      <li></li>
      <li>有记录</li>
    </ul>
  </div>

</template>

<script>
  import { getLastMonth, getNextMonth } from '@/utils/date'
  export default {
    name: '',
    data() {
      return {
        tableData: [],
        currentMonth: [],
        dayLength: null,
        options: [],
        value: '',
        month: ''
      }
    },
    created() {
      let now = new Date()
      this.getCurrentDate(now)
    },
    methods: {
      getCurrentDate(date) {
        let arr = []
        this.dayLength = this.getDayNum(date)
        for (let i = 1; i <= this.dayLength; i++) {
          let nowDate = date.setDate(i)
          const { year, month, day } = this.formatDate(nowDate)
          this.month = year + '-' + month
          let everyDay = year + '-' + month + '-' + day
          let week = this.getWeek(everyDay)
          arr.push({ date: day, week: week })
        }
        this.currentMonth = arr
        // this.initData(this.month)
      },
      getDayNum(date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let d = new Date(year, month, 0)
        return d.getDate()
      },
      getWeek(date) {
        let dt2 = new Date(date)
        var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        if (weekDay.indexOf(weekDay[dt2.getDay()]) > -1) {
          return weekDay[dt2.getDay()]
        }
        return ''
      },
      formatDate(date) {
        date = new Date(date)
        let myyear = date.getFullYear()
        let mymonth = date.getMonth() + 1
        let myweekday = date.getDate()
        mymonth < 10 ? mymonth = '0' + mymonth : mymonth
        myweekday < 10 ? myweekday = '0' + myweekday : myweekday
        return {
          year: myyear,
          month: mymonth,
          day: myweekday + ''
        }
      },
      initData(time){
      },
      getPre() {
        let time = getLastMonth(this.month)
        this.month = time
        let date = new Date(time)
        this.getCurrentDate(date)

      },
      getNex() {
        let time = getNextMonth(this.month)
        this.month = time
        let date = new Date(time)
        this.getCurrentDate(date)
      },
      geiDetailInfo(row,key){
        // if (row[key]){
        //   getDayData(row[key].uploadTime).then(res => {
        //     this.$emit('getSafeData',res.data,row[key].uploadTime)
        //   })
        // }else {
        //   this.$message('未发生安全事件');
        // }
      }

    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    height: 100%;

    .header {
      padding: 0 10px;
      height: 50px;
      justify-content: space-between;
      align-items: center;
      display: flex;

      ::v-deep .el-select {
        width: 145px;
        text-indent: 0;
        //height: 35px !important;
        .el-input {
          .el-input__inner {
            height: 30px !important;
            line-height: 30px;
            //background-color: #387AFD !important;
            //color: #fff;
            //border: 1px solid #387AFD;
          }

          .el-input__suffix {
            .el-input__icon {
              line-height: 30px;
            }
          }
        }
      }

      .el-date-editor {
        margin-left: 10px;
      }
    }

    .footer {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      li {
        margin: 0 5px;
      }

      li:nth-of-type(1) {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: #54F6F6;
      }

      li:nth-of-type(3) {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid red;
      }
    }

    .main {
      height: calc(100% - 100px);
      ::v-deep  .el-table{
        .cell{
          padding: 0;
          .no-thing{
            margin: 0 auto;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #54F6F6;
            cursor: pointer;
          }
          .have-thing{
            margin: 0 auto;
            cursor: pointer;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #FFFFFF;
            border: 2px solid red;

          }

        }
      }
    }
  }
  ::v-deep.el-table {
    font-size: 12px;

    th {
      padding: 0;

      > .cell {
        padding: 0;
      }
    }
  }

</style>
