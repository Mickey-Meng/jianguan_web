<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-26 09:42:19
-->
<template>
  <div></div>
</template>

<script>
import area from "@/assets/site/area";
import { getWorkPoint } from "@/api/system";
import eventBus from "@/assets/eventBus";
import {mapGetters} from "vuex";
let em, popups = [];
let Cesium = window.Cesium;
export default {
  name: "",
  data() {
    return {
      markerId: []
    };
  },
  created() {
    this.init();
    function computeScreenSpacePosition(scene, position, result) {
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          scene,
          position,
          result
        );
      }
    window.viewer.clock.onTick.addEventListener(function () {
      popups.forEach(item => {
        if (item.show) {
          item.ele.style.display = ''
          const screenPosition = computeScreenSpacePosition(viewer.scene, item.position, new Cesium.Cartesian2());
          if (screenPosition) {
            const _height = Math.floor(item.ele.clientHeight);
            const _screenPositionY = Math.floor(screenPosition.y + 0.25) - _height;

            item.ele.style.position = "absolute"

            item.ele.style.left = `${Math.floor(screenPosition.x + 0.25) - 100
              }px`;
            item.ele.style.top = `${_screenPositionY - 100
              }px`;
          }
        } else {
          item.ele.style.display = 'none'
        }
      })
    })
  },
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    init() {
      let zeh = window.zeh;

      let viewer = window.viewer;

      em = new Cesium.CustomDataSource("marker");
      viewer.dataSources.add(em);

      // em = zeh.earth.createMarkerManager({clusterType: "dilute"});
      // em.beginCluster();
      getWorkPoint(this.project.id).then((res) => {
        let data = res.data;
        if (data && data.length > 0) {
          data.forEach((item) => {
            let {
              altitude,
              sum,
              finish,
              work,
              longlatitude,
              projectName,
              type,
            } = item;
            let site = longlatitude.split(",");
            let height = altitude || 20;
            let rate = Math.floor((finish / sum) * 10000) / 100;
            rate = isNaN(rate) ? 0 : rate;
            let imagename = "image" + type;
            const image = require(`@/assets/image/${imagename}.png`);
            let noNumNmae = projectName.replace(/[0-9]+/g, "");
            let noZimu = noNumNmae.replace(/[a-zA-Z]+/g, "");
            let noFuHao = noZimu.replaceAll(/[+.]+/g, "");

            var len = noFuHao.replace(/[\u0391-\uFFE5]/g, "aa").length;
            var fontsize = 14;
            var width = (len * fontsize) / 1.4;
            if (width < 220) {
              width = 220;
            }

            if (site && site.length > 0) {
              em.entities.add({
                position: new Cesium.Cartesian3.fromDegrees(Number(site[0]), Number(site[1]), height),
                billboard: {
                  image: image,
                  pixelOffset: new Cesium.Cartesian2(0, -60),
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(600, 1e9),
                  pixelOffsetScaleByDistance: new Cesium.NearFarScalar(0, 1, 1e9, 0.5)
                },
              })

              const _popup = {};
              const ele = document.createElement("div");
              ele.setAttribute("class", "map_view_popup");
              ele.style.width = `${width}px`;
              ele.style.height = `130px`;
              ele.style.backgroundColor = 'rgba(11, 46, 113, 0.8)';
              ele.style.border = "none";
              ele.style.borderRadius = "10px";
              ele.style.margin = "0px";
              ele.style.color = "rgb(255, 255, 255)";
              ele.style.boxShadow = "rgb(153, 153, 153) 0px 0px 8px";
              ele.style.padding = "10px";

              document.getElementById("earth").appendChild(ele)
              _popup.ele = ele;
              _popup.position = new Cesium.Cartesian3.fromDegrees(Number(site[0]), Number(site[1]), height);
              // _popup.type = projecttype;
              _popup.show = true;

              let html = `
                <div class="overlayer_item">
                <div class="overlayer_header">${noFuHao}</div>
                <div class="overlayer_content">
                <div class="content_info">共计数量：${sum}个构件</div>
                <div class="content_info">完成数量：${finish}个构件</div>
                <div class="content_info">施工数量：${work || 0}个构件</div>
                <div class="content_info">完成比例:<span class="process">${rate}%</span></div>
                </div>
              </div>`;
              ele.innerHTML = html;

              popups.push(_popup)
            }
            // if (site && site.length > 0) {
            //   const id = zeh.openPopup({
            //     position: [Number(site[0]), Number(site[1]), 0], // 必须 弹窗位置
            //     visibleRange: [600, 45000],
            //     offset: [0, -5], // 可选，弹窗是否偏移
            //     width: width, // 可选，默认值: 400
            //     height: 130, // 可选，默认值: 240
            //     content: `
            //   <div class="overlayer_item">
            //   <div class="overlayer_header">${noFuHao}</div>
            //   <div class="overlayer_content">
            //    <div class="content_info">共计数量：${sum}个构件</div>
            //    <div class="content_info">完成数量：${finish}个构件</div>
            //    <div class="content_info">施工数量：${work || 0}个构件</div>
            //    <div class="content_info">完成比例:<span class="process">${rate}%</span></div>
            //   </div>
            // </div>`, // 弹框内容 可选，默认值: ''
            //     class: "popup", // 可选，默认值:
            //     closable: false, // 关闭按钮 可选，默认值: true
            //   });
            //   this.markerId.push(id);
            //   em.add({
            //     position: [Number(site[0]), Number(site[1]), height],
            //     image,
            //     // text: properties.Name,
            //     visibleRange: [600, 1e9],
            //     imageScaleRange: [0, 1, 1e9, 0.5],
            //     textVisibleRange: [600, 45000],
            //     // textColor: textColor,
            //     textOffset: [0, -45],
            //     textBackground: true, // 可选，默认值: true
            //     // textBgColor: textBgColor,
            //     // handleLineColor: [255, 255, 0, 255],
            //     onClick: function (id, b, c) {
            //       // const entity = em.getById(id)
            //       // entity && zeh.viewer.flyTo(entity)
            //     },
            //   });
            // }
          });
        }
      });
    },
  },
  destroyed() {
    em && viewer.dataSources.remove(em);
    eventBus.$emit("clearEffect");
    popups.forEach(item => {
      item.show = false;
    })
  },
};
</script>

<style scoped>
  .map_view_popup {
    
  }
</style>
