<template>
<div class="log-wrapper">
    <div class="log-title-box">
        <h4>操作日志<span>管理员查看所有系统操作记录</span></h4>
    </div>
    <div class="log-list">
        <el-table
            :data="list"
            border
            v-loading="loading"
            style="width: 100%">
            <el-table-column prop="content" label="日志内容" >
            </el-table-column>
            <el-table-column prop="creator_name" label="操作人" width="150">
            </el-table-column>
            <el-table-column prop="create_time" label="时间" sortable width="200"></el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>
</template>

<script>
export default {
    name: 'LogManager',
    data(){
        return {
            list: [],
            loading: false
        }
    },
    methods: {
        getLogList(curPage){
            const _this = this
            this.loading = !0
            this.$http.get('/safe/log', {
                params: {
                    pageNum: curPage,
                    pageSize: 10
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.loading = !1
                _this.list = response.data.data.list
                _this.list.total = response.data.data.totalRow
            })
            .catch(function (error){
                _this.loading = !1
            })
        },
        handleCurrentChange(index){
            this.getLogList(index)
        }
    },
    created(){
        this.getLogList(1)
    }
}
</script>

<style>
.log-wrapper {}
.log-title-box {
    padding-bottom: 20px;
}
.log-title-box h4 {
    line-height: 30px;
}
.log-title-box span {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
}

.log-list .el-table__body-wrapper {
    overflow-x: hidden;
}
</style>