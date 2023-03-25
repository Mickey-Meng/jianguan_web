<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-09 14:18:06
-->
<template>

  <div class="wrapper">
    <div class="title">池州职业技术学院实验实训南区工程总体部署图</div>
    <div class="content" :style="'background:url('+ data.engineeringLayoutImageUrl +') no-repeat'"></div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEngCompany } from '@/api/data'
  export default {
    name: '',
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
  }
</script>

<style scoped lang="scss">
  .wrapper{
    height: 100%;
    padding-top: 5px;
    background-color: #EDEFF8;
    .title{
      text-align: center;
      height: 70px;
      line-height: 70px;
      width: 98%;
      margin: 5px auto;
      color: #333333;
      font-size: 30px;
      font-weight: 600;
      background-color: #fff;
    }
    .content{
      width: 98%;
      margin: 10px auto 0;
      height: calc(100% - 100px);
      background-size: 100% 100%;
    }
  }

</style>
