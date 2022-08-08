<template>
  <div class="header_box">
    <div class="title"></div>
    <ul class="time_date">
      <li class="time">{{ nowTime }}</li>
      <li class="date">{{ nowDate }}</li>
      <li class="week">{{ nowday }}</li>
    </ul>
    <ul class="weather">
      <!--      <li class="time"></li>-->
      <li class="text"> {{ weather.weather ? weather.weather : "" }}</li>
      <li class="tem">{{ weather.temperature ? weather.temperature + "℃" : "" }}</li>
    </ul>

  </div>
</template>

<script>
  import {getNowDatehs, getDay, getCurrentDate} from "@/utils/date";
  import {getTodayWeather} from "@/api/system";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        nowTime: "",
        nowDate: "",
        nowday: "",
        weather: {},
        weatherTimer: null,
        dateTimer: null
      };
    },
    created() {
      this.initWeather();
      this.dateTimer = setInterval(() => {
        this.nowTime = getNowDatehs();
      }, 1000);
      this.weatherTimer = setInterval(() => {
        this.initWeather();
      }, 1000 * 60);
      this.nowDate = getCurrentDate();
      switch (getDay()) {
        case 1:
          this.nowday = "星期一";
          break;
        case 2:
          this.nowday = "星期二";
          break;
        case 3:
          this.nowday = "星期三";
          break;
        case 4:
          this.nowday = "星期四";
          break;
        case 5:
          this.nowday = "星期五";
          break;
        case 6:
          this.nowday = "星期六";
          break;
        case 0:
          this.nowday = "星期天";
          break;
      }
    },
    mounted() {
    },
    methods: {
      initWeather() {
        getTodayWeather().then(res => {
          let data = res.data || [];
          data.sort((a, b) => b.id - a.id);
          if (data && data.length > 0) {
            this.weather = data[0];
          }
        });
      }
    },
    components: {},
    beforeDestroy() {
      this.dateTimer && clearInterval(this.dateTimer);
      this.weatherTimer && clearInterval(this.weatherTimer);
    }

  };
</script>

<style lang='scss' scoped>
  .header_box {
    position: relative;

    .title {
      position: absolute;
      width: 577px;
      height: 45px;
      left: 50%;
      transform: translateX(-50%);
      top: 13px;
      background: url("../../../assets/mapView/头部文字.png") no-repeat;
      background-size: 100% 100%;
    }

    .time_date {
      position: absolute;
      left: 40px;
      top: 57px;
      display: flex;
      align-items: center;

      .time {
        height: 35px;
        font-size: 32px;
        font-family: Furore;
        color: #FFFFFF;
        line-height: 36px;
        letter-spacing: 1px;
        -webkit-text-stroke: 1px #1671E9;
        text-stroke: 1px #1671E9;
        background: linear-gradient(180deg, rgba(22, 113, 233, 0) 0%, #1671E9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .date {
        margin: 0 19px 0 16px;
      }

      .date, .week {
        height: 27px;
        font-size: 20px;
        font-family: CKTKingKong;
        color: #FFFFFF;
        line-height: 27px;
      }
    }

    .weather {
      position: absolute;
      right: 40px;
      top: 57px;
      display: flex;
      align-items: center;
      font-size: 20px;
      font-family: CKTKingKong;
      color: #FFFFFF;

      li {
        margin-left: 18px;
      }
    }
  }

</style>
