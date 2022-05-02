/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-10 15:12:29
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-17 20:29:58
 */
/**
 *
 * @param {*} container 要移到的元素
 * @param {*} target 监听鼠标事件的元素，一般是标题栏
 */
function moveDiv(container, target) {
  if (!$("#" + container)) {
    throw new Error("请指定要操作的元素");
  }
  if (!target) {
    target = container;
  }
  $("#" + target).mousedown(function(
    e //e鼠标事件
  ) {
    document.onselectstart = function() {
      return false;
    }; //解决拖拽时选中文字的问题
    $("#" + target).css("cursor", "move"); //改变鼠标指针的形状
    // let offset = $("#" + container).offset(); //DIV在页面的位置
    let offset = $("#" + container).position(); //DIV在页面的位置
    let x = e.pageX - offset.left; //获得鼠标指针离DIV元素左边界的距离
    let y = e.pageY - offset.top; //获得鼠标指针离DIV元素上边界的距离
    $(document).bind("mousemove", function(
      ev //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
    ) {
      $("#" + target).css("cursor", "move");
      $("#" + container).stop(); //加上这个之后
      let _x = ev.pageX - x; //获得X轴方向移动的值
      let _y = ev.pageY - y; //获得Y轴方向移动的值
      if (_x <= 0) {
        _x = 0;
      }
      if (_x >= 1200) {
        _x = 1200;
      }
      if (_y <= 70) {
        _y = 70;
      }
      if (_y >= 650) {
        _y = 650;
      }

      $("#" + container).animate(
        {
          left: _x + "px",
          top: _y + "px"
        },
        10
      );
    });
  });
  $(document).mouseup(function() {
    $("#" + target).css("cursor", "default");
    $(this).unbind("mousemove");
  });
}
export { moveDiv };

export default {
  moveDiv
};
