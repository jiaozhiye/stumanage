<template>
<div class="deptManager-wrapper">
    <div class="dept-top">
        <el-button class="fl" @click.stop="addDeptHandle">新增部门</el-button>
        <el-input class="dept-search fr" placeholder="请输入部门名称" prefix-icon="el-icon-search"
            v-model="searchVal" @keyup.enter.native="searchHandle" clearable>
        </el-input>
    </div>
    <div class="dept-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="部门名称"></el-table-column>
            <el-table-column prop="parent_name" label="上级部门"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-edit"></i> 修改
                    </el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-delete"></i> 删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <Extract :params="addDeptExtract">
        <AddDeptPanel :params="addDeptExtract" @reloadEvent="reloadGetData"></AddDeptPanel>
    </Extract>
    <Extract :params="modDeptExtract">
        <ModDeptPanel :params="modDeptExtract" @reloadEvent="reloadGetData"></ModDeptPanel>
    </Extract>
</div>
</template>

<script>
import Extract from './Extract.vue'
import AddDeptPanel from './AddDeptPanel.vue'
import ModDeptPanel from './ModDeptPanel.vue'

export default {
    name: 'DeptManager',
    data(){
        return {
            list: [],
            searchVal: '',
            loading: false,
            addDeptExtract: {
                isPlay: false,
                promptTitle: '新增部门'
            },
            modDeptExtract: {
                isPlay: false,
                promptTitle: '修改部门信息'
            }
        }
    },
    methods: {
        addDeptHandle(){
            this.addDeptExtract.isPlay = true
        },
        modItemHandle(_id){
            this.modDeptExtract.isPlay = true
            this.modDeptExtract.itemId = _id
        },
        delItemHandle(_id){
            const _this = this
            this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/dept/deleteByid', {
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
        getDeptList(){
            const _this = this
            this.loading = !0
            this.$http.get('/safe/dept/tree', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.loading = !1
                _this.list = response.data
            })
            .catch(function (error){
                _this.loading = !1
            })
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getDeptList()
            }
        },
        searchHandle(){
            const _this = this
            if (this.searchVal == ''){
                return this.getDeptList()
            }
            this.$http.get('/safe/dept/query', {
                params: {
                    name: _this.searchVal
                }
            })
            .then(function (response){
                _this.list = response.data
            })
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
        this.getDeptList()
    },
    components: {
        Extract,
        AddDeptPanel,
        ModDeptPanel
    }
}
</script>

<style>
.deptManager-wrapper {}
.dept-top {
    height: 40px;
}
.dept-search {
    width: 260px;
}

.dept-list {
    margin-top: 20px;
}
.dept-list .el-table__body-wrapper {
    overflow-x: hidden;
}
.dept-list .el-table__body td {
    padding: 5px 0;
}
</style>