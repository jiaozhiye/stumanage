<template>
<div class="app-form-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>登录帐号</label>
        <div class="app-input-block">
            <el-input name="account" v-model="form.account" v-validate="'required'" :class="{'formDanger': errors.has('account')}" clearable placeholder="请输入登录帐号..." ></el-input>
            <span v-if="errors.has('account')" class="prompt-title">{{ errors.first('account') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>密码</label>
        <div class="app-input-block">
            <el-input name="password" v-model="form.password" v-validate="'required|spechar'" :class="{'formDanger': errors.has('password')}" clearable placeholder="请输入密码..." ></el-input>
            <span v-if="errors.has('password')" class="prompt-title">{{ errors.first('password') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>姓名</label>
        <div class="app-input-block">
            <el-input name="pername" v-model="form.name" v-validate="'required|spechar'" :class="{'formDanger': errors.has('pername')}" clearable placeholder="请输入姓名..." ></el-input>
            <span v-if="errors.has('pername')" class="prompt-title">{{ errors.first('pername') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">性别</label>
        <div class="app-input-block">
            <el-radio v-model="form.sex" label="1">男</el-radio>
            <el-radio v-model="form.sex" label="0">女</el-radio>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">手机号</label>
        <div class="app-input-block">
            <el-input name="phone" v-model="form.phone" v-validate="'required|phone'" :class="{'formDanger': errors.has('phone')}" clearable placeholder="请输入手机号..." ></el-input>
            <span v-if="errors.has('phone')" class="prompt-title">{{ errors.first('phone') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">邮箱</label>
        <div class="app-input-block">
            <el-input name="email" v-model="form.email" v-validate="'required|email'" :class="{'formDanger': errors.has('email')}" clearable placeholder="请输入邮箱..." ></el-input>
            <span v-if="errors.has('email')" class="prompt-title">{{ errors.first('email') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>部门</label>
        <div class="app-input-block">
            <el-select v-model="form.deptId" placeholder="请选择">
                <el-option v-for="(item, key) in deptList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>职务</label>
        <div class="app-input-block">
            <el-select v-model="form.jobId" placeholder="请选择">
                <el-option v-for="(item, key) in jobList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
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
    name: 'AddEmployPanel',
    props: {
        params: Object
    },
    data(){
        return {
            deptList: [],
            jobList: [],
            form: {
                account: '',
                password: '',
                name: '',
                sex: '1',
                phone: '',
                email: '',
                deptId: '',
                jobId: ''
            }
        }
    },
    created(){
        this.getDeptList()
        this.getJobList()
    },
    methods: {
        getDeptList(){
            const _this = this
            this.$http.get('/safe/query', {
                params: {
                    dbObj: 'dept',
                    order: 'sort asc'
                }
            })
            .then(function (response){
                _this.superdeptList = response.data
            })
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
            this.$http.get('/safe/dept/tree', {
                params: {}
            })
            .then(function (response){
                _this.deptList = response.data
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

            if (this.form.account == '' || this.form.name == ''){
                return this.$message({
                    message: '请正确填写员工信息再提交！',
                    type: 'warning'
                })
            }
            
            this.$http.get('/safe/staff/add', {
                params: {
                    username: _this.form.account,
                    password: _this.form.password,
                    name: _this.form.name,
                    gender: _this.form.sex,
                    phone: _this.form.phone,
                    email: _this.form.email,
                    dept: _this.form.deptId,
                    job: _this.form.jobId
                }
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.id){
                    _this.$message({
                        type: 'success',
                        message: '添加员工成功!'
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