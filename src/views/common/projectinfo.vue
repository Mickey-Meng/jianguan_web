<template>
	<div class="form-block">
		<div class="block-line">
			<div class="block-item">
				<div class="block-item-label">项目名称</div>
				<div class="block-item-value">
					{{baseInfo.projectName}}
				</div>
			</div>
			<div class="block-item">
				<div class="block-item-label">合同号</div>
				<div class="block-item-value">
					{{baseInfo.contractCode}}
				</div>
			</div>
		</div>
		<div class="block-line">
			<div class="block-item">
				<div class="block-item-label">施工单位</div>
				<div class="block-item-value">
					{{baseInfo.buildCompany}}
				</div>
			</div>
			<div class="block-item">
				<div class="block-item-label">监理单位</div>
				<div class="block-item-value">
					{{baseInfo.supervisionUnit}}
				</div>
			</div>
		</div>
		<div class="block-line" v-if="hasBuildSection">
			<div class="block-item">
				<div class="block-item-label">标段</div>
				<div class="block-item-value">
					{{baseInfo.buildSectionName}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapGetters} from "vuex";
	import * as api from "@/api/quality";
	import {
		formatDateTime,
		createProjectInfo
	} from "@/utils/format.js";
	
	export default {
		props: ['hasSection'],
		data() {
			return {
				baseInfo: {
					projectName: '',
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
				},
				hasBuildSection:(this.hasSection==undefined?false:this.hasSection)
			}
		},
		computed: {
		  ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])
		},
		mounted(){
			this.getProjectInfoById();
		},
		methods: {
			getProjectInfoById() {
				this.baseInfo.buildSectionName=this.project.name;
				this.baseInfo.contractCode=this.project.contractnum;
				api.getProjectInfoById({
					projectid: this.$store.getters.project['id']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['projectName'] = data['project'] ? data['project']['name'] : '';
					let list = data['companys'] || [];
					let info = createProjectInfo(list);

					info = data['item'] || {}
					
					this.baseInfo['buildCompany'] = info['constructdpt']
					this.baseInfo['supervisionUnit'] = info['supervisordpt']
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	@import "../../assets/css/dialog.scss"
</style>

