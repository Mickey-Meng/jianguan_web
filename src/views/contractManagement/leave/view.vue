<!--
@name:
@description:
@author: 王海林
@time: 2022-05-27 18:06:43
@modifier:
@modifierTime:
-->
<template>
  <div>

    <div class="form-content">
      <el-form ref="form" :model="form" label-width="80px">
        <div class="form-title">
          <div class="title-big-bar"></div>
          <strong>请假申请</strong>
        </div>
        <div class="form-block">
          <div class="form-block-title">
            <div class="title-bar"></div>
            <strong>基本信息</strong>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">请假人</div>
              <div class="block-item-value">
                {{ form.leaverPersonName }}
              </div>
            </div>
            <div class="block-item">
              <div class="block-item-label">请假类型</div>
              <div class="block-item-value">
                {{ form.leaverType }}
              </div>
            </div>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">请假时间</div>
              <div class="block-item-value">
                {{ form.startTime }} - {{ form.endTime }}
              </div>
            </div>
            <div class="block-item">
              <div class="block-item-label">请假天数</div>
              <div class="block-item-value">
                <el-form-item prop="projectChargeUser">
                  {{ form.leaveDay }}
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">工作交接人</div>
              <div class="block-item-value">
                <el-form-item prop="projectChargeUser">
                  {{ form.handoffPerson }}
                </el-form-item>
              </div>
            </div>
            <div class="block-item">
              <div class="block-item-label">请假原因</div>
              <div class="block-item-value">
                <el-form-item prop="projectChargeUser">
                  {{ form.leaveReason }}
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">备注</div>
              <div class="block-item-value">
                <el-form-item prop="projectChargeUser">
                  {{ form.remark }}
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
<!--        <div class="form-block">-->
<!--          <div class="form-block-title">-->
<!--            <div class="title-bar"></div>-->
<!--            <strong>待处理人</strong>-->
<!--          </div>-->
<!--          <div class="block-line">-->
<!--            <div class="block-item">-->
<!--              <div class="block-item-label">施工经理-->
<!--                &lt;!&ndash;                      <i class="require-icon"></i>&ndash;&gt;-->
<!--              </div>-->
<!--              <div class="block-item-value">-->
<!--                <el-form-item prop="qualityCheckUser">-->
<!--                  <el-select v-model="form.qualityCheckUser" placeholder="请选择">-->
<!--                    <el-option v-for="item in userOptions" :key="item.value"-->
<!--                               :label="item.label" :value="item.value">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </el-form>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getLeaveByProcessId} from "@/api/staffApproval";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        form: {},
        userOptions: []
      };
    },
    created() {
    },
    computed: {
      ...mapGetters(["project"])
    },
    mounted() {
    },
    methods: {
      getDetail(id) {
        let obj = {
          projectId: this.project.id,
          businessKey: id
        };
        getLeaveByProcessId(obj).then((res) => {
          if (res) {
            let obj = res.data[0];
            this.form = Object.assign({}, obj);
          }
        });
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  @import "../../../assets/css/table.scss";
  @import "../../../assets/css/dialog.scss";

</style>
