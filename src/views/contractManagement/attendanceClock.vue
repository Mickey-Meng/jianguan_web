<!--
 * @Descripttion:考勤打卡
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 10:06:35
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 10:06:41
-->
<template>
  <div class="clock_wrapper">
    <el-calendar v-model="value">
    </el-calendar>
  </div>
</template>

<script>
export default {
   data () {
      return {
        value: ""
      };
   },
   created() {},
   components: {},
   computed: {},
   methods: {}
}
</script>
<style lang='scss' scoped>
  .clock_wrapper {
    height: 100%;
  }

</style>
