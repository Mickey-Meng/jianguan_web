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
										<div class="title-bar"></div><strong>发起位置</strong>
										
									</div>
									<locationmap></locationmap>
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<!-- <div class="block-item">
											<div class="block-item-label">创建人</div>
											<div class="block-item-value">
												{{formData.createUserId}}
											</div>
										</div> -->
										<div class="block-line">
											<div class="block-item">
												<div class="block-item-label">旁站时间</div>
												<div class="block-item-value">
													{{formData.sideDate}}
												</div>
											</div>
										</div>
									
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>旁站信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">工程部位</div>
										<div class="block-item-value">
											{{formData.projectPartId}}
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-label">旁站监理项目<i class="require-icon"></i></div>
										<div class="block-item-value">
											{{formData.sideProjectStr}}
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">工程部位描述</div>
											<div class="block-item-value">
												{{formData.projectPartDesc}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">异常情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.exceptionCondition}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>旁站信息记录</strong>
									</div>
								
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">旁站工作情况</div>
											<div class="block-item-value">
												{{formData.sideWorkCondition}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发现的问题及处理结果</div>
											<div class="block-item-value">
												{{formData.problemDealCondition}}
											</div>
										</div>
									</div>
								</div>
								
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>旁站现场照片</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.scenePhotoAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>实测实量照片</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.actualCheckAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>视频上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.video">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.attachment">
									</attachlist>
								</div>
							</el-form>
							<taskhandle :taskInfo="taskInfo"></taskhandle>
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
					<tasklog :taskInfo="taskInfo"></tasklog>
				</el-aside>
			</el-container>
		</el-dialog>
		
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions,
		getQueryVariable,
		formatDate,
		getDaysBetween,
		getOptionsLabel
	} from "@/utils/format.js";
	import tasklog from "../../../common/tasklog.vue"
	import locationmap from "../../../common/locationmap.vue"
	import taskhandle from '../../../common/taskhandle'
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"

	export default {
		props:['detailRow'],
		data() {
			return {
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				sideOptions:[],
				baseInfo: {
					buildSection: '',
					buildSectionName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
					supervisionSection: '监理办'
				},
				formData: { //表单参数
					"actualCheckAttachment": [],
					"address": {},
					"attachment": [],
					"auditUser": {},
					"deletedFlag": 1,
					"draftFlag": 1,
					"exceptionCondition": "",
					"problemDealCondition": "",
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					"projectPartDesc": "",
					"projectPartId": 0,
					"scenePhotoAttachment": [],
					"sideDate": formatDate(new Date()),
					"sideInfo": "",
					"sideProjectId": null,
					"sideWorkCondition": "",
					"video": []
				},
				taskInfo:{}
			};
		},
		created() {},
		components: {
			tasklog,
			taskhandle,
			attachlist,
			locationmap,
			projectinfo
		},
		computed: {
			
		},
		watch:{
			detailRow(obj){
				if(obj['id']){
					this.getDetail(obj['id']);
				}
			}
		},
		mounted() {
			this.getSupervisionSideEnums();
			// setTimeout(()=>{
			// 	var params = getQueryVariable();
			// 	if (params['processDefinitionId']) {
			// 		this.dialogFormVisible=true;
			// 		params['id'] = params['businessKey'];
			// 		this.taskInfo=params;
			// 		this.getDetail(params['businessKey']);
			// 	}
			// },500)
		},
		methods: {
			getSupervisionSideEnums() {
				api.getSupervisionSideEnums().then((res) => {
					let options = res.data || [];
					this.sideOptions = convertOptions(options, 'desc', 'code');
				});
			},
			closeDialog(){
				if(this.taskInfo['processDefinitionId']){
					this.$router.go(-1);
				}
			},
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getDetail(id){
				api.getSupervisionSideDeatil(id).then((res) => {
					let data=res['data']||{};
					this.formData=data;
					this.formData.sideProjectStr=getOptionsLabel(this.sideOptions,this.formData.sideProjectId)
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
