<!--
 * @Descripttion: 工点管理
 * @version:
 * @Author: WangHarry
 * @Date: 2021-10-19 10:48:02
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-08 14:18:27
-->
<template>
  <el-container>
    <el-header
      ><el-button type="primary" @click="openDialog"
        >新增工点</el-button
      ></el-header
    >
    <el-main>
      <div class="info_item" v-for="(item, index) in lists" :key="index">
        <div>
          <el-form
            :model="item"
            :ref="'form' + item.id"
            size="small"
            label-position="right"
            label-width="80px"
            :rules="rules"
          >
            <el-form-item label="工点名称" prop="groupid">
              <el-select
                v-model="item.groupid"
                placeholder=""
                filterable
                class="site_select"
              >
                <el-option
                  v-for="item in projects"
                  :key="item.groupid"
                  :label="item.projectname"
                  :value="item.groupid"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="施工工序" prop="process">
              <el-input
                placeholder="请输入施工工序"
                v-model="item.process"
              ></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="设计数量" prop="desginnum">
              <el-input
                placeholder="请输入设计数量"
                v-model="item.desginnum"
              ></el-input>
            </el-form-item>
            <el-form-item label="完成数量" prop="finishnum">
              <el-input
                placeholder="请输入完成数量"
                v-model="item.finishnum"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="工点类型" prop="type">
              <el-select v-model="item.type" placeholder="" class="site_select">
                <el-option
                  v-for="item in types"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经纬度" prop="longlatitude">
              <el-input
                placeholder="请输入经纬度"
                v-model="item.longlatitude"
              ></el-input>
            </el-form-item>
            <el-form-item label="高程" prop="altitude">
              <el-input
                placeholder="请输入高程"
                v-model="item.altitude"
              ></el-input>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input
                placeholder="请输入备注"
                v-model="item.remark"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="update_btn">
            <el-button size="mini" type="primary" @click="updateInfo(item)"
              >更新</el-button
            >
            <el-button size="mini" type="danger" @click="deleteInfo(item)"
              >删除</el-button
            >
          </div>
        </div>
      </div>
    </el-main>
    <el-dialog
      title="新增工点信息"
      :visible.sync="dialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        v-if="dialogVisible"
        ref="form"
        size="small"
        label-position="right"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="工点名称" prop="groupid">
          <el-select
            v-model="form.groupid"
            placeholder="请选择工点"
            filterable
            class="site_select"
          >
            <el-option
              v-for="item in projects"
              :key="item.groupid"
              :label="item.projectname"
              :value="item.groupid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="施工工序" prop="process">
          <el-input
            placeholder="请输入施工工序"
            v-model="form.process"
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="设计数量" prop="desginnum">
          <el-input
            placeholder="请输入设计数量"
            v-model="form.desginnum"
          ></el-input>
        </el-form-item>
        <el-form-item label="完成数量" prop="finishnum">
          <el-input
            placeholder="请输入完成数量"
            v-model="form.finishnum"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="工点类型" prop="type">
          <el-select
            v-model="form.type"
            filterable
            placeholder="请选择类型"
            class="site_select"
          >
            <el-option
              v-for="item in types"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纬度" prop="longlatitude">
          <el-input
            placeholder="请输入经纬度(','分割)"
            v-model="form.longlatitude"
          ></el-input>
        </el-form-item>
        <el-form-item label="高程" prop="altitude">
          <el-input placeholder="请输入高程" v-model="form.altitude"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入备注" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="addInfo">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import * as api from "@/api/system";
import { getProjectTypeData } from "@/api/progress";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        desginnum: "",
        finishnum: "",
        groupid: "",
        groupname: "",
        longlatitude: "",
        process: "",
        projectcode: "",
        projectname: "",
        remark: "",
        altitude: "",
        type: 1,
      },
      rules: {
        groupid: [{ required: true, message: "请选择工点", trigger: "change" }],
        type: [
          { required: true, message: "请选择工点类型", trigger: "change" },
        ],
        process: [
          { required: true, message: "请选择正在施工的工序", trigger: "blur" },
        ],
        // desginnum: [
        //   { required: true, message: "请输入设计数量", trigger: "blur" },
        // ],
        // finishnum: [
        //   { required: true, message: "请输入完成数量", trigger: "blur" },
        // ],
        longlatitude: [
          { required: true, message: "请输入经纬度", trigger: "blur" },
        ],
      },
      lists: [],
      types: [
        {
          name: "桥",
          key: 1,
        },
        {
          name: "路",
          key: 2,
        },
        {
          name: "隧",
          key: 3,
        },
      ],
      projects: [],
    };
  },
  created() {
    this.init();
  },
  components: {},
  computed: {},
  methods: {
    async init() {
      getProjectTypeData().then((res) => {
        api.getWorkPoint().then((res1) => {
          this.projects = res.data;
          this.lists = res1.data;
          console.log(this.lists);
        });
      });
    },
    openDialog() {
      this.form = {
        desginnum: "",
        finishnum: "",
        groupid: "",
        groupname: "",
        longlatitude: "",
        process: "",
        projectcode: "",
        projectname: "",
        remark: "",
        altitude: "",
        type: 1,
      };
      this.dialogVisible = true;
    },
    addInfo() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, this.form);
          let p = this.projects.find((e) => e.groupid === obj.groupid);
          obj.projectcode = p?.projectid;
          obj.projectname = p?.projectname;
          api.addWorkPoint(obj).then((res) => {
            this.dialogVisible = false;
            this.init();
            this.$message({
              message: "添加成功",
              type: "success",
              customClass: "message_override",
            });
          });
        } else {
          return false;
        }
      });
    },
    deleteInfo(item) {
      this.$confirm("删除信息？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.deleteWorkPoint(item.id).then((res) => {
            this.init();
            this.$message({
              message: "删除成功",
              type: "success",
              customClass: "message_override",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    updateInfo(item) {
      let key = "form" + item.id;
      let vuecomponent = this.$refs[key];
      let info = null;
      if (vuecomponent.constructor === Array) {
        info = vuecomponent[0];
      } else if (vuecomponent.constructor === Object) {
        info = vuecomponent;
      }
      info.validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, item);
          let p = this.projects.find((e) => e.groupid === obj.groupid);
          obj.projectcode = p?.projectid;
          obj.projectname = p?.projectname;
          api.updateWorkPoint(obj).then((res) => {
            this.init();
            this.$message({
              message: "更新成功",
              type: "success",
              customClass: "message_override",
            });
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.el-container {
  height: 100%;
  .el-main {
    margin-top: 10px;
    flex-wrap: wrap;
    background-color: #fff;
    justify-content: flex-start !important;
    .info_item {
      width: 25%;
      height: 50%;
      .update_btn {
        text-align: center;
      }
    }
  }
}
.site_select {
  width: 100%;
}
</style>
