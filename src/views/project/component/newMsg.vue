<template>
  <div class="wrapper">
    <div class="new_ui_header">
      <div class="header_line"></div>
      <div class="header_text">新闻中心</div>
    </div>
    <div class="newList">
      <ul>
        <li
          v-for="(item, index) in newLists"
          :class="{ active: item.id == currentId }"
          :key="index"
        >
          <div class="normal" v-show="item.id !== currentId ">
            <div>{{ item.title }}</div>
            <div>{{ item.sttime }}</div>
          </div>
          <div class="activate" v-show="item.id === currentId">
            <div class="left">
              <div class="label">{{ item.title }}</div>
              <div class="date">{{ item.sttime }}</div>
            </div>
            <img :src="item.img" alt="">
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getTenNews} from "@/api/news";
  import {validPicurl} from "@/utils/validate";
  import {mapGetters} from "vuex";

  export default {
    name: "",
    data() {
      return {
        newsIndex: 1,
        currentId: null,
        newLists: [],
        timer: null
      };
    },
    created() {
      this.initData();
    },
    computed: {
      ...mapGetters(["project"])
    },
    methods: {
      initData() {
        getTenNews(this.project.id).then((res) => {
          if (res.data && res.data.length > 0) {
            res.data.forEach((element) => {
              element.img = validPicurl(element.pic)[0];
            });
            this.newLists = res.data;
            this.currentId = res.data[0].id;
            this.autoPlay();
          }
        });
      },
      autoPlay() {
        this.timer = setInterval(() => {
          let data = this.newLists;
          let index = data.findIndex(e => e.id === this.currentId);
          let obj = data[index];
          data.splice(index, 1);
          data.push(obj);
        this.newLists = data;
        this.currentId = data[0].id;
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
  background-color: #FFFFFF;
  border-radius: 15px;

  .new_ui_header {
    display: flex;
    align-items: center;
    padding: 20px 0px 10px 20px;

    .header_line {
      width: 4px;
      height: 16px;
      background-color: #1E6EEB;
      margin-right: 8px;
      border-radius: 3px;
    }

    .header_text {
      color: #2D405E;
      font-size: 18px;
      font-weight: bold;
      font-family: PingFang SC;
    }

  }

  //padding: 5px;
  .header_g {
    margin-left: -16px;
  }

  .newList {
    height: calc(100% - 50px);

    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    overflow: hidden;

    ul {
      width: 100%;
      overflow: auto;

      li {
        background-repeat: no-repeat;
        background-size: 100% 100%;

        padding: 19px 0;
        cursor: pointer;
        border-bottom: 1px solid rgba(128, 142, 169, 0.3);

        .normal {
          display: flex;
          justify-content: space-between;
          align-items: center;

          div:first-of-type {
            text-indent: 1em;
            width: 74%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #2D405E;
          }

          div:last-of-type {
            width: 26%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #808EA9;
          }
        }

        .activate {
          display: flex;
          justify-content: space-between;

          .left {
            width: calc(100% - 140px);
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .label {
              font-size: 16px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #1E6EEB;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-indent: 1em;
            }

            .date {
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #808EA9;
              text-indent: 1em;
            }
          }

          img {
            width: 120px;
            height: 68px;
          }
        }


      }

      .active {

      }
    }

    //img {
    //  margin-top: 10px;
    //  width: 40%;
    //  height: 90%;
    //}
  }
}
</style>
