<template>
<div>
    <h5 class="fileTemplate">
        <span>请点击下载模版：</span><a :href="templateUrl" download="学员信息模版.xls">下载模版</a>
    </h5>
    <h5 class="fileTemplate" v-if="isError">
        <a style="color: #f56c6c;" :href="errorUrl">下载错误文档</a>
    </h5>
    <el-upload
        class="upload-demo"
        ref="upload"
        :action="reqUrl"
        :on-success="handleSuccess"
        :file-list="fileList"
        :multiple="false"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click.stop="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过2000kb</div>
    </el-upload>
</div>
</template>

<script>
export default {
    name: 'ImportPanel',
    data(){
        return {
            templateUrl: '',
            isError: false,
            errorUrl: window.serverUrl + '/safe/studentXls/downloadErrorFile',
            reqUrl: window.serverUrl + '/safe/studentXls/importXls',
            fileList: []
        }
    },
    created(){
        this.getTemplateUrl()
    },
    methods: {
        getTemplateUrl(){
            this.templateUrl = window.serverUrl + '/safe/studentXls/getTemplate'
        },
        submitUpload(){
            this.$refs.upload.submit()
        },
        handleSuccess(response, file, fileList){
            // console.log(response)
            if (response.code != 1){
                this.errorUrl += '?errorFileDir=' + response.errorFileDir + '&errorFileName=' + response.errorFileName
                this.isError = !0
                this.$message({
                    type: 'error',
                    message: response.msg
                })
            } else {
                this.$message({
                    type: 'success',
                    message: response.msg
                })
            }
        }
    }
}
</script>

<style>
.fileTemplate {
    margin-bottom: 5px;
}
.fileTemplate:first-child {
    margin-top: -20px;
}
</style>