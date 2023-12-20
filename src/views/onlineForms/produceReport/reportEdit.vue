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
					<strong>工序报验</strong>
				  </div>
  
				  <div class="form-block">
					<div class="form-block-title">
					  <div class="title-bar"></div><strong>基本信息</strong>
					</div>
					<div class="block-line">
  
					  <div class="block-item">
						<div class="block-item-label">具体部位<i class="require-icon"></i></div>
						<div class="block-item-value">
						  <el-form-item prop="name">
							<el-input v-model="formData.name"></el-input>
						  </el-form-item>
						</div>
					  </div>
  
					  <div class="block-item">
						<div class="block-item-label">构建编码<i class="require-icon"></i></div>
						<div class="block-item-value">
						  <el-form-item prop="contents">
							<el-input v-model="formData.contents"></el-input>
						  </el-form-item>
						</div>
					  </div>
  
					</div>
  
  
					<div class="block-line">
					  <div class="block-item">
						<div class="block-item-label">工序名称</div>
						<div class="block-item-value">
						  <el-form-item prop="startTime">
							<el-date-picker value-format="yyyy-MM-dd" v-model="formData.startTime" type="date"
							  placeholder="请选择">
							</el-date-picker>
						  </el-form-item>
						</div>
					  </div>
  
					  <div class="block-item">
						<div class="block-item-label">完成时间</div>
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

				  <div class="form-block">
					<div class="form-block-title">
					  <div class="title-bar"></div><strong>现场照片</strong>
					  <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
                      xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
				  </div>


				  <div class="form-block">
					<div class="form-block-title">
					  <div class="title-bar"></div><strong>应填表格</strong>
					</div>
					<div class="block-table">
						<el-table :data="templateListData" style="width: 100%" border class="have_scrolling">
							<el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
							<el-table-column prop="templateName" width="500" align="center" label="表格名称"></el-table-column>
							<el-table-column prop="editStatus" width="150" align="center" label="状态"></el-table-column>
							<el-table-column fixed="right" width="200" align="center" label="操作">
								<template slot-scope="{ row, $index }">
								<el-button type="text" size="mini" @click="fillOut(row)">填写
								</el-button>
								<el-button type="text" size="mini" @click="preview(row)">预览
								</el-button>
								<el-button type="text" size="mini" @click="download(row)">下载
								</el-button>
								</template>
							</el-table-column>
						</el-table>
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

	  <el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="luckySheetDialogVisible" append-to-body>
	  	<luckySheet ref="luckysheetRef" v-bind:luckysheetParams = "luckysheetParams" ></luckySheet>
		<div slot="footer" class="dialog-footer" style = "text-align:center; margin-top: -50px;">
			<el-button :loading="saveButtonLoading" type="primary" @click="saveSheetData(1)">保 存</el-button>
			<el-button :loading="submitButtonLoading" type="primary" @click="saveSheetData(2)">提 交</el-button>
		</div>
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

  import luckySheet from "@/components/Luckysheet/lucky-sheet";
  import { blobValidate } from "@/utils/ruoyi";
  import { getFillDataTemplate, saveFillDataTemplate } from "@/api/onlineForms";
  
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
		templateListData: [
			{templateName : "浙路(JS)107钢筋安装现场检测记录表1", editStatus : "已填写" , templateUrl: "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx"},
			{templateName : "浙路(JS)107钢筋安装现场检测记录表2", editStatus : "未填写" , templateUrl: "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx"},
			{templateName : "浙路(JS)107钢筋安装现场检测记录表3", editStatus : "已填写" , templateUrl: "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx"},
		],
		luckysheetParams: {},
		luckySheetDialogVisible: false,
		saveButtonLoading: false,
		submitButtonLoading: false,
		submitDisable: false
	  };
	},
	created() {},
	components: {
	  drafthandle,
	  approveuser,
	  projectinfo,
	  luckySheet,
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
	  },
	  fillOut(row) {
		// 获取待填写的模板
		getFillDataTemplate(100, { templateUrl : row.templateUrl })
			.then(async (resData) => {
				const isBlob = await blobValidate(resData);
				if (isBlob) {
					this.luckySheetDialogVisible = true;
					const blobData = new Blob([resData]);
					this.$refs.luckysheetRef.rendLuckyExcel(blobData);
				}
			}).catch((r) => {
				console.error(r)
				this.$message.error('加载文件出现错误，请联系管理员！')
			})
	  },

	  saveSheetData(type) {
            this.saveButtonLoading = true;
           // var allSheetsData = window.luckysheet.getAllSheets();//获取sheet数据
            var luckyExcelData = window.luckysheet.toJson(); //获取Workbook数据
            console.log(JSON.stringify(luckyExcelData));
            saveFillDataTemplate(type, JSON.stringify(luckyExcelData))
                .then(async (res) => {
                    if (res.code === 200) {
                        this.saveButtonLoading = false;
                        this.luckySheetDialogVisible = false;
                        console.log(res);
                        this.$message.success("保存模板数据成功");
                    }
                }).catch((r) => {
                    this.saveButtonLoading = false;
                    console.error(r)
                    this.$message.error('加载文件出现错误，请联系管理员！')
                })
        },
	},
  };
  </script>
  
  <style scoped lang="scss">
  @import "src/assets/css/dialog";
  </style>
  