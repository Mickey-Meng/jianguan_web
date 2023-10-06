<template>
  <div>
    <div class="form-content">
      <el-form ref="form" label-width="80px">
        <div class="form-block">
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">晨检内容</div>
              <div class="block-item-value">
                {{ formData.content }}
              </div>
            </div>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">上报人</div>
              <div class="block-item-value">
                {{ formData.reportPeople }}
              </div>
            </div>

            <div class="block-item">
              <div class="block-item-label">上报时间</div>
              <div class="block-item-value">
                {{ formData.reportTime }}
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
          <attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/dailyReport";
import {getUserInfo} from "@/api/user";
import attachlist from "../common/attachlist.vue"
import projectinfo from "../common/projectinfo.vue"

import {
  formatMonth,
  formatDate,
} from "@/utils/format.js";

export default {
  data() {
    return {
      dialogTitle: '项目全生命周期数字管理平台',
      dialogFormVisible: false,

      baseInfo: {
        buildSection: 1,
        projectName: '池州市平天湖东部区域棚户区改造建设工程EPC总承包',
        buildSectionName: '235国道项目部',
        contractCode: 'ORG_00004',
        startupUser: '赵赞文',
        startupDate: formatMonth(new Date()),
      },
      formData: { //表单参数
        attachment: [],
        content: '',
        reportPeople: '',
        reportTime: null,
        buildSection: this.$store.getters.project.id,
        projectId: this.$store.getters.project['parentid'],
        startDate: formatDate(new Date())
      },
      attachTable: [], //附件
      contractTable: []
    };
  },
  created() {
  },
  components: {
    attachlist,
    projectinfo
  },
  computed: {
    toFixedAmount(detail) {
      return detail.formData.amount.toFixed(2);
    }
  },
  watch: {},
  mounted() {
  },
  methods: {
    getUserInfo(id) {
      getUserInfo(id).then(res => {
        this.baseInfo.startupUser = res.data.userInfo.NAME;
      });
    },
    getDetail(id) {
      api.getDailyReportDetail(id).then((res) => {
        let data = res['data'] || {};
        this.formData = data;
        this.attachTable = data.attachment || [];
        this.getUserInfo(data.createUserId)
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/dialog";
</style>
