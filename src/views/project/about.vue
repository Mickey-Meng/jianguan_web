<template>
  <div class="wrapper">
    <div class="header">{{data.projectName}}</div>
<!--    <div class="header">池州港乌沙港区公用码头工程项目</div>-->
    <div class="content">
      <div class="content-left">
        <div class="title">
          <div class="logo"></div>
          <div class="text">计划进度</div>
        </div>
        <ul>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">一季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.firstQuarter}}            </div>
          </li>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">二季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.secondQuarter}}
            </div>
          </li>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">三季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.thirdQuarter}}
            </div>
          </li>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">四季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.fourthQuarter}}
            </div>
          </li>
        </ul>
      </div>
      <div class="content-left">
        <div class="title">
          <div class="logo"></div>
          <div class="text">实际进度</div>
        </div>
        <ul>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">一季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.firstQuarter}}            </div>
          </li>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">二季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.secondQuarter}}
            </div>
          </li>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">三季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.thirdQuarter}}
            </div>
          </li>
          <li>
            <div class="quarter">
              <div class="header_line"></div>
              <div class="time">四季度</div>
              <img class="status" src="../../assets/image/sgawg1.png" alt="" />
            </div>
            <div class="text">
              {{data.fourthQuarter}}
            </div>
          </li>
        </ul>
      </div>
      <div class="content-right">
        <div class="content-right-top">
          <div class="title">
            <div class="logo"></div>
            <div class="text">投资项目概况</div>
          </div>
          <!-- <div class="title">投资项目概况</div> -->
          <div class="text-content custom-scrollbar">
            <div class="small-title">建设内容和开竣工时间</div>
            <div class="small-text about-text">
              <p style="line-height:30px;font-size: 18px;">
                {{data.investmentProjectOverview}}
              </p>

            </div>
            <!--            <div class="small-title">今年目标任务</div>
                        <div class="small-text target-text">
                          (1)中心试验室土建建设完成,并投入使用;(2)1#、2#钢筋加工中心建设、1#、2#混凝土拌合站建设、1#、2#预制梁场建设、验收完成具备生产条件;(3)桥梁桩基累计完成1131根，墩柱完成330个，T梁预制完成155片；(4)隧道开挖累计完成2500m，二衬累计完成1860m；
                          （5）2021年年度计划完成产值目标为80072万元。
                        </div>-->
          </div>
        </div>
        <div class="content-right-bottom">
          <div class="title">
            <div class="logo"></div>
            <div class="text">项目保障措施</div>
          </div>
          <div class="card-content">
            <div>
              <!-- <div class="s-title">压实责任</div> -->
              <div class="quarter">
                <div class="header_line"></div>
                <div class="time">压实责任</div>
              </div>
              <ul>
                <li>
                  <span>建设单位:</span>
<!--                  <span>池州乌沙港口运输有限公司</span>-->
                  <span>{{data.builddpt}}</span>
                </li>
                <li>
                  <span>设计单位:</span
                  ><span>{{data.desgindpt}}</span>
                </li>

                <li>
                  <span>管理单位:</span
                  ><span>{{data.managedpt}}</span>
                </li>
                <li>
                  <span>施工单位：</span
                  ><span
                >{{data.constructdpt}}</span
                >
                </li>
                <li>
                  <span>监理单位：</span>
                  <span>{{data.supervisordpt}}</span>
                </li>
                <li>
                  <span>审计单位：</span>
                  <span>{{data.auditUnit}}</span>
                </li>
              </ul>
            </div>
            <div>
              <div class="quarter">
                <div class="header_line"></div>
                <div class="time">落实保障</div>
              </div>
              <div class="s-content">
                {{data.implementGuarantee}}
              </div>
            </div>
            <div>
              <div class="quarter">
                <div class="header_line"></div>
                <div class="time">抓实进度</div>
              </div>
              <div class="s-content">
                {{data.graspTheProgress}}             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEngCompany } from '@/api/data'
