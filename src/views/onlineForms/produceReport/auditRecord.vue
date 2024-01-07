<template>
	<div class='record_wrapper'>
		<div class='record_title'>审批记录</div>
		<div class='record_content'>
			<el-steps direction="vertical" :active="3" :space="120">
				
				<el-step v-for="(item, index) in stepData" :key="index" finish-status="success">
						<template #icon>
							<div class="step_icon">
								
								<i :class="item.icon"></i>
								
								<div class="step_title">{{ item.nodeTitle }}</div>
							</div>
							
						</template>
						<template #description>
							<div class="content">
								<div class="tpp">
									<div>
										<div class="descStyle">
											<div v-if="item.person" style="margin-right: 20px; display: inline-block">{{item.isSubmitNode?'发起人':'审核人'}}：{{ item.person }}</div>
											<div v-if="item.auditOption">{{item.isSubmitNode?'执行内容':'审核意见'}}： {{ item.auditOption }}</div>
											<div v-if="item.auditStatus">执行状态： {{ item.auditStatus }}</div>
											<div v-if="item.submitTime">提交时间： {{ item.submitTime }}</div>
										</div>
									
									</div>
								</div>
							</div>
						</template>
					</el-step>
			</el-steps>
		</div>

	</div>
  </template>
  
  <script>



  
  export default {
	data() {
	  return {
		 stepData:[{nodeTitle:"流程开始"},
		 {nodeTitle:"质检员提交",isSubmitNode:true,person:"王某某",auditOption:'发起工序报验',auditStatus:'已提交',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
		 {nodeTitle:"项目施工负责人审核",person:"李某某",auditOption:'同意报验',auditStatus:'已审核',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
		 {nodeTitle:"监理单位审核",person:"张某某",auditOption:'同意报验',auditStatus:'已审核',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
		 {nodeTitle:"流程审核完毕",icon:"el-icon-aim"}]
	  };
	},
	created() {},
	components: {},
	computed: {
	
	},
	mounted() {
	
	},
	watch: {},
	methods: {
	},
  };
  </script>
  
  <style scoped lang="scss">
.record_wrapper{
	padding:8px;
	width:100%;
	.record_title{
		font-weight: bolder;
		font-size: 16px;
		margin-bottom: 18px;
		&:before {
			float:left;
			content:" ";
			width: 4px;
			height: 18px;
			background: #355dff;
			border-radius: 0 3px 3px 0;
			 margin: 0px 8px 0px 0;
		}
	}
	.record_content{
		.el-steps--vertical{
			margin-left:150px;
			.step_icon{
				position: relative;
				.step_title{
					position: absolute;
					left: -166px;
					top: -2px;
					text-align: right;
					width: 150px;	
					font-weight: 800;
				}
			}
		}

	}
}

  </style>
  