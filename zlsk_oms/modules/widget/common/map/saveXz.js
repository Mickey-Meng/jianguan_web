var url_ss = 'http://localhost:6080/arcgis/rest/services/HB_SJX/MapServer/0';
var url_cs = 'http://localhost:6080/arcgis/rest/services/HB_SJ/MapServer/0';
var url_qx = 'http://localhost:6080/arcgis/rest/services/HB_XJ/MapServer/0';
var url_xz = 'http://localhost:6080/arcgis/rest/services/HB_XZJ/MapServer/0';
var url_xc = 'http://localhost:6080/arcgis/rest/services/HB_CJ/MapServer/0';
var xnConfig = [];
var featureCache = {};

var xzs = [
    {
        url: url_ss,
        sortField: ''
    },
    {
        url: url_cs,
        sortField: 'adcode'
    },
    {
        url: url_qx,
        sortField: 'adcode'
    },
    {
        url: url_xz,
        sortField: 'xzdm'
    },
    {
        url: url_xc,
        sortField: ''
    },
];
function queryXz() {
    xzs.forEach(function (item) {
        $.ajax({
            url:item.url + '/query',
            dataType:'json',
            data:{
                returnGeometry: true,
                where: '1=1',
                outSr: 4326,
                inSr: 4326,
                outFields: '*',
                f: 'json'
            },
            async:false,
            success:function (data) {
                var features = data.features;
                if(item.sortField && item.sortField !== ''){
                    features.sort(function (a,b) {
                        return a.attributes[item.sortField] - b.attributes[item.sortField];
                    });
                }
                item.features = features;
            }
        });
    });
    construct(0,'中国','中国');
    debugger
}

function construct(index,name,wholeName) {
    if(xzs[index] && xzs[index].features){
        var features = xzs[index].features;
        features.forEach(function (item) {
            var _name = item.attributes.Name;
            var _wholeName = wholeName + ' ' + _name;
            if(index === 3){
                var __wholeName = '中国 ' + item.attributes.province + ' ' + item.attributes.cityname + ' ' + item.attributes.countyname + ' ' + item.attributes.Name
                if(__wholeName === _wholeName){
                    xnConfig.push({
                        parentId:wholeName,
                        id:_wholeName,
                        title:_name
                    });
                    featureCache[_wholeName] = item;
                    construct((index + 1),_name,_wholeName);
                }
            }else {
                if(name === '中国' || name === item.attributes.countyname){
                    xnConfig.push({
                        parentId:wholeName,
                        id:_wholeName,
                        title:_name
                    });
                    featureCache[_wholeName] = item;
                    construct((index + 1),_name,_wholeName);
                }
            }
        });
    }
}

function getXz() {
    zUtil.queryArcgis(url_ss,{Name:'湖北省'},function (data) {
        var features = data.features;
        features.forEach(function (item) {
            var name = item.attributes.Name;
            var wholeName = '中国 ' + name;
            xnConfig.push({
                parentId:'中国',
                id:wholeName,
                title:name
            });
            featureCache[wholeName] = item;
            getOther(name,wholeName);
        });
    });
}

function getOther(pName,wholeName) {
    zUtil.queryArcgis(url_cs,{countyname:pName},function (data) {
        var features = data.features;
        features.sort(function (a,b) {
            return a.attributes['adcode'] - b.attributes['adcode']
        });
        features.forEach(function (item) {
            var name = item.attributes.Name;
            var _wholeName = wholeName + ' ' + name;
            xnConfig.push({
                parentId:wholeName,
                id:_wholeName,
                title:name
            });
            featureCache[_wholeName] = item;
            getOther2(name,_wholeName);
        });
    })
}

function getOther2(pName,wholeName) {
    zUtil.queryArcgis(url_qx,{countyname:pName},function (data) {
        var features = data.features;
        features.sort(function (a,b) {
            return a.attributes['adcode'] - b.attributes['adcode']
        });
        features.forEach(function (item) {
            var name = item.attributes.Name;
            var _wholeName = wholeName + ' ' + name;
            xnConfig.push({
                parentId:wholeName,
                id:_wholeName,
                title:name
            });
            featureCache[_wholeName] = item;
            getOther3(name,_wholeName);
        });

    })
}

function getOther3(pName,wholeName) {
    zUtil.queryArcgis(url_xz,{countyname:pName},function (data) {
        var features = data.features;
        features.sort(function (a,b) {
            return a.attributes['xzdm'] - b.attributes['xzdm']
        });
        features.forEach(function (item) {
            var name = item.attributes.Name;
            var _wholeName = wholeName + ' ' + name;
            xnConfig.push({
                parentId:wholeName,
                id:_wholeName,
                title:name
            });
            featureCache[_wholeName] = item;
            getOther4(name,_wholeName);
        });
    })
}

function getOther4(pName,wholeName) {
    zUtil.queryArcgis(url_xc,{countyname:pName},function (data) {
        var features = data.features;
        features.forEach(function (item) {
            var name = item.attributes.Name;
            var _wholeName = wholeName + ' ' + name;
            xnConfig.push({
                parentId:wholeName,
                id:_wholeName,
                title:name
            });
            featureCache[_wholeName] = item;
        });
    })
}

function saveJson() {
    var result = layui.okUtils.getTreeByList('id','parentId','children',xnConfig,'中国');
    var content = JSON.stringify(result);
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "cityTree.json");
}

function saveFeature() {
    var content = JSON.stringify(featureCache);
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "cityFeature.json");
}
