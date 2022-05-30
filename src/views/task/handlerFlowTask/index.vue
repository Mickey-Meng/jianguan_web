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
							<div v-if="isUnEdit" class="form-title">
								<div class="title-big-bar"></div>
								<strong>{{menuTitle}}</strong>
								<div class="form-btns">
									<el-button size="medium">暂存</el-button>
									<el-button size="medium">保存草稿</el-button>
									<el-button size="medium">选择草稿</el-button>
									<el-button size="medium" type="primary">复制填充</el-button>
								</div>
							</div>
							<router-view ref="routerview" :detailRow="detailRow"></router-view>
						</div>
					</div>
					<taskhandle v-if="isHandleVisible" :taskInfo="taskInfo" ref="taskhandle"></taskhandle>
				</el-main>
				<el-aside width="8px" class="close-wrapper">
					<div class="close-wrap">
						<i class="el-icon-caret-right"></i>
					</div>
				</el-aside>
				<el-aside style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog v-if="isInfoVisible" :taskInfo="taskInfo" ref="tasklog"></tasklog>
				</el-aside>
			</el-container>
		</el-dialog>				
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions,
		getQueryVariable
	} from "@/utils/format.js";
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	export default {
		// props:['dialogTitle','menuTitle'],
		data() {
			return {
				dialogFormVisible:true,
				dialogTitle:'项目全生命周期数字管理平台',
				menuTitle:'质量检测',
				detailRow:{},
				taskInfo:{},
				isUnEdit:false,
				isHandleVisible:false,
				isInfoVisible:false,
			}
		},
		components: {
			taskhandle,
			tasklog
		},
		mounted() {
			var params = getQueryVariable();
			if (params['businessKey']) {
				this.detailRow = {
					id:params['businessKey']
				};
				this.updateView();
				if(params['processDefinitionId']){
					this.taskInfo={
						processDefinitionId: params['processDefinitionId'],
						processInstanceId: params['processInstanceId'],
						taskId: params['taskId']
					};
					if(params['taskId']){
						this.isHandleVisible=true;
						this.isUnEdit=true;
						
						this.updateTaskHandle();
						this.updateTaskLog();
					}
					this.isInfoVisible=true;
					
				}else{
					this.isUnEdit=false;
				}
			}else{
				this.isUnEdit=false;
			}
		},
		methods:{
			updateView(){
				setTimeout(()=>{
					this.$refs['routerview'].getDetail(this.detailRow['id']);
				},100)
			},
			updateTaskHandle(){
				setTimeout(()=>{
					this.$refs['taskhandle'].initData();
				},100)
			},
			updateTaskLog(){
				setTimeout(()=>{
					this.$refs['tasklog'].initData();
				},100)
			},
			closeDialog(){
				this.$router.go(-1);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../../assets/css/dialog.scss"
</style>
