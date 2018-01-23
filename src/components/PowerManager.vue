<template>
<div class="deptManager-wrapper">
    <div class="dept-top">
        <el-button class="fl" @click.stop="addDataHandle">新增职务</el-button>
    </div>
    <div class="dept-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="职务名称" width="200"></el-table-column>
            <el-table-column prop="staffs_count" label="人数" width="100"></el-table-column>
            <el-table-column prop="staffs" label="人员"></el-table-column>
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
    <Extract :params="addPowerExtract">
        <AddPowerPanel :params="addPowerExtract" @reloadEvent="reloadGetData"></AddPowerPanel>
    </Extract>
    <Extract :params="modPowerExtract">
        <ModPowerPanel :params="modPowerExtract" @reloadEvent="reloadGetData"></ModPowerPanel>
    </Extract>
</div>
</template>

<script>
import Extract from './Extract.vue'
import AddPowerPanel from './AddPowerPanel.vue'
import ModPowerPanel from './ModPowerPanel.vue'

export default {
    name: 'PowerManager',
    data(){
        return {
            list: [],
            loading: false,
            addPowerExtract: {
                isPlay: false,
                promptTitle: '新增职务'
            },
            modPowerExtract: {
                isPlay: false,
                promptTitle: '修改职务'
            }
        }
    },
    methods: {
        addDataHandle(){
            this.addPowerExtract.isPlay = true
            this.addPowerExtract.powerType = this.powerType
        },
        modItemHandle(_id){
            this.modPowerExtract.isPlay = true
            this.modPowerExtract.powerType = this.powerType
            this.modPowerExtract.itemId = _id
        },
        delItemHandle(_id){
            const _this = this
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/job/deleteById', {
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
        getPowerList(){
            const _this = this
            this.loading = !0
            this.$http.get('/safe/job/list', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.loading = !1
                _this.list = response.data.list
            })
            .catch(function (error){
                _this.loading = !1
            })
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getPowerList()
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
        this.getPowerList()
    },
    components: {
        Extract,
        AddPowerPanel,
        ModPowerPanel
    }
}
</script>

<style>
.deptManager-wrapper {}
.dept-top {
    height: 40px;
}
.dept-top .dictSelect {
    width: 120px;
    margin-right: 10px;
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

.power-panel .power-form-item {
    margin-bottom: 0;
}
.power-panel .app-form-label {
    width: 90px;
}
.power-panel .app-input-block {
    margin-left: 120px;
}
.power-panel .app-form-label.isFirst {
    text-align: left;
    font-weight: bold;
}
.power-panel .app-form-label.isFirst > i {
    color: #409EFF;
    font-size: 16px;
    margin-right: 4px;
    vertical-align: middle;
}
</style>