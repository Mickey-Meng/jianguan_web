var uploadExtraData;
var accept;
var initData = function(data,acceptType){
    uploadExtraData = data;
    accept = acceptType;
};

layui.use(['zUpload','okUtils','constantUrl','okLayer'],function () {
    var $ = layui.jquery;
    var constantUrl = layui.constantUrl;
    var okLayer = layui.okLayer;
    var zUpload = layui.zUpload();
    zUpload.render({
        uploadUrl:constantUrl.stBase.uploadFile,
        element:'#fileSelect',
        tableElement:'#fileList',
        tableFilter:'fileList',
        uploadElement:'#fileUpload',
        clearElement:'#fileClear',
        accept:accept || 'image/*',
        uploadExtraData:uploadExtraData,
        uploadCallback:function (success,data) {
            if(success){
                okLayer.msg.greenTick('上传成功',function () {
                    sessionStorage.setItem("callback",data.data);
                    parent.layer.close(parent.layer.getFrameIndex(window.name));
                });
            }else {

            }
        }
    });
});

