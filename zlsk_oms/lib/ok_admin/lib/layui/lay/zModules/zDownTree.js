layui.define(['tree'],function (exports) {
    var $ = layui.jquery;
    var tree = layui.tree;

    var zDownTree = function () {
        this.config = {
            isChildNodeClickClose:false,
            isFatherNodeClickClose:false,
            isFatherNodeCallback:false,
        };

        {
            var style = document.createElement("style");
            style.type = "text/css";
            var styleValue = '.downpanel .z-layui-select-title span {line-height: 38px;} .downpanel dl dd:hover {background-color: inherit;}';
            try{
                style.appendChild(document.createTextNode(styleValue));
            }catch(ex){
                style.styleSheet.cssText = styleValue
            }
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(style);
        }
    };

    zDownTree.prototype.render = function(option){
        $.extend(true,this.config,option);
        var config = this.config;

        var html = "";
        html += '<div class="layui-unselect layui-form-select downpanel">';
        html += '<div class="z-layui-select-title">';
        html += '<span class="layui-input layui-unselect" id="treeclass">'+ option.hint +'</span>';
        html += '<input type="hidden" name="'+ config.inputName +'">';
        html += '<i class="layui-edge"></i>';
        html += '</div>';
        html += '<dl class="layui-anim layui-anim-upbit zDownTree">';
        html += '<dd>';
        html += '<ul id="classtree"></ul>';
        html += '</dd>';
        html += '</dl>';
        html += '</div>';

        $(config.elem).append(html);

        tree.render({
            elem: "#classtree",
            data: config.data,
            click: function (node) {
                var $select = $(this.elem).parents(".layui-form-select");
                if(!node.data.children){
                    $select.find(".z-layui-select-title span").html(node.data.title).end().find("input:hidden").val(node.data[config.callbackField]);
                    if(config.isChildNodeClickClose){
                        $select.removeClass("ok-layui-form-selected");
                    }
                    if(config.sonNodeClickCallback){
                        config.sonNodeClickCallback(node.data);
                    }
                }
                if(config.isFatherNodeCallback && node.data.children){
                    $select.find(".z-layui-select-title span").html(node.data.title).end().find("input:hidden").val(node.data[config.callbackField]);
                    if(config.isFatherNodeClickClose){
                        $select.removeClass("ok-layui-form-selected");
                    }
                }
            }
        });
        $(".downpanel").on("click", ".z-layui-select-title", function (e) {
            $(this).parents(".downpanel").toggleClass("ok-layui-form-selected");
            layui.stope(e);
        });
        $(document).on("click", function (event) {
            var rect = $('.zDownTree')[0].getBoundingClientRect();
            var x = event.clientX;
            var y = event.clientY;
            if( x < rect.left || x > rect.right || y < rect.top || y > rect.bottom){
                $(".downpanel").removeClass("ok-layui-form-selected");
            }
        });
    };

    exports("zDownTree",function () {
        return new zDownTree();
    });
});
