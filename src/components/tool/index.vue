<template>
  <div class="tool_container">
    <ul class="wrapper">
      <!-- <li @click="controlLayer">{{ showLayer ? "收起图层" : "展开图层" }}</li> -->
      <li @click="startAttrQuery" :class="{ is_active_attr: attributeQuery }">
        {{ attributeQuery ? "取消查询" : "属性查询" }}
      </li>
      <li @click="showTransparent = true">地形透明</li>
      <!-- <li>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            快速编辑<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>编码编辑</el-dropdown-item>
            <el-dropdown-item>重量编辑</el-dropdown-item>
            <el-dropdown-item>取消编辑</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li> -->
      <li>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            标注管理<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="drawPoint"
              >点标注</el-dropdown-item
            >
            <el-dropdown-item @click.native="drawPolyline"
              >线标注</el-dropdown-item
            >
            <el-dropdown-item @click.native="drawPolygon"
              >面标注</el-dropdown-item
            >
            <el-dropdown-item>标注列表</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <el-dropdown trigger="click" :hide-on-click="false">
          <span class="el-dropdown-link">
            红线注记<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-checkbox v-model="redline" @change="redlineChange"
                >红线</el-checkbox
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox v-model="intersection">路口</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox v-model="abutment">墩号</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox v-model="mileage" @change="mileageChange"
                >里程</el-checkbox
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox v-model="bestMileage" @change="bestMileageChange"
                >整百里程</el-checkbox
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            三维工具<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>
              <el-checkbox v-model="space">空间量算</el-checkbox>
            </el-dropdown-item> -->
            <el-dropdown-item @click.native="pickPosition">
              拾取位置
            </el-dropdown-item>
            <el-dropdown-item @click.native="exportImage">
              <!-- <span style="margin-left: 25px">高清出图</span> -->
              高清出图
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            空间量测<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="levelStart"
              >水平量测</el-dropdown-item
            >
            <el-dropdown-item @click.native="verticalStart"
              >垂直量测</el-dropdown-item
            >
            <el-dropdown-item @click.native="areaStart"
              >面积量测</el-dropdown-item
            >
            <el-dropdown-item @click.native="slopeStart"
              >斜率量测</el-dropdown-item
            >
            <el-dropdown-item @click.native="clearMeasure"
              >清除结果</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            空间分析<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showExcavation"
              >开挖分析</el-dropdown-item
            >
            <el-dropdown-item @click.native="showTailor"
              >裁剪分析</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <div v-show="false && showLayer" class="layer-manager" id="layer-manager">
      <div class="header" id="layer-manager-header">图层列表</div>
      <div class="tree">
        <el-tree
          ref="tree"
          :data="mapData"
          :default-checked-keys="treeDefaults"
          class="tree-box"
          highlight-current
          node-key="id"
          show-checkbox
          :default-expanded-keys="[2]"
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="nodeClick"
          @check-change="checkNode"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>
              <svg-icon
                class="svg-class"
                :icon-class="data.children.length > 0 ? 'folder' : 'coverage'"
              />{{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="position_info" v-if="lon">
      <el-descriptions title="位置信息" :column="3" border>
        <template slot="extra">
          <i class="el-icon-close" @click="closePosition"></i>
        </template>
        <el-descriptions-item
          label="经度"
          label-class-name="my-label"
          content-class-name="my-content"
          >{{ lon }}</el-descriptions-item
        >
        <el-descriptions-item
          label="纬度"
          label-class-name="my-label"
          content-class-name="my-content"
          >{{ lat }}</el-descriptions-item
        >
        <el-descriptions-item
          label="高度"
          label-class-name="my-label"
          content-class-name="my-content"
          >{{ height }}</el-descriptions-item
        >
      </el-descriptions>
    </div>
    <div class="excavation_box" v-if="exShow">
      <div class="ex_header">
        <label>开挖分析</label>
        <i class="el-icon-close" @click="closeEx"></i>
      </div>
      <div class="ex_content">
        <label>开挖深度：</label>
        <el-slider v-model="exvalue" show-input> </el-slider>
      </div>
      <div class="ex_footer">
        <span class="span_btn" @click="drawEx">绘制开挖面</span>
        <span class="span_btn" @click="clearEx">清除</span>
      </div>
    </div>
    <!-- <div class="map-controls">
      <el-table :data="tableData" style="width: 100%" :show-header="false">
        <el-table-column prop="name" width="80" />
        <el-table-column>
          <template slot-scope="{ row }">
            <el-slider
              v-if="row.type === 1"
              v-model="value1"
              :show-tooltip="false"
              @change="modelChange"
            />
            <el-slider
              v-if="row.type === 2"
              v-model="value2"
              :show-tooltip="false"
            />
            <div v-if="row.type === 3">
              <el-radio v-model="drawing" label="1">打开</el-radio>
              <el-radio v-model="drawing" label="2">关闭</el-radio>
            </div>
            <div v-if="row.type === 4">
              <el-radio v-model="label" label="1">打开</el-radio>
              <el-radio v-model="label" label="2">关闭</el-radio>
            </div>
            <div v-if="row.type === 5">
              <el-radio v-model="mileageM" label="1">打开</el-radio>
              <el-radio v-model="mileageM" label="2">关闭</el-radio>
            </div>
            <div v-if="row.type === 6">
              <el-radio v-model="pipelineModel" label="1">打开</el-radio>
              <el-radio v-model="pipelineModel" label="2">关闭</el-radio>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div> -->
    <div v-if="showDialog" class="property_box">
      <div class="property_header">
        <label>属性信息</label>
        <i class="el-icon-close" @click="showDialog = false" />
      </div>
      <el-form ref="form" :model="form" label-width="80px" class="form_panel">
        <el-form-item label="名称">
          <el-input v-model="form.label" />
        </el-form-item>
        <el-form-item label="类型">
          <span>{{ form.type }}</span>
        </el-form-item>
        <el-form-item v-if="currentType === 'point'" label="像素">
          <el-input-number
            v-model="form.pixel"
            controls-position="right"
            :min="12"
            :max="30"
          />
        </el-form-item>
        <el-form-item label="颜色" class="color_box">
          <el-input v-model="form.color" />
          <el-color-picker v-model="form.color" />
        </el-form-item>
        <el-form-item v-if="currentType === 'polyline'" label="线宽">
          <el-input-number
            v-model="form.lineWidth"
            controls-position="right"
            :min="3"
            :max="10"
          />
        </el-form-item>
        <el-form-item
          v-if="currentType !== 'polygon'"
          label="是否贴地"
          class="defineSwitch"
        >
          <el-switch
            v-model="form.stick"
            :width="50"
            active-color="#13ce66"
            inactive-color="#e5e5e5"
          />
        </el-form-item>
      </el-form>
      <div class="btn_box">
        <el-button type="primary" icon="el-icon-success" @click="createEntity"
          >确定</el-button
        >
        <el-button type="primary" icon="el-icon-error" @click="cancelCreate"
          >取消</el-button
        >
      </div>
    </div>
    <div
      class="transparent_wrapper"
      v-show="showTransparent"
      id="transparent_wrapper"
    >
      <div class="transparent_wrapper_header" id="transparent_wrapper_header">
        <label>地形透明</label>
        <i class="el-icon-close" @click="closeTransparent"></i>
      </div>
      <div class="content">
        <el-slider
          v-model="transparentValue"
          @change="modelChange"
          :show-tooltip="false"
        />
      </div>
    </div>
    <div
      class="component_info"
      id="component_info"
      v-show="componentProgressInfo.baseInfo.length > 0"
    >
      <div class="component_info_header" id="component_info_header">
        <label>构件信息</label>
        <i class="el-icon-close" @click="closeComponentInfo"></i>
      </div>
      <div class="component_in_content">
        <div class="title">基础信息</div>
        <div class="base_info">
          <el-table
            :data="componentProgressInfo.baseInfo"
            :show-header="false"
            border=""
            class="s_table"
          >
            <el-table-column prop="title" width="120px"> </el-table-column>
            <el-table-column prop="value" />
          </el-table>
        </div>
        <div class="title">进度信息</div>
        <div class="time_info">
          <el-table
            :data="componentProgressInfo.planTime"
            :show-header="false"
            border=""
            class="s_table"
          >
            <el-table-column prop="title" width="120px"> </el-table-column>
            <el-table-column prop="value" />
          </el-table>
        </div>
        <div class="title">工序信息</div>
        <div class="progress_info">
          <el-table
            :data="componentProgressInfo.progress"
            :show-header="false"
            border=""
            class="s_table"
            v-if="componentProgressInfo.progress.length > 0"
          >
            <el-table-column prop="name" width="120px"> </el-table-column>
            <el-table-column prop="stime" />
            <el-table-column width="40px">
              <template slot-scope="{ row }">
                <svg-icon
                  icon-class="teyes"
                  @click="seeRecord(row)"
                  v-if="row.recodeid"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div ref="viewer" v-viewer="{ movable: false }" style="display: none">
      <template v-for="src in showPic">
        <img v-if="src" :src="src" :key="src" />
      </template>
    </div>
    <el-drawer
      title="我是标题"
      :visible.sync="DrawerVisible"
      :with-header="false"
      custom-class="drawer-bottom-panel"
      append-to-body
      size="50%"
      :wrapperClosable="false"
      direction="btt"
    >
      <el-container>
        <el-header>
          <div class="link-info">
            类型：
            <span>{{ componentInfo ? componentInfo.pname : "" }}</span>
            编码：
            <span>{{ componentInfo ? componentInfo.conponetcode : "" }}</span>
            工序名称：
            <span>{{ processData ? processData.name : "" }}</span>
          </div>
          <i class="el-icon-close" @click="DrawerVisible = false"></i>
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="processRecordData"
                style="width: 100%"
                border
                height="100%"
              >
                <el-table-column
                  prop="process"
                  label="流程"
                  align="center"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="执行人员"
                  align="center"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="time"
                  width="180"
                  align="center"
                  label="执行时间"
                >
                </el-table-column>
                <el-table-column align="center" label="举牌照片">
                  <template slot-scope="{ row }">
                    <div class="image-box">
                      <div v-for="(item, index) in row.image" :key="index">
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div @click="downloadImage(item)">下载</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="附件">
                  <template slot-scope="{ row }">
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="row.pdf"
                      @click="seePdf(row)"
                      >预览附件</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-drawer>
  </div>
</template>

<script>
const Cesium = window.Cesium;
import Bus from "@/assets/eventBus";
import redline_line from "@/config/redline_line.json"; //红线
import stake_mark from "@/config/stake_mark.json"; //里程数据
import mileage from "@/config/mileage.json"; //整百里程
import { mercator2lonlat } from "@/utils/WebMercator2lonLat";
import { moveDiv } from "@/utils/move";
import { getComponentProgressByModel } from "@/api/progress";
import { getCurrentPdf } from "@/api/quality";
import { getNowDate, formatDate } from "@/utils/date";
import { validPicurl, disposeUrl } from "@/utils/validate";
import { downLoadFile } from "@/utils/download";

let mileageEm,
  bestMileageEm,
  em,
  dm,
  zeh,
  terrain,
  drawTool,
  linePrimitive,
  shlm,
  cth;
//cth地形开挖
//linePrimitive为红线
//dm 点线面标注集合
//terrain地形
//mileageEm 里程
//bestMileageEm 整百里程

//获取图层树
// let zeh;
const allId = [];
let checkedId = [];
const layerIdData = [];
const getTreeData = (nodes) => {
  if (!nodes) {
    return [];
  }
  const na = [];
  for (let ni of nodes) {
    const { id, name, checked, children, layerId } = ni;
    const n = { id, name, checked, layerId };
    if (layerId) layerIdData.push(layerId);
    if (children) {
      n.children = getTreeData(children);
    } else {
      allId.push(id);
      if (checked) checkedId.push(id);
      n.children = [];
    }
    na.push(n);
  }
  return na;
};
export default {
  name: "",
  data() {
    return {
      currentComponentId: null,
      showLayer: true, //
      attributeQuery: false,
      redline: false, // 红线
      intersection: false, // 路口
      abutment: false, // 墩号
      mileage: false, // 里程
      bestMileage: false, // 整百里程
      space: false, // 空间量算
      site: false, // 拾取位置
      mileageData: [], // 里程数据
      bestMileageData: [], // 整百里程数据,
      mileageEntities: [],
      // 左下控制
      drawing: "2", // 设计图纸
      label: "2", // 路口标注
      pipelineModel: "2", // 管线模型
      mileageM: "2",
      value1: 100,
      value2: null,
      zjLayer: null,
      defaultProps: {
        children: "children",
        label: "name",
      },
      mapData: [],
      mapTreeData: [],
      treeDefaults: [],
      componentProgressInfo: {
        baseInfo: [],
        planTime: [],
        progress: [],
      },
      tableData: [
        {
          name: "地形透明",
          type: 1,
        },
        {
          name: "水面透明",
          type: 2,
        },
        {
          name: "设计图纸",
          type: 3,
        },
        {
          name: "路口标注",
          type: 4,
        },
        {
          name: "整百里程",
          type: 5,
        },
        {
          name: "管线模型",
          type: 6,
        },
      ],
      nodes: [],
      showDialog: false,
      currentType: null,
      currentPositions: null,
      currentDegrees: null,
      form: {
        label: "",
        type: "",
        pixel: null,
        lineWidth: null,
        color: "",
        stick: true,
      },
      //经纬度高程
      lat: null,
      lon: null,
      height: null,
      exvalue: 30, //开挖深度
      exShow: false, //开完参数面板显示控制
      showTransparent: false,
      transparentValue: 100, //地形透明
      showPic: [],
      processData: {},
      componentInfo: {},
      processRecordData: [],
      DrawerVisible: false,
    };
  },
  created() {
    zeh = window.zeh;
    // am = zeh.earth.createEntityManager();
    // bm = zeh.earth.createEntityManager();
    // em = zeh.earth.createEntityManager();
    // dm = zeh.earth.createEntityManager();
    // drawTool = zeh.drawTool;

    // zeh.viewer.scene.postRender.addEventListener(this.mapChange);
    // terrain = zeh.layers.getLayerByName("诸暨地形");
    // this.initData();
    Bus.$on("getComponentProgress", (id) => {
      let route = this.$route;
      if (route.name === "sceneOverview") {
        this.getComponentData({ id });
      }
    });
    Bus.$on("toolClearEffect", () => {
      if (this.currentComponentId) {
        this.stopEffect(this.currentComponentId);
        this.currentComponentId = null;
      }
    });
  },
  mounted() {
    moveDiv("layer-manager", "layer-manager-header");
    moveDiv("component_info", "component_info_header");
  },
  methods: {
    controlLayer() {
      this.showLayer = !this.showLayer;
    },
    mapChange() {
      const height = zeh.viewer.camera.positionCartographic.height;
      if (this.mileageEntities.length > 0) {
        if (height >= 70 && height <= 800) {
          this.mileageEntities.forEach((item) => {
            item.show = true;
          });
        } else {
          this.mileageEntities.forEach((item) => {
            item.show = false;
          });
        }
      }
    },
    initData() {
      //转换红线坐标
      redline_line.features.forEach((item) => {
        if (
          item.geometry.type === "LineString" &&
          item.geometry.coordinates.length > 0
        ) {
          item.Cartesian3 = item.geometry.coordinates.map((result) => {
            return Cesium.Cartesian3.fromDegrees(result[0], result[1], 80);
          });
        }
      });
      //转换里程坐标
      this.mileageData = stake_mark.features.filter((item) => {
        item.Cartesian3 = Cesium.Cartesian3.fromDegrees(
          item.geometry.coordinates[0],
          item.geometry.coordinates[1],
          85
        );
        return item.properties.LB === "1";
      });
      //整百里程
      this.bestMileageData = mileage.data.map((item) => {
        const site = mercator2lonlat(item);
        const Cartesian3 = Cesium.Cartesian3.fromDegrees(site.x, site.y, 80);
        const obj = {
          Cartesian3: Cartesian3,
          name: item.name,
        };
        return obj;
      });
      //初始化红线
      this.initRedLine();
      //初始化里程
      this.initMileage();
      //初始化整百里程
      this.initBestMileage();

      this.zjLayer = zeh.layers.getLayerByName("诸暨地形");
      //图层控件数据处理
      let layers = zeh.layers.getLayerTree();
      this.mapData = getTreeData(layers);
      this.treeDefaults = checkedId;
    },
    initRedLine() {
      let instances = redline_line.features.map((item) => {
        return new Cesium.GeometryInstance({
          geometry: new Cesium.GroundPolylineGeometry({
            positions: item.Cartesian3,
            width: 2,
          }),
          // attributes: {
          //   color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          //     Cesium.Color.fromCssColorString("green").withAlpha(0.7)
          //   ),
          // },
        });
      });
      linePrimitive = new Cesium.GroundPolylinePrimitive({
        show: false,
        geometryInstances: instances,
        appearance: new Cesium.PolylineMaterialAppearance({
          closed: true,
          material: new Cesium.Material({
            fabric: {
              type: "Color",
              uniforms: {
                color: Cesium.Color.RED,
              },
            },
          }),
        }),
      });
      zeh.viewer.scene.groundPrimitives.add(linePrimitive);
    },
    initBestMileage() {
      bestMileageEm = zeh.earth.createMarkerManager({ clusterType: "dilute" });
      bestMileageEm.beginCluster();
      bestMileageEm.visible = false;
      this.bestMileageData.forEach((item) => {
        bestMileageEm.add({
          position: item.Cartesian3,
          text: item.name,
          textOffset: [0, -40],
          textVisibleRange: [10, 35000],
          textBackground: true, // 可选，默认值: true
          handleLineColor: [255, 255, 0, 255],
          // edata: info ? info : null,
          onClick: function (id, info) {},
        });
      });
    },
    initMileage() {
      mileageEm = zeh.earth.createMarkerManager({ clusterType: "dilute" });
      mileageEm.beginCluster();
      mileageEm.visible = false;
      this.mileageData.forEach((item) => {
        mileageEm.add({
          position: item.Cartesian3,
          text: item.properties.name,
          textOffset: [0, -40],
          textVisibleRange: [10, 35000],
          textBackground: true, // 可选，默认值: true
          handleLineColor: [255, 255, 0, 255],
          // edata: info ? info : null,
          onClick: function (id, info) {},
        });
      });
    },
    redlineChange(val) {
      if (val) {
        linePrimitive.show = true;
      } else {
        linePrimitive.show = false;
      }
    },
    mileageChange(val) {
      if (val) {
        mileageEm.visible = true;
      } else {
        mileageEm.visible = false;
      }
    },
    bestMileageChange(val) {
      if (val) {
        bestMileageEm.visible = true;
      } else {
        bestMileageEm.visible = false;
      }
    },
    nodeClick(row) {
      if (row.layerId) {
        let hlm = zeh.earth.getDefaultLayerManager();
        hlm.viewLayerById(row.layerId);
      }
    },
    checkNode(node, select) {
      if (node.layerId && select) {
        zeh.layers.setLayerVisibleById(node.layerId, true);
      } else if (node.layerId && !select) {
        zeh.layers.setLayerVisibleById(node.layerId, false);
      }
    },
    modelChange(value) {
      // zeh.earth.setTerrainOpacity(value / 100);
      this.setTerrainOpacity(value / 100)
    },
    setTerrainOpacity(value) {
      // window.viewer.globe.translucency.enabled = viewModel.translucencyEnabled;
      window.viewer.scene.globe.translucency.enabled = true;
      window.viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = value;
      window.viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = value;
    },
    // 测算
    levelStart() {
      zeh.measureTool.measureHDistance(() => {});
    },
    verticalStart() {
      zeh.measureTool.measureVDistance(() => {});
    },
    areaStart() {
      zeh.measureTool.measureArea(() => {});
    },
    slopeStart() {
      zeh.measureTool.measureHvDistance(null, {
        style: { polyline: { clampToGround: false } },
      });
    },
    clearMeasure() {
      zeh.measureTool.clear();
    },
    // 点线面标注
    drawPoint() {
      this.currentType = "point";
      drawTool.drawPoint((res) => {
        drawTool.clear();
        this.form = {
          label: "点",
          type: "点",
          pixel: 14,
          lineWidth: null,
          color: "#b2ffc0",
          stick: true,
        };
        this.currentPositions = res.positions;
        this.showDialog = true;
      });
    },
    drawPolyline() {
      this.currentType = "polyline";
      drawTool.drawPolyline((res) => {
        drawTool.clear();
        this.form = {
          label: "线",
          type: "线",
          pixel: 14,
          lineWidth: 3,
          color: "#ffff00",
          stick: true,
        };
        this.currentPositions = res.positions;
        this.showDialog = true;
      });
    },
    drawPolygon() {
      this.currentType = "polygon";
      drawTool.drawPolygon(
        (res) => {
          drawTool.clear();
          this.form = {
            label: "面",
            type: "面",
            pixel: 14,
            lineWidth: 3,
            color: "#3388ff",
            stick: true,
          };
          this.currentPositions = res.positions;
          this.showDialog = true;
        },
        { toDegree: true, style: { clampToGround: false } }
      );
    },
    createEntity() {
      let fillColor = Cesium.Color.RED;
      if (this.form.color) {
        fillColor = Cesium.Color.fromCssColorString(this.form.color).withAlpha(
          1
        );
      }
      const obj = Object.assign({}, this.form);
      // const guid = getGUID()
      if (this.currentType === "point") {
        dm.add({
          position: this.currentPositions,
          // id: guid,
          point: {
            pixelSize: obj.pixel,
            color: fillColor,
            outlineColor: Cesium.Color.WHITE,
            heightReference: Cesium.HeightReference.NONE,
            outlineWidth: 2,
            clampToGround: true,
          },
          label: {
            text: obj.label || "点",
            font: `14 pt monospace`,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          },
        });
        this.showDialog = false;
      } else if (this.currentType === "polyline") {
        dm.add({
          // id: guid,
          polyline: {
            positions: this.currentPositions,
            width: this.form.lineWidth || 2,
            clampToGround: this.form.stick,
            material: fillColor,
          },
        });
        this.showDialog = false;
      } else if (this.currentType === "polygon") {
        dm.add({
          // id: guid,
          polygon: {
            hierarchy: {
              positions: this.currentPositions,
            },
            material: fillColor,
          },
        });
        this.showDialog = false;
      }
    },
    cancelCreate() {
      this.form = {
        label: "",
        type: "",
        pixel: null,
        lineWidth: null,
        color: "",
        stick: true,
      };
      this.showDialog = false;
    },
    //出图
    exportImage() {
      var filename = "高清地图.png";
      var data = zeh.earth.screenShot();
      var alink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      alink.href = data;
      alink.download = filename;
      var event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      alink.dispatchEvent(event);
    },
    //拾取位置
    pickPosition() {
      let that = this;
      zeh.beginPickPosition(function (res) {
        let { height, latitude, longitude } = res;
        that.lat = latitude.toFixed(6);
        that.lon = longitude.toFixed(6);
        that.height = height.toFixed(6);
      });
    },
    //关闭拾取动作 隐藏面板
    closePosition() {
      this.lon = null;
      this.lat = null;
      this.height = null;
      zeh.exitPickPosition();
    },
    //开挖参数面板
    showExcavation() {
      this.exShow = true;
    },
    //关闭开挖
    closeEx() {
      this.clearEx();
      this.exShow = false;
    },
    //开挖
    drawEx() {
      zeh.exitPickPosition();
      let that = this;
      zeh.drawTool.stop();
      zeh.drawTool.clear();
      zeh.drawTool.drawPolygon(({ positions }) => {
        zeh.drawTool.clear();
        let at = zeh.earth.getDefaultAnalysisTool();
        let sideMaterial = new Cesium.ImageMaterialProperty({
          image: "./image/excavationregion_top.jpg",
        });
        let bottomMaterial = new Cesium.ImageMaterialProperty({
          image: "./image/excavationregion_side.jpg",
        });

        cth = at.clipTerrain(positions, that.exvalue, {
          sideMaterial: sideMaterial,
          bottomMaterial: bottomMaterial,
        });
      });
    },
    //清除开挖数据
    clearEx() {
      zeh.drawTool && zeh.drawTool.clear();
      cth && cth.destroy();
      cth = null;
    },
    stopEvent() {
      //地图交互之前关掉其他交互
      drawTool && drawTool.stop();
      zeh && zeh.exitPickPosition();
    },
    //关闭地形透明
    closeTransparent() {
      this.showTransparent = false;
      // zeh.earth.setTerrainOpacity(1);
      this.setTerrainOpacity(1);
      window.viewer.scene.globe.translucency.enabled = false;
      this.transparentValue = 100;
    },
    //裁剪参数设置
    showTailor() {},
    //属性查询
    startAttrQuery() {
      //清除构件树点击渲染的着色
      this.stopEvent();
      if (this.attributeQuery) {
        this.attributeQuery = false;
        zeh.endPick();
        this.stopEffect(this.currentComponentId);
        this.currentComponentId = null;
      } else {
        this.attributeQuery = true;
        zeh.beginPickInfo((a, b, c) => {
          let obj = a.find((e) => e.key === "name");
          if (obj) {
            let myReg = /^[^\u4e00-\u9fa5]+$/;
            let id = obj.value.replace(/^\s+|\s+$/g, "");
            if (myReg.test(id)) {
              this.getComponentData({ mouldid: id });
              Bus.$emit("clearEffect");
              if (this.currentComponentId) {
                this.stopEffect(this.currentComponentId);
              }
              this.showEffect(id);
              this.currentComponentId = id;
            } else {
              this.$message({
                message: "构件ID不符合规则",
                type: "warning",
                customClass: "message_override",
              });
            }
          }
        });
      }
    },
    stopEffect(mouldid) {
      // let zeh = window.zeh;
      shlm = zeh.earth.getDefaultHighlightManager();
      let layers = zeh.layers.data.allLayers;
      let models = layers.filter((e) => e.type === "C3DTILES");
      if (models && models.length > 0) {
        models.forEach((item) => {
          shlm.stopHighlightByKey(
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
      // let zeh = window.zeh;

      shlm = zeh.earth.getDefaultHighlightManager();
      let layers = zeh.layers.data.allLayers;
      let models = layers.filter((e) => e.type === "C3DTILES");
      if (models && models.length > 0) {
        models.forEach((item) => {
          shlm.showHighlightByKey(
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
    getComponentData(obj) {
      //渲染数据
      getComponentProgressByModel(obj).then((res) => {
        let { conponent, produceandrecodes, progressDetails, produces } =
          res.data;
        let { conponentcode, pname, conponenttypename, mouldid } = conponent;
        let {
          planStartTime,
          planEndTime,
          actualStartTime,
          actualEndTime,
          status,
        } = progressDetails;
        let planTimeArr = [
          {
            title: "计划开始",
            value: planStartTime,
          },
          {
            title: "计划结束",
            value: planEndTime,
          },
          {
            title: "实际开始",
            value: actualStartTime,
          },
          {
            title: "实际结束",
            value: actualEndTime,
          },
          {
            title: "施工状态",
            value:
              status === 2
                ? "完工"
                : status === 0
                ? "未开工"
                : status === 1
                ? "施工中"
                : "延期",
          },
        ];
        let base = [
          {
            title: "构件类型",
            value: conponenttypename,
          },
          {
            title: "构件编码",
            value: mouldid,
          },
        ];
        let proArr = produces.map((item) => {
          let d = produceandrecodes.find((e) => e.produceid === item.id);
          if (d) {
            item.recodeid = d.recodeid;
            item.stime = d.stime;
          }
          return item;
        });
        this.componentProgressInfo = {
          planTime: planTimeArr,
          baseInfo: base,
          progress: proArr,
        };
      });
    },
    closeComponentInfo() {
      this.componentProgressInfo = {
        planTime: [],
        baseInfo: [],
        progress: [],
      };
    },
    //seeRecord
    seeRecord(row) {
      getCurrentPdf(row.recodeid).then((res) => {
        this.processRecordData = [];
        let data = res.data;
        let { recode, produceandrecode } = data;
        this.processData = produceandrecode;
        let { accrecodeurl, remark, testurl, standbyrecode } = recode;
        let { updateusername, checkusername, stime, updatetime, checkresult } =
          produceandrecode;
        let uploadUrl = validPicurl(accrecodeurl);
        let uploadPdf = remark ? this.recodeUrl + remark : "";
        let checkUrl = validPicurl(testurl);
        let checkPdf = standbyrecode ? this.recodeUrl + standbyrecode : "";
        let arr = [
          {
            process: "工序填报",
            name: updateusername,
            image: uploadUrl,
            pdf: uploadPdf,
            time: formatDate(stime),
          },
          {
            process: "工序审核",
            name: checkusername,
            image: checkresult === 1 ? checkUrl : "",
            pdf: checkresult === 1 ? checkPdf : "",
            time: checkresult === 1 ? formatDate(updatetime) : "",
          },
        ];
        this.processRecordData = arr;
        this.DrawerVisible = true;
      });
    },
    seePicDetail(row) {
      this.showPic = [];
      this.showPic.push(row);
      this.$refs.viewer.$viewer.show();
    },
    downloadImage(item) {
      let str = item.split("=")[1];
      downLoadFile(str);
    },
    seePdf(row) {
      this.recode = row;
      this.dialogPdfVisible = true;
    },
  },
  destroyed() {
    Bus.$off("getComponentProgress");
    Bus.$off("toolClearEffect");
  },
};
</script>

<style scoped lang="scss">
::v-deep .s_table {
  background-color: rgba(38, 38, 38, 0.5);
  overflow: visible;

  .el-table__body-wrapper {
    .el-table__row {
      background-color: rgba(38, 38, 38, 0.5);
      color: #ffffff;
      border-color: #1e374b !important;

      &:hover {
        background-color: rgba(38, 38, 38, 0.5) !important;
        color: #ffffff;

        td {
          background-color: rgba(38, 38, 38, 0.5) !important;
        }
      }

      td {
        padding: 6px 0;
        .cell {
          > div {
            display: flex;
            .el-radio {
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}
.tool_container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: #ffffff;
}
.wrapper {
  position: absolute;
  top: 0;
  left: 50px;
  pointer-events: auto;
  padding: 5px;
  display: flex;
  background-color: rgba(38, 38, 38, 0.5);
  z-index: 2001;
  li {
    line-height: 30px;
    text-align: center;
    width: 88px;
    border: 1px solid #333;
    box-shadow: 0 1px 1px #8b8b8b inset, 0 -1px 0 #3d3d3d inset,
      0 -1px 3px #8b8b8b inset;
    cursor: pointer;
    pointer-events: auto;

    .el-dropdown-link {
      cursor: pointer;
      color: #ffffff;
    }
  }
  .is_active_attr {
    color: #20a0ff;
  }
}

.layer-manager {
  position: absolute;
  top: 52px;
  left: 50px;
  z-index: 2001;
  width: 240px;
  background-color: rgba(38, 38, 38, 0.5) !important;
  border: 1px solid rgb(82, 111, 130) !important;
  pointer-events: auto;
  .header {
    line-height: 40px;
    height: 40px;
    text-align: center;
    background-color: rgba(38, 38, 38, 1);
  }

  .tree {
    height: 290px;
    background-color: rgba(38, 38, 38, 0.5);
    overflow: auto;

    ::v-deep .el-tree {
      height: 100%;
      color: #ffffff;
      background-color: transparent;

      .el-tree-node {
        &:focus {
          background-color: transparent;
          .el-tree-node__content {
            background-color: transparent;
          }
        }
        .el-tree-node__content {
          .el-checkbox {
            background-color: transparent;
          }

          &:hover {
            border: 1px solid #1e374b;
            background-color: #1e374b;
          }
        }
      }
    }
  }
}

.map-controls {
  width: 230px;
  position: absolute;
  top: 450px;
  left: 0px;
  z-index: 2001;
  .active:before {
    outline: none;
  }
}

.overlay-container {
  .box {
    > div {
      position: absolute;
      z-index: 100;
    }
  }
}
.property_box {
  position: absolute;
  width: 300px;
  height: 330px;
  top: 20px;
  right: 20px;
  background: rgba(57, 61, 73, 0.5);
  pointer-events: auto;

  .property_header {
    position: relative;
    border-bottom: 1px solid #fafafa;
    height: 30px;
    line-height: 30px;

    i {
      position: absolute;
      right: 10px;
      font-size: 26px;
      cursor: pointer;
      top: 2px;
    }
  }

  ::v-deep .form_panel {
    .el-form-item {
      padding-bottom: 5px;
      margin-bottom: 0;
      border-bottom: 1px dashed #787878;

      .el-form-item__label {
        font-size: 12px;
        color: #ffffff;
        position: relative;
      }

      .el-form-item__content {
        height: 40px;
        line-height: 40px;

        &:focus-visible {
          height: 40px;
          line-height: 40px;
          outline: none;
        }

        .el-input-number {
          height: 35px;
          line-height: 35px;

          .el-input-number__decrease {
            bottom: 0;
          }
        }

        .el-input {
          .el-input__inner {
            background: rgba(57, 61, 73, 0.5);
            border-color: #fff;
            color: #ffffff;
            line-height: 35px;
            height: 35px;
            font-size: 12px !important;
          }

          input[type="text"]:focus,
          select:focus {
            border: 1px solid #fff;
            outline: none;
          }

          .el-input-group__append {
            border-color: #fff;
            background: rgba(57, 61, 73, 0.5);
            font-size: 12px;
          }

          //  .el-button {
          //    color: #FFFFFF;
          //    background-color: #0F88D2;
          //    border-color: #0F88D2;
          //  }
          //}
          //
          //.el-input-group__append:hover {
          //  border-color: #01A6E6;
          //}
        }
      }
    }

    .defineSwitch {
      .el-switch__core::before {
        content: "否";
        position: absolute;
        top: 0;
        right: 5px;
        color: #fff;
      }

      .is-checked .el-switch__core::before {
        content: "是";
        position: absolute;
        top: 0;
        left: 5px;
        color: #fff;
      }
    }

    .color_box {
      .el-form-item__content {
        display: flex;
        align-items: center;

        .el-input {
          width: 150px;
          margin-right: 10px;
        }
      }
    }
  }

  .btn_box {
    text-align: center;
    margin-top: 10px;

    .el-button {
      background-color: rgba(32, 160, 255, 0.2);
      border-color: #20a0ff;
    }
  }
}
.analyse_box {
  position: absolute;
  top: 500px;
  left: 130%;
  background-color: rgba(38, 38, 38, 0.5);
  width: 300px;
  height: 100px;
  border: 1px solid #526f82;
  padding: 5px;
}

.position_info {
  pointer-events: auto;
  width: 400px;
  position: absolute;
  top: 52px;
  right: 20px;
  z-index: 2001;
  ::v-deep.el-descriptions {
    .el-descriptions__header {
      background-color: rgba(38, 38, 38, 1);
      color: #ffffff;
      padding: 10px;
      margin-bottom: 0;
      .el-descriptions__extra {
        i {
          font-size: 24px;
          cursor: pointer;
        }
      }
    }
    .el-descriptions__body {
      .el-descriptions-row {
        background-color: transparent;
      }
      .my-label {
        width: 40px;
        padding: 5px 0;
        color: #ffffff;
        word-spacing: 2px;
        text-align: center;
        background-color: rgba(38, 38, 38, 0.5);
      }
      .my-content {
        background-color: rgba(38, 38, 38, 0.5);
        color: #ffffff;
      }
    }
  }
}
.excavation_box {
  pointer-events: auto;
  width: 300px;
  height: 170px;
  position: absolute;
  bottom: 70px;
  right: 90px;
  z-index: 2001;
  .ex_header {
    height: 40px;
    position: relative;
    background-color: rgba(38, 38, 38, 1);
    label {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
    }
    i {
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .ex_content {
    height: 90px;
    background: rgba(57, 61, 73, 0.5);
    display: flex;
    align-items: center;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
    .el-slider {
      flex: 1;
      ::v-deep .el-slider__input {
        width: 110px;
      }
      ::v-deep .el-slider__runway.show-input {
        margin-right: 130px;
      }
    }
  }
  .ex_footer {
    height: 38px;
    background: rgba(57, 61, 73, 0.5);
    display: flex;
    justify-content: space-around;
    // align-items: center;
    .span_btn {
      margin-top: 5px;
      height: 30px;
      box-shadow: 0px 0px 0px 2px #91b8b3;
      background: linear-gradient(to bottom, #768d87 5%, #6c7c7c 100%);
      background-color: #768d87;
      border-radius: 10px;
      border: 1px solid #566963;
      display: inline-block;
      cursor: pointer;
      color: #ffffff;
      font-family: Arial;
      font-size: 14px;
      padding: 7px 31px;
      text-decoration: none;
      text-shadow: 0px 1px 0px #2b665e;
    }
    .span_btn:hover {
      background: linear-gradient(to bottom, #6c7c7c 5%, #768d87 100%);
      background-color: #6c7c7c;
    }
    .span_btn:active {
      position: relative;
      top: 1px;
    }
  }
}
.transparent_wrapper {
  pointer-events: auto;
  width: 300px;
  height: 100px;
  position: absolute;
  bottom: 70px;
  right: 100px;
  z-index: 2001;
  // padding: 0 20px;
  background: rgba(57, 61, 73, 0.5);
  .transparent_wrapper_header {
    height: 40px;
    position: relative;
    background-color: rgba(38, 38, 38, 1);
    label {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
    }
    i {
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .content {
    padding: 0 20px;
  }
}
.component_info {
  pointer-events: auto;
  width: 320px;
  // height: 100px;
  position: absolute;
  top: 52px;
  right: 150px;
  z-index: 2001;
  // padding: 0 20px;
  background: rgba(57, 61, 73, 0.5);
  .component_info_header {
    height: 40px;
    position: relative;
    background-color: rgba(38, 38, 38, 1);
    label {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
    }
    i {
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .component_in_content {
    // padding: 0 20px;
    display: flex;
    flex-direction: column;
    .title {
      text-align: center;
      line-height: 30px;
      height: 30px;
    }
  }
}
</style>
