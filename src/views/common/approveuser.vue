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
      <div class="block-line"
           v-if="options.length>1">
        <div class="block-item">
          <div class="block-item-label">类型<i class="require-icon"></i></div>
          <div class="block-item-value">
            <el-form-item :rules="[{required: true,
                                message: '必选',
                                trigger: 'blur'}]">
              <el-select placeholder="请选择"
                         v-model="currentType"
                         @change="changeNodeUser()">
                <el-option v-for="(item, index) in options"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="block-line"
           v-for="(userOptions,_index) in flowNodesUsersData"
           :key="_index">
        <div class="block-item"
             v-if="userOptions.sort != 1">
          <div class="block-item-label">{{userOptions.entryName}}<i class="require-icon"></i></div>
          <div class="block-item-value">
            <el-form-item :rules="[{required: true,
                                message: '必选',
                                trigger: 'blur'}]">
              <el-select placeholder="请选择"
                         :disabled="userOptions['isSign']?true:false"
                         :multiple="userOptions['isSign']?true:false"
                         v-model="auditUser[userOptions.entryUserVariable]"
                         @change="flowUserChange($event, userOptions.entryUserVariable)">
                <el-option v-for="(item, idx) in userOptions.userInfo"
                           :key="item.id+idx"
                           :label="item.name"
                           :value="item.username">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="block-item"
             v-if="userOptions.sort == 1 && userOptions.copyUserInfo">
          <div class="block-item-label">抄送<i class="require-icon"></i></div>
          <div class="block-item-value">
            <el-form-item :rules="[{required: true,
                                message: '必选',
                                trigger: 'blur'}]">
              <el-select placeholder="请选择"
                         :multiple="true"
                         v-model="copyData['user']"
                         @change="flowCopyUserChange($event, 'user')">
                <el-option v-for="(item, idx) in userOptions.copyUserInfo"
                           :key="item.id+idx"
                           :label="item.name"
                           :value="item.username">
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
import '@/staticDict/flowStaticDict.js'
import * as api from '@/api/quality'
import { getToken } from '@/utils/auth'
export default {
  props: ['auditUser', 'flowKey', 'copyData'],
  data() {
    return {
      formData: {},
      flowNodesUsersData: [],
      allData: {},

      currentType: '',
      options: [],
    }
  },
  created() {},
  computed: {},
  mounted() {
    this.getFlowAuditEntry()
  },
  methods: {
    flowUserChange(data, data1) {
      this.auditUser[data1] = data
      this.$forceUpdate()
    },
    flowCopyUserChange(data, data1) {
      this.copyData[data1] = data
    },
    getFlowAuditEntry() {
      this.options = []
      api
        .getFlowAuditEntry({
          flowKey: this.flowKey,
          buildSection: this.$store.getters.project.id,
          projectId: this.$store.getters.project['parentid'] || 2,
        })
        .then((res) => {
          res = res.data || {}
          this.allData = res
          let index = 0
          let currentData = []
          for (let f in res) {
            if (index == 0) {
              currentData = res[f]
              this.currentType = f
            }
            if (f.indexOf('隧道') > -1) {
              this.options.push({
                label: '隧道',
                value: f,
              })
            }
            if (f.indexOf('桥梁') > -1) {
              this.options.push({
                label: '桥梁',
                value: f,
              })
            }
            if (f.indexOf('道路') > -1) {
              this.options.push({
                label: '道路',
                value: f,
              })
            }
            if (f.indexOf('其他') > -1) {
              this.options.push({
                label: '其他',
                value: f,
              })
            }
            index++
          }
          for (let i = 0; i < currentData.length; i++) {
            const item = currentData[i]
            item.userInfo = item.userInfo || []
            if (currentData[i]['isSign']) {
              this.auditUser[item.entryUserVariable] = item.userInfo.map(
                (v) => v.username
              )
            } else {
              this.auditUser[item.entryUserVariable] =
                item.userInfo.length > 0 ? item.userInfo[0]['username'] : []
            }
          }
          this.auditUser.startUserName = getToken('name')
          this.flowNodesUsersData = currentData
        })
    },
    changeNodeUser() {
      let field = this.currentType
      let currentData = this.allData[field] || []
      for (let i = 0; i < currentData.length; i++) {
        const item = currentData[i]
        item.userInfo = item.userInfo || []
        if (currentData[i]['isSign']) {
          this.auditUser[item.entryUserVariable] = item.userInfo.map(
            (v) => v.username
          )
        } else {
          this.auditUser[item.entryUserVariable] =
            item.userInfo.length > 0 ? item.userInfo[0]['username'] : []
        }
      }
      this.auditUser.startUserName = getToken('name')
      this.flowNodesUsersData = currentData
    },
    validate() {
      this.$refs['ruleform'].validate((valid) => {})
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../assets/css/dialog.scss';
</style>
