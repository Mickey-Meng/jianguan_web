<!--
@name:
@description: 底部图片选择
@author: 王海林
@time: 2022-08-03 17:58:06
@modifier:
@modifierTime:
-->
<template>
  <div class="image_select">
    <div class="left_btn_box">
      <img src="../../../assets/mapView/左箭头.png" alt="">
    </div>
    <ul class="main_image_box">
      <li v-for="(item,index) in lists" :key="index">
        <img :src="item.image" alt="">
      </li>
    </ul>
    <div class="right_btn_box">
      <img src="../../../assets/mapView/右箭头.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    props: [],
    watch: {},
    data() {
      return {
        lists: [
          {
            image: require("@/assets/mapView/项目图片1.jpg")
          },
          {
            image: require("@/assets/mapView/项目图片2.jpg")
          },
          {
            image: require("@/assets/mapView/项目图片3.jpg")
          },
          {
            image: require("@/assets/mapView/项目图片4.jpg")
          }
        ]
      };
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
  .image_select {
    width: 980px;
    height: 150px;
    background: url("../../../assets/mapView/底部背景框.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    bottom: 22px;
    left: 470px;
    z-index: 1000;
    display: flex;

    .left_btn_box, .right_btn_box {
      width: 56px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        cursor: pointer;
      }

    }

    .main_image_box {
      width: calc(100% - 120px);
      display: flex;
      align-items: center;

      li {
        margin-right: 10px;

        width: 210px;
        height: 114px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
