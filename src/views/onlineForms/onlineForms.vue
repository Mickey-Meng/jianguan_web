<template>
    <div class="app-container">
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" height="90%" append-to-body>
            <el-button :loading="exportLoading" type="primary" @click="exportLuckySheet">导 出</el-button>
            <!-- 
                :fullscreen="fullscreen"
                :lock-scroll="lockScroll"
                :close-on-click-modal="closeOnClickModal"
                :close-on-press-escape="closeOnPressEscape"
            <div class="luckysheet-content">
                <div id="luckysheet" style="margin: 0px; padding: 0px; position: absolute; width: 100%; height:100%; left: 0px;top: 0px; bottom: 20px;"></div>
            </div>
             -->
             <lucky-sheet ref="luckysheetRef" v-bind:luckysheetParams = "luckysheetParams" />
 
            <div slot="footer" class="dialog-footer">
                <el-button :loading="buttonLoading" type="primary" @click="saveSheetData">确 定</el-button>
                <el-button @click="handleToClose">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import LuckySheet from "@/components/Luckysheet/lucky-sheet";
import { getFillDataTemplate, saveFillDataTemplate } from "@/api/jianguan/produce/produce";

import { blobValidate } from "@/utils/ruoyi";
import { exportLuckyExcel } from "@/utils/exportLuckyExcel";

export default {
    name: "OnlineForms",
    components: {
        LuckySheet
    },
    props: ['produceItem'],
    data() {
        return {
            buttonLoading: false,
            exportLoading: false,
            dialogVisible: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            fullscreen: false,
            lockScroll: false,
            dialogTitle: "luckysheet数据编辑",
            // lucksheet组件参数数据
            luckysheetParams: {
                luckySheetData: {
                    excelHeader: [],
                    excelData: {},
                },
                templateZipFile: undefined,
                templateUrl : "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx",
                templateName: "",
                templatePath: undefined
            }
            
        }
    },
    methods: {
        /**
         * 父页面调用此函数
        // 在线表单
        handleOnlineForms(row){
        this.currentProduceItem = row;
        // 在线表单
        setTimeout(() =>{
            this.$refs.onlineForms.onLuckySheetReady();
        }, 200);
        },
         */
        onLuckySheetReady() {
            this.dialogVisible = true;
            this.dialogTitle = "在线填写-" + this.produceItem.name
            this.onGetLuckySheetData();
        },
        onGetLuckySheetData(){
            this.luckysheetParams.luckySheetData = {
                excelHeader : ["姓名", "年龄", "性别"],
                excelData : {
                    姓名: ["张三", "赵兰", "李四"],
                    年龄: ["18", "17", "20"],
                    性别: ["男", "女", "男"]
                }
            };
            this.luckysheetParams.templateUrl = "http://112.30.143.222:9000/hefei/2023/07/19/da05f12b61d64a62a3e895b56ac159f0.xlsx";
            //this.luckysheetParams.templateUrl = "http://150.158.139.18:9000/hefei/2023/11/08/49a814bb5ed246e4a58c0a2ace85a316.xlsx";
            
            // 获取待填写的模板
            getFillDataTemplate(this.produceItem.id, { templateUrl : this.luckysheetParams.templateUrl })
                .then(async (resData) => {
                    const isBlob = await blobValidate(resData);
                    if (isBlob) {
                        const blobData = new Blob([resData]);
                        this.$refs.luckysheetRef.rendLuckyExcel(blobData);
                    }
                }).catch((r) => {
                    console.error(r)
                    this.$message.error('加载文件出现错误，请联系管理员！')
                })
        },
        saveSheetData() {
            this.buttonLoading = true;
           // var allSheetsData = window.luckysheet.getAllSheets();//获取sheet数据
            var luckyExcelData = window.luckysheet.toJson(); //获取Workbook数据
            console.log(JSON.stringify(luckyExcelData));
            saveFillDataTemplate(this.produceItem.id, JSON.stringify(luckyExcelData))
                .then(async (res) => {
                    if (res.code === 200) {
                        this.buttonLoading = false;
                        this.dialogVisible = false;
                        console.log(res);
                        this.$message.success("保存模板数据成功");
                    }
                }).catch((r) => {
                    this.buttonLoading = false;
                    console.error(r)
                    this.$message.error('加载文件出现错误，请联系管理员！')
                })
        },
        exportLuckySheet() {
            this.exportLoading = true;
            var luckysheetFile = window.luckysheet.getluckysheetfile();
            exportLuckyExcel(luckysheetFile, "文件下载");
        },

        handleToClose() {
            this.dialogVisible = false;
        }
    },
}
</script>
 
<style scoped>

.luckysheet-content {
    margin: 0px;
    padding: 0px;
    position: relative;
    width: 100%;
    height: 500px;
    left: 0px;
    top: 0px;
    bottom: 10px;
  }
    .excel {
        width: 100%;
        height: 60vh;
            .luckyexcel {
                margin:0px;
                padding:0px;
                position:absolute;
                width:100%;
                left: 0px;
                top: 95px;
                bottom:0px;
            }
    }
    .centers {
        color: #ccc;
        font-size: 12px;
        text-align: center;
    }
    .luckyexcel-zoom-content{
        display: none!important;
        height: 0px!important;
    }
    .luckyexcel-print-viewList {
        display: none!important;
    height: 0px!important;
    }
    #luckysheet-bottom-add-row{
        display: none;
    }
    #luckysheet-bottom-add-row-input{
        display: none;
    }
    #luckysheet-bottom-controll-row{
        span{
            display: none;
        }
    }
    .luckyexcel-sheet-area .luckyexcel-sheets-item, .luckyexcel-sheet-area>div{
        display: none!important;
    }
    .lucky-button-custom{
        display: none!important;
    }
    .luckyexcel-wa-calculate{
        display: none!important;
    }
</style>