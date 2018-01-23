<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label">当前密码</label>
        <div class="app-input-block">
            <el-input v-model="currentPwd" clearable placeholder="请输入当前密码..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">新密码</label>
        <div class="app-input-block">
            <el-input v-model="password" clearable placeholder="请输入新密码..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">确认密码</label>
        <div class="app-input-block">
            <el-input @blur="checkSameFn" v-model="confirmPwd" clearable placeholder="请再次输入新密码..." ></el-input>
            <span v-if="isPrompt" class="prompt-title">两次输入密码不一致！</span>
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
    name: 'ModPwdPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            currentPwd: '',
            password: '',
            confirmPwd: '',
            isPrompt: false
        }
    },
    methods: {
        submitHandle(){
            const _this = this
            this.updateDeptInfo(function(){
                _this.closePanelHandle()
            })
        },
        updateDeptInfo(callback){
            const _this = this

            if (this.isPrompt){
                return
            }
            if (this.confirmPwd == ''){
                return this.$message({
                    type: 'warning',
                    message: '请正确填写新密码!'
                })
            }
            
            this.$http.get('/safe/staff/modifyMyPwd', {
                params: {
                    id: _this.itemId,
                    currentPwd: _this.currentPwd,
                    confirmPwd: _this.confirmPwd
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '密码修改成功!'
                    })
                    // 执行回调
                    callback && callback()
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        checkSameFn(){
            if (this.password !== this.confirmPwd){
                this.isPrompt = !0
            } else {
                this.isPrompt = !1
            }
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    }
}
</script>

<style>
</style>