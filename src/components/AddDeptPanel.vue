<template>
<div class="add-dept-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>上级部门</label>
        <div class="app-input-block">
            <el-select v-model="superdeptId" placeholder="请选择上级部门">
                <el-option v-for="(item, key) in superdeptList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>部门名称</label>
        <div class="app-input-block">
            <el-input name="deptname" v-model="dept" v-validate="'required|spechar'" :class="{'formDanger': errors.has('deptname')}" clearable placeholder="请输入部门名称..." ></el-input>
            <span v-if="errors.has('deptname')" class="prompt-title">{{ errors.first('deptname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">部门描述</label>
        <div class="app-input-block">
            <el-input :rows="5" name="deptdesc" v-model="deptdesc" v-validate="'required'" :class="{'formDanger': errors.has('deptdesc')}" placeholder="请输入部门描述..." type="textarea"></el-input>
            <span v-if="errors.has('deptdesc')" class="prompt-title">{{ errors.first('deptdesc') }}</span>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
export default {
    name: 'AddDeptPanel',
    props: {
        params: Object
    },
    data(){
        return {
            superdeptList: [],
            superdeptId: '',
            dept: '',
            deptdesc: ''
        }
    },
    created(){
        this.getDeptList()
    },
    methods: {
        getDeptList(){
            const _this = this
            this.$http.get('/safe/dept/tree', {
                params: {}
            })
            .then(function (response){
                _this.superdeptList = response.data
            })
        },
        submitHandle(){
            const _this = this   
            this.insertDeptInfo(function(){
                _this.$emit('reloadEvent', 'reload')
                _this.closePanelHandle()
            })
        },
        insertDeptInfo(callback){
            const _this = this

            if (this.superdeptId == '' || this.dept == ''){
                return this.$message({
                    message: '请正确填写部门信息再提交！',
                    type: 'warning'
                })
            }
            
            this.$http.get('/safe/dept/save', {
                params: {
                    parent_id: _this.superdeptId,
                    name: _this.dept,
                    descr: _this.deptdesc
                }
            })
            .then(function (response){
                if (response.data.id){
                    _this.$message({
                        type: 'success',
                        message: '添加部门成功!'
                    })
                    callback && callback()
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    }
}
</script>

<style>
.add-dept-panel {
    padding: 30px 40px 20px 20px;
}
</style>