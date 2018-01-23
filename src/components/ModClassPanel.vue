<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>班级名称</label>
        <div class="app-input-block">
            <el-input name="classname" v-model="form.title" v-validate="'required|spechar'" :class="{'formDanger': errors.has('classname')}" clearable placeholder="请输入班级名称..." ></el-input>
            <span v-if="errors.has('classname')" class="prompt-title">{{ errors.first('classname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">班级描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="form.desc" placeholder="请输入班级描述..." type="textarea"></el-input>
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
    name: 'ModClassPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            form: {
                title: '',
                desc: ''
            }
        }
    },
    created(){
        this.getItemInfo()
    },
    methods: {
        getItemInfo(){
            const _this = this
            this.$http.get('/safe/class/showById', {
                params: {
                    id: _this.itemId
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.form.title = response.data.data.name
                _this.form.desc = response.data.data.remark || ''
            })
        },
        submitHandle(){
            const _this = this   
            this.updateClassInfo(function(){
                _this.$emit('reloadEvent', 'reload')
                _this.closePanelHandle()
            })
        },
        updateClassInfo(callback){
            const _this = this
            this.$http.post('/safe/class/updateById', {
                id: _this.itemId,
                name: _this.form.title,
                remark: _this.form.desc
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '班级修改成功!'
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
</style>