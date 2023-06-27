<template>
  <div>
    <div class="form-content">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="80px">
        <div class="form-title">
          <div class="title-big-bar"></div>
          <strong>计划申报-施工图管理</strong>
        </div>

        <div class="form-block">
          <div class="form-block-title">
            <div class="title-bar"></div><strong>基本信息</strong>
          </div>

          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">施工图名称</div>
              <div class="block-item-value">{{ formData.name }}</div>
            </div>

            <div class="block-item">
              <div class="block-item-label">施工图内容</div>
              <div class="block-item-value">{{ formData.contents }}</div>
            </div>
          </div>


          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">计划开始时间</div>
              <div class="block-item-value">{{ formData.startTime }}</div>
            </div>
            <div class="block-item">
              <div class="block-item-label">计划结束时间</div>
              <div class="block-item-value">{{ formData.endTime }}</div>
            </div>
          </div>

          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">上报时间</div>
              <div class="block-item-value">{{ formData.reportTime }}</div>
            </div>
            <div class="block-item">
              <div class="block-item-label">上报人</div>
              <div class="block-item-value">{{ formData.reportUser }}</div>
            </div>
          </div>

          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">责任人</div>
              <div class="block-item-value">{{ formData.owner }}</div>
            </div>

            <div class="block-item">
              <div class="block-item-label">备注</div>
              <div class="block-item-value">{{ formData.remark }}</div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/constructionDesign/planConstructionDesign.js";
import { getUserInfo } from "@/api/user";
import attachlist from "../../common/attachlist"
import projectinfo from "../../common/projectinfo.vue"

import {
  formatMonth,
  formatDate,
} from "@/utils/format.js";

export default {
  data() {
    return {
      dialogTitle: '全生命周期智慧建设管理平台',
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
      api.getPlanConstructionDesignDetail(id).then((res) => {
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
@import "../../../assets/css/dialog.scss";
</style>
