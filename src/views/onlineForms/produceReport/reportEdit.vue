<template>
	<div>
	  <el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="dialogFormVisible">
		<template slot="title">
		  {{dialogTitle}}
		  <div class="logo-icon"></div>
		</template>
		<el-container>
		  <el-main
			style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
			<div class="form-bg">
			  <div class="form-content">
				<el-form :model="formData" :rules="rules" ref="ruleForm" label-width="80px">
				  <div class="form-title">
					<div class="title-big-bar"></div>
					<strong>计划管理-证照管理</strong>
				  </div>
  
				  <div class="form-block">
					<div class="form-block-title">
					  <div class="title-bar"></div><strong>基本信息</strong>
					</div>
					<div class="block-line">
  
					  <div class="block-item">
						<div class="block-item-label">证照名称<i class="require-icon"></i></div>
						<div class="block-item-value">
						  <el-form-item prop="name">
							<el-input v-model="formData.name"></el-input>
						  </el-form-item>
						</div>
					  </div>
  
					  <div class="block-item">
						<div class="block-item-label">证照内容<i class="require-icon"></i></div>
						<div class="block-item-value">
						  <el-form-item prop="contents">
							<el-input v-model="formData.contents"></el-input>
						  </el-form-item>
						</div>
					  </div>
  
					</div>
  
  
					<div class="block-line">
					  <div class="block-item">
						<div class="block-item-label">计划开始时间</div>
						<div class="block-item-value">
						  <el-form-item prop="startTime">
							<el-date-picker value-format="yyyy-MM-dd" v-model="formData.startTime" type="date"
							  placeholder="请选择">
							</el-date-picker>
						  </el-form-item>
						</div>
					  </div>
  
					  <div class="block-item">
						<div class="block-item-label">计划结束时间</div>
						<div class="block-item-value">
						  <el-form-item prop="endTime">
							<el-date-picker value-format="yyyy-MM-dd" v-model="formData.endTime" type="date"
							  placeholder="请选择">
							</el-date-picker>
						  </el-form-item>
						</div>
					  </div>
  
					</div>
  
  
					<div class="block-line">
					  <div class="block-item">
						<div class="block-item-label">上报时间</div>
						<div class="block-item-value">
						  <el-form-item prop="reportTime">
							<el-date-picker value-format="yyyy-MM-dd" v-model="formData.reportTime" type="date"
							  placeholder="请选择">
							</el-date-picker>
						  </el-form-item>
						</div>
					  </div>
  
					  <div class="block-item">
						<div class="block-item-label">上报人<i class="require-icon"></i></div>
						<div class="block-item-value">
						  <el-form-item prop="reportUser">
							<el-input v-model="formData.reportUser"></el-input>
						  </el-form-item>
						</div>
					  </div>
  
					</div>
  
					<div class="block-line">
					  <div class="block-item">
						<div class="block-item-label">责任人<i class="require-icon"></i></div>
						<div class="block-item-value">
						  <el-select v-model="formData.owner" filterable clearable placeholder="请选择责任人">
							<el-option v-for="item in ownerOptions" :key="item.userId"
							  :value="item.userId + '&' + item.nickName" :label="item.nickName + '(' + item.roleName + ')'">
							</el-option>
						  </el-select>
						</div>
					  </div>
  
					  <div class="block-item">
						<div class="block-item-label">备注<i class="require-icon"></i></div>
						<div class="block-item-value">
						  <el-form-item prop="remark">
							<el-input v-model="formData.remark"></el-input>
						  </el-form-item>
						</div>
					  </div>
					</div>
				  </div>
  
				  <approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey"></approveuser>
  
				  <div class="form-block">
					<el-button @click="addOrModify()" class="submit-btn" size="small" type="primary"
					  :loading="submitDisable">提交</el-button>
				  </div>
				</el-form>
			  </div>
			</div>
		  </el-main>
		</el-container>
	  </el-dialog>
	</div>
  </template>
  
  <script>
  import * as api from "@/api/certificate/planCertificatePhotos.js";
  import { mapGetters } from "vuex";
  import { getUserInfo, getUsersByProjectId } from "@/api/user";
  import upload from "../../common/upload.vue"
  import attachlist from "../../common/attachlist.vue"
  import drafthandle from "../../common/drafthandle.vue"
  import approveuser from "../../common/approveuser.vue"
  import projectinfo from "../../common/projectinfo.vue"
  import { findDataDictionaryList } from "@/api/dataDictionary"
  
  export default {
	props: ['editRow'],
	data() {
	  return {
		draftVisible: false,
		addOrModifyFlag: true,
		dialogTitle: '项目全生命周期数字管理平台',
		dialogFormVisible: false,
		partOptions:[],
		rules: {
		  name: [{
			required: true,
			message: '请填写证照名称',
			trigger: 'blur'
		  }],
		  contents:[{
			required: true,
			message: '请填写证照内容'
		  }],
		  startTime:[{
			required: true,
			message: '请填写计划开始时间'
		  }],
		  endTime:[{
			required: true,
			message: '请填写计划结束时间'
		  }],
		  reportTime:[{
			required: true,
			message: '请填写上报时间'
		  }]
		},
		userInfo: {
		  userName: ''
		},
		baseInfo: {
		},
		formData: { //表单参数
		  name: '',
		  contents: '',
		  startTime: null,
		  endTime: null,
		  reportTime: null,
		  reportUser: '',
		  owner: '',
		  remark: ''
		},
		// 责任人下拉选项值
		ownerOptions: [],
		contractTable: [],
		contractVisible: false,
		auditUser: {},
		approveVisible:true,
		flowKey:'planCertificatePhotos',
		dataDictionaryList: [],
  
		submitDisable: false
	  };
	},
	created() {},
	components: {
	  drafthandle,
	  approveuser,
	  projectinfo,
	  payment: () => import("./produceReport.vue")
	},
	computed: {
	  ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])
	},
	mounted() {
	  this.getUserInfo();
	},
	watch: {
	  editRow(obj) {
		obj=obj||{};
		if (obj['id']) {
		  this.getDetail(obj['id']);
		  this.approveVisible=false;
		} else {
		  this.restForm();
		  this.attachTable = [];
		  this.contractTable = [];
		  // this.auditUser={};
		  this.approveVisible=true;
		}
	  }
	},
	methods: {
	  restForm(){
		this.formData = {
			name: '',
			contents: '',
			startTime: null,
			endTime: null,
			reportTime: null,
			reportUser: '',
			owner: '',
			remark: '',
			projectId:this.$store.getters.project['parentid']
		  }
	  },
	  getUserInfo() {
		getUserInfo(localStorage.getItem('ID')).then((res) => {
		  this.userInfo = res.data.userInfo;
		});
	  },
	  changeVisible(obj,value) {
		this.dialogFormVisible = value;
		obj = obj || {};
		this.addOrModifyFlag = obj['id'] ? false : true;
		if (obj['id']) {
		  this.getDetail(obj['id']);
		  // 修改和删除操作，都可以选择审批人
		  this.approveVisible=false;
		} else {
		  this.restForm();
		  this.attachTable = [];
		  // this.auditUser={};
		  this.approveVisible=true;
		}
		// 根据项目ID查询其下属工区对应的所有用户信息
		getUsersByProjectId(this.project.id).then((res) => {
		  this.ownerOptions = res.data;
		});
	  },
	  getDetail(id) {
		api.getPlanCertificatePhotosDetail(id).then((res) => {
		  let data = res['data'] || {};
		  this.formData = data;
		  this.attachTable = data.attachment || [];
		});
	  },
	  addOrModify(isdraft) {
		if (this.submitDisable) return;
		
		this.submitDisable = true;
		this.$refs['ruleForm'].validate((valid) => {
		  if (valid) {
			this.formData.attachment = this.attachTable;
			this.formData.auditUser = this.auditUser;
			this.formData.draftFlag=1;
			this.formData.typeCode = this.formData.type;
			this.dataDictionaryList.forEach(item=> {
			  if(item.id === this.formData.type) {
				this.formData.type = item.name;
			  }
			})
			api.addOrUpdatePlanCertificatePhotos(this.formData).then((res) => {
			  if (res.data) {
				this.$message({
				  type: 'success',
				  message: '提交成功!'
				});
				this.dialogFormVisible = false;
				setTimeout(()=> {
				  this.submitDisable = false;
				}, 500)
				this.$emit("query");
			  }
			});
		  } else {
			setTimeout(()=> {
			  this.submitDisable = false;
			}, 500)
		  }
  
		})
	  },
	  hideDraft() {
		this.draftVisible = false;
	  },
	  checkDraft() {
		this.draftVisible = true;
	  }
	},
  };
  </script>
  
  <style scoped lang="scss">
  @import "src/assets/css/dialog";
  </style>
  