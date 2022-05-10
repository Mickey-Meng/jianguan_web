<!--
 * @Descripttion:岗位管理
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 16:38:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 19:55:07
-->
<template>
  <el-container>
    <el-header
      ><el-button type="primary" @click="openDialog"
        >新增岗位</el-button
      ></el-header
    >
    <el-main>
      <el-table :data="tableData" border style="width: 100%" height="100%">
        <el-table-column prop="post" label="岗位名称"> </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table>
    </el-main>
    <el-dialog
      :title="isCreate ? '新增岗位信息' : '修改岗位信息'"
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
        <el-form-item label="岗位名称" prop="post">
          <el-input placeholder="请输入岗位名称" v-model="form.post"></el-input>
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
import { getAllPost, addPost } from "@/api/system";
export default {
  data() {
    return {
      tableData: [],
      isCreate: true,
      dialogVisible: false,
      form: {},
      rules: {
        post: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
      },
    };
  },
  created() {
    this.init();
  },
  components: {},
  computed: {},
  methods: {
    init() {
      getAllPost().then((res) => {
        console.log(res);
      });
    },
    openDialog() {
      this.isCreate = true;
      this.form = {};
      this.dialogVisible = true;
    },
    addInfo() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          alert("submit!");
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
  }
}
</style>
