<!--
@name:
@description: 质量安全
@author: 王海林
@time: 2022-08-03 09:49:02
@modifier:
@modifierTime:
-->
<template>
  <div class="quality_safety_wrapper">
    <el-table
      :data="tableData"
      height="100%"
      class="quality_safety"
      style="width: 100%">
      <el-table-column
        prop="a"
        align="center"
        show-overflow-tooltip
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="b"
        align="center"
        label="质量整改完成率">
      </el-table-column>
      <el-table-column
        prop="c"
        label="安全整改完成率">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    props: [],
    watch: {},
    data() {
      return {
        tableData: [
          {
            a: "235国道杭州至诸暨公路萧…",
            b: 90,
            c: 90
          },
          {
            a: "235国道杭州至诸暨公路萧…",
            b: 90,
            c: 90
          },
          {
            a: "235国道杭州至诸暨公路萧…",
            b: 90,
            c: 90
          },
          {
            a: "235国道杭州至诸暨公路萧…",
            b: 90,
            c: 90
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
  .quality_safety_wrapper {
    //padding: 10px 20px;
    padding:10px 20px 20px 20px;
    height: 100%;
  }

  ::v-deep .quality_safety {
    border: none;
    background-color: transparent;

    &:before {
      background-color: transparent;
    }

    tr {
      background-color: transparent !important;

      &:hover,
      &.hover-row,
      &.current-row {
        td {
          background-color: transparent !important;
        }
      }
    }

    th {
      background-color: transparent !important;
    }

    th.el-table__cell {
      background-color: transparent;

    }

    td {
      border-bottom: none;
    }

    td.el-table__cell {
      border-bottom: none;
    }

    .el-table__header-wrapper {

      .el-table__header {
        thead {
          th {
            padding: 12px 0;
            line-height: 14px;
            .cell {
              line-height: 14px;
              font-size: 12px;
              font-weight: bold;
              font-family: AlibabaPuHuiTiB;
              color: #FFFFFF;
            }

            border-bottom: none;
          }
        }
      }
    }
    .el-table__body {
      -webkit-border-vertical-spacing: 10px; // 垂直间距 设置的是行间距
      tbody {
        font-size: 14px;
        font-weight: 400;
        color: #DCFDED;

        tr{
          background: url("../../../../assets/mapView/行背景.png") no-repeat;
          background-size: 100% 100%;
          td{
            padding: 0;
            height: 40px;
            line-height: 40px;
          }
        }

      }
    }
    .el-table__body-wrapper{
      overflow-y: hidden;
      &:hover{
        overflow-y: auto;
      }
      &::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
        background-color: transparent;
      }

      /**
  * 滚动条的滑块
  */
      &::-webkit-scrollbar-thumb {
        background-color: #194BCC;
        //background-color: #0f88d2;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-track {
        //background-color: #0e4f94;
        background-color: #3C5189;
        border-radius: 0px;
        -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
      }
    }
  }


</style>
