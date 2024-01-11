<template>
  <div>
    <div class="form-content">
      <el-form :model="formData" ref="ruleForm" label-width="80px">
        <div class="form-title">
        <div class="title-big-bar"></div>
        <strong>工序报验</strong>
        </div>

        <div class="form-block">
        <div class="form-block-title">
          <div class="title-bar"></div><strong>基本信息</strong>
        </div>
        <div class="block-line">

          <div class="block-item">
          <div class="block-item-label">具体部位</div>
          <div class="block-item-value">
            <el-form-item prop="conponenttypename">
            <el-input v-model="component.conponenttypename" disabled></el-input>
            </el-form-item>
          </div>
          </div>

          <div class="block-item">
          <div class="block-item-label">构建编码</div>
          <div class="block-item-value">
            <el-form-item prop="componentcode">
            <el-input v-model="component.conponentcode" disabled></el-input>
            </el-form-item>
          </div>
          </div>
        </div>

        <div class="block-line">
          <div class="block-item">
            <div class="block-item-label">工序名称</div>
            <div class="block-item-value">
              <el-form-item prop="name">
                <el-input v-model="produceAndRecode.producename" disabled></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="block-item">
            <div class="block-item-label">提交时间</div>
            <div class="block-item-value">
              <el-form-item prop="finish">
                <el-date-picker value-format="yyyy-MM-dd" v-model="produceAndRecode.updatetime" type="date" disabled></el-date-picker>
              </el-form-item>
            </div>
          </div>

        </div>

        <div class="block-line">
          <div class="block-item">
            <div class="block-item-label">备注</div>
            <div class="block-item-value">
              <el-form-item prop="pjctype">
                <el-input v-model="component.name" disabled></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>

      <div class="form-block">
        <div class="form-block-title">
          <div class="title-bar"></div><strong>现场照片</strong>
          <span style="font-size: 12px;margin-left: 40px;">支持上传jpg、jpeg、png文件,且不超过10M</span>
        </div>
        <attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
      </div>


        <div class="form-block">
          <div class="form-block-title">
            <div class="title-bar"></div><strong>应填表格</strong>
          </div>
          <div class="block-table">
            <el-table :data="templateListData" style="width: 100%" border class="have_scrolling">
              <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
              <el-table-column prop="documentName" width="500" align="center" label="表格名称"></el-table-column>
              <el-table-column label="状态" width="150" align="center">
                <template slot-scope="{ row }">
                  {{ row.documentStatus === 1 ? "已填写" :  "待填写" }}
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="200" align="center" label="操作">
                <template slot-scope="{ row, $index }">
                <!-- <el-button type="text" size="mini" @click="preview(row)">预览</el-button> -->
                <el-button type="text" size="mini" @click="handleDownload(row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div> 
      </el-form>
    </div>
	</div>
</template>

<script>
import * as api from "@/api/onlineForms";
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
      templateListData: [],
      component: null,
      produceAndRecode: null,
      taskInfo: null
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
      //console.log("businessKey:" + id +" | recodeId:" + id.substring(id.indexOf("_") + 1, id.lastIndexOf("_")) + " | produceAndRecodeId:" + id.indexOf("_") > 0 ? id.substring(0, id.indexOf("_")));
      api.getProduceReportInfoById(id.indexOf("_") > 0 ? id.substring(0, id.indexOf("_")) : id, 1).then((res) => {
        console.log(res);
        let data = res['data'] || {};  
        this.produceAndRecode = data.produceandrecode;
        this.component = data.conponent;
        this.attachTable = JSON.parse(data.attachment) || [];
        this.templateListData = data.templateListData || [];
        console.log(this.produceAndRecode);
        console.log(this.component);
        console.log(this.attachTable);
        console.log(this.templateListData);
      });
    }
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/dialog.scss";
</style>
