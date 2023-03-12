<template>
  <el-container class="container-box">
    <el-header />
    <el-main>
      <div class="left-chart">
        <div class="allbg" style="margin-bottom:20px">
          <div class="chart-box">
            <div class="header">
              <div class="titleitem"></div>
              <span>进度款审核统计</span>
              <el-select
                v-model="typeKey"
              >
                <el-option v-for="item in typeArr" :key="item.key" :value="item.key" :label="item.name" />
              </el-select>
            </div>
            <div class="main-container">
              <v-chart autoresize class="charts" :options="barOption" />
            </div>
          </div>
        </div>
        <div class="allbg">
          <div class="chart-box">
            <div class="header">
              <div class="titleitem"></div>
              <span>进度款趋势统计</span>
              <el-select
                v-model="typeKey"
              >
                <el-option v-for="item in typeArr" :key="item.key" :value="item.key" :label="item.name" />
              </el-select>
            </div>
            <div class="main-container">
              <v-chart autoresize class="charts" :options="lineOption" />
            </div>
          </div>
        </div>
      </div>
      <div class="right-table">
        <div class="allbg">
          <div class="statement">
            <div class="header">
              <span>进度款审核汇报表</span>
              <div class="header-bottom">
                <div>工程名称: <span>池州港乌沙港区公用码头工程项目</span>合同价：<span>669321</span>万元</div>
                <el-button type="primary" size="small">导出</el-button>
              </div>
            </div>
            <div class="main">
              <el-table
                :data="tableData"
                height="100%"
                class="bim-table"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="date"
                  label="审核期数"
                  align="center"
                />
                <el-table-column
                  prop="name"
                  label="产值完成时段"
                  align="center"
                />
                <el-table-column
                  label="施工单位上报(元)"
                  align="center"
                >
                  <el-table-column
                    prop="province"
                    label="本期产值"
                    align="center"
                  />
                  <el-table-column
                    prop="city"
                    label="累计产值"
                    align="center"
                  />
                  <el-table-column
                    prop="address"
                    label="本期支付"
                    align="center"
                  />
                  <el-table-column
                    prop="zip"
                    label="累计支付"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="监理单位审核(元)"
                  align="center"
                >
                  <el-table-column
                    prop="province"
                    label="本期产值"
                    align="center"
                  />
                  <el-table-column
                    prop="city"
                    label="累计产值"
                    align="center"
                  />
                  <el-table-column
                    prop="address"
                    label="本期支付"
                    align="center"
                  />
                  <el-table-column
                    prop="zip"
                    label="累计支付"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  label="审计单位意见(元)"
                  align="center"
                >
                  <el-table-column
                    prop="province"
                    label="本期产值"
                    align="center"
                  />
                  <el-table-column
                    prop="city"
                    label="累计产值"
                    align="center"
                  />
                  <el-table-column
                    prop="address"
                    label="本期支付"
                    align="center"
                  />
                  <el-table-column
                    prop="zip"
                    label="累计支付"
                    align="center"
                  />
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="累计付款占全合同比例"
                  align="center"
                />
                <el-table-column
                  prop="date"
                  label="核减产值(元)"
                  align="center"
                />
                <el-table-column
                  prop="name"
                  label="操作"
                  align="center"
                />
              </el-table>

            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer />
  </el-container>

</template>

<script>
export default {
  name: '',
  data() {
    return {
      typeKey: '',
      typeArr: [],
      tableData: [],
      barOption: {
        color: ['#4472C4', '#95F204'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        legend: {
          data: ['产值', '支付'],
          icon: 'circle', //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          left: 'center',
          bottom: '1%',
          textStyle: { // 图例文字的样式
            color: '#fff',
            fontSize: 14
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['施工单位上报', '监理单位审核', '审计单位意见'],
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fffff',
                width: 1// 这里是为了突出显示加上的
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: function(value) {
                return value / 10000
              }
            },
            name: '万元',
            axisLine: {
              lineStyle: {
                color: '#ffffff',
                width: 1// 这里是为了突出显示加上的
              }
            }
          }
        ],
        series: [
          {
            name: '产值',
            type: 'bar',
            data: [2178544764, 0, 1066963320],
            barWidth: 30,
            itemStyle: {
              normal: {
                label: {
                  show: true,		// 开启显示
                  position: 'top',	// 在上方显示
                  textStyle: { // 数值样式
                    color: '#fff',
                    fontSize: 12
                  },
                  formatter: function(params) {
                    if (params.value) {
                      const num = params.value / 10000
                      return num + '万元'
                    } else {
                      return ''
                    }
                  }
                }
              }
            }
          },
          {
            name: '支付',
            type: 'bar',
            data: [1851754878, 0, 830318505],
            barWidth: 30
          }
        ]
      },
      lineOption: {
        color: ['#4472C4', '#95F204'],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '12%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['累计产值', '累计支付'],
          textStyle: { // 图例文字的样式
            color: '#fff',
            fontSize: 14
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['2020/09/19', '2020/10/19', '2020/11/19', '2021/01/19', '2021/03/29', '2021/04/29'],
            axisLabel: {
              show: true,
              rotate: 20,
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fffff',
                width: 1// 这里是为了突出显示加上的
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '万元',
            axisLabel: {
              formatter: function(value) {
                return value / 10000
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ffffff',
                width: 1// 这里是为了突出显示加上的
              }
            }
          }
        ],
        series: [
          {
            name: '累计产值',
            type: 'line',
            // stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [802215901, 882930339, 1110243989, 1401569400, 1410860388, 1481456122]
          },
          {
            name: '累计支付',
            type: 'line',
            // stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [601661927, 662197756, 832682994, 1051177052, 1058145293, 1111092094]
          }
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .container-box {
    color: #FFFFFF;

    .el-main {
      display: flex;
      padding: 0;

      .left-chart {
        width: 27%;
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        > div {
          flex: 1;
        }
        .allbg{
          .chart-box {
          display: flex;
          flex-direction: column;
          height: 100%;
          .header {
            height: 30px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-top: 16px;
            padding-left: 16px;
            padding-right: 16px;
            ::v-deep .el-select {
              width: 158px;
              margin-left: 5px;
              //height: 35px !important;
              .el-input {
                .el-input__inner {
                  height: 30px !important;
                  line-height: 30px;
                  background-color: #060C26 !important;
                  color: #fff;
                  border: 1px solid #387AFD;
                }

                .el-input__suffix {
                  .el-input__icon {
                    line-height: 30px;
                  }
                }
              }
            }

            span {
              font-size: 18px;
              font-weight: 600;
              margin-left: 16px;
              margin-right: 30%;
            }
          }

          .main-container {
            flex: 1;

            .charts {
              height: 100%;
              width: 100%;
            }
          }
        }
        }

      }

      .right-table {
        width: 73%;
        .statement {
        padding: 16px;

          height: 100%;
          display: flex;
          flex-direction: column;

          .header {
            height: 70px;

            > span {
              display: block;
              height: 30px;
              line-height: 30px;
              font-size: 18px;
              font-weight: 600;
            }

            .header-bottom {
              display: flex;
              height: 40px;
              padding-right: 200px;
              justify-content: space-between;
              align-items: center;

              > div {
                span {
                  color: #9BAAED;
                }

                span:first-of-type {
                  margin: 0 40px 0 10px;
                }

                span:last-of-type {
                  margin: 0 10px;

                }
              }
            }
          }

          .main {
            width: 100%;
            flex: 1;
          }
        }
      }
    }
  }

</style>
