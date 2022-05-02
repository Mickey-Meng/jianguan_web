<template>
  <div class="wrapperbox">
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">道路总量(m²)</div>
      </div>
      <div class="num" style="color:#387afd">0</div>
    </div>
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">已完成量(m²)</div>
      </div>
      <div class="num" style="color:#04e5a1">0</div>
    </div>
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">当天完成量(m²)</div>
      </div>
      <div class="num" style="color:#F6DC26">0</div>
    </div>
    <div class="tabcontent">
      <div>
        <img src="../../../assets/image/next.png" alt="">
        <div class="name">延期量(m²)</div>
      </div>
      <div class="num" style="color:#f04356">0</div>
    </div>
  </div>
</template>

<script>
export default {
  name: ''
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
