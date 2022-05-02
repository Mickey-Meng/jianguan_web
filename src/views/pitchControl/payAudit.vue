<template>
  <el-container class="container-box">
    <el-header>
      <ul>
        <li v-for="(item,index) in navData" :key="index" :class="{'active':currentNav === item.key}" @click="changeNav(item.key)">{{item.name}}</li>
      </ul>
      <el-button type="primary" size="small">添加合同信息</el-button>
      <el-button type="primary" size="small">添加支付审核</el-button>

    </el-header>
    <el-main>
      <div class="left-chart">
          <div class="allbg" style="margin-bottom:20px">
            <div class="bar-chart"></div>
          </div>
          <div class="allbg">
            <div class="line-chart"></div>
          </div>
      </div>
      <div class="right-table">
        <div class="allbg">
          <div class="statement">
            <div class="header">
              <span>审核信息</span>
              <el-button type="primary" size="small">导出</el-button>
            </div>
            <div class="main">
              <el-table
                :data="tableData"
                height="99%"
                border
                class="bim-table"
                style="width: 100%"
              >
                <el-table-column
                  prop="date"
                  label="审核期数"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="date"
                  label="计量周期"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="本期审核支付金额"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="本期支付占比"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="累计审核支付金额"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="累计支付占比"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="形象支付进度"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="操作"
                  align="center"
                >
                </el-table-column>

              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
  export default {
    name: '',
    data() {
      return {
        currentNav:1,
        navData:[
          {
            name:'施工合同',
            key:1
          },
          {
            name:'监理合同',
            key:2
          },
          {
            name:'设计合同',
            key:3
          },
          {
            name:'跟审合同',
            key:4
          }
        ],
        tableData: []
      }
    },
    methods:{
      changeNav(val){
        this.currentNav =val;
      }
    }
  }
</script>

<style scoped lang="scss">
  .container-box {
    .el-header{
      padding: 0 5px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      ul{
        display: flex;
        align-items: center;
        margin-right: 50px;
        li{
          height: 50px;
          line-height: 50px;
          padding: 0 40px;
          cursor: pointer;
          border: 1px solid rgb(56, 122, 253);
        }
        .active{
          background-color: rgb(56, 122, 253);
        }
      }
      .el-button{
        padding: 6px 20px;
      }
    }
    .el-main {
      padding: 0;
      display: flex;

      .left-chart {
        width: 27%;
        display: flex;
        flex-direction: column;

        > div {
          flex: 1;
        }
      }

      .right-table {
        width: 73%;
        margin-left: 20px;
        .statement {
          height: 100%;
          display: flex;
          flex-direction: column;

          .header {

            height: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;

            > span {
              font-size: 18px;
              font-weight: 600;
            }

            .el-button {
              margin-right: 40px;
              padding: 7px 25px;
            }
          }

          .main {
            flex: 1;
            padding: 16px;
          }

        }
      }
    }
  }

</style>
