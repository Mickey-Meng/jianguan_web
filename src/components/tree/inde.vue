<template>
  <div class="wrapper">
    <div class="header">
      <!--      <el-select v-model="projectId">-->
      <!--        <el-option-->
      <!--          v-for="item in projects"-->
      <!--          :key="item.key"-->
      <!--          :value="item.key"-->
      <!--          :label="item.name"-->
      <!--        />-->
      <!--      </el-select>-->
      <!--      <el-button size="mini">导出数据</el-button>-->
    </div>
    <ul class="center">
      <li v-for="(item, index) in lists" :key="index" :class="{ active: item.key === currentKey }"
        @click="changeData(item.key)">
        {{ item.name }}
      </li>
    </ul>
    <div class="main">
      <el-tree ref="tree" :data="treeInfo[currentKey]" accordion class="tree-box" highlight-current node-key="id"
        :default-expanded-keys="[2]" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick">
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <svg-icon class="svg-class" :icon-class="data.child.length > 0 ? 'folder' : 'coverage'" />{{ node.label }}
          </span>
          <svg-icon v-if="data.mouldid" class="svg-class" icon-class="model" />
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
const Cesium = window.Cesium;
let hlm, layer, em, am;
import { getBridgeTree } from "@/api/tree";
import Bus from "@/assets/eventBus";
import { xyToLonlat } from "@/utils/site";
import { getWorkArea } from "@/api/workArea";
import { mapGetters } from "vuex";
import { getProgressWarningTableData, getProjectTypeData, getDictDataByType } from "@/api/progress";

