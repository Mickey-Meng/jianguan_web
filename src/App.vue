<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-18 14:06:37
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "App",
  data() {
    return {
      timer: null,
    };
  },
  mounted() {
    let whiteRouter = ["/home", "/pandect","/mapView"];
    if (whiteRouter.includes(this.$route.path)) {
    } else {
      let projectInfo = getToken("project_info");
      if (projectInfo) {
        let menus = getToken("routerMenus");
        if (menus && menus.length > 0) {
          let o = menus[0];
          if (o.children) {
            let path = o.children[0];
            this.$router.push(path.path);
          } else {
            this.$router.push("/data");
          }
        } else {
          this.$router.push("/data");
        }
      } else {
        this.$router.push("/home");
      }

    }
  },
  methods: {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>
