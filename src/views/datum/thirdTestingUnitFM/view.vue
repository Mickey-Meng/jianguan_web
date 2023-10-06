<template>
  <div>

    <div class="form-content">
      <el-form ref="form" label-width="80px">

        <div class="form-block">
          <div class="form-block-title">
            <div class="title-bar"></div><strong>合同付款1</strong>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">资料类型</div>
              <div class="block-item-value">
                {{formData.typeDesc}}
              </div>
            </div>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">资料名称</div>
              <div class="block-item-value">
                {{formData.filename}}
              </div>
            </div>
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
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/contractPayment";
import { getUserInfo } from "@/api/user";
import { getFileInfo } from "@/api/thirdTestingUnitFM";
import attachlist from "../../common/attachlist"
import projectinfo from "../../common/projectinfo.vue"

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
        projectName:'池州市平天湖东部区域棚户区改造建设工程EPC总承包',
        buildSectionName: '235国道项目部',
        contractCode: 'ORG_00004',
        startupUser: '赵赞文',
        startupDate: formatMonth(new Date()),
      },
      formData: { //表单参数
        attachment: [],
        contractCode: '',
        information: [],
        contractUser: '',
        deletedFlag: 1,
        draftFlag: 1,
        buildSection: this.$store.getters.project.id,
        projectId:this.$store.getters.project['parentid'],
        startDate:formatDate(new Date())
      },
      attachTable: [], //附件
      contractTable: []
    };
  },
  created() {},
  components: {
    attachlist,
    projectinfo
  },
  computed: {
    toFixedAmount(detail) {
      return detail.formData.amount.toFixed(2);
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    getUserInfo(id) {
      getUserInfo(id).then(res => {
        this.baseInfo.startupUser = res.data.userInfo.NAME;
      });
    },
    getDetail(id) {
      getFileInfo(id).then(res => {
        this.formData = res.data;
        this.attachTable = [JSON.parse(res.data.fileurl)];
        console.log(res.data)
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/dialog.scss";
</style>