export default {
  name: "",
  data() {
    return {
      currentHlm: null,
      lists: [
        {
          name: "桥梁",
          key: "QL"
        },
        {
          name: "道路1",
          key: "LM"
        },
        {
          name: "隧道",
          key: "SD"
        },
        {
          name: "其他",
          key: "QT"
        }
      ],
      defaultProps: {
        children: "child",
        label: "name"
      },
      treeInfo: {
        SD: [],
        QL: [],
        LM: [],
        QT: []
      },
      projects: [],
      projectId: "",
      currentKey: "QL",
      visualData: [], //形象进度数据
      currentVisualObj: {}
    };
  },
  computed: {
    ...mapGetters(["project"])
  },
  created() {
    this.getDictDataByType()
      .then(() => {
        this.initData(this.lists[0]["key"]);
      })
    Bus.$on("mapSucceed", () => {
      // em = window.zeh.earth.createEntityManager();
      Bus.$off("mapSucceed");
    });
    Bus.$on("clearEffect", () => {
      if (this.currentHlm) {
        // this.stopEffect(this.currentHlm);
      }
      this.currentHlm = null;
      this.currentVisualObj = {};
    });
    Bus.$on("getVisualData", (data) => {
      this.visualData = data;
    });
  },
  methods: {
    changeData(val) {
      this.currentKey = val;
      // lrj 2023-09-02
      // if (val === "QL" || val === "SD" || val === "LM") {
      this.initData(val);
      // }
    },
    getDictDataByType() {
      return new Promise((resolve, reject) => {
        getDictDataByType({ pageNum: 1, pageSize: 999, dictType: "jg_gclx_all" }).then((res) => {
          let data = res.rows || [];
          const array = [];
          data.forEach(item => {
            array.push({ name: item.dictLabel, key: item.dictValue })
          });
          this.lists = array;
          this.currentKey = array[0]["key"];
          console.log(array)
          resolve()
        })
      })
    },
    initData(key) {
      if (this.treeInfo[key] && this.treeInfo[key].length === 0) {
        getBridgeTree(key, this.project.id).then((res) => {
          const arr = [];
          arr.push(res.data);
          this.treeInfo[key] = arr;
        });
      }
    },
    nodeClick(node, data) {
      if (node.conponetcode) {
        Bus.$emit("getProcessById", node);
        Bus.$emit("getComponentProgress", node.id);
        Bus.$emit("toolClearEffect");
      }
      let route = this.$route;
      if (node.mouldid && node.x && node.y) {
        const x = parseFloat(node.x);
        const y = parseFloat(node.y);
        const z = parseFloat(node.z) || 65;
        let mouldid = node.mouldid.replace(/^\s+|\s+$/g, "");
        let showEffetcsName = ["sceneOverview", "PlanToFill", "processFill"];
        if (showEffetcsName.includes(route.name)) {
          if (this.currentHlm && this.currentHlm !== node.mouldid) {
            // this.stopEffect(this.currentHlm);
            // this.showEffect(mouldid);
          } else if (this.currentHlm && this.currentHlm === node.mouldid) {
          } else if (!this.currentHlm) {
            // this.showEffect(mouldid);
          }
          this.currentHlm = mouldid;
        } else if (route.name === "visualProgress") {
          //如果没有上一个有形象进度的构件、直接着色
          var arr = Object.keys(this.currentVisualObj);
          if (arr.length > 0) {
            let { status, layername } = this.currentVisualObj;
            let mid = this.currentVisualObj.mouldid;
            if (mid) {
              mid = mid.replace(/^\s+|\s+$/g, "");
              //清除上一个的着色再着色
              // this.stopEffect(mid);
              // this.showVisualEffect(mid, status, layername);
              //清除现在点击的再着色
              // this.stopEffect(mouldid);
              // this.showEffect(mouldid);
              let obj = this.visualData.find(
                (e) => e.mouldid.replace(/^\s+|\s+$/g, "") === mouldid
              );
              if (obj && obj.layername) {
                this.currentVisualObj = obj;
              }
            }
          } else {
            // this.stopEffect(mouldid);
            // this.showEffect(mouldid);
            let obj = this.visualData.find(
              (e) => e.mouldid.replace(/^\s+|\s+$/g, "") === mouldid
            );
            if (obj && obj.layername) {
              this.currentVisualObj = obj;
            }
          }
        }

        const length = viewer.scene.primitives.length;
        for (let i = 0; i < length; i++) {
          const layer = viewer.scene.primitives.get(i);
          
          let conditions = [];
          if (viewer.styleConditions && viewer.styleConditions[layer.name]) {
            conditions = JSON.parse(JSON.stringify(viewer.styleConditions[layer.name]));
          }
          conditions.unshift(["${name} === '" + mouldid + "'", "rgba(25, 248, 250, 1)"])
          layer.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: conditions
            }
          });
        }

        const lonLat = xyToLonlat([x, y]);
        const lon = lonLat[0] - 0.00045;
        window.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lon, lonLat[1], z),
          orientation: {
            heading: Cesium.Math.toRadians(85),
            pitch: Cesium.Math.toRadians(-10.0),
            roll: Cesium.Math.toRadians(0.0),
          },
        });
      }
    },
    stopEffect(mouldid) {
      let zeh = window.zeh;
      hlm = zeh.earth.getDefaultHighlightManager();
      let layers = zeh.layers.data.allLayers;
      let models = layers.filter((e) => e.type === "C3DTILES");
      if (models && models.length > 0) {
        models.forEach((item) => {
          hlm.stopHighlightByKey(
            item.primitive,
            [mouldid],
            true,
            {
              color: [25, 248, 250, 1],
            },
            "name"
          );
        });
      }
    },
    showEffect(mouldid) {
      let zeh = window.zeh;
      hlm = zeh.earth.getDefaultHighlightManager();
      let layers = zeh.layers.data.allLayers;
      let models = layers.filter((e) => e.type === "C3DTILES");
      if (models && models.length > 0) {
        models.forEach((item) => {
          hlm.showHighlightByKey(
            item.primitive,
            [mouldid],
            true,
            {
              color: [25, 248, 250, 1],
            },
            "name"
          );
        });
      }
    },
    showVisualEffect(id, status, name) {
      let zeh = window.zeh;
      hlm = zeh.earth.getDefaultHighlightManager();
      let layer = zeh.layers.getLayerByName(name);
      let color = [191, 234, 238, 1];
      switch (status) {
        case 0:
          color = [191, 234, 238, 1];
          break;
        case 1:
          color = [233, 188, 50, 1];
          break;
        case 2:
          color = [107, 205, 1, 1];
          break;
        case 3:
          color = [241, 26, 26, 1];
          break;
      }
      hlm.showHighlightByKey(
        layer.primitive,
        [id],
        true,
        {
          color: color,
        },
        "name"
      );
    },
    flyToPoint(node, data) {
      if (data.w9code && data.w10 && data.w10code) {
        window.zeh.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            data.w10code,
            data.w10,
            1000
          ),
          orientation: {
            // heading : Cesium.Math.toRadians(85),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: Cesium.Math.toRadians(0.0),
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  background-color: #ffffffd1;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px;

    ::v-deep .el-select {
      width: 232px;
      text-indent: 0;

      .el-input {
        .el-input__inner {
          height: 35px !important;
          line-height: 35px;
          background-color: rgba(128, 142, 169, .14);
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #2D405E;
          border: none;
        }

        input {
          background: transparent;
        }

        .el-input__suffix {
          .el-input__icon {
            line-height: 35px;
            color: rgba(75, 89, 115, 1);
          }
        }
      }
    }

    .el-button {
      align-items: center;
      background-color: #1E6EEB;
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      font-family: PingFangSC;
      padding: 10px 18px;
      border: none;
    }
  }

  .center {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 29px;

    li {
      width: 64px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      background: url("../../assets/newUi/nav.png") no-repeat;
      background-size: 100% 100%;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #808EA9;
      cursor: pointer;
    }

    .active {
      background: url("../../assets/newUi/nav_active.png") no-repeat;
      background-size: 100% 100%;
      color: #1E6EEB;
    }
  }

  .main {
    height: calc(100% - 135px);
    padding-bottom: 10px;
    box-sizing: border-box;
    // border-top: 1px solid #1E374B;
    // border-bottom: 1px solid #1E374B;
    overflow: scroll;

    ::v-deep .tree-box {
      background-color: #FFFFFF;
      //color: #ffffff;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #4B5973;

      .el-tree-node {
        .el-tree-node__content {
          //background-color: #060c26;

          &:hover {
            //border: 1px solid #1e374b;
            //background-color: #1e374b;
          }
        }
      }

      .is-current {

        //当前选中的节点
        >.el-tree-node__content {
          //border: 1px solid #1e374b;
          //background-color: #1e374b;
        }
      }

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #4B5973;
        padding-right: 8px;
        overflow: hidden;

        .svg-class {
          margin-right: 5px;
        }

        .tree_btn {
          font-size: 12px;
          color: #3995fb;

          +.el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }
}

.open-close {
  position: absolute;
  top: 50%;
  // right: -15px;
  z-index: 100;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  line-height: 50px;
  text-align: center;
  background-color: #060c26;
  transform: translateY(-50%);
  cursor: pointer;
  vertical-align: middle;

  i {
    font-size: 35px;
  }
}
</style>
