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
let em;
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
  },
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    init() {
      let zeh = window.zeh;
      em = zeh.earth.createMarkerManager({clusterType: "dilute"});
      em.beginCluster();
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
              const id = zeh.openPopup({
                position: [Number(site[0]), Number(site[1]), 0], // 必须 弹窗位置
                visibleRange: [600, 45000],
                offset: [0, -5], // 可选，弹窗是否偏移
                width: width, // 可选，默认值: 400
                height: 130, // 可选，默认值: 240
                content: `
              <div class="overlayer_item">
              <div class="overlayer_header">${noFuHao}</div>
              <div class="overlayer_content">
               <div class="content_info">共计数量：${sum}个构件</div>
               <div class="content_info">完成数量：${finish}个构件</div>
               <div class="content_info">施工数量：${work || 0}个构件</div>
               <div class="content_info">完成比例:<span class="process">${rate}%</span></div>
              </div>
            </div>`, // 弹框内容 可选，默认值: ''
                class: "popup", // 可选，默认值:
                closable: false, // 关闭按钮 可选，默认值: true
              });
              this.markerId.push(id);
              em.add({
                position: [Number(site[0]), Number(site[1]), height],
                image,
                // text: properties.Name,
                visibleRange: [600, 1e9],
                imageScaleRange: [0, 1, 1e9, 0.5],
                textVisibleRange: [600, 45000],
                // textColor: textColor,
                textOffset: [0, -45],
                textBackground: true, // 可选，默认值: true
                // textBgColor: textBgColor,
                // handleLineColor: [255, 255, 0, 255],
                onClick: function (id, b, c) {
                  // const entity = em.getById(id)
                  // entity && zeh.viewer.flyTo(entity)
                },
              });
            }
          });
        }
      });
    },
  },
  destroyed() {
    em && em.clear();
    eventBus.$emit("clearEffect");
    if (this.markerId) {
      this.markerId.forEach((item) => {
        window.zeh.closePopup(item);
      });
    }
  },
};
</script>

<style scoped>
</style>
