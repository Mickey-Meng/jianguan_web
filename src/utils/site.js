let srsConfig = {
  defsr: 'EPSG:4549',
  srs: [
    ['EPSG:4547', '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
    ['EPSG:4544', '+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
    ['EPSG:2583', '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=635Q6755.288157528 +units=m +no_defs'],
    ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs '],
    ['EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs '],
    ['EPSG:4549', '+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs']
  ]
}
SFM.sfmProjHelper.defineProj(srsConfig.srs)
let csr = srsConfig.defsr

export const lonlatToXy = (point, sr = csr) => SFM.sfmProjHelper.transformPoint('WGS84', sr, point)
export const xyToLonlat = (point, sr = csr) => SFM.sfmProjHelper.transformPoint(sr, 'WGS84', point)

export const lonlatArrayToXyArray = (points, sr = csr) => SFM.sfmProjHelper.transformPoints('WGS84', sr, points)
export const xyArrayToLonlatArray = (points, sr = csr) => SFM.sfmProjHelper.transformPoints(sr, 'WGS84', points)


const toCartesian3 = data => {
  data.forEach(item => {
    item.Cartesian3 = item.Gis84.map(result => {
      return Cesium.Cartesian3.fromDegrees(result[0], result[1], 0);
    })

  })
  return data
}


export const returnColor = (data, alpha) => {
  let [x, y, z] = data.color;
  return new Cesium.Color(x / 255, y / 255, z / 255, alpha)
}
