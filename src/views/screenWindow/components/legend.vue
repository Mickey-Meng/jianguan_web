<template>
  <ul>
<!--    <li class="item">交通（13）</li>-->
    <li class="item_1">
      <div class="label">施工（5）</div>
      <img src="../../../assets/mapView/施工.png" alt="">
    </li>
    <li class="item_1">
      <div class="label">停工（0）</div>
      <img src="../../../assets/mapView/停工.png" alt="">

    </li>
    <li class="item_1">
      <div class="label">完工未验（0）</div>
      <img src="../../../assets/mapView/完工未验.png" alt="">

    </li>
  </ul>
</template>

<script>
  export default {
    props: [],
    watch: {},
    data() {
      return {};
    },
    created() {
    },
    mounted() {
    },
    methods: {},
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  ul {
    width: 170px;
    height: 140px;
    padding: 10px 20px;
    position: absolute;
    z-index: 1000;
    left: 470px;
    bottom: 182px;
    background: url("../../../assets/mapView/计划背景.png") no-repeat;
    background-size: 100% 100%;

    .item {
      height: 22px;
      font-size: 16px;
      font-family: AlibabaPuHuiTiB;
      color: #FFFFFF;
      line-height: 22px;
      //text-shadow: 0px 1px 5px #0049BF;
      background: linear-gradient(180deg, #FFFFFF 40%, #0049BF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .item_1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;

      .label {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
      }

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

</style>
