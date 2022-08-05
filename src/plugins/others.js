/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2021-09-26 10:04:30
 */
import Vue from 'vue'
import Pagination from '@/components/Pagination/Index'
import EChart from 'vue-echarts'
import splitPane from 'vue-splitpane'
import VueDragResize from 'vue-drag-resize'
import Viewer from 'v-viewer'
import ImgViewer from '@/components/img-viewer'
import  uploadFile  from '@/components/uploadFile'
// import tree from "vue-giant-tree"

// 手动引入 ECharts 各模块来减小打包体积
// 引入需要的echarts如表

import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pictorialBar'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

// 引入需要的 echarts的交互组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/toolbox'

Vue.component('split-pane', splitPane)
Vue.component('pagination', Pagination)
Vue.component('v-chart', EChart)
Vue.component('vue-drag-resize', VueDragResize)
Vue.component('img-viewer', ImgViewer)
Vue.component('uploadFile', uploadFile)
// Vue.component('big-tree', tree)
Vue.use(VideoPlayer)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    toolbar: true
  }
})
