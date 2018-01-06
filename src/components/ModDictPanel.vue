<template>
<div class="add-dept-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>字典名称</label>
        <div class="app-input-block">
            <el-input name="dataname" v-model="form.title" v-validate="'required|spechar'" :class="{'formDanger': errors.has('dataname')}" clearable placeholder="请输入字典名称..." ></el-input>
            <span v-if="errors.has('dataname')" class="prompt-title">{{ errors.first('dataname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">字典值</label>
        <div class="app-input-block">
            <el-input v-model="form.value" clearable placeholder="请输入字典值..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>字典排序</label>
        <div class="app-input-block">
            <el-input name="order" v-model="form.number" v-validate="'required|numeric'" :class="{'formDanger': errors.has('order')}" clearable placeholder="请输入排序值..." ></el-input>
            <span v-if="errors.has('order')" class="prompt-title">{{ errors.first('order') }}</span>
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
    name: 'ModDictPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            form: {
                title: '',
                value: '',
                number: ''
            }
        }
    },
    created(){
        this.getItemInfo()
    },
    methods: {
        getItemInfo(){
            const _this = this
            this.$http.get('/safe/dictMgr/showById', {
                params: {
                    id: _this.itemId
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.form.title = response.data.name
                _this.form.value = response.data.value || ''
                _this.form.number = response.data.sort
            })
        },
        submitHandle(){
            const _this = this   
            this.updateDataInfo(function(){
                _this.$emit('reloadEvent', 'reload')
                _this.closePanelHandle()
            })
        },
        updateDataInfo(callback){
            const _this = this
            this.$http.get('/safe/dictMgr/updateById', {
                params: {
                    id: _this.itemId,
                    pid: _this.params.dictType,
                    name: _this.form.title,
                    value: _this.form.value,
                    sort: _this.form.number
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '字典修改成功!'
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