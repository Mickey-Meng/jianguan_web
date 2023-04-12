<template>
  <div class="wrapper">
    <div class="header">{{data.projectName}}</div>
<!--    <div class="header">池州港乌沙港区公用码头工程项目</div>-->
    <div class="content">
      <div class="content-left">
        <div class="title">项目进度安排</div>
        <ul>
          <li>
            <div class="quarter">
              <span>一季度</span
              ><img src="../../assets/image/sgawg.png" alt="" />
            </div>
            <div class="text">
              {{data.firstQuarter}}            </div>
          </li>
          <li>
            <div class="quarter">
              <span>二季度</span
              ><img src="../../assets/image/sgawg.png" alt="" />
            </div>
            <div class="text">
              {{data.secondQuarter}}
            </div>
          </li>
          <li>
            <div class="quarter">
              <span>三季度</span
              ><img src="../../assets/image/sgawg.png" alt="" />
            </div>
            <div class="text">
              {{data.thirdQuarter}}
            </div>
          </li>
          <li>
            <div class="quarter">
              <span>四季度</span
              ><img src="../../assets/image/sgawg.png" alt="" />
            </div>
            <div class="text">
              {{data.fourthQuarter}}
            </div>
          </li>
        </ul>
      </div>
      <div class="content-right">
        <div class="content-right-top">
          <div class="title">投资项目概况</div>
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
          <div class="title">项目保障措施</div>
          <div class="card-content">
            <div>
              <div class="s-title">压实责任</div>
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
              <div class="s-title">落实保障</div>
              <div class="s-content">
                {{data.implementGuarantee}}
              </div>
            </div>
            <div>
              <div class="s-title">抓实进度</div>
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
    background-color: #fff;
  }
  .content {
    width: 100%;
    margin: 0 auto;
    height: calc(100% - 90px);
    display: flex;
    justify-content: space-between;
    .content-left {
      width: 30%;
      background-color: #fff;
      padding: 30px;
      .title {
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          height: 130px;
          background-color: #ebecee;
          border-radius: 5px;
          .quarter {
            width: 25%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              margin-left: 5px;
            }
          }
          .text {
            width: 73%;
            display: flex;
            align-items: center;
            line-height: 25px;
          }
        }
      }
    }
    .content-right {
      width: 69%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .content-right-top {
        height: 39%;
        background-color: #ffffff;
        padding: 10px 20px 0 20px;
        .title {
          font-size: 18px;
          color: #333;
          font-weight: bold;
        }
        .text-content {
          width: 100%;
          margin: 10px auto 0;
          height: calc(100% - 35px);
          // overflow: hidden;
          background-color: #ebecee;
          border-radius: 5px;
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
          }
          .target-text {
            text-indent: 2em;
            overflow: auto;
            // height: 30px;
            line-height: 20px;
            // height: calc(40% - 30px);
          }
          .small-text {
            padding: 0 50px;
            overflow: auto;
            p {
              margin: 0;
              text-indent: 2em;
            }
          }
        }
      }
      .content-right-bottom {
        padding: 20px 20px 0 20px;
        height: 59%;
        background-color: #ffffff;
        .title {
          font-size: 18px;
          color: #333;
          font-weight: bold;
        }
        .card-content {
          margin-top: 10px;
          height: calc(100% - 40px);
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
            ul {
              height: 300px;
              background-color: #ebecee;
              border-radius: 5px;
              padding: 10px;
              li {
                margin: 10px 0;
                display: flex;
                align-items: center;
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
              height: 300px;
              background-color: #ebecee;
              border-radius: 5px;
              padding: 10px;
              line-height: 25px;
              text-indent: 2em;
            }
          }
        }
      }
    }
  }
}
</style>
