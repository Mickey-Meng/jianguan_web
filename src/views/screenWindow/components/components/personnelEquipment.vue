<!--
@name:
@description: 人员设备
@author: 王海林
@time: 2022-08-03 10:29:10
@modifier:
@modifierTime:
-->
<template>
  <div class="personnel_equipment">
    <el-select v-model="value" placeholder="请选择" popper-class="project_select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="people">
      <div class="img">
        <img src="../../../../assets/mapView/管理.png" alt="">
        <span>管理</span>
      </div>
      <ul>
        <li>
          <div>6</div>
          <div>出勤</div>
        </li>
        <li>
          <div>4</div>
          <div>在场</div>
        </li>
        <li>
          <div>34</div>
          <div>在册</div>
        </li>
      </ul>
    </div>
    <div class="people">
      <div class="img">
        <img src="../../../../assets/mapView/工人.png" alt="">
        <span>工人</span>
      </div>
      <ul>
        <li>
          <div>293</div>
          <div>出勤</div>
        </li>
        <li>
          <div>235</div>
          <div>在场</div>
        </li>
        <li>
          <div>328</div>
          <div>在册</div>
        </li>
      </ul>
    </div>
    <ul class="equipment">
      <li>
        <img src="../../../../assets/mapView/盾构机.png" alt="">
        <div class="value"><span>7</span><span>/9</span></div>
        <div class="label">盾构机</div>
      </li>
      <li>
        <img src="../../../../assets/mapView/大型履带吊.png" alt="">
        <div class="value"><span>15</span><span>/20</span></div>
        <div class="label">大型履带吊</div>
      </li>
      <li>
        <img src="../../../../assets/mapView/铣槽成槽.png" alt="">
        <div class="value"><span>8</span><span>/8</span></div>
        <div class="label">铣槽成槽</div>
      </li>
      <li>
        <img src="../../../../assets/mapView/其他设备.png" alt="">
        <div class="value"><span>54</span><span>/76</span></div>
        <div class="label">其他</div>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    props: [],
    watch: {},
    data() {
      return {
        value: "",
        options: []
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
  .personnel_equipment {
    padding: 20px;
    height: 100%;

    ::v-deep.el-select {
      .el-input {
        background: url("../../../../assets/mapView/下拉背景.png") no-repeat;
        background-size: 100% 100%;

        .el-input__inner {
          background: transparent;
          border: none;
          height: 40px;
          line-height: 40px;
        }

        .el-input__suffix {
          .el-select__caret {
            &:before {
              content: '';
              background: url("../../../../assets/mapView/下拉选择.png") center center no-repeat;
              position: absolute;
              width: 100%;
              height: 100%;
              appearance: none;
              -moz-appearance: none;
              -webkit-appearance: none;
              top: 0;
              right: 10%;

            }

            &:after {

            }
          }
        }
      }
    }

    .people {
      margin-top: 10px;
      height: 21%;
      background: url("../../../../assets/mapView/人员背景.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;

      .img {
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 32px;
          height: 32px;
          margin-right: 20px;
        }

        span {
          font-size: 16px;
          font-family: AlibabaPuHuiTiB;
          color: #FFFFFF;
          line-height: 24px;
        }
      }

      ul {
        width: calc(100% - 150px);
        display: flex;
        justify-content: space-around;
        align-items: center;

        li {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;

          div:first-child {
            margin-bottom: 7px;
            height: 24px;
            font-size: 24px;
            font-family: DINPro-Bold;
            font-weight: bold;
            color: #34C5C9;
            line-height: 31px;
            background: linear-gradient(180deg, #FFFFFF 60%, #2861F6 95%, #2861F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          div:last-child {
            height: 24px;
            font-size: 14px;
            font-family: AlibabaPuHuiTiR;
            color: #FFFFFF;
            line-height: 24px;
          }
        }
      }
    }

    .equipment {
      margin-top: 10px;
      height: calc(58% - 70px);
      display: flex;
      justify-content: space-between;

      li {
        width: 87px;
        background: url("../../../../assets/mapView/设备背景.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          width: 32px;
          height: 32px;
        }

        .value {
          margin-top: 17%;
          margin-bottom: 4px;
          > span:nth-of-type(1) {
            font-size: 24px;
            font-family: DINPro-Bold;
            font-weight: bold;
            color: #34C5C9;
            line-height: 31px;
            background: linear-gradient(180deg, #FFFFFF 50%, #2861F6 80%, #2861F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          > span:nth-of-type(2) {
            font-size: 16px;
            font-family: DINPro-Bold;
            font-weight: bold;
            color: #34C5C9;
            line-height: 31px;
            background: linear-gradient(180deg, #FFFFFF 50%, #2861F6 80%, #2861F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .label {
          height: 24px;
          font-size: 14px;
          font-family: AlibabaPuHuiTiR;
          color: #FFFFFF;
          line-height: 24px;
        }
      }

    }

  }

</style>
