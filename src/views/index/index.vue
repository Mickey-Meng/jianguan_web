<template>
  <div class="wrapper">
    <img :src="logo" alt="" />
    <div class="header">项目全生命周期数字管理平台</div>
    <div class="exit" @click="exitSys">返回登陆</div>
    <!-- <div class="main">
      <div class="all-view">
        <img :src="allView" alt="" @click="seeView">
        <label>多项目总览</label>
      </div>
      <div class="project-box">
        <div v-for="(item, index) in listData" :key="index" class="out-box">
          <div
            v-for="(i, n) in item"
            :key="n"
            class="in-box"

          >
            <img :src="box" alt=""  @click="seeProject(i)">
            <label>{{ i.name }}</label>
          </div>
        </div>
        <svg-icon
          v-if="startIndex < doubleArr.length - 4"
          icon-class="left"
          class="right_shift"
          @click="add"
        />
        <svg-icon
          v-if="startIndex > 0"
          icon-class="right"
          class="left_shift"
          @click="dec"
        />
      </div>
    </div> -->
    <div class="main_container">
      <div class="all-project">
        <img :src="allView" alt="" @click="seeView" />
        <label>多项目总览</label>
      </div>
      <div class="project_lists">
        <div id="album">
          <div class="img_box" v-for="(item, index) in listData" :key="index">
            <div class="img_box_wrapper" @click.stop="seeProject(item)">
              <img :src="item.img" alt="" />
              <label class="pro_name">{{ item.name }}</label>
            </div>
          </div>
          <p></p>
        </div>
        <svg-icon
          icon-class="left"
          v-if="currentPage < quotient"
          class="right_shift"
          @click="addPage"
        />
        <svg-icon
          v-if="currentPage > 1"
          icon-class="right"
          class="left_shift"
          @click="decPage"
        />
      </div>
    </div>
    <div class="footer">诸暨市建设集团有限公司</div>
  </div>
</template>

<script>
import logo from "@/assets/image/logo.png";
import allView from "@/assets/image/dbdzl.png";
import box from "@/assets/image/SX001.png";
import { mapMutations, mapGetters } from "vuex";
import { removeToken } from "@/utils/auth";
import { updateOnline } from "@/api/user";

