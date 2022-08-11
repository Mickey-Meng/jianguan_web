<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="200px">
				<div class="form-block">
					<!-- <div class="form-block-title">
						<div class="title-bar"></div><strong>发起位置</strong>
						
					</div>
					<locationmap></locationmap> -->
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
					<el-collapse v-model="sideInfoVisible">
						<el-collapse-item v-if="formData.sideProjectId==1" title="嵌入表单" name="1">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								沥青面层</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="管理人员（人）">
										{{sideInfo.a33}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工人员（人）">
										{{sideInfo.a34}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="层位">
										{{sideInfo.a35}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="机械设备">
										{{sideInfo.a36}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="自动找平方式">
										{{sideInfo.a37}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="摊铺长度(m)">
										{{sideInfo.a38}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="管理人员（人）">
										{{sideInfo.a39}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="使用混合料">
										{{sideInfo.a40}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="摊铺开始时间">
										{{sideInfo.a41}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="摊铺结束时间">
										{{sideInfo.a42}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="4">
									<el-form-item label="">
										<el-checkbox disabled disabled v-model="sideInfo.a43">下承层清扫</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-form-item label="">
										<el-checkbox disabled v-model="sideInfo.a44">粘层</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-form-item label="">
										<el-checkbox disabled v-model="sideInfo.a45">设备正常</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-form-item label="">
										<el-checkbox disabled v-model="sideInfo.a46">熨平板预热</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-form-item label="">
										<el-checkbox disabled v-model="sideInfo.a47">工艺与方案一致</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-form-item label="">
										<el-checkbox disabled v-model="sideInfo.a48">有离析</el-checkbox>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="桩号">
										{{sideInfo.a49}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="摊铺速度(km/h)">
										{{sideInfo.a50}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="摊铺厚度(mm)">
										{{sideInfo.a51}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="初压速度(km/h)">
										{{sideInfo.a52}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="初压遍数(遍)">
										{{sideInfo.a53}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="复压速度(km/h)">
										{{sideInfo.a54}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="复压遍数(遍)">
										{{sideInfo.a55}}
									</el-form-item>
								</el-col>
							</el-row>
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==2" title="嵌入表单" name="2">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								压浆</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="管理人员（人）">
										{{sideInfo.a56}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工人员（人）">
										{{sideInfo.a57}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="设备型号">
										{{sideInfo.a58}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="孔道编码">
										{{sideInfo.a59}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="压力表读数">
										{{sideInfo.a60}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="是否堵孔">
										{{sideInfo.a61}}
									</el-form-item>
								</el-col>
							</el-row>
						
							<el-row>
								<el-col :span="12">
									<el-form-item label="开始时间">
										{{sideInfo.a62}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="结束时间">
										{{sideInfo.a63}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="稳压时间">
										{{sideInfo.a64}}
									</el-form-item>
								</el-col>
							</el-row>
						
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="压浆液水胶比">
										{{sideInfo.a65}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="压浆液水胶比">
										{{sideInfo.a66}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="压浆液水胶比">
										{{sideInfo.a67}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="制取强度试件">
										{{sideInfo.a68}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="制取强度试件">
										{{sideInfo.a69}}
									</el-form-item>
								</el-col>
						
							</el-row>
						
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==3" title="嵌入表单" name="3">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								张拉</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="管理人员（人）">
										{{sideInfo.a70}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工人员（人）">
										{{sideInfo.a71}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="设备型号">
										{{sideInfo.a72}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="油表编号">
										{{sideInfo.a73}}
									</el-form-item>
								</el-col>
							</el-row>
						
							<el-row>
								<el-col :span="12">
									<el-form-item label="开始时间">
										{{sideInfo.a74}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="结束时间">
										{{sideInfo.a75}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="断束数量">
										{{sideInfo.a76}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="端头砼有无碎裂">
										{{sideInfo.a77}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="锚垫板有无变形">
										{{sideInfo.a78}}
									</el-form-item>
								</el-col>
							</el-row>
						
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==4" title="嵌入表单" name="4">
							<el-row
									style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
									桩基首盘混凝土</el-row>
								<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
								</el-row>
								<el-row>
									<el-form-item label="旁站时间">
										{{sideInfo.a01}}
									</el-form-item>
								</el-row>
								<el-row>
									<el-col :span="8">
										<el-form-item label="施工员在岗情况">
											{{sideInfo.a02}}
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="质检员在岗情况">
											{{sideInfo.a03}}
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="安全员在岗情况" prop="sideDate">
											{{sideInfo.a04}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="施工作业人员满足施工需要情况" prop="sideDate">
											{{sideInfo.a05}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="特殊作业人员持证上岗情况" prop="sideDate">
											{{sideInfo.a06}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="施工机械满足施工需要情况" prop="sideDate">
											{{sideInfo.a07}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="施工材料符合设计和规范要求" prop="sideDate">
											{{sideInfo.a08}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="开始施工时间" prop="sideDate">
											{{sideInfo.a09}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="结束施工时间" prop="sideDate">
											{{sideInfo.a10}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-form-item label="施工工艺按审批施工方案实施" prop="sideDate">
										{{sideInfo.a11}}
									</el-form-item>
								</el-row>
								<el-row>
									<el-form-item label="钢筋笼安放所采用的施工机械设备是否满足要求" prop="sideDate">
										{{sideInfo.a12}}
									</el-form-item>
								</el-row>
								<el-row>
									<el-form-item label="钢筋笼吊装及安放工艺是否符合批准的施工方案" prop="sideDate">
										{{sideInfo.a13}}
									</el-form-item>
								</el-row>
								<el-row>
									<el-col :span="8">
										<el-form-item label="施工现场质量措施落实情况" prop="sideDate">
											{{sideInfo.a14}}
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="安全措施落实情况" prop="sideDate">
											{{sideInfo.a15}}
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="环保措施落实情况" prop="sideDate">
											{{sideInfo.a16}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="施工现场质量措施落实情况" prop="sideDate">
											{{sideInfo.a17}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="桩位实测值" prop="sideDate">
											{{sideInfo.a18}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="孔深设计值(m）" prop="sideDate">
											{{sideInfo.a19}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="孔深实测值(m）" prop="sideDate">
											{{sideInfo.a20}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="孔径设计值(mm)" prop="sideDate">
											{{sideInfo.a21}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="孔径实测值(mm)" prop="sideDate">
											{{sideInfo.a22}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="钻孔倾斜度设计值(mm)" prop="sideDate">
											{{sideInfo.a23}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="倾斜度实测值(mm)" prop="sideDate">
											{{sideInfo.a24}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="沉淀厚度设计值(mm)" prop="sideDate">
											{{sideInfo.a25}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="沉淀厚度实测值(mm)" prop="sideDate">
											{{sideInfo.a26}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="终孔后泥浆比重" prop="sideDate">
											{{sideInfo.a27}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="砂率" prop="sideDate">
											{{sideInfo.a28}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="一清后泥浆的比重" prop="sideDate">
											{{sideInfo.a29}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="砂率" prop="sideDate">
											{{sideInfo.a30}}
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="二清后泥浆的比重" prop="sideDate">
											{{sideInfo.a31}}
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="砂率" prop="sideDate">
											{{sideInfo.a32}}
										</el-form-item>
									</el-col>
								</el-row>
							</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==5" title="嵌入表单" name="5">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								桩基钢筋笼安放</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-form-item label="施工准备完成时间">
									{{sideInfo.a79}}
								</el-form-item>
							</el-row>
							<el-row>
								<el-col :span="8">
									<el-form-item label="施工员在岗情况">
										{{sideInfo.a80}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="质检员在岗情况">
										{{sideInfo.a81}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="安全员在岗情况">
										{{sideInfo.a82}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="施工作业人员满足施工需要情况">
										{{sideInfo.a83}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="业人员持证上岗情况">
										{{sideInfo.a84}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="施工机械满足施工需要情况">
										{{sideInfo.a85}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工材料符合设计和规范要求">
										{{sideInfo.a86}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="开始施工时间">
										{{sideInfo.a87}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="结束施工时间">
										{{sideInfo.a88}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-form-item label="施工工艺按审批施工方案实施">
									{{sideInfo.a89}}
								</el-form-item>
							</el-row>
							<el-row>
								<el-form-item label="钢筋笼安放所采用的施工机械设备是否满足要求">
									{{sideInfo.a90}}
								</el-form-item>
							</el-row>
							<el-row>
								<el-form-item label="钢筋笼吊装及安放工艺是否符合批准的施工方案">
									{{sideInfo.a91}}
								</el-form-item>
							</el-row>
							<el-row>
								<el-col :span="8">
									<el-form-item label="施工现场质量措施落实情况">
										{{sideInfo.a92}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="安全措施落实情况">
										{{sideInfo.a93}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="环保措施落实情况">
										{{sideInfo.a94}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="钢筋笼主筋间距设计值(mm)">
										{{sideInfo.a95}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="钢筋笼主筋间距设计值(mm)">
										{{sideInfo.a96}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="螺旋筋间距设计值(mm）">
										{{sideInfo.a97}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="螺旋筋间距实测值(mm）">
										{{sideInfo.a98}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="钢筋笼长度(直径)设计值(mm)">
										{{sideInfo.a99}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="钢筋笼长度(直径)实测值(mm)">
										{{sideInfo.a100}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="保护层厚度设计值(mm)">
										{{sideInfo.a101}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="保护层厚度实测值(mm)">
										{{sideInfo.a102}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="钢筋笼接头扭矩规定值(Nm)">
										{{sideInfo.a103}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="钢筋笼接头扭矩实测值(Nm)">
										{{sideInfo.a104}}
									</el-form-item>
								</el-col>
							</el-row>
						
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==6" title="嵌入表单" name="6">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								砼浇筑</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="管理人员（人）">
										{{sideInfo.a105}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工人员（人）">
										{{sideInfo.a106}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="砼供应方式">
										{{sideInfo.a107}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="机械设备">
										{{sideInfo.a108}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="砼振捣方式">
										{{sideInfo.a109}}
									</el-form-item>
								</el-col>
						
							</el-row>
						
							<el-row>
								<el-col :span="12">
									<el-form-item label="浇筑开始时间">
										{{sideInfo.a110}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="浇筑结束时间">
										{{sideInfo.a111}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="6">
									<el-form-item label="检查项1">
										<el-checkbox disabled v-model="sideInfo.a112">模板清洁</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="检查项2">
										<el-checkbox disabled v-model="sideInfo.a113">设备正常</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="检查项3">
										<el-checkbox disabled v-model="sideInfo.a114">保护层垫块良好</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="检查项4">
										<el-checkbox disabled v-model="sideInfo.a115">工艺与方案一致</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="检查项5">
										<el-checkbox disabled v-model="sideInfo.a116">无涨模现象</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="检查项6">
										<el-checkbox disabled v-model="sideInfo.a117">预埋件位置正确</el-checkbox>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="检查项7">
										<el-checkbox disabled v-model="sideInfo.a118">电器设备安全</el-checkbox>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="坍落度(mm)">
										{{sideInfo.a119}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="砼强度等级(MPa)">
										{{sideInfo.a120}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="砼设计方量(m³)">
										{{sideInfo.a121}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="砼实际方量(m³)">
										{{sideInfo.a122}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="制作抗压试件(组)">
										{{sideInfo.a123}}
									</el-form-item>
								</el-col>
						
							</el-row>
						
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==7" title="嵌入表单" name="7">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								湿喷桩</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="管理人员（人）">
										{{sideInfo.a124}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工人员（人）">
										{{sideInfo.a125}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="钻机型号">
										{{sideInfo.a126}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工工艺">
										{{sideInfo.a127}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="桩号">
										{{sideInfo.a128}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="设计桩长(m)">
										{{sideInfo.a129}}
									</el-form-item>
								</el-col>
							</el-row>
						
							<el-row>
								<el-col :span="12">
									<el-form-item label="下钻开始时间">
										{{sideInfo.a130}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="下钻结束时间">
										{{sideInfo.a131}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="复搅卡开始时间">
										{{sideInfo.a132}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="复搅卡结束时间">
										{{sideInfo.a133}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="桩号">
										{{sideInfo.a134}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="水泥浆稠度">
										{{sideInfo.a135}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="下钻速度(米/分)">
										{{sideInfo.a136}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="复搅速度(米/分)">
										{{sideInfo.a137}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="结束电流(A)">
										{{sideInfo.a138}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="水泥用量(kg/延米)">
										{{sideInfo.a139}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="实际桩长(m)">
										{{sideInfo.a140}}
									</el-form-item>
								</el-col>
						
							</el-row>
						
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==8" title="嵌入表单" name="8">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								湿喷桩</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="管理人员（人）">
										{{sideInfo.a141}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工人员（人）">
										{{sideInfo.a142}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="钻机类型">
										{{sideInfo.a143}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="单节钢筋笼(m)">
										{{sideInfo.a144}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="安装方式">
										{{sideInfo.a145}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="连接方式">
										{{sideInfo.a146}}
									</el-form-item>
								</el-col>
							</el-row>
						
							<el-row>
								<el-col :span="12">
									<el-form-item label="安装开始时间">
										{{sideInfo.a147}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="安装结束时间">
										{{sideInfo.a148}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="二次清孔开始时间">
										{{sideInfo.a149}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="二次清孔结束时间">
										{{sideInfo.a150}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">桩基浇筑
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="二次清孔泥浆比重">
										{{sideInfo.a151}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="粘度(S)">
										{{sideInfo.a152}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="含沙率(%)">
										{{sideInfo.a153}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="沉淀层厚度(cm)">
										{{sideInfo.a154}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="首封砼方量(m³)">
										{{sideInfo.a155}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="首封管深埋(m)">
										{{sideInfo.a156}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="坍落度(mm)">
										{{sideInfo.a157}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="浇筑砼总方量(m³)">
										{{sideInfo.a158}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="砼顶面高程(m)">
										{{sideInfo.a159}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="高于设计桩顶(m)">
										{{sideInfo.a160}}
									</el-form-item>
								</el-col>
							</el-row>
						
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==9" title="嵌入表单" name="9">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								水泥稳定碎石基层（底基层）</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-form-item label="施工准备完成时间">
									{{sideInfo.a161}}
								</el-form-item>
							</el-row>
							<el-row>
								<el-col :span="8">
									<el-form-item label="施工员在岗情况">
										{{sideInfo.a162}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="质检员在岗情况">
										{{sideInfo.a163}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="安全员在岗情况">
										{{sideInfo.a164}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="施工作业人员满足施工需要情况">
										{{sideInfo.a165}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="特殊作业人员持证上岗情况">
										{{sideInfo.a166}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="施工机械满足施工需要情况">
										{{sideInfo.a167}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工材料符合设计和规范要求">
										{{sideInfo.a168}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="开始施工时间">
										{{sideInfo.a169}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="结束施工时间">
										{{sideInfo.a170}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-form-item label="施工工艺">
									{{sideInfo.a171}}
								</el-form-item>
							</el-row>
							
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="松铺厚度">
										{{sideInfo.a172}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="宽度">
										{{sideInfo.a173}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="平整度">
										{{sideInfo.a174}}
									</el-form-item>
								</el-col>
								
							</el-row>
							
						</el-collapse-item>
						<el-collapse-item v-if="formData.sideProjectId==10" title="嵌入表单" name="10">
							<el-row
								style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
								级配碎石基层（底基层）</el-row>
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
							</el-row>
							<el-row>
								<el-form-item label="施工准备完成时间">
									{{sideInfo.a175}}
								</el-form-item>
							</el-row>
							<el-row>
								<el-col :span="8">
									<el-form-item label="施工员在岗情况">
										{{sideInfo.a176}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="质检员在岗情况">
										{{sideInfo.a177}}
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="安全员在岗情况">
										{{sideInfo.a178}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="施工作业人员满足施工需要情况">
										{{sideInfo.a179}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="特殊作业人员持证上岗情况">
										{{sideInfo.a180}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="施工机械满足施工需要情况">
										{{sideInfo.a181}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="施工材料符合设计和规范要求">
										{{sideInfo.a182}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="开始施工时间">
										{{sideInfo.a183}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="结束施工时间">
										{{sideInfo.a184}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-form-item label="施工工艺">
									{{sideInfo.a185}}
								</el-form-item>
							</el-row>
							
							<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="松铺厚度">
										{{sideInfo.a186}}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="宽度">
										{{sideInfo.a187}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="平整度">
										{{sideInfo.a188}}
									</el-form-item>
								</el-col>
								
							</el-row>
							
						</el-collapse-item>
										
					</el-collapse>
													
				
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
				sideInfoVisible:'',
				sideInfo: {
				
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
				this.sideInfoVisible=''
				api.getSupervisionSideDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.sideInfo = data['sideInfo'] ? JSON.parse(data['sideInfo']) : {};
					this.formData.sideProjectStr=getOptionsLabel(this.sideOptions,this.formData.sideProjectId)
					
					let treename=getChidlren(this.treeData,this.formData.projectPartId,[]);
					this.formData.projectPartStr=(treename?treename:[]).join('/');
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	.el-collapse-item {
		.el-input {
			width: calc(100% - 200px) !important
		}
	}
	@import "../../../../assets/css/dialog.scss"
</style>
