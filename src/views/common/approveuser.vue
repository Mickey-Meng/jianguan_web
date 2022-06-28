<template>
	<div v-show="flowNodesUsersData.length>0">
		<!-- <el-form ref="ruleform" label-width="80px" :rules="rules" v-model="formData"> -->
			<div class="form-title">
				<div class="title-big-bar"></div><strong>审批信息</strong>
			</div>
			<div class="form-block">
				<div class="form-block-title">
					<div class="title-bar"></div><strong>待审批人</strong>
				</div>
				<div class="block-line" v-for="userOptions in flowNodesUsersData">
					<div class="block-item" v-if="userOptions.sort != 1">
						<div class="block-item-label">{{userOptions.entryName}}<i class="require-icon"></i></div>
						<div class="block-item-value">
							<el-form-item :rules="[{required: true,
                                message: '必选',
                                trigger: 'blur'}]">
								<el-select placeholder="请选择" :disabled="userOptions['isSign']?true:false"
									:multiple="userOptions['isSign']?true:false"
									v-model="auditUser[userOptions.entryUserVariable]"
									@change="flowUserChange($event, userOptions.entryUserVariable)">
									<el-option v-for="(item, idx) in userOptions.userInfo" :key="item.id"
										:label="item.name" :value="item.username">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
					</div>
				</div>
			</div>
		<!-- </el-form> -->
	</div>
</template>

<script>
	import '@/staticDict/flowStaticDict.js';
	import * as api from "@/api/quality";
	import {getToken} from "@/utils/auth";
	export default {
		props: ['auditUser', 'flowKey'],
		data() {
			return {
				formData: {},
				flowNodesUsersData: [],
				
			};
		},
		created() {},
		computed: {

		},
		mounted() {
			this.getFlowAuditEntry() 
		},
		methods: {
			flowUserChange(data, data1) {
				this.auditUser[data1] = data;
				this.$forceUpdate();
			},
			getFlowAuditEntry() {
				api.getFlowAuditEntry({
					flowKey: this.flowKey,
					buildSection: this.$store.getters.project.id,projectId:this.$store.getters.project['parentid'] || 2
				}).then((res) => {
					for (let i = 0; i < res.data.length; i++) {
						const item = res.data[i];
						item.userInfo = item.userInfo || [];
						if (res.data[i]['isSign']) {
							this.auditUser[item.entryUserVariable] = item.userInfo.map(v=>v.username);
						} else {
							this.auditUser[item.entryUserVariable] = item.userInfo.length > 0 ? item.userInfo[0]['username'] : [];
						}
					}
					this.auditUser.startUserName = getToken("name");
					this.flowNodesUsersData = res.data;
				});
			},
			validate(){
				this.$refs['ruleform'].validate((valid) => {
					
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../assets/css/dialog.scss"
</style>
