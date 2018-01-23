<template>
<div class="app-header">
    <div class="app-head-logo fl">
        <router-link to="/">长春市吉软教育培训学校</router-link>
    </div>
    <el-dropdown class="fr">
        <span class="user-setting">{{ userName }}</span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.stop.native="jumpToPersonal">个人设置</el-dropdown-item>
            <el-dropdown-item @click.stop.native="doLogout">安全退出</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: 'Header',
    data(){
        return {
            userName: ''
        }
    },
    computed: {
        ...mapGetters([
            'getPersonalInfo'
        ])
    },
    watch: {
        getPersonalInfo(){
            if (typeof this.getPersonalInfo.name == 'undefined'){
                return
            }
            if (this.getPersonalInfo.name.length <= 3){ // 中文昵称
                this.userName = this.getPersonalInfo.name.slice(1)
            } else {
                this.userName = this.getPersonalInfo.name.slice(0, 1).toUpperCase() + this.getPersonalInfo.name.slice(1)
            }
        }
    },
    methods: {
        jumpToPersonal(){
            window.location.href = '#/per-setting'
        },
        doLogout(){
            const _this = this
            this.$http.get('/logout', {
                params: {}
            })
            .then(function (response){
                if (response.data.code == 1){
                    window.location.href = '/login.html'
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        }
    }
}
</script>

<style>
.app-header .app-head-logo {
    color: #fff;
    font-size: 16px;
}
.app-head-logo a {
    color: #fff;
}

.app-header .el-dropdown {
    padding: 0 10px;
    cursor: pointer;
}
.app-header .el-dropdown:hover {
    background: rgba(255, 255, 255, .15);
}
.app-header .user-setting {
    display: inline-block;
    width: 38px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
    background: rgb(124, 181, 236);
}
</style>