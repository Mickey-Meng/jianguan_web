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
			<el-row>
				<el-col :span="16">
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
							<div class="block-item-label">具体部位</div>
							<div class="block-item-value">
							<el-form-item prop="conponenttypename">
								<el-input v-model="editRow.name" disabled></el-input>
							</el-form-item>
							</div>
						</div>
	
						<div class="block-item">
							<div class="block-item-label">构建编码</div>
							<div class="block-item-value">
							<el-form-item prop="componentcode">
								<el-input v-model="editRow.conponetcode" disabled></el-input>
							</el-form-item>
							</div>
						</div>
						</div>
	
						<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">工序名称</div>
							<div class="block-item-value">
							<el-form-item prop="name">
								<el-input v-model="produceInfo.name" disabled></el-input>
							</el-form-item>
							</div>
						</div>
	
						<div class="block-item">
							<div class="block-item-label">完成时间</div>
							<div class="block-item-value">
							<el-form-item prop="finish">
								<el-date-picker value-format="yyyy-MM-dd" v-model="produceInfo.finish" type="date" disabled></el-date-picker>
							</el-form-item>
							</div>
						</div>
	
						</div>
	
						<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">备注</div>
							<div class="block-item-value">
							<el-form-item prop="pjctype">
								<el-input v-model="editRow.pname" disabled></el-input>
							</el-form-item>
							</div>
						</div>
						</div>
					</div>

					<div class="form-block">
						<div class="form-block-title">
						<div class="title-bar"></div><strong>现场照片</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg、jpeg、png文件,且不超过10M</span>
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
								<el-table-column prop="documentName" width="500" align="center" label="表格名称"></el-table-column>
								<el-table-column label="状态" width="150" align="center">
									<template slot-scope="{ row }">
										{{ row.documentStatus === 1 ? "已填写" :  "待填写" }}
									</template>
								</el-table-column>
								<el-table-column fixed="right" width="200" align="center" label="操作">
									<template slot-scope="{ row, $index }">
									<el-button type="text" size="mini" @click="fillOut(row)">填写</el-button>
									<!-- <el-button type="text" size="mini" @click="preview(row)">预览</el-button> -->
									<el-button type="text" size="mini" @click="handleDownload(row)">下载</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>

					<approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey"></approveuser>
	
					<div class="form-block">
						<el-button @click="handleSubmit()" class="submit-btn" size="small" type="primary" :loading="submitDisable">提交</el-button>
					</div>
					</el-form>
				</div>
				</el-col>
				<el-col :span="8">
					<auditRecord ></auditRecord>
				</el-col>
			</el-row>
		
			</div>
		  </el-main>
		</el-container>
	  </el-dialog>

	  <el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="luckySheetDialogVisible" append-to-body>
	  	<luckySheet ref="luckysheetRef" v-bind:luckysheetParams = "luckysheetParams" ></luckySheet>
		<div slot="footer" class="dialog-footer" style = "text-align:center; margin-top: -50px;">
			<el-button :loading="saveButtonLoading" type="primary" @click="saveSheetData()">保 存</el-button>
		</div>
	  </el-dialog>

	</div>
  </template>
  
  <script>
  import { listProduceDocument, getProduceDocument } from "@/api/produceDocument.js";
  import * as api from "@/api/onlineForms";
  import { mapGetters } from "vuex";
  import { getUserInfo, getUsersByProjectId } from "@/api/user";
  import upload from "../../common/upload.vue"
  import attachlist from "../../common/attachlist.vue"
  import drafthandle from "../../common/drafthandle.vue"
  import approveuser from "../../common/approveuser.vue"
  import projectinfo from "../../common/projectinfo.vue"
  import { findDataDictionaryList } from "@/api/dataDictionary"
  
  import auditRecord from "./auditRecord.vue"
  import luckySheet from "@/components/Luckysheet/lucky-sheet";
  import { blobValidate } from "@/utils/ruoyi";
  import { download } from "@/utils/download";
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
		flowKey:'produceOnlineReport',
		dataDictionaryList: [],
		produceInfo: {},
		attachTable: [],
		templateListData: [
			// {documentName : "浙路(JS)107钢筋安装现场检测记录表", documentStatus : "未填写" , documentUrl: "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx"},
			// {documentName : "浙路(ZJ)802钢筋加工及安装工程现场质量检验报告单(一)(钢筋安装)", documentStatus : "未填写" , documentUrl: "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx"},
			// {documentName : "浙路(JS)604结构物钢筋施工原始记录表", documentStatus : "未填写" , documentUrl: "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx"},
		],
		currentEditTemplate: null,
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
	  attachlist,
	  luckySheet,
	  auditRecord,
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
		this.produceInfo = obj || {};
		this.attachTable = [];
		
		console.log(this.editRow);
		console.log(this.produceInfo);
		this.addOrModifyFlag = obj['id'] ? false : true;
		if (obj['id']) {
		  //this.getDetail(obj['id']);
		  // 修改和删除操作，都可以选择审批人
		  this.approveVisible=false;
		} else {
		  this.restForm();
		  this.attachTable = [];
		  // this.auditUser={};
		  this.approveVisible=true;
		}
		/**
		根据项目ID查询其下属工区对应的所有用户信息
		getUsersByProjectId(this.project.id).then((res) => {
		  this.ownerOptions = res.data;
		});*/
		// 根据构建ID和工序ID查询待填写文档
		listProduceDocument({documentType : 1, componentId : this.editRow.id, produceId : obj.produceid}).then((res) => {
		  this.templateListData = res.rows;
		});
		// 根据附件记录ID查询附件信息
		api.getRecordById(obj.recordid).then((res) => {
			console.log(res);
			console.log(res.data.recode);
			this.attachTable = JSON.parse(res.data.recode.remark) || [];
		});
	  },
	  
	  getDetail(id) {
		getProduceDocument(id).then((res) => {
		  let data = res['data'] || {};
		});
	  },

	  /**
	   * 提交保存
	   */
	  handleSubmit() {
		this.templateListData.forEach(template => {
			if (template.documentStatus === 0) {
				this.$message({
				  type: 'warning',
				  message: "[" + template.documentName + ']未完成填写，不可提交!'
				});
				return;
			}
		})

		if (this.submitDisable) {
			return;
		} 
		
		this.submitDisable = true;
		let reportRecord = Object.assign({}, this.formData);
		let currentProject = JSON.parse(localStorage.getItem('project_info'));
		let userName = localStorage.getItem('userName').replace(/"/g, "");
		let component = this.editRow;

		reportRecord.checkusername = userName;
		reportRecord.conpoentid = component.id;
		reportRecord.conponentname = component.name;
		reportRecord.conponenttype = component.conponenttype;
		reportRecord.produceid = this.produceInfo.produceid;
		reportRecord.projectcode = currentProject.code;
		reportRecord.produceidname = this.produceInfo.name;
		reportRecord.updateusername = userName;
		reportRecord.projectId = currentProject.id;
        reportRecord.remark = this.attachTable;
        reportRecord.accrecodeurl = this.attachTable.map(file => file.fileId).join(",");
		reportRecord.auditUser = this.auditUser;
		reportRecord.submitType = 'report';
		console.log(reportRecord);
		api.submitReport(reportRecord).then((res) => {
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
	  },
	  hideDraft() {
		this.draftVisible = false;
	  },
	  checkDraft() {
		this.draftVisible = true;
	  },
	  /**
	   * 填写模板
	   */
	  fillOut(row) {
		this.currentEditTemplate = row;
		// 获取待填写的模板
		getFillDataTemplate(row.id, { templateUrl : row.documentUrl })
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
            api.saveOnlineTemplate(this.currentEditTemplate.id, JSON.stringify(luckyExcelData))
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
		/**
		 * 附件下载
		 */
		handleDownload(file) {
			download(file.documentUrl, file.documentName, false);
		}
	},
  };
  </script>
  
  <style scoped lang="scss">
  @import "src/assets/css/dialog";
  .full-dialog{
	.form-bg{
	width: 1510px!important;
	
  }
  }

  </style>
  