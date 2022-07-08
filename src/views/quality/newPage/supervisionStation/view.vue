<template>
	<div>

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
								{{baseInfo.supervisionUnit}}
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
							{{formData.projectPartStr}}
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
		</div>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions,
		getQueryVariable,
		formatDate,
		getDaysBetween,
		getOptionsLabel,
		getChidlren
	} from "@/utils/format.js";
	import attachlist from "../../../common/attachlist"
	
	import {
		getBridgeTree
	} from "@/api/tree";
	
	import simpleData from '../../../common/simdata.js'
	
	export default {
		data() {
			return {
				sideOptions:[],
				baseInfo: {
					buildSection: 1,
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
					"projectPartId": null,
					"projectPartStr":'',
					"scenePhotoAttachment": [],
					"sideDate": formatDate(new Date()),
					"sideInfo": "",
					"sideProjectId": null,
					"sideWorkCondition": "",
					"video": []
				},
				taskInfo:{},
				treeData:null
			};
		},
		created() {},
		components: {
			attachlist
		},
		computed: {
			
		},
		watch: {
			
		},
		mounted() {
			this.initData();
			this.getSupervisionSideEnums();
		},
		methods: {
			initData(){
				this.treeData = [simpleData.data];
				// getBridgeTree('QL', null).then((res) => {
				//   const arr = [];
				//   arr.push(res.data);
				//   this.treeInfo = arr;
				// });
			},
			getSupervisionSideEnums() {
				api.getSupervisionSideEnums().then((res) => {
					let options = res.data || [];
					this.sideOptions = convertOptions(options, 'desc', 'code');
				});
			},
			getDetail(id) {
				api.getSupervisionSideDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.formData.sideProjectStr=getOptionsLabel(this.sideOptions,this.formData.sideProjectId)
					
					let treename=getChidlren(this.treeData,this.formData.projectPartId,[]);
					this.formData.projectPartStr=(treename?treename:[]).join('/');
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
