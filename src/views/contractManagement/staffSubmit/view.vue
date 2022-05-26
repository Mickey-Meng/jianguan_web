<!--
@name:
@description:
@author: 王海林
@time: 2022-05-25 10:57:08
@modifier:
@modifierTime:
-->
<template>
  <div>

    <div class="form-content">
      <div class="form-bg">
        <el-form ref="form" :model="form" label-width="80px">
          <div class="form-title">
            <div class="title-big-bar"></div>
            <strong>人员填报</strong>
            <!--                    <div class="form-btns">-->
            <!--                      <el-button size="medium">暂存</el-button>-->
            <!--                      <el-button size="medium">保存草稿</el-button>-->
            <!--                      <el-button size="medium">选择草稿</el-button>-->
            <!--                      <el-button size="medium" type="primary">复制填充</el-button>-->
            <!--                    </div>-->
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
                  {{ form.projectName }}
                </div>
              </div>
              <div class="block-item">
                <div class="block-item-label">记录人</div>
                <div class="block-item-value">
                  <el-input v-model="form.recorder" readonly></el-input>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">报审日期</div>
                <div class="block-item-value">
                  <el-date-picker
                    v-model="form.subDate"
                    type="datetime"
                    :clearable="false"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </div>
              </div>
              <div class="block-item">
                <div class="block-item-label">人员类型</div>
                <div class="block-item-value">
                  <el-form-item prop="projectChargeUser">
                    {{ form.isContract == 1 ? "合同人员" : "非合同人员" }}
                    <!--                    <el-select v-model="form.isContract" placeholder="请选择">-->
                    <!--                      <el-option label="合同人员" value="1"></el-option>-->
                    <!--                      <el-option label="非合同人员" value="0" :disabled="true"></el-option>-->
                    <!--                    </el-select>-->
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">是否自管</div>
                <div class="block-item-value">
                  {{ project.isauto === 1 ? "自管" : "非自管" }}
                </div>
              </div>
            </div>
          </div>
          <div class="form-block">
            <div class="form-block-title">
              <div class="title-bar"></div>
              <strong>报审信息</strong>
            </div>
            <!--            <div class="block-line">-->
            <!--              <el-button size="small" type="primary" @click="addRow">添加行</el-button>-->
            <!--            </div>-->
            <div class="block-table">
              <el-table
                :data="tableData"
                border
                class="have_scrolling"
                style="width: 100%">
                <el-table-column
                  label="姓名"
                  prop="name"
                  width="160">
                </el-table-column>

                <el-table-column
                  label="身份证号"
                  width="220"
                  prop="identityId">
                </el-table-column>
                <el-table-column
                  label="有效期"
                  width="320"
                  prop="identityTime">
                </el-table-column>
                <el-table-column
                  label="性别"
                  width="120">
                  <template slot-scope="{row}">
                    {{ row.gender == 1 ? "男" : "女" }}

                  </template>
                </el-table-column>
                <el-table-column
                  label="岗位"
                  width="150"
                  prop="post">
                </el-table-column>
                <el-table-column
                  label="证件名称"
                  width="250"
                  prop="certificateName">
                </el-table-column>
                <el-table-column
                  label="证件编号"
                  width="250"
                  prop="certificateCode">
                </el-table-column>
                <el-table-column
                  label="发证单位"
                  width="250"
                  prop="issuer">
                </el-table-column>
                <el-table-column
                  label="有效期"
                  width="320"
                  prop="effectiveTime">

                </el-table-column>
                <el-table-column
                  label="文化程度"
                  width="120"
                  prop="education">
                </el-table-column>
                <el-table-column
                  label="脸部照片"
                  width="120"
                  align="center">
                  <template slot-scope="{row}">
                    <img-viewer :img-list="[row.peoplePic]"></img-viewer>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="form-block">
            <div class="form-block-title">
              <div class="title-bar"></div>
              <strong>待处理人</strong>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">施工经理<i class="require-icon"></i></div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-select v-model="form.qualityCheckUser" placeholder="请选择">
                      <el-option v-for="item in userOptions" :key="item.value"
                                 :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">合同专监<i class="require-icon"></i></div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-select v-model="form.qualityCheckUser" placeholder="请选择">
                      <el-option v-for="item in userOptions" :key="item.value"
                                 :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">监理总监<i class="require-icon"></i></div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-select v-model="form.qualityCheckUser" placeholder="请选择">
                      <el-option v-for="item in userOptions" :key="item.value"
                                 :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">全咨业主<i class="require-icon"></i></div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-select v-model="form.qualityCheckUser" placeholder="请选择">
                      <el-option v-for="item in userOptions" :key="item.value"
                                 :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="block-line">
              <div class="block-item">
                <div class="block-item-label">建设单位业主<i class="require-icon"></i></div>
                <div class="block-item-value">
                  <el-form-item prop="qualityCheckUser">
                    <el-select v-model="form.qualityCheckUser" placeholder="请选择">
                      <el-option v-for="item in userOptions" :key="item.value"
                                 :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="form-block">
            <!--            <el-button class="submit-btn" size="small" type="primary" @click="submitStaffInfo">提交-->
            <!--            </el-button>-->
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  // import * as api from "@/api/contract";
  import {mapGetters} from "vuex";
  import {getStaffByProcessIdAndProjectId} from "@/api/staffApproval";

  export default {
    data() {
      return {
        dialogTitle: "项目全生命周期数字管理平台",
        dialogFormVisible: false,

        // baseInfo: {
        //   buildSection: 1,
        //   buildSectionName: '235国道项目部',
        //   contractCode: '',
        //   buildCompany: '',
        //   supervisionUnit: '',
        // },
        // formData: { //表单参数
        //   attachment: [],
        //   buildSection: '4',
        //   commandUser: 1,
        //   contractCode: '',
        //   contractInfo: [],
        //   contractUser: '',
        //   deletedFlag: 1,
        //   draftFlag: 1,
        //   projectId: this.$store.getters.project['id'],
        //   projectManageUser: 1,
        //   projectName: '',
        //   supervisionUser: 1
        // },
        // attachTable: [], //附件
        // contractTable: [],
        form: { //基础信息

        },
        tableData: [],//报审的数据
        userOptions: []
      };
    },
    created() {
    },
    components: {},
    computed: {
      ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])

    },
    watch: {},
    mounted() {

    },
    methods: {
      getDetail(id) {
        let obj = {
          projectid: this.project.id,
          businessKey: id
        };
        getStaffByProcessIdAndProjectId(obj).then((res) => {
          if (res) {
            this.form = Object.assign({}, res.data.person);
            let data = res.data.personSub;
            console.log(data, this.form);
            if (data && data.length > 0) {
              this.tableData = data.map(item => {
                if (item.peoplePic) {
                  item.peoplePic = this.getUrl + item.peoplePic;
                }
                return item;
              });
            }
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/css/dialog.scss"
</style>
