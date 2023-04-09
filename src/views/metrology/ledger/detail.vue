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
									<div class="form-block-title">
										<div class="title-bar"></div><strong>计量管理</strong>
									</div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计量期数名称</div>
                      <div class="block-item-value">
                        {{formData.metrologyName}}
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">开始日期</div>
                      <div class="block-item-value">
                        {{formData.startDate}}
                      </div>
                    </div>

                    <div class="block-item">
                      <div class="block-item-label">结束日期</div>
                      <div class="block-item-value">
                        {{formData.endDate}}
                      </div>
                    </div>
                  </div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>计量信息管理</strong>
									</div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计量编号<i class="require-icon"></i></div>
                      <div class="block-item-value">
                        {{formData.metrologyNo}}
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">申请日期</div>
                      <div class="block-item-value">
                        {{formData.applyDate}}
                      </div>
                    </div>
                  </div>

                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">申请单位</div>
                      <div class="block-item-value">
                        {{formData.applyUnit}}
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">计量金额</div>
                      <div class="block-item-value">
                        {{toFixedAmount}}
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计量内容</div>
                      <div class="block-item-value">
                        {{formData.content}}
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">申请依据</div>
                      <div class="block-item-value">
                        {{formData.applyCertificate}}
                      </div>
                    </div>
                  </div>

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
	import * as api from "@/api/metrology";
	import { getUserInfo } from "@/api/user";
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	import attachlist from "../../common/attachlist"
	import projectinfo from "../../common/projectinfo.vue"

	import {
		formatMonth,
		formatDate,
		formatDateTime,
		convertOptions
	} from "@/utils/format.js";

	export default {
		props:['detailRow'],
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
				api.getMetrologyDetail(id).then((res) => {
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
				  flowKey:'jiliangshenpiv3'
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
