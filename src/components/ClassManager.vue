<template>
<div class="classManager-wrapper">
    <div class="class-top">
        <el-button class="fl" @click.stop="addClassHandle">新增班级</el-button>
        <div class="fr class-top-tit">{{ classInfo }}</div>
    </div>
    <div class="class-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="班级名称"></el-table-column>
            <el-table-column prop="student_count" label="学生数量" sortable width="200"></el-table-column>
            <el-table-column prop="finish_text" label="班级状态" width="200"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click.stop="classStateHandle(scope.row)" type="text">
                        {{ scope.row.finish == '1' ? '已结课' : '上课中' }}
                    </el-button>
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">修改</el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <Extract :params="addClassExtract">
        <AddClassPanel :params="addClassExtract" @reloadEvent="reloadGetData"></AddClassPanel>
    </Extract>
    <Extract :params="modClassExtract">
        <ModClassPanel :params="modClassExtract" @reloadEvent="reloadGetData"></ModClassPanel>
    </Extract>
</div>
</template>

<script>
import Extract from './Extract.vue'
import AddClassPanel from './AddClassPanel.vue'
import ModClassPanel from './ModClassPanel.vue'

export default {
    name: 'ClassManager',
    data(){
        return {
            curPageIndex: 1, // 当前页码
            list: [],
            classInfo: '',
            loading: false,
            addClassExtract: {
                isPlay: false,
                promptTitle: '新增班级'
            },
            modClassExtract: {
                isPlay: false,
                promptTitle: '修改班级'
            }
        }
    },
    methods: {
        addClassHandle(){
            this.addClassExtract.isPlay = true
        },
        modItemHandle(_id){
            this.modClassExtract.isPlay = true
            this.modClassExtract.itemId = _id
        },
        delItemHandle(_id){
            const _this = this
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/class/deleteById', {
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
        getClassInfo(){
            const _this = this
            this.$http.get('/safe/class/showClassNum', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.classInfo = response.data.message
            })
        },
        getClassList(curPage){
            const _this = this
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            this.$http.get('/safe/class/query', {
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
        classStateHandle(item){
            let tmp = item.finish == '1' ? '0' : '1'
            const _this = this
            this.$http.get('/safe/class/finish', {
                params: {
                    id: item.id,
                    finish: tmp
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    item.finish = tmp
                    // 获取列表数据和班级整体信息
                    _this.getClassList(_this.curPageIndex)
                    _this.getClassInfo()
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getClassList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getClassList(this.curPageIndex)
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
    created(){
        this.getClassInfo()
        this.getClassList(1)
    },
    components: {
        Extract,
        AddClassPanel,
        ModClassPanel
    }
}
</script>

<style>
.classManager-wrapper {}
.class-top {
    height: 40px;
}
.class-top .dictSelect {
    width: 120px;
    margin-right: 10px;
}
.class-top .class-top-tit {
    line-height: 40px;
    padding-right: 10px;
}

.class-list {
    margin-top: 20px;
}
.class-list .el-table__body-wrapper {
    overflow-x: hidden;
}
.class-list .el-table__body td {
    padding: 5px 0;
}
</style>