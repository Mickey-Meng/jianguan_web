<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2021-10-18 09:21:09
-->
<template>
  <div class="wrapperbox">
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">构件总数量(pcs)</div>
      </div>
      <div class="num" style="color:#387afd">{{ engineering.QL?engineering.QL.count:0 }}</div>
    </div>
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">已完成数量(pcs)</div>
      </div>
      <!-- <div class="num" style="color:#04e5a1">360</div> -->
      <div class="num" style="color:#04e5a1">{{ engineering.QL?engineering.QL.finish:0 }}</div>
    </div>
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">当天完成数量(pcs)</div>
      </div>
      <div class="num" style="color:#F6DC26">{{ engineering.QL?engineering.QL.todayFinish:0 }}</div>
    </div>
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">延期数量(pcs)</div>
      </div>
      <div class="num" style="color:#f04356">{{ engineering.QL?engineering.QL.dalay:0 }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    engineering: {
      type: Object,
      default: () => {}
    }
  },
  created() {
  }
}
</script>

<style scoped lang="scss">
  .wrapperbox{
    height: 100%;
    display: flex;
    // flex-direction: column;
    flex-wrap: wrap;
    .tabcontent{
      // flex: 1;
      display: flex;
      width: 46%;
      // flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      background-color: #052853;
      margin-left: 20px;
      // margin-right: 20px;
      margin-bottom: 20px;
      >div{
        display: flex;
        img{
          margin-left: 13px;
      }
      .name{
        color: #9ab9ed;
        margin-left: 2px;
        font-size: 16px;
        font-family: PingFangSC;
        font-weight: 500;
        color: #FFFFFF;
      }
      }
      .num{
        font-weight: 600;
        font-size: 40px;
        margin-right: 13px;
      }
    }
  }

</style>
