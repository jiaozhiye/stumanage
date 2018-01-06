<template>
<div class="persetting-wrapper">
    <div>
        <h4 class="form-group-apart">
            <i class="icon el-icon-edit-outline"></i>基本信息
        </h4>
        <div class="app-form-item">
            <label class="app-form-label">姓名:</label>
            <div class="app-input-block">
                <span>{{ form.name }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">性别:</label>
            <div class="app-input-block">
                <span>{{ form.gender }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">部门:</label>
            <div class="app-input-block">
                <span>{{ form.dept }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">职务:</label>
            <div class="app-input-block">
                <span>{{ form.job }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">电话:</label>
            <div class="app-input-block">
                <span>{{ form.phone }}</span>
            </div>
        </div>
        <h4 class="form-group-apart">
            <i class="icon el-icon-edit-outline"></i>帐号信息
        </h4>
        <div class="app-form-item">
            <label class="app-form-label">邮箱:</label>
            <div class="app-input-block">
                <span>{{ form.email }}</span>
            </div>
        </div>
        <div class="app-form-item">
            <label class="app-form-label">密码:</label>
            <div class="app-input-block">
                <span class="password">● ● ● ● ● ● ● ●</span>
                <el-button type="text" @click.stop="modPwdHandle">修改</el-button>
            </div>
        </div>
    </div>
    <Extract :params="modPwdExtract">
        <ModPwdPanel :params="modPwdExtract"></ModPwdPanel>
    </Extract>
</div>
</template>

<script>
import Extract from './Extract.vue'
import ModPwdPanel from './ModPwdPanel.vue'

import {mapGetters} from 'vuex'

export default {
    name: 'PersonalSetting',
    data(){
        return {
            itemId: '',
            form: {
                name: '',
                gender: '',
                dept: '',
                job: '',
                phone: '',
                email: '',
                password: ''
            },
            modPwdExtract: {
                isPlay: false,
                promptTitle: '修改个人登录密码'
            }
        }
    },
    computed: {
        ...mapGetters([
            'getPersonalInfo'
        ])
    },
    methods: {
        modPwdHandle(){
            this.modPwdExtract.isPlay = true
            this.modPwdExtract.itemId = this.itemId
        },
        getItemInfo(){
            const _this = this
            this.$http.get('/safe/staff/showMe', {
                params: {
                    id: _this.itemId
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.form.name = response.data.name
                _this.form.gender = response.data.gender_text
                _this.form.dept = response.data.dept_name
                _this.form.job = response.data.job_name
                _this.form.phone = response.data.phone
                _this.form.email = response.data.email   
            })
        },
    },
    created(){
        this.itemId = this.getPersonalInfo.id
        this.getItemInfo()
    },
    components: {
        Extract,
        ModPwdPanel
    }
}
</script>

<style>
.persetting-wrapper {}

.persetting-wrapper .password {
    display: inline-block;
    width: 200px;
}
</style>