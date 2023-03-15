var allFiles = [];
layui.define(['zTable','okUtils','table','okNprogress'],function (exports) {
    var $ = layui.jquery;
    var okUtils = layui.okUtils;
    var okNprogress = layui.okNprogress;
    var zUpload = function () {
        this.config = {
            zFileSelectInput:'zFileSelectInput',
            accept:"file",//.doc,.docx  image/*
            element: '',
            clearElement:'',
            uploadElement:'',
            tableElement:'',
            tableFilter:'',
            tableFullHeight:'full-70',
            multiple:true,
            uploadUrl:'',
            uploadCallback:function () {

            },
            uploadExtraData:''
        }
    };

    /**
     *支持热重载,替换input标签的属性
     */
    zUpload.prototype.render = function(option){
        $.extend(true,this.config,option);
        var config = this.config;
        var table = this.renderTable();
        var brother = $(config.element).next('#' + config.zFileSelectInput)[0];
        if(brother){
            brother.parentNode.removeChild(brother);
        }
        var input = '<input id="'+ config.zFileSelectInput +'" type="file" style="display: none" accept="'+ config.accept +'" '+ (config.multiple ? "multiple" : "") +'>';
        $(config.element).after(input);

        $(config.element).off('click');
        $(config.element).on('click',function () {
            $('#' + config.zFileSelectInput).click();
        });
        $(config.clearElement).off('click');
        $(config.clearElement).on('click',function () {
            allFiles = [];
            table.reload({
                data:[]
            });
        });
        $(config.uploadElement).off('click');
        $(config.uploadElement).on('click',function () {
            var formData = new FormData();
            for(var extraData in config.uploadExtraData){
                formData.append(extraData,config.uploadExtraData[extraData]);
            }
            for(var uploadFile in allFiles){
                formData.append('file',allFiles[uploadFile]);
            }
            okUtils.uploadFile({
                url:config.uploadUrl,
                param:formData,
                onUploadCallback:function (percent) {
                    okNprogress.set(percent/100);
                }
            }).done(function (data) {
                okNprogress.done();
                if (typeof config.uploadCallback === "function") {
                    config.uploadCallback(true, data);
                }
            }).fail(function () {
                okNprogress.done();
                if (typeof config.uploadCallback === "function") {
                    config.uploadCallback(false);
                }
            });
        });
        $('#' + config.zFileSelectInput).on('change',function (e) {
            if(!e.currentTarget.files || e.currentTarget.files.length < 1){
                return;
            }
            var files = e.currentTarget.files;
            for (var index = 0;index <files.length;index ++){
                var file = files[index];
                allFiles[file.name] = file;
            }
            var tempFiles = [];
            Object.values(allFiles).forEach(function (value) {
                if(value && typeof value != 'function')
                tempFiles.push(value);
            });
            // for (var file in allFiles){
            //     tempFiles.push(allFiles[file]);
            // }
            table.reload({
                data:tempFiles
            });
        });

        layui.table.on('tool('+ config.tableFilter +')', function(obj){
            var data = obj.data;
            var layEvent = obj.event;
            if(layEvent === 'delete'){
                obj.del();
                var temp = [];
                for (var file in allFiles){
                    if(file !== obj.data.name){
                        temp[file] = allFiles[file];
                    }
                }
                allFiles = temp;
            }
        });
    };

    zUpload.prototype.renderTable = function(){
        var config = this.config;
        var zTable = layui.zTable({
            text:{none:'请选择文件'},
            elem: config.tableElement,
            data:[],
            height: config.tableFullHeight,
            limit:1000,
            page:false,
            cols: [[
                {field: 'name', title: '文件名称',width:500},
                {field: 'type', title: '文件类型'},
                {field: 'size', title: '文件大小',templet:function (d) {
                        return layui.okUtils.getFileSize(d.size);
                    }},
                {field: 'operate', title: '操作',align:'center',templet:function (d) {
                        let div = '';
                        div += '<a class="layui-btn layui-btn-xs" lay-event="delete">删除</a>';
                        return div;
                    }}
            ]]
        });
        return zTable.getTable();
    };

    exports("zUpload", function () {
        return new zUpload();
    });
});
