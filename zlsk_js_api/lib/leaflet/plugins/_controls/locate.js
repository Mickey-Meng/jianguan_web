//覆盖重写左下角的定位按钮事件，利用百度接口进行GPS定位。
var baidu_ak = 'qObioeG8HeeQVrOVAGScPVhDzlmv6rL9';

document.write('<script type="text/javascript" src="http://api.map.baidu.com/getscript?v=2.0&ak='+baidu_ak+'&services="></script>');


var geolocation;

L.Control.ToolBar.goLocate = function (e) {
    if (!geolocation)
        geolocation = new BMap.Geolocation();

    L.DomUtil.removeClasses(this.btnLocation, this._iconLocation);
    L.DomUtil.addClasses(this.btnLocation, this._iconLocationLoading);

    var that = this;
    geolocation.getCurrentPosition(function (r) {
        L.DomUtil.removeClasses(that.btnLocation, that._iconLocationLoading);
        L.DomUtil.addClasses(that.btnLocation, that._iconLocation);

        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var wgsPoint = L.zlskmap.pointconvert.bd2wgs([r.point.lng, r.point.lat]);

            that.onLocationFound({
                accuracy: 3000,
                latlng: [wgsPoint[1], wgsPoint[0]]
            })
        }
        else {
            //关于状态码
            //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
            //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
            //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
            //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
            //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
            //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
            //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
            //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
            //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
            haoutil.msg(this.getStatus(), "定位失败");
        }
    }, { enableHighAccuracy: true });
}
