<!--
@name:
@description:设备进场报验
@author: 王海林
@time: 2022-05-27 14:28:18
@modifier:
@modifierTime:
-->
<template>
  <div class="tab-page">
    <el-tabs v-model="activeName">
      <el-tab-pane label="设备进场"
                   name="first">
        <el-container class="container-box">
          <el-header>
            <div class="input-box">
              <div class="input-value">
                <el-input v-model="queryData.supervisionBan"
                          placeholder="监理单位"></el-input>
              </div>

            </div>
            <div class="input-box">
              <div class="input-value">
                <el-input v-model="queryData.projectCode"
                          placeholder="工程编号"></el-input>
              </div>
            </div>
            <el-button type="primary"
                       @click="query()">搜索</el-button>

            <div v-if="!isDraft"
                 class="right-btns">
              <!-- <el-button type="primary" size="small"
					:icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
					@click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
              <div class="operate-btns"
                   v-show="operateBtnsVisible">
                <el-button size="small"
                           @click="addNew">新增</el-button>
                <el-button size="small"
                           @click="exportData">导出</el-button>
                <el-button size="small">批量操作</el-button>
              </div>
            </div>
          </el-header>
          <el-main>
            <div class="container">
              <el-table :data="tableData"
                        style="width: 100%"
                        border
                        height="calc(100% - 48px)"
                        class="have_scrolling">
                <el-table-column type="index"
                                 width="50"
                                 align="center"
                                 label="序号">
                </el-table-column>
                <el-table-column prop="projectName"
                                 align="center"
                                 label="项目名称"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="projectCode"
                                 align="center"
                                 label="工程编号"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="buildUnits"
                                 align="center"
                                 label="施工单位"
                                 show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column prop="contractCode" align="center" label="合同号" show-overflow-tooltip>
					</el-table-column> -->
                <el-table-column prop="supervisionBan"
                                 align="center"
                                 label="监理办"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supervisorUnits"
                                 align="center"
                                 label="监理单位">
                </el-table-column>
                <!-- <el-table-column prop="contractCode" align="center" label="合同号">
					</el-table-column> -->
                <el-table-column prop="statusStr"
                                 align="center"
                                 label="状态描述">
                </el-table-column>
                <el-table-column fixed="right"
                                 width="120"
                                 align="center"
                                 label="操作">
                  <template slot-scope="{ row, $index }">
                    <el-button v-if="!isDraft"
                               type="text"
                               size="mini"
                               @click="modify(row)">修改</el-button>
                    <el-button v-if="!isDraft"
                               type="text"
                               size="mini"
                               @click="viewDetail(row)">详情</el-button>

                    <el-button v-if="isDraft"
                               type="text"
                               size="mini"
                               @click="checkDetail(row)">选择</el-button>

                    <el-button type="text"
                               size="mini"
                               @click="deleteRow(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination @current-change="handleCurrentChange"
                             :current-page="queryData.pageNum"
                             :page-size="queryData.pageSize"
                             layout="total, prev, pager, next, jumper"
                             :total="queryData.totalPage">
              </el-pagination>
            </div>
          </el-main>
          <edit ref="edit"
                @query="query"
                :editRow="editRow"></edit>
          <detail ref="detail"
                  :detailRow="detailRow"></detail>
        </el-container>
      </el-tab-pane>
      <el-tab-pane v-if="!isDraft"
                   label="设备一览"
                   name="second">
        <el-container class="container-box">
          <el-header>
            <div class="input-box">
              <div class="input-value">
                <el-input v-model="queryData_1.equipmentName"
                          placeholder="设备名称"></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="input-value">
                <el-select v-model="queryData_1.equipmentType"
                            clearable
                           placeholder="请选择">
                  <el-option v-for="item in equipmentOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="input-box">
              <div class="input-value">
                <el-button type="primary"
                           @click="query_1">搜索</el-button>
              </div>
            </div>
          </el-header>
          <el-main>
            <div class="container">
              <el-table :data="tableData_1"
                        style="width: 100%"
                        border
                        height="calc(100% - 48px)"
                        class="have_scrolling">
                <el-table-column type="index"
                                 width="50"
                                 align="center"
                                 label="序号">
                </el-table-column>
                <el-table-column prop="equipmentTypeStr"
                                 align="center"
                                 label="设备类型"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="equipmentName"
                                 width="180px"
                                 align="center"
                                 label="设备名称">
                </el-table-column>
                <el-table-column prop="specification"
                                 width="120px"
                                 align="center"
                                 label="规格型号">
                </el-table-column>
                <el-table-column prop="num"
                                 width="120px"
                                 align="center"
                                 label="数量">
                </el-table-column>
                <el-table-column prop="enterDate"
                                 width="120px"
                                 align="center"
                                 label="进场日期">
                </el-table-column>
                <el-table-column prop="techCondition"
                                 width="120px"
                                 align="center"
                                 label="技术状况">
                </el-table-column>
                <el-table-column prop="useWhere"
                                 width="120px"
                                 align="center"
                                 label="拟用何处">
                </el-table-column>
                <el-table-column prop="remark"
                                 width="120px"
                                 align="center"
                                 label="备注">
                </el-table-column>
              </el-table>
              <el-pagination @current-change="handleCurrentChange_1"
                             :current-page="queryData_1.pageNum"
                             :page-size="queryData_1.pageSize"
                             layout="total, prev, pager, next, jumper"
                             :total="queryData_1.totalPage">
              </el-pagination>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as api from '@/api/contract'
