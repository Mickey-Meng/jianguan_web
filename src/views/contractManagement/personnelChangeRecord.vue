<!--
@name:
@description: 人员变更记录
@author: 王海林
@time: 2022-05-11 15:40:36
@modifier:
@modifierTime:
-->
<template>
  <el-container class="container-box">
    <el-header>
      <!--      <el-button type="primary" size="medium" @click="openDialog">新增</el-button>-->
    </el-header>
    <el-main>
      <el-table :data="tableDta" style="width: 100%" border height="100%">
        <el-table-column prop="uploadname" label="标段"></el-table-column>
        <el-table-column prop="uploadname" label="人员变更类型"></el-table-column>
        <el-table-column prop="uploadname" label="变更岗位"></el-table-column>
        <el-table-column prop="uploadname" label="变更前人员"></el-table-column>
        <el-table-column prop="uploadname" label="变更后人员"></el-table-column>
        <el-table-column prop="uploadname" label="录入日期"></el-table-column>
        <el-table-column prop="uploadname" label="负责人"></el-table-column>
        <el-table-column prop="uploadname" label="操作"></el-table-column>
      </el-table>
    </el-main>
    <el-footer></el-footer>
    <el-dialog class="full_global_dialog" title="详情" :fullscreen="true" :visible.sync="dialogFormVisible">
      <el-container class="full_dialog_container">
        <el-main>
          <div class="form_content">
            <el-form ref="form" label-width="120px">
              <div class="header_title">人员变更记录</div>
              <div class="form_item">
                <div class="form_item_title">
                  <div class="title_bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="form_item_content">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="标段">
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="填报人">
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="填报日期">
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

              </div>
              <div class="form_item">
                <div class="form_item_title">
                  <div class="title_bar"></div>
                  <strong>变更信息</strong>
                </div>
                <div class="form_item_content">
                  <el-row :gutter="6">
                    <el-col :span="12">
                      <el-form-item label="项目">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="标段">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6">
                    <el-col :span="12">
                      <el-form-item label="人员变更类型">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="建设单位">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6">
                    <el-col :span="12">
                      <el-form-item label="变更单位">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="变更岗位">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6">
                    <el-col :span="12">
                      <el-form-item label="变更前人员">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="变更前(执业)资格证书号">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6">
                    <el-col :span="12">
                      <el-form-item label="变更后人员">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="变更后(执业)资格证书号">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6">
                    <el-col :span="12">
                      <el-form-item label="变更原因">
                        <el-input type="textarea"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6">
                    <el-col :span="24">
                      <el-form-item label="附件">
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="form_item_table">
                    <el-table :data="fileData" border style="width: 100%;">
                      <el-table-column prop="uploadname" label="附件"></el-table-column>
                      <el-table-column prop="uploadname" label="上传日期"></el-table-column>
                      <el-table-column prop="uploadname" label="上传人"></el-table-column>
                      <el-table-column prop="uploadname" label="操作"></el-table-column>
                    </el-table>
                  </div>
                  <div class="word-wrap">
                    <p>
                      <span style="font-family: FangSong, FangSong_GB2312; font-size: 14px;">
                        <em>应附：替换人与被替换人的简历表、职称证书、学历证书、身份证复印件、工作简历、业绩、社保、资格证书等相关材料。 </em>
                      </span>
                    </p>

                  </div>
                </div>
              </div>
              <div class="form_item">
                <div class="form_item_title">
                  <div class="title_bar"></div>
                  <strong>待处理人</strong>
                </div>
                <div class="form_item_content">
                  <el-row :gutter="6">
                    <el-col :span="12">
                      <el-form-item label="负责人">
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="项目部">
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="form_item">
                <div class="form_item_title">
                  <div class="title_bar"></div>
                  <strong>审核记录</strong>
                </div>
                <div class="form_item_content">
                  <div class="form_item_table">
                    <el-table :data="fileData" border style="width: 100%;">
                      <el-table-column prop="uploadname" label="填报人"></el-table-column>
                      <el-table-column prop="uploadname" label="审核人"></el-table-column>
                      <el-table-column prop="uploadname" label="审核状态"></el-table-column>
                      <el-table-column prop="uploadname" label="备注"></el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
<!--              <div class="form_item" style="text-align: center;padding: 5px 0">-->
<!--                <el-button type="primary">提交</el-button>-->
<!--              </div>-->
            </el-form>

          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        tableDta: [],
        fileData: [],//上传的附件
        form: {},
        dialogFormVisible: true
      };
    },
    created() {
    },
    components: {},
    computed: {},
    methods: {
      openDialog() {
        this.dialogFormVisible = true;
      }
    }
  };
</script>
<style lang='scss' scoped>

</style>
