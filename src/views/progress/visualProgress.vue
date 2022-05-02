<template>
  <div>
    <div class="wrapper">
      <vue-drag-resize :w="200" :h="200" :isResizable="false">
        <div class="header">图例</div>
        <!-- <ul>
          <li class="active">施工进度</li>
        </ul>
        <el-select
          v-model="roadKey"
          placeholder="请选择单位工程"
        >
          <el-option v-for="item in typeArr" :key="item.key" :value="item.key" :label="item.name"></el-option>
        </el-select> -->
        <div class="main">
          <div style="background-color: #bfeaee">未开工</div>
          <div style="background-color: #e9bc32">已开工</div>
          <div style="background-color: #f11a1a">延期</div>
          <div style="background-color: #6bcd01">完工</div>
        </div>
      </vue-drag-resize>
    </div>
  </div>
</template>

<script>
import { getConponentStatus, getQiaoData } from "@/api/progress";
let zeh;
let layer, hlm;
import Bus from "@/assets/eventBus";
export default {
  name: "",
  data() {
    return {
      roadKey: "",
      currentView: "roadWork",
      typeArr: [],
      allId: [],
      planId: [],
      finishId: [],
      workId: [],
      postponeId: [],
      layer: null,
    };
  },
  created() {
    zeh = window.zeh;
    this.initData();
  },
  methods: {
    initData() {
      getConponentStatus().then((result) => {
        //0是未开个，2是已完成,1施工，3是延期了
        let arr = [];
        Bus.$emit("getVisualData", result.data);
        result.data.forEach((item) => {
          let { layername, mouldid } = item;
          if (layername && mouldid) {
            if (arr.length > 0) {
              let obj = arr.find((e) => e.layername === layername);
              if (obj) {
                obj.children.push(item);
              } else {
                arr.push({ layername, children: [item] });
              }
            } else {
              arr.push({ layername, children: [item] });
            }
          }

          // if (item.mouldid) {
          //   this.allId.push(item.mouldid.replace(/^\s*|\s*$/g, ""));
          //   if (item.status === 1) {
          //     this.finishId.push(item.mouldid.replace(/^\s*|\s*$/g, ""));
          //   } else if (item.status === 0) {
          //     this.planId.push(item.mouldid.replace(/^\s*|\s*$/g, ""));
          //   } else if (item.status === 3) {
          //     this.workId.push(item.mouldid.replace(/^\s*|\s*$/g, ""));
          //   } else if (item.status === 4) {
          //     this.postponeId.push(item.mouldid.replace(/^\s*|\s*$/g, ""));
          //   }
          // }
        });
        this.showLight(arr);
      });
    },
    showLight(arr) {
      if (arr && arr.length > 0) {
        hlm = zeh.earth.getDefaultHighlightManager();
        arr.forEach((item) => {
          let { layername, children } = item;
          let layer = zeh.layers.getLayerByName(layername);
          let planId = [];
          let workId = [];
          let postponeId = [];
          let finishId = [];
          if (children) {
            children.forEach((e) => {
              let { mouldid, status } = e;
              let str = mouldid.replace(/^\s*|\s*$/g, "");
              switch (status) {
                case 0:
                  planId.push(str);
                  break;
                case 2:
                  finishId.push(str);
                  break;
                case 3:
                  postponeId.push(str);
                  break;
                case 1:
                  workId.push(str);
                  break;
              }
            });
          }
          hlm.showHighlightByKey(
            layer.primitive,
            planId,
            true,
            {
              color: [191, 234, 238, 1], //未开工
            },
            "name"
          );
          hlm.showHighlightByKey(
            layer.primitive,
            workId,
            true,
            {
              color: [233, 188, 50, 1], //已开工
            },
            "name"
          );
          hlm.showHighlightByKey(
            layer.primitive,
            postponeId,
            true,
            {
              color: [241, 26, 26, 1], //延期
            },
            "name"
          );
          hlm.showHighlightByKey(
            layer.primitive,
            finishId,
            true,
            {
              color: [107, 205, 1, 1], //完工
            },
            "name"
          );
        });
      }
    },
    //遍历着色
    showEffects() {
      hlm = zeh.earth.getDefaultHighlightManager();
      let layers = zeh.layers.data.allLayers;
      let models = layers.filter((e) => e.type === "C3DTILES");
      if (models && models.length > 0) {
        models.forEach((item) => {
          hlm.showHighlightByKey(
            item.primitive,
            this.planId,
            true,
            {
              color: [191, 234, 238, 1], //未开工
            },
            "name"
          );
          hlm.showHighlightByKey(
            item.primitive,
            this.workId,
            true,
            {
              color: [233, 188, 50, 1], //已开工
            },
            "name"
          );
          hlm.showHighlightByKey(
            item.primitive,
            this.postponeId,
            true,
            {
              color: [241, 26, 26, 1], //延期
            },
            "name"
          );
          hlm.showHighlightByKey(
            item.primitive,
            this.finishId,
            true,
            {
              color: [107, 205, 1, 1], //完工
            },
            "name"
          );
        });
      }
    },
    stopEffect() {
      let layers = zeh.layers.data.allLayers;
      let models = layers.filter((e) => e.type === "C3DTILES");
      if (models && models.length > 0) {
        models.forEach((item) => {
          hlm.stopHighlightByKey(
            item.primitive,
            this.allId,
            true,
            {
              color: [191, 234, 238, 1],
            },
            "name"
          );
        });
      }
    },
    changeView(val) {
      if (this.currentView !== val) {
        this.currentView = val;
      }
    },
  },
  destroyed() {
    if (hlm) {
      hlm.clearAllHighlight();
    }
    Bus.$emit("clearEffect");
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  position: fixed;
  left: 80%;
  top: 70%;
  ::v-deep .content-container {
    border: 1px solid #526f82;
    background-color: rgba(38, 38, 38, 0.5);
    > ul {
      display: flex;
      li {
        flex: 1;
        text-align: center;
        line-height: 30px;
        height: 30px;
      }
      .active {
        background-color: rgb(0, 39, 148);
      }
    }
  }
  .header {
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid #526f82;
  }
  .main {
    > div {
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #000000;
    }
  }

  ::v-deep .el-select {
    width: 100%;
    text-indent: 0;
    //height: 35px !important;
    .el-input {
      .el-input__inner {
        height: 30px !important;
        line-height: 30px;
        //background-color: #060C26 !important;
        color: #fff;
        //border: 1px solid #387AFD;
      }
      .el-input__suffix {
        .el-input__icon {
          line-height: 30px;
        }
      }
    }
  }
}
.map-controls {
}
</style>
