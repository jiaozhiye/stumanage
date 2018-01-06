<template>
    <a :href="fileUrl" download="学员信息.xls">点击下载文件</a>
</template>

<script>
import qs from 'qs'

export default {
    name: 'ExportPanel',
    props: {
        params: Object
    },
    data(){
        return {
            fileUrl: ''
        }
    },
    methods: {
        getDownloadUrl(){
            this.fileUrl = window.serverUrl + '/safe/studentXls/exportXls?' + qs.stringify(this.params)
        }
    },
    created(){
        this.getDownloadUrl()
    }
}
</script>

<style>
</style>