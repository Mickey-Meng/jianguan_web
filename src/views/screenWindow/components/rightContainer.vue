<template>
  <div class="right_main_box">
    <div class="top">
      <scheduleManagement></scheduleManagement>
    </div>
    <div class="bottom">
      <panelBox header_bg="人员设备">
        <personnelEquipment></personnelEquipment>
      </panelBox>

    </div>
  </div>
</template>

<script>
  import panelBox from "./panelBox";
  import personnelEquipment from "@/views/screenWindow/components/components/personnelEquipment";
  import scheduleManagement from "@/views/screenWindow/components/components/scheduleManagement";

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
    components: {panelBox, personnelEquipment, scheduleManagement},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .right_main_box {
    height: 100%;

    .top {
      height: 43%;
    }

    .bottom {
      margin-top: 10px;
      height: calc(57% - 10px);
    }

  }

</style>
