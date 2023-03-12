<template>
  <div class="wrapper">
    <div class="header">池州港乌沙港区公用码头工程项目</div>
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
              季末累计完成：项目驻地建设完成并入住，项目中心试验室建设完成并投入使用。累计完成全年灌注桩施工2%。累计完成产值：1521万。
            </div>
          </li>
          <li>
            <div class="quarter">
              <span>二季度</span
              ><img src="../../assets/image/sgawg.png" alt="" />
            </div>
            <div class="text">
              季末累计完成：2#场站建设完成，灌注桩完成16%，路基施工15%，隧道施工完成26%。累计完成产值：13121万。
            </div>
          </li>
          <li>
            <div class="quarter">
              <span>三季度</span
              ><img src="../../assets/image/sgawg.png" alt="" />
            </div>
            <div class="text">
              季末累计完成：1#场站建设完成，灌注桩完成38%，路基施工30%，隧道进尺完成34%。累计完成产值：28453万。
            </div>
          </li>
          <li>
            <div class="quarter">
              <span>四季度</span
              ><img src="../../assets/image/sgawg.png" alt="" />
            </div>
            <div class="text">
              季末累计完成：T梁预制完成100%，灌注桩完成44%，路基施工53%，隧道进尺完成40%。累计完成产值：36978万。
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
              <p>
                池州港乌沙港区公用码头工程位于池州港乌沙港区，距下游池州长江公路大桥约1600m，工程按年吞吐量4000万吨设计，拟建设8个5000吨级通用泊位，申请使用岸线长度1025m，为周边矿山、腹地及园区企业提供货物港廊公水联运及装卸服务。
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
                  <span>建设单位:</span
                  ><span>池州乌沙港口运输有限公司</span>
                </li>
                <li>
                  <span>管理单位:</span
                  ><span>池州建设投资集团有限公司</span>
                </li>
                <li>
                  <span>施工单位：</span
                  ><span
                    >中交上海航道局有限公司/中交第二航务工程勘察设计院有限公司</span
                  >
                </li>
                <li>
                  <span>监理单位：</span
                  ><span
                >安徽省科兴交通建设工程监理有限公司/池州建投工程管理有限公司</span
                >
                </li>
              </ul>
            </div>
            <div>
              <div class="s-title">落实保障</div>
              <div class="s-content">
                沿线60.32公里，涉及征地拆迁问题较多，加强与当地政府部门联系，加强项目征地拆迁力度，为全线开工做好充足准备。确保年进度产值。
              </div>
            </div>
            <div>
              <div class="s-title">抓实进度</div>
              <div class="s-content">
                由诸暨市交通基础设施建设有限公司牵头，会同浙江公路水运工程咨询有限责任公司、中交上海航道局有限公司做好项目推进的协调、督查、检查工作；每季度评估、分析和通报，对滞后的节点进行预警、跟踪和协调，提出解决问题的措施，切实解决项目推进中存在的共性问题和突出问题，定时将周报、月报报送基础设施公司。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
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
            height: 110px;
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
                  width: 35%;
                }
                span:last-of-type {
                  width: 65%;
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
