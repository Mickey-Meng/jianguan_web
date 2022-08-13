<!--
@name:
@description: 项目类型导航
@author: 王海林
@time: 2022-08-03 17:16:32
@modifier:
@modifierTime:
-->
<template>
  <ul>
    <li v-for="(item,index) in menus" :key="index" :class="{isActive:item.id === currentId}" @click="changeData(item)">
      <div>{{ item.name }}</div>
    </li>

  </ul>
</template>

<script>
  export default {
    props: [],
    watch: {},
    data() {
      return {
        currentId: 1,
        menus: [
          {
            name: "交通类",
            id: 1
          },
          {
            name: "房建类",
            id: 2
          },
          {
            name: "市政类",
            id: 3,
          },
          {
            name: "其他类",
            id: 4
          }
        ]
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      changeData(item) {
        if (this.currentId !== item.id) {
          this.currentId = item.id;
          this.$emit("changeData", item.name);
        }
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  ul {
    position: absolute;
    z-index: 1000;
    top: 103px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;

    li {
      width: 144px;
      height: 40px;
      background: url("../../../assets/mapView/项目类型.png") no-repeat;
      background-size: 100% 100%;
      margin-right: 16px;
      cursor: pointer;
      user-select: none;
      //height: 32px;
      div {
        font-size: 22px;
        font-family: DINPro-Bold, DINPro;
        font-weight: bold;
        color: #34C5C9;
        line-height: 40px;
        text-align: center;
        background: linear-gradient(180deg, #FFFFFF 50%, #2861F6 80%, #2861F6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }


    }

    .isActive {
      background: url("../../../assets/mapView/项目类型选中.png") no-repeat;
      background-size: 100% 100%;
      div{
        font-size: 22px;
        font-family: DINPro-Bold, DINPro;
        font-weight: bold;
        color: #34C5C9;
        line-height: 40px;
        text-align: center;
        background: linear-gradient(180deg, #FFFFFF 50%, #FF7400  80%, #FF7400  100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

</style>
