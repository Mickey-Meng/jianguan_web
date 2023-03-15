var objOkTab = "";
var element;
layui.use(["element", "layer", "okUtils",  "okLayer","okTab"], function () {
   var okUtils = layui.okUtils;
   var $ = layui.jquery;
   var user = JSON.parse(sessionStorage.getItem('userInfo'));
   $('.userName').html(user.NAME);
   $('.okadmin-logo').html(sessionStorage.getItem('title'));
   $('.copyright').html(sessionStorage.getItem('copyright'));

   var layer = layui.layer;
   var okLayer = layui.okLayer;
   var menus = sessionStorage.getItem("menus");
   var okTab = layui.okTab({
      data:JSON.parse(menus),
      openTabNum: 30, // 允许同时选项卡的个数
      parseData: function (data) { // 如果返回的结果和navs.json中的数据结构一致可省略这个方法
         return data;
      }
   });

   objOkTab = okTab;

  /**
   * 左侧导航渲染完成之后的操作
   */
  okTab.render(function () {
      var homePage = JSON.parse(sessionStorage.getItem("homePage"));
      var homePageMk = homePage.MENUCODE;
      var thisMk = '';
      var title_this = $('#tabTitle .layui-this');
      if(title_this.length > 0){
          thisMk = title_this.attr('lay-attr');
      }
      var menuMk = okUtils.getUrlParameter('menu',true);
      if(menuMk && homePageMk && !thisMk){
          openTabByMk(homePageMk);
          setTimeout(function () {
              openTabByMk(menuMk);
          },200);
      }else {
          openTabByMk(menuMk || thisMk || homePageMk);
      }
  });

  function openTabByMk(mk){
      okTab.tabAdd($('#navBar .layui-nav-item a[data-mk="'+ mk +'"]'));
  }

   /**
    * 添加新窗口
    */
   $("body").on("click", "#navBar .layui-nav-item a,#userInfo a", function () {
      // 如果不存在子级
      if ($(this).siblings().length == 0) {
         okTab.tabAdd($(this));
      }
      // 关闭其他展开的二级标签
      $(this).parent("li").siblings().removeClass("layui-nav-itemed");
      if (!$(this).attr('lay-id')) {
         var topLevelEle = $(this).parents("li.layui-nav-item");
         var childs = $("#navBar > li > dl.layui-nav-child").not(topLevelEle.children("dl.layui-nav-child"));
         childs.removeAttr('style');
      }
   });

   /**
    * 左侧菜单展开动画
    */
   $("#navBar").on('click', '.layui-nav-item a', function () {
      if (!$(this).attr('lay-id')) {
         var superEle = $(this).parent();
         var ele = $(this).next('.layui-nav-child');
         var height = ele.height();
         ele.css({'display': 'block'});

         if (superEle.is('.layui-nav-itemed')) {//是否是展开状态
            ele.height(0);
            ele.animate({
               height: height + 'px'
            }, function () {
               ele.css({
                  height: "auto"
               });
               //ele.removeAttr('style');
            });
         } else {
            ele.animate({
               height: 0
            }, function () {
               ele.removeAttr('style');
            });
         }
      }
   });

   /**
    * 左边菜单显隐功能
    */
   $(".ok-menu").click(function () {
      $(".layui-layout-admin").toggleClass("ok-left-hide");
      $(this).find('i').toggleClass("ok-menu-hide");
      localStorage.setItem("isResize", false);
      setTimeout(function () {
         localStorage.setItem("isResize", true);
      }, 1200);
   });

   /**
    * 移动端的处理事件
    */
   $("body").on("click", ".layui-layout-admin .ok-left a[data-url],.ok-make", function () {
      if ($(".layui-layout-admin").hasClass("ok-left-hide")) {
         $(".layui-layout-admin").removeClass("ok-left-hide");
         $(".ok-menu").find('i').removeClass("ok-menu-hide");
      }
   });

   /**
    * tab左右移动
    */
   $("body").on("click", ".okNavMove", function () {
      var moveId = $(this).attr("data-id");
      var that = this;
      okTab.navMove(moveId, that);
   });

   /**
    * 刷新当前tab页
    */
   $("body").on("click", ".ok-refresh", function () {
      okTab.refresh(this);
   });

   /**
    * 关闭tab页
    */
   $("body").on("click", "#tabAction a", function () {
      var num = $(this).attr('data-num');
      okTab.tabClose(num);
   });

   /**
    * 全屏/退出全屏
    */
   $("body").on("keydown", function (event) {
      event = event || window.event || arguments.callee.caller.arguments[0];
      // 按 Esc
      if (event && event.keyCode == 27) {
         console.log("Esc");
         $("#fullScreen").children("i").eq(0).removeClass("okicon-screen-restore");
      }
      // 按 F11
      if (event && event.keyCode == 122) {
         $("#fullScreen").children("i").eq(0).addClass("okicon-screen-restore");
      }
   });

   $("body").on("click", "#fullScreen", function () {
      if ($(this).children("i").hasClass("okicon-screen-restore")) {
         screenFun(2).then(function () {
            $(this).children("i").eq(0).removeClass("okicon-screen-restore");
         });
      } else {
         screenFun(1).then(function () {
            $(this).children("i").eq(0).addClass("okicon-screen-restore");
         });
      }
   });

   /**
    * 全屏和退出全屏的方法
    * @param num 1代表全屏 2代表退出全屏
    * @returns {Promise}
    */
   function screenFun(num) {
      num = num || 1;
      num = num * 1;
      var docElm = document.documentElement;

      switch (num) {
         case 1:
            if (docElm.requestFullscreen) {
               docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
               docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
               docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
               docElm.msRequestFullscreen();
            }
            break;
         case 2:
            if (document.exitFullscreen) {
               document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
               document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
               document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
               document.msExitFullscreen();
            }
            break;
      }

      return new Promise(function (res, rej) {
         res("返回值");
      });
   }

   /**
    * 系统公告
    */
   $(document).on("click", "#notice", noticeFun);
   !function () {
      var notice = sessionStorage.getItem("notice");
      if (notice != "true") {
         // noticeFun();
      }
   }();

   function noticeFun() {
      var srcWidth = okUtils.getBodyWidth();
      layer.open({
         type: 0, title: "系统公告", btn: "我知道啦", btnAlign: 'c', content: getContent(),
         yes: function (index) {
            if (srcWidth > 800) {
               layer.tips('公告跑到这里去啦', '#notice', {
                  tips: [1, '#000'],
                  time: 2000
               });
            }
            sessionStorage.setItem("notice", "true");
            layer.close(index);
         },
         cancel: function (index) {
            if (srcWidth > 800) {
               layer.tips('公告跑到这里去啦', '#notice', {
                  tips: [1, '#000'],
                  time: 2000
               });
            }
         }
      });
   }

   function getContent() {
      let dateStr = okUtils.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      let content =
          "开发中 &nbsp;&nbsp;<span style='color:#5cb85c'>"+ dateStr +"</span><br/>";
      return content;
   }

   /**
    * 弹窗皮肤
    */
   $("#alertSkin").click(function () {
      okLayer.open("皮肤动画", "pages/system/alertSkin.html", "50%", "45%", function (layero) {
      }, function () {
      });
   });

   /**
    * 退出操作
    */
   $("#logout").click(function () {
      okLayer.confirm("确定要退出吗？", function (index) {
          okUtils.deleteCookie("token");
          sessionStorage.clear();
          localStorage.removeItem('omstk');
          var url = window.parent.parent.location.href;
          window.parent.parent.location.href = url;
      });
   });

   /**
    * 锁定账户
    */
   $("#lock").click(function () {
      okLayer.confirm("确定要锁定账户吗？", function (index) {
         layer.close(index);
         $(".yy").show();
         layer.prompt({
            btn: ['确定'],
            title: '输入密码解锁(123456)',
            closeBtn: 0,
            formType: 1
         }, function (value, index, elem) {
            if (value == "123456") {
               layer.close(index);
               $(".yy").hide();
            } else {
               layer.msg('密码错误', {anim: 6, time: 1000});
            }
         });
      });
   });
});

var closeTab = function(){
    objOkTab.tabClose(1);
};

var addTab = function (data) {
    objOkTab.tabAddByConfig(data);
};

var refreshTab = function (data) {
    objOkTab.refresh(data);
};

var switchToHomePage = function(toId) {
    objOkTab.switchToHomePage(toId);
};
