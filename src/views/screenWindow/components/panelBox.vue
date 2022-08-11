<template>
  <div class="panel_wrapper">
    <div class="header">
      <img :src="require(`@/assets/mapView/${header_bg}.png`)" alt="">
    </div>
    <div class="content" :class="contentClass">
      <slot></slot>
    </div>

  </div>
</template>

<script>
  export default {
    props: ["title", "contentClass", "header_bg"],
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
  .panel_wrapper {
    height: 100%;
    position: relative;

    .header {
      height: 50px;
      background: url("../../../assets/mapView/面板头部背景.png") no-repeat;
      background-size: 100% 100%;
      line-height: 50px;
      padding-left: 56px;
      font-weight: 500;
      color: #fff;
      display: flex;
      align-items: center;
      margin-bottom: 10px;


      .text {
        height: 28px;
      }
    }

    .content {
      height: calc(100% - 60px);
      background: url("../../../assets/mapView/面板内容背景.png") no-repeat;
      background-size: 100% 100%;

      > div {
        height: 100%;
      }
    }
  }

</style>
