"use strict";
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    if(val){
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
};
layui.define(["layer",'okSweetAlert2','okLayer','constantUrl','countUp'], function (exprots) {
    var $ = layui.jquery;
    var okUtils = {
        /**
         * 是否前后端分离
         */
        isFrontendBackendSeparate: false,
        /**
         * 服务器地址
         */
        baseUrl: "http://localhost:8080",
        /**
         * 获取body的总宽度
         */
        getBodyWidth: function () {
            return document.body.scrollWidth;
        },
        /**
         * 主要用于对ECharts视图自动适应宽度
         */
        echartsResize: function (element) {
            var element = element || [];
            window.addEventListener("resize", function () {
                var isResize = localStorage.getItem("isResize");
                // if (isResize == "false") {
                for (let i = 0; i < element.length; i++) {
                    element[i].resize();
                }
                // }
            });
        },
        getCurrentDateStr : function () {
            var date = new Date();
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        },
        getTreeByList : function(idField,pIdField,childrenField,data,pId){
            var result = [];
            data.forEach(function (item) {
                if(item[pIdField] == pId) {
                    var temp = okUtils.getTreeByList(idField, pIdField, childrenField, data, item[idField]);
                    if (temp.length !== 0) {
                        if (item[childrenField]) {
                            item[childrenField] = item.children.concat(temp);
                        } else {
                            item[childrenField] = temp;
                        }
                    }
                    result.push(item);
                }
            });
            return result;
        },
        /**
         * 产生随机整数，包含下限值，包括上限值
         * @param {Number} lower 下限
         * @param {Number} upper 上限
         * @return {Number} 返回在下限到上限之间的一个随机整数
         */
        random:function (lower, upper) {
            return Math.floor(Math.random() * (upper - lower + 1)) + lower;
        },
        countUp:function(config) {
            new layui.countUp(config).start();
        },
        getFileSize:function getfilesize(size) {
            if (!size)
                return "";

            var num = 1024.00; //byte
            if (size < num)
                return size + "B";
            if (size < Math.pow(num, 2))
                return (size / num).toFixed(2) + "K"; //kb
            if (size < Math.pow(num, 3))
                return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
            if (size < Math.pow(num, 4))
                return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
            return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
        },
        getAddress:function(location,callback){
            var loadIndex;
            $.ajax({
                url:layui.constantUrl.other.bdLocation + location,
                dataType:'jsonp',
                async:false,
                beforeSend: function (request) {
                    loadIndex = layer.load(0, {shade: false});
                },
                success:function (data) {
                    var address = '';
                    if(data.result){
                        if(data.result.pois.length !== 0){
                            if(data.result.addressComponent){
                                address += data.result.addressComponent.province || '';
                                address += data.result.addressComponent.city || '';
                                address += data.result.addressComponent.district || '';
                                address += data.result.addressComponent.street || '';
                            }
                            address += data.result.pois[0].name;
                        }else {
                            address += data.result.formatted_address;
                        }
                    }
                    callback(address,data.result.location);
                },
                complete: function () {
                    layer.close(loadIndex);
                },
                error: function () {
                    layer.close(loadIndex);
                }
            });
        },
        getLocation:function(address){
            var deferred = $.Deferred();
            var loadIndex;
            $.ajax({
                url:layui.constantUrl.other.bdLocationGeoCoding + address,
                dataType:'jsonp',
                async:false,
                beforeSend: function (request) {
                    loadIndex = layer.load(0, {shade: false});
                },
                success:function (data) {
                    if(data.status !== 0){
                        layui.okLayer.errorTips(data.msg);
                        deferred.reject('查询失败');
                    }else {
                        deferred.resolve(data.result.location);
                    }
                },
                complete: function () {
                    layer.close(loadIndex);
                },
                error: function () {
                    layer.close(loadIndex);
                    deferred.reject('查询失败');
                }
            });
            return deferred.promise();
        },
        deleteCookie:function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = okUtils.getCookie(name);
            if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
        },
        getCookie: function(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
                return null;
            }
        },
        setCookie:function(name,value,days){
            var Days = days || 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days*24*60*60*1000);
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/";
        },
        uploadFile:function(option){
            var stateCode = option.stateCode || 0;
            var load = option.load || true;
            var deferred = $.Deferred();
            var loadIndex;
            $.ajax({
                url: option.url,
                type: 'POST',
                cache: false,
                data: option.param,
                processData: false,
                contentType:false,
                xhr:function(){
                    var myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){
                        myXhr.upload.addEventListener('progress',function(e){
                            var loaded = e.loaded;
                            var tot = e.total;
                            var per = Math.floor(100 * loaded / tot);
                            if(option.onUploadCallback){
                                option.onUploadCallback(per);
                            }
                        }, false);
                    }
                    return myXhr;
                },
                beforeSend: function (request) {
                    request.setRequestHeader("token", okUtils.getCookie('token'));
                    if (load) {
                        loadIndex = layer.load(0, {shade: [0.5, '#393D49']});
                    }
                },
                success: function (data) {
                    if (data.meow === stateCode) {
                        // 业务正常
                        deferred.resolve(data)
                    } else {
                        // 业务异常
                        // layer.msg(data.msg || '服务异常', {icon: 7, time: 2000});
                        layui.okLayer.errorTips(data.msg);
                        deferred.reject("okUtils.ajax warn: " + data.msg);
                    }
                },
                complete: function () {
                    if (load) {
                        layer.close(loadIndex);
                    }
                },
                error: function () {
                    layer.close(loadIndex);
                    layer.msg("服务器错误", {icon: 2, time: 2000});
                    deferred.reject("okUtils.ajax error: 服务器错误");
                }
            });
            return deferred.promise();
        },
        /**
         * ajax()函数二次封装
         * {
         *     url:,
         *     type:,
         *     param:,
         *     load:,
         *     traditional:,
         *     dataType:,
         *     stateCode:,
         * }
         */
        ajax: function (option) {
            var stateCode = option.stateCode || 0;
            var load = option.load || true;
            var deferred = $.Deferred();
            var returnDataAnyWay = option.returnDataAnyWay || false;
            var isNeedToken = true;
            if(option.isNeedToken !== undefined && option.isNeedToken === false){
                isNeedToken = false;
            }
            var async = option.async || true;
            var loadIndex;
            $.ajax({
                url: okUtils.isFrontendBackendSeparate ? okUtils.baseUrl + option.url : option.url,
                type: option.type || "get",
                data: option.param || option.data || {},
                dataType: option.dataType || "json",
                traditional:option.traditional || false,
                async:async,
                beforeSend: function (request) {
                    if(isNeedToken){
                        var tk = localStorage.getItem('omstk');
                        tk || (tk = okUtils.getCookie('token'));
                        request.setRequestHeader("token", tk);
                    }
                    if (load) {
                        loadIndex = layer.load(0, {shade: false});
                    }
                },
                success: function (data) {
                    if (returnDataAnyWay){
                        deferred.resolve(data)
                    }else if (data.meow === stateCode) {
                        // 业务正常
                        deferred.resolve(data)
                    } else {
                        // 业务异常
                        // layer.msg(data.msg || '服务异常', {icon: 7, time: 2000});
                        layui.okLayer.errorTips(data.msg);
                        deferred.reject("okUtils.ajax warn: " + data.msg);
                    }
                },
                complete: function () {
                    if (load) {
                        layer.close(loadIndex);
                    }
                },
                error: function () {
                    layer.close(loadIndex);
                    layer.msg("服务器错误", {icon: 2, time: 2000});
                    deferred.reject("okUtils.ajax error: 服务器错误");
                }
            });
            return deferred.promise();
        },
        table: {
            /**
             * 主要用于针对表格批量操作操作之前的检查
             * @param table
             * @returns {string}
             */
            batchCheck: function (table) {
                var checkStatus = table.checkStatus("tableId");
                var rows = checkStatus.data.length;
                if (rows > 0) {
                    var idsStr = "";
                    for (var i = 0; i < checkStatus.data.length; i++) {
                        idsStr += checkStatus.data[i].id + ",";
                    }
                    return idsStr;
                } else {
                    layer.msg("未选择有效数据", {offset: "t", anim: 6});
                }
            },
            /**
             * 在表格页面操作成功后弹窗提示
             * @param content
             */
            successMsg: function (content) {
                layer.msg(content, {icon: 1, time: 1000}, function () {
                    // 刷新当前页table数据
                    $(".layui-laypage-btn")[0].click();
                });
            }
        },
        /**
         * 获取父窗体的okTab
         * @returns {string}
         */
        getOkTab: function () {
            return parent.objOkTab;
        },
        /**
         * 格式化当前日期
         * @param date
         * @param fmt
         * @returns {void | string}
         */
        dateFormat: function (date, fmt) {
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        number: {
            /**
             * 判断是否为一个正常的数字
             * @param num
             */
            isNumber: function (num) {
                if (num && !isNaN(num)) {
                    return true;
                }
                return false;
            },
            /**
             * 判断一个数字是否包括在某个范围
             * @param num
             * @param begin
             * @param end
             */
            isNumberWith: function (num, begin, end) {
                if (this.isNumber(num)) {
                    if (num >= begin && num <= end) {
                        return true;
                    }
                    return false;
                }
            },
        },
        showConfirmDialog:function (option,callback) {
            var config = {
                type: "warning",
                title: "你确定要这样操作吗？",
                text: "此操作您将无法还原！",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            };
            $.extend(true,config,option);
            layui.okSweetAlert2.fire(config).then(function (data) {
                callback(data);
            });
        },
        getDic:function(key,callback,async){
            var cache = sessionStorage.getItem(key);
            if(cache && cache != 'undefined'){
                okUtils.callbackDic(JSON.parse(cache),callback);
            }else {
                okUtils.ajax({
                    url:layui.constantUrl.stAuth.selectDicByParentKey,
                    param:{keyStr:key},
                    async:async || true
                }).done(function (data) {
                    sessionStorage.setItem(key,JSON.stringify(data.data[key]));
                    okUtils.callbackDic(data.data[key],callback);
                });
            }
        },
        callbackDic:function(dicArray,callback){
            var dicMap = [];
            dicArray.forEach(function (item) {
                dicMap[item.key] = item.value;
            });
            callback(dicArray,dicMap);
        },
        /**
         *构造下拉框
         */
        adapterSelect:function (id,defaultText,value,text,data,datasets,defaultValue) {
            var dom = $(id);
            dom.empty();
            defaultText = defaultText || '请选择';
            defaultValue = defaultValue || '';
            let dataset = [];
            if(datasets && datasets.length > 0)
                for (var datasetIndex = 0;datasetIndex < datasets.length;datasetIndex ++){
                    var _item = datasets[datasetIndex];
                    dataset.push("data-" + text + "=" + JSON.stringify(_item));
                    // dataset += ' data-' + _item + '="' + item[_item] + '" ';
                    //    $("#id").find("option:selected").attr("data-_item")取值
                }
            dom.append('<option value=' + defaultValue + '>'+ defaultText +'</option>>');
            for (var index = 0;index < data.length;index ++){
                var item = data[index];
                dom.append('<option '+ dataset[index] +' value="'+ item[value] +'">'+ item[text] +'</option>>');
            }
            layui.form.render("select");
        },
        dicTurn:function(dics){
            dics.forEach(function (dic) {
                dic.value = dic.key;
            });
            return dics;
        },
        structureTree:function (option,id,title,parent) {
            var pid = 'PARENTID';
            if(parent){
                pid = parent;
            }
            var key = 'ID';
            if(id){
                key = 'id';
            }
            var data = option.data;
            var checked = option.checked || false;
            var spread = option.spread || false;
            for (var index = 0; index < data.length; index++) {
                var m = data[index];
                m.title = m.NAME || m[title];
                m.id = m.ID || m[id];
                m.checked = option.checked;
                m.spread = false;
                for (var j = index + 1; j < data.length; j++) {
                    var n = data[j];
                    n.title = n.NAME || n[title];
                    n.id = n.ID || n[id];
                    m.checked = option.checked;
                    m.spread = false;
                    if (n[pid] == m[key]) {
                        if (!m.children) {
                            m.children = [];
                        }
                        m.children.push(n);
                    } else if (m[pid] == n[key]) {
                        if (!n.children) {
                            n.children = [];
                        }
                        n.children.push(m);
                    }
                }
            }
            return data;
        },
        /**
         * 解析xml字符串
         * @param xmlString
         */
        loadXMLString:function(xmlString){
            var  xmlDoc = null ;
            // 判断浏览器的类型
            // 支持IE浏览器
            if ( ! window.DOMParser && window.ActiveXObject){    // window.DOMParser 判断是否是非ie浏览器
                var  xmlDomVersions = [ ' MSXML.2.DOMDocument.6.0 ' , ' MSXML.2.DOMDocument.3.0 ' , ' Microsoft.XMLDOM ' ];
                for ( var  i = 0 ;i < xmlDomVersions.length;i ++ ){
                    try {
                        xmlDoc =  new ActiveXObject(xmlDomVersions[i]);
                        xmlDoc.async = false ;
                        xmlDoc.loadXML(xmlString);  // loadXML方法载入xml字符串
                        break ;
                    } catch (e){
                    }
                }
            }
            // 支持Mozilla浏览器
            else if (window.DOMParser && document.implementation && document.implementation.createDocument){
                try {
                    /*  DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                    * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                    * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                    * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                     */
                    let domParser = new DOMParser();
                    xmlDoc = domParser.parseFromString(xmlString,  'text/xml' );
                } catch (e){
                }
            } else {
                return null ;
            }
            return xmlDoc;
        },
        /**
         *获取URL中的参数
         */
        getUrlParameter:function (name,isParent) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if(isParent){
                r = window.parent.location.search.substr(1).match(reg);
            }
            if (r != null) return decodeURI(r[2]); return null; //返回参数值
        },
        trimSpace:function(array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == " " || array[i] == null || typeof (array[i]) == "undefined") {
                    array.splice(i, 1);
                    i = i - 1;
                }
            }
            return array;
        },
        replaceAll: function(origin, oldWord, newWord) {
            return origin.replace(new RegExp(oldWord, "gm"), newWord);
        },
        /**
         *非标准JSON字符串转JSON字符串
         * 例如 '{a:1,b:2}'
         */
        toJSONStr: function(str) {
            return str.replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":'});
        },
        renderEasySelect : function($,option,showDelete){
            var config = {
                el: '',
                tips:'',
                name: '',
                filterable: false,
                repeat: true,
                radio: true,
                clickClose: true,
                data: [],
                theme: {
                    color: '#333333',
                },
                model: {
                    label: {
                        type: 'block',
                        block: {
                            showCount: 0,
                            showIcon: showDelete,//是否显示删除图标
                        }
                    }
                }
            };
            $.extend(true,config,option);
            return layui.xmSelect.render(config);
        },
};
    exprots("okUtils", okUtils);
});
