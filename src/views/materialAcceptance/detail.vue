<template>
  <div>
    <el-dialog class="full-dialog defined-dialog" @close="closeDialog" :visible.sync="dialogFormVisible" :fullscreen="true">
      <template slot="title">
        {{dialogTitle}}
        <div class="logo-icon"></div>
      </template>
      <el-container>
        <el-main
          style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
          <div class="form-bg">
            <div class="form-content">
              <el-form ref="form" label-width="80px">
                <div class="form-block">
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">材料品牌</div>
                      <div class="block-item-value">
                        {{formData.materialBrand}}
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">材料类型</div>
                      <div class="block-item-value">
                        {{formData.materialCategory}}
                      </div>
                    </div>
                  </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">样板照片</div>
                    <div class="block-item-value">
                      {{formData.samplePhoto}}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">样板内容</div>
                    <div class="block-item-value">
                      {{formData.sampleContent}}
                    </div>
                  </div>
                </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">材料进场内容</div>
                      <div class="block-item-value">
                        {{formData.materialApproachContent}}
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">材料进场数量</div>
                      <div class="block-item-value">
                        {{formData.materialApproachQuantity}}
                      </div>
                    </div>
                  </div>

                </div>
                <div class="form-block">

                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>附件</strong>
                    <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
                  </div>
                  <attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
                </div>
              </el-form>
            </div>
          </div>
        </el-main>
        <el-aside width="8px" class="close-wrapper">
          <div class="close-wrap">
            <i class="el-icon-caret-right"></i>
          </div>
        </el-aside>
        <el-aside
          style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
          <tasklog :taskInfo="taskInfo" ref="tasklog"></tasklog>
        </el-aside>
      </el-container>
    </el-dialog>

  </div>
</template>

<script>
import * as api from "@/api/materialSampleConfirmation";
import { getUserInfo } from "@/api/user";
import tasklog from "../common/tasklog.vue"
import taskhandle from '../common/taskhandle'
import attachlist from "../common/attachlist"
import projectinfo from "../common/projectinfo.vue"
import {getMaterialSampleConfirmationDetail} from "@/api/materialSampleConfirmation";


export default {
  props:['detailRow'],
  data() {
    return {
      dialogTitle: '全生命周期智慧建设管理平台',
      dialogFormVisible: false,
      formData: { //表单参数
        materialCategory: '',
        materialBrand:'',
        buildSection: this.$store.getters.project.id,
        projectId:this.$store.getters.project['parentid'],
      },
      attachTable: [], //附件
      contractTable: [],
      taskInfo:{}
    };
  },
  created() {},
  components: {
    tasklog,
    taskhandle,
    attachlist,
    projectinfo
  },
  computed: {
    toFixedAmount(detail) {
      return detail.formData.amount.toFixed(2);
    }
  },
  watch:{
    detailRow(obj){
      if(obj['id']){
        this.getDetail(obj['id']);
      }
    }
  },
  mounted() {

  },
  methods: {

    getUserInfo(id) {
      getUserInfo(id).then(res => {
        this.baseInfo.startupUser = res.data.userInfo.NAME;
      });
    },
    closeDialog(){
      // if(this.taskInfo['processDefinitionId']){
      // 	this.$router.go(-1);
      // }
    },
    changeVisible(value){
      this.dialogFormVisible=value;
    },
    getDetail(id){
      api.getMaterialSampleConfirmationDetail(id).then((res) => {
        console.log(res);
        let data = res['data'] || {};
        this.formData = data;
        this.attachTable = data.attachment || [];
        this.contractTable = data.information || [];
        this.getUserInfo(data.createUserId)
      });
      api.getFlowAndTaskInfo({businessKey: id}).then((res) => {
        console.log(res.data);
        let data=res['data'];
        this.taskInfo={
          processDefinitionId: data['processDefinitionId'],
          processInstanceId: data['processInstanceId'],
          taskId: data['taskId'],
          flowKey:'aterialAcceptance'
        }
        this.updateTaskLog();
      });
    },
    updateTaskLog(){
      setTimeout(()=>{
        this.$refs['tasklog'].initData();
      },100)
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/assets/css/dialog";
</style>
