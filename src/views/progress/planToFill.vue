<template>
  <div class="wrapper">
    <div class="header">
      计划填报<span style="margin-left: 5px; color: #f9b633"
        >({{ conponetcode ? conponetcode : "" }})</span
      >
    </div>
    <div>
      <el-form
        ref="form"
        size="small"
        class="bim-form-panel"
        label-position="right"
        label-width="140px"
        :model="form"
      >
        <el-form-item label="计划开始时间" prop="plansttime">
          <el-date-picker
            v-model="form.plansttime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="计划结束时间" prop="planendtime">
          <el-date-picker
            v-model="form.planendtime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="实际开始时间" prop="actulsttime">
          <el-date-picker
            v-model="form.actulsttime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            :disabled=true
          />
        </el-form-item>
        <el-form-item label="实际结束时间" prop="actulendtime">
          <el-date-picker
            v-model="form.actulendtime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            :disabled=true
          />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button plain size="mini" class="btn-bg" @click="submit"
          >提交</el-button
        >
        <el-button plain size="mini" class="btn-bg" @click="handleCancel"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { setConponmentTime, getConponmentTime } from "@/api/progress";
import Bus from "@/assets/eventBus";
import { getToken } from "@/utils/auth";

export default {
  name: "",
  data() {
    return {
      form: {
        plansttime: "",
        planendtime: "",
        actulsttime: "",
        actulendtime: "",
      },
      isDisabled: true,
      conponmentId: null,
      currentInfo: {},
      conponetcode: "",
      dialogVisible: false,
      header: { token: "" }, // 文件上传带token
      rules: {
        // plansttime: [
        //   { required: true, message: "请选择计划开始时间", trigger: "blur" },
        // ],
        // planendtime: [{ required: true, message: '请选择检查日期', trigger: 'blur' }],
        // actulsttime: [{ required: true, message: '请选择检查日期', trigger: 'blur' }],
        // actulendtime: [{ required: true, message: '请选择检查日期', trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    Bus.$on("getProcessById", (item) => {
      this.conponetcode = item.conponetcode;
      this.conponmentId = item.id;
      this.getTime();
    });
    let groupId = getToken("groupId");
    if ([2].includes(groupId)) {
      this.isDisabled = false;
    }
  },
  methods: {
    getTime() {
      getConponmentTime(this.conponmentId).then((res) => {
        let data = res.data;
        this.currentInfo = data;
        this.form = {
          plansttime: data.plansttime || "",
          planendtime: data.planendtime || "",
          actulsttime: data.actulsttime || "",
          actulendtime: data.actulendtime || "",
        };
      });
    },
    submit() {
      // this.$refs["form"].validate((valid) => {
      //   if (valid) {
      let obj = Object.assign({}, this.form);
      let id = this.conponmentId;
      obj.conponentids = [id];
      if (id) {
        setConponmentTime(JSON.stringify(obj)).then((res) => {
          this.$message({
            message: "修改成功",
            type: "success",
            customClass: "message_override",
          });
        });
      } else {
        this.$message({
          message: "请选择构件",
          type: "warn",
          customClass: "message_override",
        });
      }

      //   }
      // });
    },
    handleCancel() {
      let data = this.currentInfo;
      this.form = {
        plansttime: data.plansttime || "",
        planendtime: data.planendtime || "",
        actulsttime: data.actulsttime || "",
        actulendtime: data.actulendtime || "",
      };
    },
  },
  destroyed() {
    Bus.$off("getProcessById");
    Bus.$emit("clearEffect");
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  border: 1px solid #fff;
  .header {
    text-indent: 2em;
    line-height: 50px;
    height: 50px;
    //background-color: #1e374b;
  }
  .bim-form-panel {
    .el-form-item {
      padding: 18px 0;
      border-bottom: 1px solid #c2c4c9;
      margin: 0;
      .el-form-item__label {
      }
    }
  }
}
</style>
