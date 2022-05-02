<template>
  <div class="header-box">
    <div class="left-box">
      <a href="javascript:void(0)">
        <img src="../../assets/image/logo.jpg" alt="logo" />
        <template v-if="device !== 'mobile'"
          ><span>{{ TopSysNameValue }}</span></template
        >
      </a>

      <div class="main">
        <el-dropdown
          class="avatar-container engineering-dropdown"
          :hide-on-click="true"
          trigger="click"
          @command="handleCommand"
        >
          <span class="el-dropdown-link"
            >{{ name }}<i class="el-icon-arrow-down el-icon--right"
          /></span>
          <el-dropdown-menu slot="dropdown" class="eng-lists user-dropdown">
            <el-dropdown-item
              v-for="(item, index) in engineerings"
              :key="index"
              :command="item"
              >{{ item.engineeringName }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" type="primary" @click="toProject"
          >返回全局视图</el-button
        >
      </div>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar ? avatar : admin" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登陆</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { removeToken } from "@/utils/auth";
import admin from "@/assets/image/admin.png";
import * as api from "@/api/project";
import Bus from "@/assets/eventBus";
import { getAreaLand, getPlanAreas, addManyLand } from "@/api/area";

export default {
  name: "Header",
  data() {
    return {
      admin: admin,
      TopSysNameValue: "",
      engineerings: [],
      name: "",
    };
  },
  computed: {
    ...mapGetters(["device", "avatar", "project"]),
  },
  created() {
    this.initDataFun();
    Bus.$on("updateArea", () => {
      this.initDataFun();
    });
  },
  methods: {
    logout() {
      removeToken("zj_token");
      this.$router.push(`/login`);
    },
    initDataFun() {
      const area_id = this.project.area_id;
      api.getAreasById(this.project.project_info.id).then((res) => {
        if (res.data.length > 0) {
          const obj = res.data.find((e) => e.id == area_id);
          if (obj) {
            this.name = obj.engineeringName;
          } else {
            this.name = res.data[0].engineeringName;
            this.$store.dispatch("project/disposeXY", res.data[0]);
            this.$store.commit("project/WORDSITE_SET", res.data[0].worldSite);
          }
          //  this.checkAreaData(res.data[0].id)
        }
        this.engineerings = res.data;
      });
    },
    getSpaceData() {
      getPlanAreas(this.project.guihua, this.project.xy).then((res) => {
        if (res.data.length > 0 && res.data[0].rows.length > 0) {
          const arr = res.data[0].rows.map((item) => {
            const obj = {
              engineeringId: this.project.area_id,
              floorage: "",
              id: null,
              gid: item.gid,
              landArea: item.landarea,
              landCode: item.landcode,
              landNumber: item.landnumber,
              landProperty: item.layer,
              landType: 2,
              plotRatio: null,
              remark: "",
              site: item.__GEOMJSON__,
              landYxdz: "",
            };
            return obj;
          });
          addManyLand(JSON.stringify(arr)).then((res1) => {
            this.$message({
              message: "新增成功",
              type: "success",
              customClass: "message_override",
            });
          });
        }
      });
    },
    checkAreaData(id) {
      getAreaLand(id).then((res) => {
        if (res.data.length == 0) {
          this.getSpaceData();
        } else {
          this.$message({
            message: "地块已新增",
            type: "info",
          });
        }
      });
    },
    toProject() {
      this.$router.push("/project");
    },
    handleCommand(item) {
      this.name = item.engineeringName;
      this.$store.dispatch("project/disposeXY", item);
      this.$store.commit("project/WORDSITE_SET", item.worldSite);
      this.checkAreaData(item.id);
    },
  },
  components: {},
};
</script>

<style lang='scss' scoped>
.header-box {
  color: #fff;
  font-size: 18px;
  background-color: #041352;
  display: flex;
  justify-content: space-between;
  .left-box {
    display: flex;
    height: 60px;
    padding: 0 10px 0 10px;
    align-items: center;
    button {
      margin-left: 40px;
    }

    a {
      display: inline-block;
      height: 100%;
      line-height: 60px;
      cursor: pointer;
      text-decoration: none;
      overflow: hidden;

      img {
        width: 40px;
        height: 40px;
        vertical-align: middle;
        margin-right: 7px;
      }

      span {
        display: inline-block;
        margin: 0;
        font-weight: 600;
        line-height: 60px;
        vertical-align: middle;
      }
    }
    .main {
      margin-left: 20px;
      display: flex;
      align-items: center;
    }
  }
}

.main {
  height: 100%;
  .engineering-dropdown {
    color: #00fdf8;
  }
}

.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;
    color: #fff;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        vertical-align: middle;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}

.user-dropdown {
  padding: 0px;
  min-width: 140px;
  background-color: #052165;
  color: #fff;
  border-radius: 5px;
  border: 1px solid #00f6ff;

  .el-dropdown-menu__item {
    padding: 0;
    margin: 0;
  }
}
.el-dropdown-menu__item--divided {
  border-top: 0px;
  color: #fff;
  text-align: center;
  &:hover {
    background-color: #052165;
  }
}
.el-dropdown-menu__item--divided:before {
  background-color: #052165;
  margin: 0px;
  height: 0px;
}
::v-deep .popper__arrow::after {
  border-bottom-color: #00f6ff !important;
  top: 0px !important;
}

::v-deep.popper__arrow {
  border-bottom-color: #00f6ff !important;
}

.eng-lists {
  .el-dropdown-menu__item {
    color: #fff;
    text-align: center;
    &:hover {
      background-color: #052165;
      columns: #00f6ff;
    }
  }
}
</style>
