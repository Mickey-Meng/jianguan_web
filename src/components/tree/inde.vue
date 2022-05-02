<template>
  <div class="wrapper">
    <div class="header">
      <el-select v-model="projectId">
        <el-option
          v-for="item in projects"
          :key="item.key"
          :value="item.key"
          :label="item.name"
        />
      </el-select>
      <el-button size="mini">导出数据</el-button>
    </div>
    <ul class="center">
      <li
        v-for="(item, index) in lists"
        :key="index"
        :class="{ active: item.key === currentKey }"
        @click="changeData(item.key)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div class="main">
      <el-tree
        ref="tree"
        :data="nodes"
        accordion
        class="tree-box"
        highlight-current
        node-key="id"
        :default-expanded-keys="[2]"
        :expand-on-click-node="true"
        :props="defaultProps"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <svg-icon
              class="svg-class"
              :icon-class="data.child.length > 0 ? 'folder' : 'coverage'"
            />{{ node.label }}
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

export default {
  name: "",
  data() {
    return {
      currentHlm: null,
      lists: [
        {
          name: "桥梁",
          key: "QL",
        },
        {
          name: "道路",
          key: "LM",
        },
        {
          name: "隧道",
          key: "SD",
        },
        {
          name: "其他",
          key: "QT",
        },
      ],
      defaultProps: {
        children: "child",
        label: "name",
      },
      nodes: [],
      treeData: [],
      qlTree: [],
      dlTree: [],
      sdTree: [],
      otTree: [],
      projects: [],
      projectId: "",
      currentKey: "QL",
      visualData: [], //形象进度数据
      currentVisualObj: {},
    };
  },
  created() {
    this.initData("QL");
    Bus.$on("mapSucceed", () => {
      em = window.zeh.earth.createEntityManager();
      Bus.$off("mapSucceed");
    });
    Bus.$on("clearEffect", () => {
      if (this.currentHlm) {
        this.stopEffect(this.currentHlm);
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
      if (val === "QL" || val === "SD" || val === "LM") {
        this.initData(val);
      } else {
        this.nodes = [];
      }
    },
    initData(key) {
      getBridgeTree(key).then((res) => {
        const arr = [];
        arr.push(res.data);
        this.nodes = arr;
        this.treeData = arr;
      });
    },
    nodeClick(node, data) {
      if (node.conponetcode) {
        Bus.$emit("getProcessById", node);
        Bus.$emit("getComponentProgress", node.id);
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
            this.stopEffect(this.currentHlm);
            this.showEffect(mouldid);
          } else if (this.currentHlm && this.currentHlm === node.mouldid) {
          } else if (!this.currentHlm) {
            this.showEffect(mouldid);
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
              this.stopEffect(mid);
              this.showVisualEffect(mid, status, layername);
              //清除现在点击的再着色
              this.stopEffect(mouldid);
              this.showEffect(mouldid);
              let obj = this.visualData.find(
                (e) => e.mouldid.replace(/^\s+|\s+$/g, "") === mouldid
              );
              if (obj && obj.layername) {
                this.currentVisualObj = obj;
              }
            }
          } else {
            this.stopEffect(mouldid);
            this.showEffect(mouldid);
            let obj = this.visualData.find(
              (e) => e.mouldid.replace(/^\s+|\s+$/g, "") === mouldid
            );
            if (obj && obj.layername) {
              this.currentVisualObj = obj;
            }
          }
        }

        const lonLat = xyToLonlat([x, y]);
        const lon = lonLat[0] - 0.00045;
        window.zeh.viewer.camera.flyTo({
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
      console.log(layer, "layer");
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
      console.log(layer, id, color);
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
  background-image: url(../../assets/image/三维场景背景.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px;
    // height: 70px;
    ::v-deep .el-select {
      // width: 210px;
      text-indent: 0;
      //height: 35px !important;
      .el-input {
        .el-input__inner {
          height: 28px !important;
          line-height: 28px;
          // background-color: #060C26 !important;
          background-image: url(../../assets/image/日期选择.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          color: #fff;
          border: none;
        }
        input {
          background: transparent;
        }
        .el-input__suffix {
          .el-input__icon {
            line-height: 28px;
            color: #7ceff6;
          }
        }
      }
    }
    .el-button {
      height: 28px;
      align-items: center;
      background-image: url(../../assets/image/导出.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 500;
      color: #eaeefb;
      border: none;
      // padding: 10px 20px;
    }
  }
  .center {
    // height: 70px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
    li {
      width: 20%;
      height: 24px;
      text-align: center;
      line-height: 24px;
      // flex: 1;
      font-size: 18px;
      cursor: pointer;
      background-image: url(../../assets/image/tab.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.8;
    }

    .active {
      color: rgb(249, 182, 51);
      // border-bottom: 2px solid rgb(249, 182, 51);
      background-image: url(../../assets/image/tab-bg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .main {
    height: calc(100% - 140px);
    padding-bottom: 10px;
    box-sizing: border-box;
    // border-top: 1px solid #1E374B;
    // border-bottom: 1px solid #1E374B;
    overflow: scroll;
    ::v-deep .tree-box {
      background-color: transparent;
      color: #ffffff;

      .el-tree-node {
        .el-tree-node__content {
          background-color: #060c26;

          &:hover {
            border: 1px solid #1e374b;
            background-color: #1e374b;
          }
        }
      }

      .is-current {
        //当前选中的节点
        > .el-tree-node__content {
          border: 1px solid #1e374b;
          background-color: #1e374b;
        }
      }

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        padding-right: 8px;
        overflow: auto;
        .svg-class {
          margin-right: 5px;
        }

        .tree_btn {
          font-size: 12px;
          color: #3995fb;

          + .el-button {
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
