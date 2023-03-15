
// 获取地址栏参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function loadData(jsonStr) {
    //  alert(jsonStr.toString())
    //   var obj = eval("(" + jsonStr + ")");
    var obj = jsonStr;
      var key, value, tagName, type, arr;
      for (x in obj) {
          key = x.toLowerCase();;
          value = obj[x];
          try
          {
               $("[name='" + key + "']").each(function () {
                  tagName = $(this)[0].tagName;

                  type = $(this).attr('type');
                  if (tagName == 'INPUT') {
                      if (type == 'radio') {
                          $(this).attr('checked', $(this).val() == value);
                      } else if (type == 'checkbox') {
                          arr = value.split(',');
                          for (var i = 0; i < arr.length; i++) {
                              if ($(this).val() == arr[i]) {
                                  $(this).attr('checked', true);
                                  break;
                              }
                          }
                      } else {
                          $(this).val(value);
                      }
                  } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                      $(this).val(value);
                  }
                  else if(tagName == 'SPAN') {
                      ///如果是lable的话

                     // alert(tagName)
                      $(this).html(value);
                  }


              });
          }
          catch(e){}
      }
  }

function getFormData(){
    var d = {};
    var t = $('form').serializeArray();
    $.each(t, function() {
      d[this.name] = this.value;
    });
    // alert(JSON.stringify(d));
    // return JSON.stringify(d);
    return d;
}


function loadDataByModelName(jsonStr,modelName){
    var obj = jsonStr;
      var key, value, tagName, type, arr;
      for (x in obj) {
          key = x.toLowerCase();;
          value = obj[x];
          try
          {
               $("["+modelName+"='" + key + "']").each(function () {
                  tagName = $(this)[0].tagName;

                  type = $(this).attr('type');
                  if (tagName == 'INPUT') {
                      if (type == 'radio') {
                          $(this).attr('checked', $(this).val() == value);
                      } else if (type == 'checkbox') {
                          arr = value.split(',');
                          for (var i = 0; i < arr.length; i++) {
                              if ($(this).val() == arr[i]) {
                                  $(this).attr('checked', true);
                                  break;
                              }
                          }
                      } else {
                          $(this).val(value);
                      }
                  } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                      $(this).val(value);
                  }
                  else if(tagName == 'SPAN') {
                      ///如果是lable的话

                     // alert(tagName)
                      $(this).html(value);
                  }


              });
          }
          catch(e){}
      }
}

function getFormDataByModelName(modelName){
    var d = {};
    var t = $("[" + modelName + "]");
    $.each(t, function() {
      d[$(this).attr(modelName)] = this.value;
    });
    // alert(JSON.stringify(d));
    // return JSON.stringify(d);
    return d;
}



/**
 *
 * 获取当前时间
 */
function getNow(s) {
    return s < 10 ? '0' + s: s;
}

// 格式：2019-05-15 16:35:35
function getNowDateTimeStringL(){
    var myDate = new Date();
    //获取当前年
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取当前日
    var date=myDate.getDate();
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds();

    var now=year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
    return now;
}

// 格式：2019/05/15 16:35:35
function getNowDateTimeStringI(){
    var myDate = new Date();
    //获取当前年
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取当前日
    var date=myDate.getDate();
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds();

    var now=year+'/'+getNow(month)+"/"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
    return now;
}

var generateXmSelect = function (array,id,tips,isRadio,callback) {
    return xmSelect.render({
        el: id,
        tips: tips,
        name: 'gid',
        data: array,
        filterable: true,
        repeat: false,
        radio: isRadio,
        clickClose: true,
        direction: 'down',
        theme: {
            color: '#333333',
        },
        model: {
            label: {
                type: 'block',
                block: {
                    showCount: 0,
                    showIcon: false,//是否显示删除图标
                }
            }
        },
        on: function (data) {
            var arr = data.arr;
            var change = data.change;
            var isAdd = data.isAdd;
            callback(arr,change,isAdd);
        }
    });
};

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

function generateLineName(lines,nodeInfo) {
    if (lines){
        let nodeIdAndNn = {};
        for (let index = 0; index < nodeInfo.length; index++) {
            nodeIdAndNn[nodeInfo[index].nn] = nodeInfo[index].name;
        }
        lines.forEach(function (value,index) {
            value.sname = nodeIdAndNn[value.snode];
            value.ename = nodeIdAndNn[value.enode];
        })
    }
    return lines;
}
