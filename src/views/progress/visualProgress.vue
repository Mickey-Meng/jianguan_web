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
  import {getConponentStatus, getQiaoData} from "@/api/progress";
  import {mapGetters} from "vuex";

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
        layer: null
      };
    },
    created() {
      zeh = window.zeh;
      this.initData();
      
      viewer.camera.flyTo({
          destination: {x: -2780681.2160946866, y: 4797331.251368911, z: 3142257.6799062267},
          orientation: {
              direction: {x: -0.4574093661348728, y: -0.2517740912160975, z: -0.8528695555384787},
              up: {x: -0.6853422630555877, y: 0.7109440518049546, z: 0.15768493166120795}
          }
      })
    },
    computed: {
      ...mapGetters(["project"])
    },
    methods: {
      initData() {
        getConponentStatus(this.project.id).then((result) => {
          //0是未开个，2是已完成,1施工，3是延期了
          let arr = [];
          const styleArray = {};
          Bus.$emit("getVisualData", result.data);
          result.data.forEach((item) => {
            let {layername, mouldid, status} = item;
            // if (layername && mouldid) {
            //   if (arr.length > 0) {
            //   let obj = arr.find((e) => e.layername === layername);
            //   if (obj) {
            //     obj.children.push(item);
            //   } else {
            //     arr.push({ layername, children: [item] });
            //   }
            // } else {
            //   arr.push({ layername, children: [item] });
            // }
            if (layername && mouldid) {
              if (!styleArray[layername]) {
                styleArray[layername] = []
              }
              // 0是未开个，2是已完成,1施工，3是延期了
              let color = "rgba(67, 180, 105,1)";
              switch (status) {
                case 0:
                  color = "rgba(191, 234, 238,1)"; //未开工
                  break;
              
                case 1:
                  color = "rgba(233, 188, 50, 1)"; //已开工
                  break;
              
                case 3:
                  color = "rgba(241, 26, 26, 1)"; //延期
                  break;
              
                case 2:
                  color = "rgba(107, 205, 1, 1)"; //完工
                  break;
              
                default:
                  break;
              }
              styleArray[layername].push(["${name} === '" + mouldid + "'", color])
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
        this.styleConditions = styleArray;
        viewer.styleConditions = styleArray;
        console.log(styleArray)
        this.showLight(arr);
      });
    },
    showLight(arr) {
      // if (arr && arr.length > 0) {
      //   hlm = zeh.earth.getDefaultHighlightManager();
      //   arr.forEach((item) => {
      //     let { layername, children } = item;
      //     let layer = zeh.layers.getLayerByName(layername);
      //     let planId = [];
      //     let workId = [];
      //     let postponeId = [];
      //     let finishId = [];
      //     if (children) {
      //       children.forEach((e) => {
      //         let { mouldid, status } = e;
      //         let str = mouldid.replace(/^\s*|\s*$/g, "");
      //         switch (status) {
      //           case 0:
      //             planId.push(str);
      //             break;
      //           case 2:
      //             finishId.push(str);
      //             break;
      //           case 3:
      //             postponeId.push(str);
      //             break;
      //           case 1:
      //             workId.push(str);
      //             break;
      //         }
      //       });
      //     }
      //     hlm.showHighlightByKey(
      //       layer.primitive,
      //       planId,
      //       true,
      //       {
      //         color: [191, 234, 238, 1], //未开工
      //       },
      //       "name"
      //     );
      //     hlm.showHighlightByKey(
      //       layer.primitive,
      //       workId,
      //       true,
      //       {
      //         color: [233, 188, 50, 1], //已开工
      //       },
      //       "name"
      //     );
      //     hlm.showHighlightByKey(
      //       layer.primitive,
      //       postponeId,
      //       true,
      //       {
      //         color: [241, 26, 26, 1], //延期
      //       },
      //       "name"
      //     );
      //     hlm.showHighlightByKey(
      //       layer.primitive,
      //       finishId,
      //       true,
      //       {
      //         color: [107, 205, 1, 1], //完工
      //       },
      //       "name"
      //     );
      //   });
      // }
      const styleConditions = this.styleConditions;
      Object.keys(styleConditions).forEach(key => {
        const layer = viewer.getLayerByName(key);
        if (layer) {
          const conditions = styleConditions[key];
          conditions.push(['true', 'rgba(255,255,255,1)']);
          layer.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: conditions
            }
          });
        }
      })
    },
    clearAllHighlight() {
      const styleConditions = this.styleConditions;
      Object.keys(styleConditions).forEach(key => {
        const layer = viewer.getLayerByName(key);
        if (layer) {
          layer.style = undefined
        }
      })
      viewer.styleConditions = undefined
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
    // if (hlm) {
    //   hlm.clearAllHighlight();
    // }
    this.clearAllHighlight()
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
