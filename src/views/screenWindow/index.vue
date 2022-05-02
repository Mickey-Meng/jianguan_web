<template>
<!--  <dv-full-screen-container>-->
    <div class="wrapper" :style="'background-image:url('+ Background +')'">
      <div class="header">
        <dv-decoration-8 style="width:25%;height:60px;"/>
        <dv-decoration-5 style="width:30%;height:60px;" class="header-center-decoration"/>
        <dv-decoration-8 :reverse="true" style="width:25%;height:60px;"/>
        <div class="center-little">xxxxxx一体化管理平台</div>
      </div>
      <div class="main">
        <div class="main-left"></div>
        <div class="main-center">
          <Cesium></Cesium>
        </div>
        <div class="main-right"></div>
      </div>
    </div>
<!--  </dv-full-screen-container>-->

</template>

<script>
  import Background from "@/assets/image/datavbg.png";
  import Cesium from '@/components/Map/Index'
  export default {
    name: '',
    components:{Cesium},
    data(){
      return{
        Background,
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    height: 100%;
    .header {
      height: 100px;
      position: relative;
      display: flex;
      justify-content: space-between;
      .header-center-decoration {
        margin-top: 40px;
      }
      .center-little {
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 30px;
        font-weight: 700;
        color: #fff;
      }
    }
    .main{
      height: calc(100% - 100px);
      display: flex;
      .main-left{
        width: 380px;
      }
      .main-center{
        flex: 1;
      }
      .main-right{
        width: 380px;
      }
    }
  }

</style>
