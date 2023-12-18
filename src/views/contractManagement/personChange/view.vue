<template>
  <div>

    <div class="form-content">
      <div class="form-bg">
        <el-form ref="form" :model="form" label-width="80px">
          <div class="form-title">
            <div class="title-big-bar"></div>
            <strong>人员变更</strong>
          </div>
          <div class="form-block">
            <div class="form-block-title">
              <div class="title-bar"></div>
              <strong>基本信息</strong>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">标段</div>
                <div class="block-item-value">
                  <el-input readonly v-model="form.projectChildName"></el-input>
                </div>
              </div>
              <div class="block-item">
                <div class="block-item-label">填报人</div>
                <div class="block-item-value">
                  <el-input readonly v-model="form.recorder"></el-input>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">填报日期</div>
                <div class="block-item-value">
                  {{ form.subDate }}
                </div>
              </div>
            </div>
          </div>
          <div class="form-block">
            <div class="form-block-title">
              <div class="title-bar"></div>
              <strong>变更信息</strong>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">项目</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-input readonly v-model="form.projectName"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="block-item">
                <div class="block-item-label">标段</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-input readonly v-model="form.projectChildName"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">人员变更类型</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    {{ form.changeTypeName }}
                  </el-form-item>
                </div>
              </div>
              <div class="block-item">
                <div class="block-item-label">变更岗位</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    {{ form.changePostName }}
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">变更前人员</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    {{ form.beforePerson }}
                  </el-form-item>
                </div>
              </div>
              <div class="block-item">
                <div class="block-item-label">变更前(执业)资格证书号</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-input v-model="form.beforeCode"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">变更后人员</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    {{ form.afterPerson }}
                  </el-form-item>
                </div>
              </div>
              <div class="block-item">
                <div class="block-item-label">变更后(执业)资格证书号</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-input v-model="form.afterCode"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">变更单位</div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-input readonly v-model="form.changeUnitName"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="form-block">
            <div class="form-block-title">
              <div class="title-bar"></div>
              <strong>附件</strong>
              <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
                xisx xis pdf文件，且不超过100m</span>
            </div>
            <div class="block-line" style="height: 35px;">
              <div class="block-table-btns">
                <el-button size="small" type="primary" @click="downloadFileEvent">下载全部</el-button>
              </div>
            </div>

            <div class="form-block">

              <div class="form-block-title">
                <div class="title-bar"></div><strong>合同附件</strong>
                <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
              </div>

              <attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
            </div>

<!--            <div class="block-table">-->
<!--              <el-table :data="fileData" border style="width: 100%;">&ndash;&gt;-->
<!--                <el-table-column prop="fileName" label="附件"></el-table-column>-->
<!--                <el-table-column prop="uploadTime" label="上传日期"></el-table-column>-->
<!--                <el-table-column prop="uploadPerson" label="上传人"></el-table-column>-->
<!--              </el-table>-->
<!--            </div>-->
            <div class="block-line">
              <p>
                <span style="font-family: FangSong, FangSong_GB2312; font-size: 14px;">
                  <em>应附：替换人与被替换人的简历表、职称证书、学历证书、身份证复印件、工作简历、业绩、社保、资格证书等相关材料。 </em>
                </span>
              </p>
            </div>
          </div>
          <!--          <div class="form-block">-->
          <!--            <div class="form-block-title">-->
          <!--              <div class="title-bar"></div>-->
          <!--              <strong>待处理人</strong>-->
          <!--            </div>-->
          <!--            <div class="block-line">-->
          <!--              <div class="block-item">-->
          <!--                <div class="block-item-label">负责人<i class="require-icon"></i></div>-->
          <!--                <div class="block-item-value">-->
          <!--                  <el-form-item prop="qualityCheckUser">-->

          <!--                  </el-form-item>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="block-item">-->
          <!--                <div class="block-item-label">项目部<i class="require-icon"></i></div>-->
          <!--                <div class="block-item-value">-->
          <!--                  <el-form-item prop="qualityCheckUser">-->

          <!--                  </el-form-item>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="form-block">
            <!--            <el-button class="submit-btn" size="small" type="primary" @click="submitInfo">提交-->
            <!--            </el-button>-->
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import { getPersonChangeByProcessId } from "@/api/staffApproval";
import { downLoadFile } from "@/utils/download";
import { getToken } from "@/utils/auth";
import attachlist from "@/views/common/attachlist.vue";

export default {
  props: [],
  watch: {},
  data() {
    return {
      form: {},
      userOptions: [],
      tableData: [],
      fileData: [],
      attachTable: []
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])
  },
  methods: {
    getDetail(id) {
      let type = getToken("taskType");
      let obj = {
        projectid: this.project.id,
        businessKey: id,
        type
      };
      getPersonChangeByProcessId(obj).then((res) => {
        if (res) {
          // let obj = res.data[0];
          // this.form = Object.assign({}, obj);
          // this.fileData = obj.files;
          this.form = res.data.ZjPersonChange;
          // this.fileData = res.data.ZjPersonChangeFile;
          for (let j = 0; j < res.data.ZjPersonChangeFile.length; j++) {
            res.data.ZjPersonChangeFile[j].creatorName = res.data.ZjPersonChangeFile[j].uploadPerson;
          }
          this.attachTable = res.data.ZjPersonChangeFile;
        }
      });
    },
    downloadFileEvent() {
      if (this.fileData && this.fileData.length > 0) {
        this.fileData.forEach(item => {
          downLoadFile(item.fileId);
        });
      }
    }
  },
  components: {attachlist},
  beforeDestroy() {
  }

};
</script>

<style lang='scss' scoped>
@import "../../../assets/css/table.scss";
@import "../../../assets/css/dialog.scss";

.form-bg {
  .form-block {
    .block-item-label {
      width: 180px !important;
    }

    .block-item-value {
      width: calc(100% - 200px) !important;
    }

    .el-date-editor {
      width: 100% !important;
    }
  }
}
</style>
