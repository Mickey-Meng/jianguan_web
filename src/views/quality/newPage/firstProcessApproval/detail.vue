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
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">首件工程名称<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.firstProjectName}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">分部分项<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.subProjectStr}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">单位工程</div>
											<div class="block-item-value">
												{{baseInfo.unitProject}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">分部工程</div>
											<div class="block-item-value">
												{{baseInfo.parcelProject}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">分项工程</div>
											<div class="block-item-value">
												{{baseInfo.subitemProject}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">具体分项<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.subProjectDetail}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">实施日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.buildDate}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工过程简述<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.buildProcessExplain}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">监理工作情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.supervisionWorkExplain}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">主要数据记录<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.mainDataExplain}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发现的问题及处理情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.problemDealExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>质量检验及评定</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">检验结果描述<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.checkResultExplain}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">外观质量描述<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.faceQuelityExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>开工申请</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>施工技术、工艺方案说明和图表<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.buildTechAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>测量放样资料<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>

									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.measureAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>材料出厂保证书、材料检测试验报告<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.materialAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>机械的主要技术标准及最大生产能力<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.mechanicalAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>批准的标准试验报告<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.testAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>开工申请<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.openAttachment">
									</attachlist>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>质量保证资料<i class="require-icon"></i></strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>文件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.qualityAttachment">
									</attachlist>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>影像资料</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>文件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.imageVideo">
									</attachlist>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>首件工程总结</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>文件<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.firstProjectVideo">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">首件工程通过情况</div>
											<div class="block-item-value">
												{{formData.firstPassExplain}}
											</div>
										</div>
									</div>
								</div>
							</el-form>
							<!-- <taskhandle :taskInfo="taskInfo"></taskhandle> -->
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
	import * as api from "@/api/quality";
	import {
		convertOptions,
		getQueryVariable,
		formatDate,
		getDaysBetween,
		getChidlren
	} from "@/utils/format.js";
	import tasklog from "../../../common/tasklog.vue"

	import taskhandle from '../../../common/taskhandle'
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"

	import {
		getBridgeTree
	} from "@/api/tree";

	import simpleData from '../../../common/simdata.js'

	export default {
		props:['detailRow'],
		data() {
			return {
				dialogFormVisible: false,
				dialogTitle: '全生命周期智慧建设管理平台',
				baseInfo: {
					buildSection: '',
					buildSectionName: '池州市平天湖东部区域棚户区改造建设工程EPC总承包',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
					supervisionSection: '监理办'
				},
				formData: { //表单参数
					buildDate: formatDate(new Date()),
					buildProcessExplain: "",
					buildTechAttachment: [],
					checkResultExplain: "",
					deletedFlag: 1,
					draftFlag: 1,
					faceQuelityExplain: "",
					firstPassExplain: "",
					firstProjectName: "",
					firstProjectVideo: [],
					imageVideo: [],
					mainDataExplain: "",
					materialAttachment: [],
					measureAttachment: [],
					mechanicalAttachment: [],
					openAttachment: [],
					problemDealExplain: "",
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					qualityAttachment: [],
					subProject: null,
					subProjectStr:'',
					subProjectDetail: "",
					supervisionWorkExplain: "",
					testAttachment: []
				},
				taskInfo:{},
				treeData:null
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

		},
		watch:{
			detailRow(obj){
				if(obj['id']){
					this.getDetail(obj['id']);
				}
			}
		},
		mounted() {
			// setTimeout(()=>{
			// 	var params = getQueryVariable();
			// 	if (params['processDefinitionId']) {
			// 		this.dialogFormVisible=true;
			// 		params['id'] = params['businessKey'];
			// 		this.taskInfo=params;
			// 		this.getDetail(params['businessKey']);
			// 	}
			// },500)

			this.treeData = [simpleData.data];
			// getBridgeTree('QL', null).then((res) => {
			//   const arr = [];
			//   arr.push(res.data);
			//   this.treeInfo = arr;
			// });
		},
		methods: {
			initData(){

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
				api.getFirstAcceptDeatil(id).then((res) => {
					let data=res['data']||{};

					const conponent = data.conponent;
					data.subProjectStr = '';
					for (let i = 1; i < 20; i++) {
						if (conponent['w'+i]) {
              if (i<9){ // add by yangaogao 20230824 功能 #645
                data.subProjectStr += `/${conponent['w'+i]}`;
              }

							if (i == 3) {
								this.baseInfo.unitProject=conponent['w'+i]
							}
							if (i == 4) {
								this.baseInfo.parcelProject=conponent['w'+i]
							}
							if (i == 6) {
								this.baseInfo.subitemProject=conponent['w'+i]
							}
						}

					}
					data.subProjectStr = data.subProjectStr.replace('/','');

					this.formData=data;
					this.attachTable=data.otherAttachment||[];
					// let treename=(data['subProject']||'').split('/');

					let treename=getChidlren(this.treeData,this.formData.subProject,[]);
					// this.formData.subProjectStr=(treename?treename:[]).join('/');

					if(treename.length>5){
						// this.baseInfo.unitProject=treename[2]
						// this.baseInfo.parcelProject=treename[3]
						// this.baseInfo.subitemProject=treename[5]
					}

				});
				api.getFlowAndTaskInfo({businessKey: id}).then((res) => {
					console.log(res.data);
					let data=res['data'];
					this.taskInfo={
						processDefinitionId: data['processDefinitionId'],
						processInstanceId: data['processInstanceId'],
						taskId: data['taskId'],
						flowKey:'shoujianrenke',
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
	@import "../../../../assets/css/dialog.scss"
</style>