import edit from './equipmentEntryForInspection/edit'
import detail from './equipmentEntryForInspection/detail'
import { convertOptions } from '@/utils/format.js'

export default {
  props: {
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: 'first',
      allData: {},
      tableData: [],
      tableData_1: [],
      operateBtnsVisible: true,
      dialogTitle: '智慧建设通用版-【绍兴市】235国道杭州',
      dialogFormVisible: false,
      queryData: {
        supervisionBan: '',
        projectCode: '',
        draftFlag: 1,
        pageNum: 1,
        totalPage: 1,
        pageSize: 10,
        buildSection: this.$store.getters.project.id,
        projectId: this.$store.getters.project['parentid'],
      },
      queryData_1: {
        //查询参数
        buildSection: this.$store.getters.project.id,
        draftFlag: 1,
        enterId: null,
        equipmentName: '',
        equipmentType: '',
        pageNum: 1,
        pageSize: 10,
        projectId: this.$store.getters.project['parentid'],
      },
      editRow: null,
      detailRow: null,
      equipmentOptions: [],
    }
  },
  created() {},
  components: {
    edit,
    detail,
  },
  computed: {},
  mounted() {
    this.getEquipmentEnterEnums()
    this.query()
    
  },
  methods: {
    query() {
      this.queryData.draftFlag = this.isDraft ? 0 : 1
      api.getEquipmentEnterList(this.queryData).then((res) => {
        this.allData = res.data || {}
        this.tableData = this.formateTableData(this.allData['list'])
        this.queryData.pageNum = res.data.pageNum
        this.queryData.totalPage = res.data.total
        this.queryData.pageSize = res.data.pageSize
      })
    },
    query_1() {
      api.getEquipmentInfoList(this.queryData_1).then((res) => {
        res.data = res.data || {}
        this.tableData_1 = this.formatEquType(res.data['list'] || []);
        this.queryData_1.pageNum = res.data.pageNum
        this.queryData_1.totalPage = res.data.total
        this.queryData_1.pageSize = res.data.pageSize
      })
    },
    formatEquType(data){
        data=data||[]
        data.forEach(item=>{
            this.equipmentOptions.forEach(obj=>{
                 if (item['equipmentType'].toString() == obj['value'].toString()) {
                    item['equipmentTypeStr']=obj['label']
                }
            })
        })
        return data;
    },
    getEquipmentEnterEnums() {
      api.getEquipmentEnterEnums().then((res) => {
        let options = res.data || []
        this.equipmentOptions = convertOptions(options, 'desc', 'code')

        this.query_1()
      })
    },
    formateTableData(list) {
      list = list || []
      list.forEach((item) => {
        item['buildUnits'] = item['buildUnits']
          ? item['buildUnits'].join('、')
          : ''
        item['supervisorUnits'] = item['supervisorUnits']
          ? item['supervisorUnits'].join('、')
          : ''
      })
      return list
    },
    addNew() {
      // this.editRow=null;
      this.$refs.edit.changeVisible(null, true)
    },
    modify(row) {
      // this.editRow=row;
      this.$refs.edit.changeVisible(row, true)
    },
    viewDetail(row) {
      this.detailRow = row
      this.$refs.detail.changeVisible(true)
    },
    deleteRow(row) {
      this.$confirm('确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api
          .deleteEquipmentEnter(row['id'])
          .then((res) => {
            if (this.tableData.length == 1) {
              this.queryData.pageNum =
                this.queryData.pageNum > 1 ? this.queryData.pageNum - 1 : 1
            }
            this.query()
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          })
          .catch((error) => {
            this.$message({
              type: 'fail',
              message: '删除失败!',
            })
          })
      })
    },
    handleCurrentChange(page) {
      this.queryData.pageNum = page
      this.query()
    },
    handleCurrentChange_1(page) {
      this.queryData_1.pageNum = page
      this.query_1()
    },
    checkDetail(row) {
      this.$emit('hideDraft')
      this.$emit('getDetail', row['id'])
    },
    exportData() {
      this.queryData.draftFlag = 1
      api.exportEquipmentEnterList(this.queryData).then((res) => {
        const reader = new FileReader()
        reader.readAsDataURL(res)
        reader.onload = (e) => {
          const a = document.createElement('a')
          a.download = `设备进场报验清单.xls`
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import '../../assets/css/table.scss';
</style>