import img1 from "@/assets/projectImg/图层0.png";
import img2 from "@/assets/projectImg/图层1.png";
import img3 from "@/assets/projectImg/图层2.png";
import img4 from "@/assets/projectImg/图层7.png";
import img5 from "@/assets/projectImg/图层4.png";
import img6 from "@/assets/projectImg/图层5.png";
import img7 from "@/assets/projectImg/图层6.png";
import {getAllProject} from "@/api/project";
export default {
  name: "",
  data() {
    return {
      logo: logo,
      allView: allView,
      box: box,
      lists: [
        // {
        //   name: "G235改建",
        //   img: img1,
        // },
        {
          name: "项目2",
          img: img2
        },
        {
          name: "项目3",
          img: img3
        },
        {
          name: "项目4",
          img: img4,
        },
        {
          name: "项目5",
          img: img5,
        },
        {
          name: "项目6",
          img: img6,
        },
        {
          name: "项目7",
          img: img7,
        },
      ],
      listData: [],
      doubleArr: [],
      number: 3,
      startIndex: 0,
      currentPage: 1,
      pageSize: 10,
      quotient: null,
      timer: null,
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["menus"]),
  },
  mounted() {
    document.onselectstart = function () {
      return false;
    };
    getAllProject().then(res => {
      let data = res.data;
      data.forEach(item => {
        item.img = img1;
      });
      let arr = data.concat(this.lists);
      this.lists = arr;
      this.initData();
      this.$nextTick(() => {
        this.initEffects();
      });
    });
  },
  methods: {
    ...mapMutations("project", ["SET_PROJECT"]),
    initData() {
      this.listData = this.lists.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
      this.quotient = Math.ceil(this.lists.length / 10);
    },
    addPage() {
      if (this.currentPage <= this.quotient) {
        this.currentPage++;
      }
      let data = this.lists.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
      if (data.length === 10) {
        this.listData = data;
      } else {
        let arr = this.lists.slice(-10);
        this.listData = arr;
      }
    },
    decPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
      let data = this.lists.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
      this.listData = data;
    },
    initEffects() {
      var album = document.getElementById("album"),
        aImg = document.getElementsByClassName("img_box");
      for (var i = 0; i < aImg.length; i++) {
        // 图片旋转分散 36°
        aImg[i].style.transform =
          "rotateY(" + (i * 360) / aImg.length + "deg) translateZ(300px)";
        aImg[i].style.transition =
          "transform 1s " + (aImg.length - i) * 0.1 + "s";
      }
      var lastX = 0, // 前一次的坐标X
        lastY = 0,
        nowX = 0, // 当前的坐标X
        nowY = 0,
        desX = 0,
        desY = 0,
        rotX = -30,
        rotY = 0,
        timer; // 时间间隔
      document.onmousedown = function (e) {
        var e = e || event;
        lastX = e.clientX;
        lastY = e.clientY;
        this.onmousemove = function (e) {
          var e = e || event;
          nowX = e.clientX;
          nowY = e.clientY;
          desX = nowX - lastX;
          desY = nowY - lastY;
          // 更新album的旋转角度，拖拽越快-> des变化大 -> roY变化大 -> 旋转快
          rotX -= desY * 0.1;
          rotY += desX * 0.2;
          album.style.transform =
            "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
          lastX = nowX;
          lastY = nowY;
        };
        document.onmouseup = function () {
          this.onmousemove = this.onmouseup = null;
          timer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            rotX -= desY * 0.1;
            rotY += desX * 0.2;
            album.style.transform =
              "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";

            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
              clearInterval(timer);
            }
          }, 13);
        };
        // 阻止默认行为
        return false;
      };
    },
    stopEffect() {
      document.onmousedown = null;
      document.onmouseup = null;
    },
    seeView() {
      this.$router.push("/pandect");
    },
    seeProject(item) {
      if (item.id) {
        this.SET_PROJECT(item);
        if (this.menus && this.menus.length > 0) {
          let item = this.menus[0];
          if (item.children && item.children.length > 0) {
            let path = item.children[0];
            this.$router.push(path.path);
          }
        }
      }
    },
    exitSys() {
      window.localStorage.clear();
      this.$router.push("/login");
    },
    init() {
      let that = this;
      updateOnline();
      that.timer = setInterval(() => {
        updateOnline();
      }, 1000 * 60 * 3);
    },
  },
  destroyed() {
    this.stopEffect();
    this.timer && clearInterval(this.timer);
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  background: url("../../assets/image/mainbg.png") no-repeat;
  background-size: 100%;
  position: relative;
  .exit {
    position: fixed;
    top: 12px;
    right: 20px;
    font-size: 18px;
    cursor: pointer;
    color: #FFFFFF;
  }
  > img {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
  }
  .header {
    width: 100%;
    height: 120px;
    line-height: 70px;
    color: #04ffff;
    font-size: 36px;
    text-align: center;
    background: url("../../assets/image/bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .main_container {
    width: 100%;
    height: calc(100% - 200px);
    // margin-top: 100px;
    display: flex;
    align-items: center;
    .all-project {
      width: 30%;
      position: relative;
      text-align: center;
      > img {
        width: 70%;
        &:hover {
          cursor: pointer;
          transform: scale(1.1);
        }
      }
      > label {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 32px;
        color: #04ffff;
      }
    }
    .project_lists {
      width: 70%;
      height: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      position: relative;
      .right_shift {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 20px;
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
      .left_shift {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 20px;
        width: 30px;
        height: 30px;
        cursor: pointer;
      }

      #album {
        width: 133px;
        height: 200px;
        margin: auto;
        position: relative;
        transform-style: preserve-3d;
        transform: rotateX(-20deg);
      }
      #album .img_box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* 反射倒影 距离下面5px  */
        -webkit-box-reflect: below 5px -webkit-linear-gradient(top, rgba(
                0,
                0,
                0,
                0
              )
              40%, rgba(0, 0, 0, 0.5));
        .img_box_wrapper {
          height: 100%;
          width: 100%;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          .pro_name {
            width: 120px;
            text-align: center;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 20px;
            z-index: 100;
            color: #FFFFFF;
          }
        }
      }
      #album p {
        position: absolute;
        left: calc(133px / 2 - 800px / 2);
        top: calc(200px / 2 - 800px / 2);
        width: 800px;
        height: 800px;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(100px) rotateX(90deg);
        border-radius: 50%;
      }

      // background: -webkit-radial-gradient(#490338 10%, #000);
    }
  }

  .main {
    width: 100%;
    height: calc(100% - 380px);
    margin-top: 100px;
    display: flex;
    align-items: center;
    .all-view {
      width: 40%;
      position: relative;
      text-align: center;
      > img {
        width: 70%;
        &:hover {
          cursor: pointer;
          transform: scale(1.1);
        }
      }
      > label {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 32px;
        color: #04ffff;
      }
    }
    .project-box {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .out-box {
        width: 15%;
        .in-box {
          width: 100%;
          height: 160px;
          position: relative;
          img {
            width: 100%;
            &:hover {
              cursor: pointer;
              transform: scale(1.1);
            }
          }
          label {
            width: 100px;
            position: absolute;
            bottom: 30px;
            // width: 100%;
            left: 50%;
            text-align: center;
            transform: translateX(-50%);
            font-size: 20px;
            //color: #04ffff;
            color: #FFFFFF;
          }
        }
      }
      // .right_shift {
      //   position: absolute;
      //   top: 50%;
      //   transform: translateY(-50%);
      //   right: 20px;
      //   width: 30px;
      //   height: 30px;
      //   cursor: pointer;
      // }
      // .left_shift {
      //   position: absolute;
      //   top: 50%;
      //   transform: translateY(-50%);
      //   left: 20px;
      //   width: 30px;
      //   height: 30px;
      //   cursor: pointer;
      // }
    }
  }
  .footer {
    position: absolute;
    width: 100%;
    bottom: 30px;
    text-align: center;
    margin-top: 50px;
    height: auto;
    color: #88a2c5;
    font-size: 20px;
    // -webkit-user-select: none;
    // -moz-user-select: none;
    // -ms-user-select: none;
  }
}
</style>
