let token='73c8cafe0bf281cfc6685ffed36baf6e';
// let token = '61dab5cd60b7e6690aa64535330281f3';
// let token = '6f435c1434e6134088f615ea33824f62';
// let token = 'f49ff09093fc4ec19225622b6f6fd159';
// let token = '238e59a676588b40622964ed5e70a03c';
// let token = 'ec423b20e728ddeab0ed413681fa458a';
// let token = '3f5e6f046cdf6d18b68c49270111c454';
// let token = '78587077f0ad63135e4e33c6aa4a3614'
// let token = '014725c38695ecd7424c3235197ca2fe';
let subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
let tdtUrl = 'https://t{s}.tianditu.gov.cn/'

export const earth = {
  init: {
    lon: 117.48387645025284,
    lat: 30.66751823064398,
    height: 5000,
    // lon: 120.10326899646911,
    // lat: 29.638086861129057,
    // height: 50,
    heading: 0,
    pitch: -90,
    roll: 0,
    duration: 3
  },
  viewerOptions: {
    terrainProviderViewModels: [],
    // terrainProvider: {
    //   name: '诸暨地形',
    //   type: 'CESIUM_TERRAIN',
    //   clampToGround: true,
    //   url: 'http://101.200.223.171/mapData/zhujishi/DEM',
    //   visible: true
    // },
    imageryProviderViewModels: [],
    fullscreenButton: false
  },
  baseLayers: [{
    name: '谷歌影像',
    type: 'URL',
    // url: 'http://mt2.google.cn/vt?lyrs=s@800&x={x}&y={y}&z={z}',
    url: 'https://khms0.google.com/kh/v=889?x={x}&y={y}&z={z}',
    minimumLevel: 1,
    maximumLevel: 18,
    visible: false,
    image: './image/mapSwitch/google_img.png'
  },
  {
    name: '天地图影像',
    type: 'URL',
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    minimumLevel: 1,
    maximumLevel: 18,
    image: './image/mapSwitch/tdt_img.png',
    visible: false,
    stGroup: '天地图影像'
  },
  {
    name: '天地图矢量',
    type: 'URL',
    url: tdtUrl + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + token,
    visible: false,
    subdomains: subdomains,
    image: './image/mapSwitch/tdt_vec.png',
    stGroup: '天地图矢量'
  },
  {
    name: '天地图地形',
    type: 'URL',
    url: tdtUrl + 'DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=' + token,
    visible: false,
    subdomains: subdomains,
    image: './image/mapSwitch/tdt_ter.png',
    stGroup: '天地图地形'
  },
  {
    name: '影像注记',
    type: 'URL',
    url: tdtUrl + 'DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + token,
    visible: false,
    subdomains: subdomains,
    stGroup: '天地图影像'
  },
  {
    name: '矢量注记',
    type: 'URL',
    url: tdtUrl + 'DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + token,
    visible: false,
    subdomains: subdomains,
    stGroup: '天地图矢量'
  },
  {
    name: '地形注记',
    type: 'URL',
    url: tdtUrl + 'DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=' + token,
    visible: false,
    subdomains: subdomains,
    stGroup: '天地图地形'
  },
  {
    name: '高德影像',
    type: 'GCJ02',
    url: `https://wprd0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&dc={st_time}`,
    subdomains: ['1', '2', '3', '4'],
    visible: false,
    image: './image/mapSwitch/tdt_img.png',
    stGroup: '高德影像'
  }
  ],
  layers: [

  ]
}
