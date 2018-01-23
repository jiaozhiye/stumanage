<template>
<div class="employManager-wrapper">
    <div class="employ-top">
        <el-button class="fl" @click.stop="addEmployHandle">新增员工</el-button>
        <ul class="fr">
            <el-select class="fl" v-model="search.jobId" @change="searchHandle" placeholder="请选择职务">
                <el-option
                    v-for="(item, key) in jobList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select class="fl" v-model="search.deptId" @change="searchHandle" placeholder="请选择部门">
                <el-option
                    v-for="(item, key) in deptList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-input class="fl" placeholder="名称/拼音头/手机" prefix-icon="el-icon-search"
                v-model="search.searchVal" @keyup.enter.native="searchHandle" clearable>
            </el-input>
        </ul>
    </div>
    <div class="employ-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="name" label="员工名称" sortable></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="dept_name" label="部门" sortable></el-table-column>
            <el-table-column prop="job_name" label="职务" sortable></el-table-column>
            <el-table-column prop="phone" label="手机"></el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-edit"></i> 修改
                    </el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-delete"></i> 离职
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <Extract :params="addEmployExtract">
        <AddEmployPanel :params="addEmployExtract" @reloadEvent="reloadGetData"></AddEmployPanel>
    </Extract>
    <Extract :params="modEmployExtract">
        <ModEmployPanel :params="modEmployExtract" @reloadEvent="reloadGetData"></ModEmployPanel>
    </Extract>
</div>
</template>

<script>
import Extract from './Extract.vue'
import AddEmployPanel from './AddEmployPanel.vue'
import ModEmployPanel from './ModEmployPanel.vue'

export default {
    name: 'EmployManager',
    data(){
        return {
            list: [],
            curPageIndex: 1, // 当前页码
            jobList: [],
            deptList: [],
            search: {
                jobId: '',
                deptId: '',
                searchVal: ''
            },
            loading: false,
            addEmployExtract: {
                isPlay: false,
                promptTitle: '新增员工'
            },
            modEmployExtract: {
                isPlay: false,
                promptTitle: '修改员工信息'
            }
        }
    },
    methods: {
        addEmployHandle(){
            this.addEmployExtract.isPlay = !0
        },
        modItemHandle(_id){
            this.modEmployExtract.isPlay = !0
            this.modEmployExtract.itemId = _id
        },
        getJobList(){
            const _this = this
            this.$http.get('/safe/job/showJobs', {
                params: {}
            })
            .then(function (response){
                _this.jobList = response.data
            })
        },
        getDeptList(){
            const _this = this
            this.$http.get('/safe/dept/toWebSearch', {
                params: {}
            })
            .then(function (response){
                _this.deptList = response.data
            })
        },
        delItemHandle(_id){
            const _this = this
            this.$confirm('确认此员工离职吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/staff/deleteById', {
                    params: {
                        id: _id
                    }
                }).then(function (response){
                    if (response.data.code == 1){
                        _this.removeItemById(_id)
                        _this.$message({
                            type: 'success',
                            message: '操作成功!'
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
        getEmployList(curPage, callback){
            const _this = this
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            this.loading = !0
            this.$http.get('/safe/staff/query', {
                params: {
                    pageNum: curPage,
                    pageSize: 10,
                    keyword: _this.search.searchVal,
                    dept: _this.search.deptId,
                    job: _this.search.jobId
                }
            })
            .then(function (response){
                _this.loading = !1
                _this.list = response.data.list
                _this.list.total = response.data.totalRow
                callback && callback()
            })
            .catch(function (error){
                _this.loading = !1
            })
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getEmployList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getEmployList(this.curPageIndex)
            }
        },
        searchHandle(){
            this.getEmployList(1)
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
        this.getEmployList(this.curPageIndex)
        this.getJobList()
        this.getDeptList()
    },
    components: {
        Extract,
        AddEmployPanel,
        ModEmployPanel
    }
}
</script>

<style>
.employManager-wrapper {}
.employ-top {
    height: 40px;
}
.employ-top ul {
    height: 40px;
}
.employ-top ul > .el-input {
    width: 280px;
}
.employ-top ul > .el-select {
    width: 200px;
    margin-right: 10px;
}

.employ-list {
    margin-top: 20px;
}
.employ-list .el-table__body-wrapper {
    overflow-x: hidden;
}
.employ-list .el-table__body td {
    padding: 5px 0;
}
</style>