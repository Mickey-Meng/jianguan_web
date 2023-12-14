<template>
  <el-container class="container-box">
    <el-header>
      <div class="nav">
        <div :class="{ active: currentView === 'fill' }" @click="changeView('fill')" > 工序报验 </div>
        <div :class="{ active: currentView === 'record' }" @click="changeView('record')" > 验收记录 </div>
      </div>      
    </el-header>

    <el-main>
      <!-- 工序报验 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-if="currentView === 'fillReport'"
        key="fillReport"
        height="100%"
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="工序名称" align="center"></el-table-column>
        
        <el-table-column label="完成时间" width="140px" show-overflow-tooltip align="center">
              <template slot-scope="{ row }">
                {{ row.status === 3 ? "正在审核" : (row.status === 0 || !row.status ? '未录入' : row.finish) }}
              </template>
        </el-table-column>
        <el-table-column label="照片/附件" width="80px" align="center">
          <template slot-scope="{ row }">
            <svg-icon class="svg-class svg-btn" :class="row.status === 3
              ? 'submit'
              : row.status === 2
                ? 'reject'
                : row.status === 1
                  ? 'finish'
                  : 'error'
              " icon-class="seeDetail" v-if="row.recordid" @click="seeRecord(row)"></svg-icon>
            <span v-else>未录入</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60px" align="center">
          <template slot-scope="{ row, $index }">
            <el-tooltip class="item" popper-class="tooltio-panel" :enterable="false" effect="dark" content="填报"
              placement="top">
              <svg-icon icon-class="update" class="svg-btn" @click="fillProcess(row, $index)"></svg-icon>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 验收记录 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-if="currentView === 'model'"
        key="model"
        height="100%"
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        
        <el-table :data="recordsData" style="width: 100%" class="small_scrolling" key="check"
            v-if="currentView === 'record'" height="95%" border>
          <el-table-column label="状态" align="center">
            <template slot-scope="{ row }">
              <div :class="row.checkresult === 3
                ? 'sum'
                : row.checkresult === 2
                  ? 'rej'
                  : row.checkresult === 1
                    ? 'yes'
                    : ''
                ">
                {{
                  row.checkresult === 3
                  ? "正在审核"
                  : row.checkresult === 2
                    ? "监理驳回"
                    : row.checkresult === 1
                      ? "审核通过"
                      : ""
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="conponentcode" label="构件编码" align="center">
          </el-table-column>
          <el-table-column prop="conponentname" label="构件类型" align="center">
          </el-table-column>
          <el-table-column prop="producename" label="工序名称" align="center">
          </el-table-column>
          <el-table-column prop="stime" label="完成时间" align="center">
          </el-table-column>
      </el-table>
    </el-main>

    <el-footer> </el-footer>
    <el-dialog
      :title="diaTitle"
      :visible.sync="dialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        :model="form"
        v-if="dialogVisible"
        ref="form"
        size="small"
        label-position="right"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="文件类型">
          <el-input readonly="" v-model="typeText"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="uploadname">
          <el-input
            placeholder="请输入文件名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件" prop="fileurl" v-if="isCreate">
          <uploadFile
            ref="otherOrgAttachments"
            @changeValue="changeValue"
            :limitFileSize="300"
          ></uploadFile>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary"  class="primary_mini"  @click="addFile">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="isCreate ? '上传模型文件' : '修改模型文件'"
      :visible.sync="modelDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        :model="form"
        v-if="modelDialogVisible"
        ref="modelform"
        size="small"
        label-position="right"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="标段名称" prop="distiancename">
          <el-input
            placeholder="请输入标段名称"
            v-model="form.distiancename"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件名称" prop="uploadname">
          <el-input
            placeholder="请输入文件名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="更新内容" prop="changecontent">
          <el-input
            placeholder="请输入更新内容"
            v-model="form.changecontent"
          ></el-input>
        </el-form-item>
        <el-form-item label="建模软件" prop="softname">
          <el-input
            placeholder="请输入建模软件"
            v-model="form.softname"
          ></el-input>
        </el-form-item>
        <el-form-item label="审查意见" prop="opiontion">
          <el-input
            placeholder="请输入审查意见"
            v-model="form.opiontion"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否编码">
          <el-switch
            v-model="form.isutf"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="上传文件" prop="fileurl" v-if="isCreate">
          <uploadFile
            ref="otherOrgAttachments"
            @changeValue="changeValue"
            :limitFileSize="300"
          ></uploadFile>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="modelDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" type="primary"  class="primary_mini"  @click="addModelFile"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {uploadF, getFile, deleteFile, updateFileInfo, getFileDictByPCode} from "@/api/file";
import { downLoadFile, downLoadRowFile } from "@/utils/download";
import {mapGetters} from "vuex";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      modelData: [],
      currentView: "fillReport", //model
      typeKey: "",
      dialogVisible: false
    }
    
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    this.$nextTick(() => {
        Bus.$on("getProcessById", (data) => {
          this.componentInfo = data;
          this.name = "(" + data.pname + ":" + data.conponetcode + ")";
          this.getCheackDataById();
        });
      })
    },
  }
}
</script>

<style scoped lang="scss">
.container-box {
  .el-header {
    padding: 0 5px;
    line-height: 60px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    color: #000000;

    .nav {
      display: flex;
      align-items: center;
      margin-right: 20px;

      > div {
        border: 1px solid rgb(56, 122, 253);
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        cursor: pointer;
      }

      .active {
        background-color: rgb(56, 122, 253);
        color: #ffffff;
      }
    }
    .el-select {
      margin-right: 20px;
    }
  }
}
</style>
