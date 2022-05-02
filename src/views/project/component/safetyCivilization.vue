<template>
  <div class="wrapper">
    <div class="safe-left">
      <div class="global-title">
        <div class="title">
          <div class="titleitem"></div>
          <span>安全文明</span>
        </div>
        <el-select
          v-model="companyKey"
        >
          <el-option v-for="item in company" :key="item.key" :value="item.key" :label="item.name" />
        </el-select>
      </div>
      <div class="type-btn">
        <el-button size="mini" :class="{'active':type === 1}" @click="btnClick(1)">周巡检率</el-button>
        <el-button size="mini" :class="{'active':type === 2}" @click="btnClick(2)">月巡检率</el-button>
      </div>
      <div class="left-content">
        <div v-show="type === 1 && companyKey === 2">
          <barChart :resumption="resumption" />
        </div>
        <div v-show="type === 2 && companyKey === 2">
          <pieChart :resumption="resumption" />
        </div>
        <div v-if="companyKey === 1" style="text-align: center;margin-top: 50px">暂无数据</div>
      </div>
    </div>
    <div class="safe-right">
      <div class="global-title">
        <div class="title">
          <div class="titleitem"></div>
          <span>事件统计</span>
        </div>
        <div>
          <el-button size="mini" :class="{'active':typeNum === 1}" @click="btnTypeClick(1)">类型统计</el-button>
          <el-button size="mini" :class="{'active':typeNum === 2}" @click="btnTypeClick(2)">数量统计</el-button>
        </div>
      </div>
      <div class="right-content">
        <div v-if="typeNum === 1">
          <v-chart autoresize :options="option" class="charts" />
        </div>
        <ul v-if="typeNum === 2">
          <li><span>已整改数量：</span><span style="color: #05e600">{{ numberData.finish }}</span></li>
          <li><span>待整改数量：</span><span style="color: #e60d00">{{ numberData.awaitData }}</span></li>
          <li><span>延期记录：</span><span style="color: #e2c608">{{ numberData.postpone }}</span></li>
          <!--            <li><span>平均整改天数：</span><span style="color: #267fed">{{numberData.average}}</span></li>-->
        </ul>

      </div>
    </div>
  </div>

</template>

<script>
import barChart from '@/views/project/component/barChart'
import pieChart from '@/views/project/component/pieChart'
import { getByFirstType, getPerSafeData } from '@/api/safe'
import { getCurrentDate } from '@/utils/date'

export default {
  name: '',
  components: { barChart, pieChart },
  data() {
    return {
      companyKey: 2,
      type: 1,
      typeNum: 1,
      company: [
        {
          name: '施工单位',
          key: 1
        },
        {
          name: '监理单位',
          key: 2
        }
      ],
      resumption: {},
      numberData: {
        finish: null,
        awaitData: null,
        postpone: null,
        average: null
      },
      option: {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '事件类型',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

    }
  },
  mounted() {
    this.initData()
    this.initChartData()
  },
  methods: {
    btnClick(num) {
      if (this.type != num) {
        this.type = num
      }
    },
    btnTypeClick(num) {
      if (this.typeNum != num) {
        this.typeNum = num
      }
    },
    initData() {
      getByFirstType().then(res => {
        const arr = []
        let check = null
        let nodo = null
        let nodelay = null
        let nocheck = null
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            check += item.check
            nocheck += item.nocheck
            nodelay += item.nodelay
            nodo += item.nodo
            arr.push({ name: item.name, value: item.count })
          })
        }
        this.numberData = {
          finish: check,
          awaitData: nodo,
          postpone: nodelay,
          average: null
        }
        this.option.series[0].data = arr
      })
    },
    initChartData() {
      const time = getCurrentDate()
      this.timePremium = time
      getPerSafeData(time).then(res => {
        this.resumption = res.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    height: 100%;
    display: flex;
    background-image: url(../../../assets/image/边框-小.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-left: 16px;
    margin-right: 16px;
    padding: 16px;
    .safe-left{
      width: 55%;
      // border-right: 1px solid #1E374B;
      padding-right: 5px;
      .global-title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title{
          display: flex;
          justify-content: flex-start;
        }
        ::v-deep .el-select {
          width: 158px;
          text-indent: 0;
          //height: 35px !important;
          .el-input {
            .el-input__inner {
              height: 30px !important;
              line-height: 30px;
              // background-color: #060C26 !important;
            background-image: url(../../../assets/image/日期选择.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
              color: #fff;
              border: 1px solid #387AFD;
            }
             input{
                background:transparent;
              }
            .el-input__suffix{
              .el-input__icon{
                line-height: 30px;
              }
            }
          }
        }
      }
      .type-btn{
        text-align: right;
        padding: 15px 0;

      }
      .left-content{
        height: calc(100% - 70px);
        div{
          height: 100%;
          width: 100%;
          .charts{
            height: 100%;
            width: 100%;
          }
        }
      }
    }
    .safe-right{
      width: 45%;
      .global-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title{
          display: flex;
          justify-content: flex-start;
          .titleitem{
            width: 2px;
            height: 15px;
            background: #4F71FF;
            margin-left: 16px;
            margin-right: 16px;
          }
        }
        div{
          text-indent: 0;
        }
      }
      .right-content{
        height: calc(100% - 30px);
        >div{
          width: 100%;
          height: 100%;
          .charts{
            width: 100%;
            height: 100%;
          }
        }
        ul{
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          li{
            margin: 20px 0;

          }
        }
      }
    }
  }

  .el-button{
    border: 1px solid rgb(56, 122, 253);
    background-color: #060C26 !important;
    color: #fff;
  }
  .active{
    background-color: #387afd !important;

  }

</style>
