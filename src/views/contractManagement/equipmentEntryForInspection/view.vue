<template>
  <div>

    <div class="form-content">
      <el-form ref="form"
               label-width="80px">
<!--        <div class="form-title">-->
<!--          <div class="title-big-bar"></div>-->
<!--          <strong>到场设备报验单-浙公路（JL）011</strong>-->
<!--        </div>-->

        <div class="form-block">
          <div class="form-block-title">
            <div class="title-bar"></div><strong>基本信息</strong>
          </div>
          <projectinfo></projectinfo>
          <div class="block-line">

            <div class="block-item">
              <div class="block-item-label">工程编号</div>
              <div class="block-item-value">
                {{formData.projectCode}}
              </div>
            </div>
          </div>
        </div>
        <div class="form-block">
          <div class="form-block-title">
            <div class="title-bar"></div><strong>进场设备信息</strong>
          </div>
          <div class="block-line">
            <div class="block-item">
              <div class="block-item-label">监理办<i class="require-icon"></i></div>
              <div class="block-item-value">
                {{formData.supervisionBan}}
              </div>
            </div>
          </div>
          <div class="block-table">
            <el-table :data="equipmentTable"
                      style="width: 100%"
                      border
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
          </div>
        </div>
        <div class="form-block">
          <div class="form-block-title">
            <div class="title-bar"></div><strong>附件清单</strong>
          </div>

          <attachlist :editAble="false"
                      ref="attachlist"
                      :attachTable="attachTable">
          </attachlist>

        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/contract'
import * as proapi from '@/api/project.js'
import {
  convertOptions,
  createProjectInfo,
  getQueryVariable,
} from '@/utils/format.js'
import attachlist from '../../common/attachlist'
import projectinfo from '../../common/projectinfo.vue'

export default {
  props: ['detailRow'],
  data() {
    return {
      baseInfo: {
        buildSection: 1,
        buildSectionName: '池州市平天湖东部区域棚户区改造建设工程EPC总承包',
        contractCode: '235SJSG01',
        buildCompany:
          '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
        supervisionUnit: '浙江交科公路水运工程监理有限公司',
      },
      formData: {
        //表单参数
        attachment: [],
        equipmentInfo: [],
        deletedFlag: 1,
        draftFlag: 1,
        projectCode: '',
        buildSection: this.$store.getters.project.id,
        projectId: this.$store.getters.project['parentid'],
        supervisionBan: '',
      },
      attachTable: [], //附件
      equipmentTable: [],
    }
  },
  created() {},
  components: {
    attachlist,
    projectinfo,
  },
  computed: {},
  mounted() {
    this.getEquipmentEnterEnums();
    this.getProjectInfoById()

    setTimeout(() => {
      var params = getQueryVariable()
      if (params['processDefinitionId']) {
        this.dialogFormVisible = true
        params['id'] = params['businessKey']
        this.taskInfo = params
        this.getDetail(params['businessKey'])
      }
    }, 500)
  },
  watch: {
    detailRow(obj) {
      if (obj['id']) {
        this.getDetail(obj['id'])
      }
    },
  },
  methods: {
    formatEquType(data) {
      data = data || []
      data.forEach((item) => {
        this.equipmentOptions.forEach((obj) => {
          if (item['equipmentType'].toString() == obj['value'].toString()) {
            item['equipmentTypeStr'] = obj['label']
          }
        })
      })
      return data
    },
    getEquipmentEnterEnums() {
      api.getEquipmentEnterEnums().then((res) => {
        let options = res.data || []
        this.equipmentOptions = convertOptions(options, 'desc', 'code')
      })
    },
    getDetail(id) {
      api.getEquipmentEnterDeatil(id).then((res) => {
        let data = res['data'] || {}
        this.formData = data
        this.attachTable = data.attachment || []
        this.equipmentTable = this.formatEquType(data.equipmentInfo || [])
      })
    },
    getProjectInfoById() {
      proapi
        .getProjectInfoById({
          projectid: this.$store.getters.project['parentid'],
        })
        .then((res) => {
          let data = res['data'] || {}
          this.baseInfo['buildSectionName'] = data['project']
            ? data['project']['name']
            : ''
          let list = data['companys'] || []
          let info = createProjectInfo(list)
          this.baseInfo['buildCompany'] = info['buildCompany']
          this.baseInfo['supervisionUnit'] = info['supervisionUnit']
        })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../../assets/css/dialog.scss';
</style>