export default {
  name: "",
  data() {
    return {
      data: {}
    }
  },
  computed: {
    ...mapGetters(["project"]),
  },
  created() {
    this.getEngCompany(this.project.id)
  },
  methods: {
    getEngCompany(id) {
      getEngCompany(id).then((res) => {
        this.data = res.data;
      });
    }
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  //padding-top: 5px;
  padding: 2px 5px 5px 5px;
  background-color: #edeff8;
  color: #4a4a4a;
  height: 100%;
  font-size: 16px;
  .header {
    text-align: center;
    height: 70px;
    line-height: 70px;
    width: 100%;
    margin-bottom: 5px;
    color: #333333;
    font-size: 22px;
    font-weight: 600;
    background-color: #EAF1FF;    
    font-size: 18px;
    font-family: AlibabaPuHuiTiM;
  }

  .content {
    width: 100%;
    margin: 0 auto;
    height: calc(100% - 90px);
    display: flex;
    justify-content: space-between;
    .content-left {
      width: 15%;
      min-width: 300px;
      background-color: #F1F3F9;
      margin-left: 10px;
      // .title {
      //   font-size: 16px;
      //   color: #333;
      //   font-weight: bold;
      //   font-family: AlibabaPuHuiTiM;
      // }
      
      .title {
        display: flex;
        align-items: center;
        padding: 20px 0px 10px 20px;
        background: #EAF1FF;
        border-radius: 4px 4px 0px 0px;

        .logo {
          width: 24px;
          height: 24px;
          background-color: #1E6EEB;
          margin-right: 8px;
          border-radius: 3px;
          background: url(../../assets/image/datacenter_headericon3.svg) no-repeat;
          background-size: cover;
        }

        .text {
          color: #2D405E;
          font-size: 18px;
          font-weight: bold;
          font-family: PingFang SC;
          font-size: 16px;
          font-family: AlibabaPuHuiTiM;
          color: #191919;
        }

      }
      ul {
        background-color: #fff;
        padding: 16px;
        li {
          display: flex;
          // width: 100%;
          justify-content: space-between;
          margin: 15px 0;
          height: 120px; 
          flex-direction: column;
          padding: 10px;
          .quarter {
            // width: 100%;
            display: flex;
            justify-content: left;
            align-items: center;
            padding-top: 15px;
            margin-bottom: 10px;
            .header_line {
              width: 4px;
              height: 20px;
              background-color: #1E6EEB;
              margin-right: 8px;
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
            }
            .time {
              width: 188px;
              height: 22px;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #191919;
              line-height: 22px;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #191919;
            }
            .status {
              margin-left: 75px;
            }
          }
          .text {
            width: 100%;
            display: flex;
            align-items: center;
            line-height: 25px;
            font-size: 16px;
            font-family: AlibabaPuHuiTiR;
            color: #11142D;
            background-color: #ebecee;
            border-radius: 5px;
            padding: 15px 10px;

          }
        }
      }
    }
    .content-right {
      width: 69%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;
      .content-right-top {
        height: 39%;
        background-color: #fff;
        // padding: 10px 20px 0 20px;
        // .title {
        //   font-size: 16px;
        //   color: #333;
        //   font-weight: bold;
        //   font-family: AlibabaPuHuiTiM;
        // }
        .title {
          display: flex;
          align-items: center;
          padding: 20px 0px 10px 20px;
          background: #EAF1FF;
          border-radius: 4px 4px 0px 0px;

          .logo {
            width: 24px;
            height: 24px;
            background-color: #1E6EEB;
            margin-right: 8px;
            border-radius: 3px;
            background: url(../../assets/image/datacenter_headericon3.svg) no-repeat;
            background-size: cover;
          }

          .text {
            color: #2D405E;
            font-size: 18px;
            font-weight: bold;
            font-family: PingFang SC;
            font-size: 16px;
            font-family: AlibabaPuHuiTiM;
            color: #191919;
          }

        }
        .text-content {
          width: calc(100% - 32px);
          margin: 10px 16px;
          // mar
          height: calc(100% - 75px);
          // overflow: hidden;
          background: #E4E4E44f;
          border-radius: 4px;
          .small-title {
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            font-weight: 600;
            color: #555;
            text-indent: 2em;
          }
          .about-text {
            height: 120px;
            font-size: 16px;
            font-family: AlibabaPuHuiTiR;
            color: #11142D;
          }
          .target-text {
            text-indent: 2em;
            overflow: auto;
            // height: 30px;
            line-height: 20px;
            font-size: 16px;
            font-family: AlibabaPuHuiTiR;
            color: #11142D;
            // height: calc(40% - 30px);
          }
          .small-text {
            padding: 0 50px;
            overflow: auto;
            font-size: 16px;
            font-family: AlibabaPuHuiTiR;
            color: #11142D;
            p {
              margin: 0;
              text-indent: 2em;
            }
          }
        }
      }
      .content-right-bottom {
        // padding: 20px 20px 0 20px;
        height: 59%;
        background-color: #ffffff;
        
        .title {
          display: flex;
          align-items: center;
          padding: 20px 0px 10px 20px;
          background: #EAF1FF;
          border-radius: 4px 4px 0px 0px;

          .logo {
            width: 24px;
            height: 24px;
            background-color: #1E6EEB;
            margin-right: 8px;
            border-radius: 3px;
            background: url(../../assets/image/datacenter_headericon3.svg) no-repeat;
            background-size: cover;
          }

          .text {
            color: #2D405E;
            font-size: 18px;
            font-weight: bold;
            font-family: PingFang SC;
            font-size: 16px;
            font-family: AlibabaPuHuiTiM;
            color: #191919;
          }

        }
        .card-content {
          margin-top: 10px;
          height: calc(100% - 64px);
          display: flex;
          justify-content: space-between;
          > div {
            width: 32%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .s-title {
              background-color: #387afd;
              color: #fff;
              height: 40px;
              text-align: center;
              line-height: 40px;
              border-radius: 5px;
            }
            
            .quarter {
              // width: 100%;
              display: flex;
              justify-content: left;
              align-items: center;
              padding-top: 15px;
              margin-bottom: 10px;
              .header_line {
                width: 4px;
                height: 20px;
                background-color: #1E6EEB;
                margin-right: 8px;
                border-top-right-radius: 3px;
                border-bottom-right-radius: 3px;
              }
              .time {
                width: 188px;
                height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #191919;
                line-height: 22px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #191919;
              }
              .status {
                margin-left: 75px;
              }
            }
            ul {
              height: 330px;
              background-color: #E4E4E44f;
              border-radius: 5px;
              padding: 10px;  
              margin: 10px;
              li {
                margin: 5px 0;
                display: flex;
                align-items: center;
                font-size: 16px;
                font-family: AlibabaPuHuiTiR;
                color: #11142D;
                span:first-of-type {
                  width: 25%;
                }
                span:last-of-type {
                  width: 75%;
                  line-height: 25px;
                }
              }
            }
            .s-content {
              height: 330px;
              background-color: #E4E4E44f;
              border-radius: 5px;
              padding: 10px;
              line-height: 25px;
              text-indent: 2em;
              margin: 10px;
              font-size: 16px;
              font-family: AlibabaPuHuiTiR;
              color: #11142D;
            }
          }
        }
      }
    }
  }
}
</style>
