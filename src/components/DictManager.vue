<template>
<div class="dictManager-wrapper">
    <div class="dict-top">
        <el-select v-model="dictType" @change="changeHandle" class="dictSelect fl">
            <el-option
            v-for="item in dictList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
        <el-button class="fl" @click.stop="addDataHandle">新增字典</el-button>
    </div>
    <div class="dict-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="字典名称"></el-table-column>
            <el-table-column prop="sort" label="排序" sortable></el-table-column>
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
    <Extract :params="addDictExtract">
        <AddDictPanel :params="addDictExtract" @reloadEvent="reloadGetData"></AddDictPanel>
    </Extract>
    <Extract :params="modDictExtract">
        <ModDictPanel :params="modDictExtract" @reloadEvent="reloadGetData"></ModDictPanel>
    </Extract>
</div>
</template>

<script>
import Extract from './Extract.vue'
import AddDictPanel from './AddDictPanel.vue'
import ModDictPanel from './ModDictPanel.vue'

export default {
    name: 'DictManager',
    data(){
        return {
            dictList: [],
            dictType: '',
            list: [],
            loading: false,
            addDictExtract: {
                isPlay: false,
                promptTitle: '新增字典'
            },
            modDictExtract: {
                isPlay: false,
                promptTitle: '修改字典'
            }
        }
    },
    methods: {
        addDataHandle(){
            this.addDictExtract.isPlay = true
            this.addDictExtract.dictType = this.dictType
        },
        modItemHandle(_id){
            this.modDictExtract.isPlay = true
            this.modDictExtract.dictType = this.dictType
            this.modDictExtract.itemId = _id
        },
        getDictList(){
            const _this = this
            this.$http.get('/safe/dictMgr/parentList', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.dictList = response.data.list
                _this.dictType = response.data.selected
                _this.getDataList()
            })
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
        getDataList(){
            const _this = this
            this.loading = !0
            this.$http.get('/safe/dictMgr/list', {
                params: {
                    pid: _this.dictType
                }
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
        changeHandle(){
            this.getDataList()
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getDataList()
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
        this.getDictList()
    },
    components: {
        Extract,
        AddDictPanel,
        ModDictPanel
    }
}
</script>

<style>
.dictManager-wrapper {}
.dict-top {
    height: 40px;
}
.dict-top .dictSelect {
    width: 120px;
    margin-right: 10px;
}

.dict-list {
    margin-top: 20px;
}
.dict-list .el-table__body-wrapper {
    overflow-x: hidden;
}
.dict-list .el-table__body td {
    padding: 5px 0;
}
</style>