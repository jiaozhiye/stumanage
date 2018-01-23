<template>
<div class="arcManager-wrapper">
    <div class="arc-top">
        <el-button class="fl" @click.stop="addArcHandle">新增文章</el-button>
    </div>
    <div class="arc-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="文章标题"></el-table-column>
            <el-table-column prop="sort" label="创建时间" sortable></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">修改</el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <Extract :params="addArcExtract">
        <AddArcPanel :params="addArcExtract" @reloadEvent="reloadGetData"></AddArcPanel>
    </Extract>
    <Extract :params="modArcExtract">
        <ModArcPanel :params="modArcExtract" @reloadEvent="reloadGetData"></ModArcPanel>
    </Extract>
</div>
</template>

<script>
import Extract from './Extract.vue'
import AddArcPanel from './AddArcPanel.vue'
import ModArcPanel from './ModArcPanel.vue'

export default {
    name: 'ArticleManager',
    data(){
        return {
            curPageIndex: 1, // 当前页码
            list: [],
            loading: false,
            addArcExtract: {
                isPlay: false,
                promptTitle: '新增文章'
            },
            modArcExtract: {
                isPlay: false,
                promptTitle: '修改文章'
            }
        }
    },
    created(){
        this.getArcList(this.curPageIndex)
    },
    methods: {
        addArcHandle(){
            this.addArcExtract.isPlay = true
        },
        modItemHandle(_id){
            this.modArcExtract.isPlay = true
            this.modArcExtract.itemId = _id
        },
        delItemHandle(_id){
            const _this = this
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/dictMgr/deleteById', {
                    params: {
                        id: _id
                    }
                }).then(function (response){
                    if (response.data.code == 1){
                        _this.removeItemById(_id)
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    } else {
                        _this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                })
            }).catch(() => {})
        },
        getArcList(curPage){
            const _this = this
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            this.$http.get('/safe/dictMgr/list', {
                params: {
                    pageNum: curPage,
                    pageSize: 10
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.loading = !1
                _this.list = response.data
                _this.list.total = response.data.totalRow
            })
            .catch(function (error){
                _this.loading = !1
            })
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getArcList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getArcList(this.curPageIndex)
            }
        },
        removeItemById(_id){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == _id){
                    this.list.splice(i, 1)
                    break
                }
            }
        }
    },
    components: {
        Extract,
        AddArcPanel,
        ModArcPanel
    }
}
</script>

<style>
.arcManager-wrapper {}
.arc-top {
    height: 40px;
}

.arc-list {
    margin-top: 20px;
}
.arc-list .el-table__body-wrapper {
    overflow-x: hidden;
}
.arc-list .el-table__body td {
    padding: 5px 0;
}
</style>