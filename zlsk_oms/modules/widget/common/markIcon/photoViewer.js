var allPics;
var initData = function(data){
    allPics = data;
};

layui.use(['flow'],function () {
    var flow = layui.flow;

    //按屏加载图片
    flow.lazyimg({
        pictureContent:'#pictureContent',
        pictures:allPics,
        elem: '#pictureContent img'
    });
});
