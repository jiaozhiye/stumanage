<template>
<div id="app">
    <el-row>
        <el-col :span="6" :offset="9">
            <div class="hd-logo"></div>
            <h3 class="hd-welcome">欢迎使用</h3>
            <el-alert v-if="showDanger" title="用户名或密码有误" type="error" show-icon></el-alert>
            <div class="app-form">
                <div class="app-form-item">
                    <span class="my-form-title">请输入用户名</span>
                    <el-input name="username" v-model="username" v-validate="'required|spechar'" :class="{'formDanger': errors.has('username')}" placeholder="用户名..." ></el-input>
                    <span v-if="errors.has('username')" class="prompt-title">{{ errors.first('username') }}</span>
                </div>
                <div class="app-form-item">
                    <span class="my-form-title">请输入密码</span>
                    <el-input name="password" type="password" v-model="password" @keyup.enter.native="doLogin"  v-validate="'required|spechar'" :class="{'formDanger': errors.has('password')}" placeholder="密码..." ></el-input>
                    <span v-if="errors.has('password')" class="prompt-title">{{ errors.first('password') }}</span>
                </div>
                <div class="app-form-item">
                    <el-button type="primary" @click.stop="doLogin">登 录</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import 'common/css/reset.css'
import 'common/css/style.css'

export default {
    name: 'app',
    data (){
        return {
            showDanger: false,
            username: '',
            password: ''
        }
    },
    watch: {
        showDanger(newVal, oldVal){
            const _this = this
            if (newVal){
                setTimeout(() => {
                    _this.showDanger = !1
                    _this.username = ''
                    _this.password = ''
                }, 2000)
            }
        }
    },
    methods: {
        doLogin(){
            const _this = this

            if (this.username == '' || this.password == ''){
                return this.$message({
                    message: '请正确填写用户名和密码！',
                    type: 'warning'
                })
            }

            this.$http.get('/login', {
                params: {
                    username: _this.username,
                    password: _this.password
                }
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.code == 1){
                    window.location.href = '/index/'
                } else {
                    _this.showDanger = !0
                }
            })
            .catch(function (error){
                console.log(error)
            })
        }
    }
}
</script>

<style>
body {
    background-color: #f9f9f9;
}
.hd-logo {
    margin: 50px 0 20px;
    height: 90px;
    background: url('./assets/logo.png') 50% 0 no-repeat;
    background-size: auto 100%;
}
.hd-welcome {
    text-align: center;
    padding: 20px;
    font-size: 30px;
}

#app .el-alert {
    margin-bottom: 10px;
}

#app .app-form {
    padding: 20px 30px;
    background-color: #fff;
    border: 1px solid #d8dee2;
    border-radius: 5px;
}
#app .app-form-item {
  margin-bottom: 15px;
  clear: both;
}
#app .my-form-title {
    display: inline-block;
    font-size: 12px;
    margin-bottom: 8px;
}
#app .el-button--primary {
    width: 100%;
}

/**
 * form 校验提醒
 */
#app .formDanger > input {
    border-color: #fa5555!important;
}
#app .prompt-title {
    color: #fa5555;
    display: inline-block;
}
</style>