<template>
  <div class="wrapper">
    <div class="header_g">
      <div class="title_item"></div>
      <span class="title_text"> 新闻中心 </span>
      <!-- <span class="see-new-btm">新闻中心<i class="el-icon-d-arrow-right" /></span> -->
    </div>
    <div class="newList">
      <ul>
        <li
          v-for="(item, index) in newLists"
          :class="{ active: index == currentIndex }"
          :key="index"
        >
          <div>{{ item.title }}</div>
          <div>{{ item.sttime }}</div>
        </li>
      </ul>
      <img v-if="newLists.length > 0" :src="newLists[currentIndex].img" />
    </div>
  </div>
</template>

<script>
import bg_1 from "@/assets/newsImage/1.jpg";
import bg_2 from "@/assets/newsImage/2.jpg";
import bg_3 from "@/assets/newsImage/3.jpg";
import bg_4 from "@/assets/newsImage/4.jpg";
import bg_5 from "@/assets/newsImage/5.png";
import bg_6 from "@/assets/newsImage/6.jpg";
import bg_7 from "@/assets/newsImage/7.jpg";
import bg_8 from "@/assets/newsImage/8a.jpg";
import baodao from "@/assets/newsImage/baodao.png";
import jindong from "@/assets/newsImage/jindong.jpg";
import fangzai from "@/assets/newsImage/fangzai.webp";
import fangtai from "@/assets/newsImage/fangtai.webp";
import { getTenNews } from "@/api/news";
import { validPicurl } from "@/utils/validate";

export default {
  name: "",
  data() {
    return {
      newsIndex: 1,
      currentIndex: 0,
      lists: [
        {
          name: "诸暨235国道项目“防台十二时辰战役",
          time: "07/23",
          img: fangtai,
        },
        {
          name: "诸暨235国道项目前塘坞隧道正式进洞",
          time: "07/20",
          img: jindong,
        },
        {
          name: "王珣一行莅临诸暨235国道项目开展防灾减灾检查并召开专项会议",
          time: "07/08",
          img: fangzai,
        },
        {
          name: " 235国道项目数字化应用报道",
          time: "07/05",
          img: baodao,
        },
        {
          name: "绍兴市委常委、诸暨市委书记沈志江莅临诸暨235国道项目现场调研",
          time: "05/06",
          img: bg_8,
        },
        {
          name: "诸暨交投集团党委书记、董事长郭剑波莅临诸暨235国道项目调研",
          time: "04/23",
          img: bg_7,
        },
        {
          name: "诸暨235国道项目召开首次合同交底会",
          time: "03/26",
          img: bg_6,
        },
        {
          name: "马忠贤莅临诸暨235国道项目开展设备工作调研",
          time: "03/23",
          img: bg_5,
        },
      ],
      newLists: [],
      timer: null,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getTenNews().then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((element) => {
            element.img = validPicurl(element.pic)[0];
          });
          this.newLists = res.data;
          this.autoPlay();
        }
      });
    },
    autoPlay() {
      this.timer = setInterval(() => {
        if (this.currentIndex == this.newLists.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }, 5000);
    },
  },
  destroyed() {
    this.timer && clearInterval(this.timer);
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: 0 16px 16px 16px;
  background-image: url(../../../assets/image/边框-小.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .header_g {
    margin-left: -16px;
  }
  .newList {
    height: calc(100% - 30px);
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    ul {
      width: 58%;
      overflow: auto;
      li {
        background-image: url(../../../assets/image/newsbg.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 36px;
        height: 36px;
        color: rgb(152, 156, 159);
        margin: 16px 0;
        cursor: pointer;
        div:first-of-type {
          text-indent: 1em;
          width: 74%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        div:last-of-type {
          width: 26%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
      .active {
        color: #ffffff;
      }
    }
    img {
      margin-top: 10px;
      width: 40%;
      height: 90%;
    }
  }
}
</style>
