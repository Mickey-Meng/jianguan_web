<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>地理位置</strong>
				
					</div>
					<locationmap></locationmap>
					<div class="form-block-title">
						<div class="title-bar"></div><strong>基本信息</strong>
					</div>
					<projectinfo></projectinfo>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">发起人</div>
							<div class="block-item-value">
								{{formData.createUserId}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">发起时间</div>
							<div class="block-item-value">
								{{formData.createTime}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">抄送</div>
							<div class="block-item-value">
								{{formData.copy}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">指令编号<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.orderCode}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>指令信息</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">指令标题<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.orderTitle}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">回复期限<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.orderDate}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">工程部位<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.projectPart}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">严重程度<i class="require-icon"></i></div>
							<div class="block-item-value">
								
								{{formData.seriousLevel==0?'一般':'严重'}}
							</div>
						</div>
					</div>
					<div class="form-block">
						<div class="form-block-title">
							<div class="title-bar"></div><strong>问题照片</strong>
							<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png 文件，且不超过
								100M</span>
						</div>
						<attachlist :editAble="false" :attachTable="formData.problemPhotoAttachment">
						</attachlist>
				
					</div>
					<div class="form-block">
						<div class="form-block-title">
							<div class="title-bar"></div><strong>其他附件</strong>
							<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png mp4 docx
								doc xlsx xls pdf 文件，且不超过 100M</span>
						</div>
						<attachlist :editAble="false" :attachTable="formData.otherAttachment">
						</attachlist>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">指令内容<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.orderContent}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>指令回复</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">指令回复编号<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.replyCode}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">回复内容<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.replyContent}}
							</div>
						</div>
					</div>
					<div class="form-block">
						<div class="form-block-title">
							<div class="title-bar"></div><strong>整改照片</strong>
							<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png 文件，且不超过
								100M</span>
						</div>
						<attachlist :editAble="false" :attachTable="formData.replyPhotoAttachment">
						</attachlist>
				
					</div>
					<div class="form-block">
						<div class="form-block-title">
							<div class="title-bar"></div><strong>其他附件</strong>
							<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png mp4 docx
								doc xlsx xls pdf 文件，且不超过 100M</span>
						</div>
						<attachlist :editAble="false" :attachTable="formData.replyOtherAttachment">
						</attachlist>
				
					</div>
				
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
		getDaysBetween
	} from "@/utils/format.js";
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"
	import locationmap from "../../../common/locationmap.vue"
	
	export default {
		data() {
			return {
				formData: { //表单参数
					"address": {},
					"auditUser": {},
					"copy": "",
					"deletedFlag": 1,
					"draftFlag": 1,
					"orderCode": "",
					"orderContent": "",
					"orderDate": formatDate(new Date()),
					"orderTitle": "",
					"otherAttachment": [],
					"problemPhotoAttachment": [],
					"buildSection": this.$store.getters.project.id,
					"projectId":this.$store.getters.project['parentid'],
					"projectPart": "",
					"replyCode": "",
					"replyContent": "",
					"replyDate": formatDate(new Date()),
					"replyOtherAttachment": [],
					"replyPhotoAttachment": [],
					"reviewDirector": "",
					"reviewSupervision": "",
					"seriousLevel": 0
				},
				taskInfo:{}
			};
		},
		created() {},
		components: {
			attachlist,
			projectinfo,
			locationmap,
		},
		computed: {
		},
		watch: {
			
		},
		mounted() {
			
		},
		methods: {
			getDetail(id) {
				api.getSupervisionOrderDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
