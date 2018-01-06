<template>
<div class="add-student-panel">
    <h4 class="form-group-apart"><i class="icon el-icon-edit-outline"></i>学员基本信息</h4>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>学员姓名</label>
        <div class="app-input-block">
            <el-input name="stuname" v-model="form.name" v-validate="'required|spechar'" :class="{'formDanger': errors.has('stuname')}" clearable placeholder="请输入学员姓名..." ></el-input>
            <span v-if="errors.has('stuname')" class="prompt-title">{{ errors.first('stuname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">性别</label>
        <div class="app-input-block">
            <el-radio v-model="form.gender" label="1">男</el-radio>
            <el-radio v-model="form.gender" label="0">女</el-radio>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>手机号</label>
        <div class="app-input-block">
            <el-input name="phone" v-model="form.phone" v-validate="'required|phone'" :class="{'formDanger': errors.has('phone')}" clearable placeholder="请输入手机号..." ></el-input>
            <span v-if="errors.has('phone')" class="prompt-title">{{ errors.first('phone') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">身份证号</label>
        <div class="app-input-block">
            <el-input name="sfzh" v-model="form.sfzh" v-validate="'alpha_num'" :class="{'formDanger': errors.has('sfzh')}" clearable placeholder="请输入身份证..." ></el-input>
            <span v-if="errors.has('sfzh')" class="prompt-title">{{ errors.first('sfzh') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>学员状态</label>
        <div class="app-input-block">
            <el-select v-model="form.status" placeholder="请选择学员状态">
                <el-option v-for="(item, key) in stuStatusList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">来源</label>
        <div class="app-input-block">
            <el-select v-model="form.source" placeholder="请选择学员来源">
                <el-option v-for="(item, key) in sourceList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">所有者</label>
        <div class="app-input-block">
            <el-tree
                :data="treeList"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                :default-expanded-keys="expandedKeys"
                :default-checked-keys="checkedKeys"
                :props="defaultProps">
            </el-tree>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">自定义标签</label>
        <div class="app-input-block">
            <LabelPanel :label-list="form.labels"></LabelPanel>
        </div>
    </div>
    <h4 class="form-group-apart"><i class="icon el-icon-edit-outline"></i>学员在校信息</h4>
    <div class="app-form-item">
        <label class="app-form-label">qq号</label>
        <div class="app-input-block">
            <el-input v-model="form.qq" clearable placeholder="请输入qq..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">邮箱</label>
        <div class="app-input-block">
            <el-input name="email" v-model="form.email" v-validate="'email'" :class="{'formDanger': errors.has('email')}" clearable placeholder="请输入邮箱..." ></el-input>
            <span v-if="errors.has('email')" class="prompt-title">{{ errors.first('email') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>大学名称</label>
        <div class="app-input-block">
            <el-select v-model="form.school" placeholder="请选择学校">
                <el-option v-for="(item, key) in schoolList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">专业名称</label>
        <div class="app-input-block">
            <el-select v-model="form.speciality" placeholder="请选择专业">
                <el-option v-for="(item, key) in specialList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">班级</label>
        <div class="app-input-block">
            <el-input v-model="form.class" clearable placeholder="请输入班级..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">寝室号</label>
        <div class="app-input-block">
            <el-input v-model="form.room_num" clearable placeholder="请输入寝室号..." ></el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>入学时间</label>
        <div class="app-input-block">
            <el-date-picker
                v-model="form.school_year"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
        </div>
    </div>
    <h4 class="form-group-apart"><i class="icon el-icon-edit-outline"></i>学员其他信息</h4>
    <div class="app-form-item">
        <label class="app-form-label">描述</label>
        <div class="app-input-block">
            <el-input :rows="5" name="studesc" v-model="form.remark" placeholder="请输入描述..." type="textarea"></el-input>
        </div>
    </div>
    <!-- 自定义字段 -->
    <div class="app-form-item" v-for="(item, key) in formList" :key="key">
        <component v-bind:is="item.name" :params="item"></component>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import TextField from './fields/TextField.vue'
import TextareaField from './fields/TextareaField.vue'
import SelectField from './fields/SelectField.vue'
import RadioField from './fields/RadioField.vue'
import CheckboxField from './fields/CheckboxField.vue'
import DateField from './fields/DateField.vue'
import LabelPanel from './LabelPanel.vue'

export default {
    name: 'ModStudentPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            form: {
                name: '',
                gender: '1',
                status: '',
                owner: '',
                source: '',
                phone: '',
                sfzh: '',
                school: '',
                speciality: '',
                school_year: '',
                class: '',
                room_num: '',
                qq: '',
                email: '',
                remark: '',
                labels: []
            },
            stuStatusList: [],
            sourceList: [],
            schoolList: [],
            specialList: [],
            treeList: [],
            expandedKeys: [],
            checkedKeys: [],
            formList: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created(){
        this.getItemInfo()
        this.getInfoList('/safe/dict/showStudentStatus', 'stuStatusList')
        this.getInfoList('/safe/dict/showSource', 'sourceList')
        this.getInfoList('/safe/dict/showSchool', 'schoolList')
        this.getInfoList('/safe/dict/showSpeciality', 'specialList')
        this.getInfoList('/safe/staff/tree', 'treeList')
        this.getFieldsInfo()
    },
    methods: {
        getItemInfo(){
            const _this = this
            this.$http.get('/safe/student/showById', {
                params: {
                    id: _this.itemId
                }
            })
            .then(function (response){
                // console.log(response.data)

                if (!response.data.name){
                    return _this.$message({
                        type: 'error',
                        message: '学生数据有误!'
                    })
                }

                _this.form.name = response.data.name
                _this.form.gender = response.data.gender || '1'
                _this.form.status = response.data.status || ''
                _this.form.source = response.data.source || ''
                _this.form.phone = response.data.phone || ''
                _this.form.sfzh = response.data.sfzh || ''
                _this.form.school = response.data.school || ''
                _this.form.speciality = response.data.speciality || '' || ''
                _this.form.school_year = response.data.school_year || ''
                _this.form.class = response.data.class || ''
                _this.form.room_num = response.data.room_num || ''
                _this.form.qq = response.data.qq || ''
                _this.form.email = response.data.email || ''
                _this.form.remark = response.data.remark || ''
                _this.form.labels = response.data.tags || []

                let _arr1 = [], _arr2 = []
                for (let i = 0; i < response.data.owners.length; i++){
                    _arr1[i] = response.data.owners[i].id
                    _arr2[i] = response.data.owners[i].pid
                }
                _this.checkedKeys  = _arr1
                _this.expandedKeys = _arr2
            })
            .catch(function (error){
                console.log(error)
            })
        },
        getInfoList(url, listname){
            const _this = this
            this.$http.get(url, {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.code == 1){
                    _this[listname] = response.data.result
                }
            })
        },
        getCheckedKeys(){
            this.form.owner = this.$refs.tree.getCheckedKeys().join(',')
        },
        getFieldsInfo(){
            const _this = this
            this.$http.get('/safe/studentForm/show', {
                params: {}
            })
            .then(function (response){
                _this.formList = JSON.parse(response.data.content)
            })
        },
        submitHandle(){
            const _this = this
            this.getCheckedKeys()
            // console.log(this.form)
            // console.log(this.formList)
            this.updateInfo(function(){
                _this.$emit('reloadEvent', 'reload')
                _this.closePanelHandle()
            })
        },
        updateInfo(callback){
            const _this = this
            
            this.$http.post('/safe/student/updateById', {
                id: _this.itemId,
                form: {
                    name: _this.form.name,
                    gender:  _this.form.gender,
                    status:  _this.form.status,
                    owner:  _this.form.owner,
                    source:  _this.form.source,
                    phone:  _this.form.phone,
                    sfzh:  _this.form.sfzh,
                    school:  _this.form.school,
                    speciality:  _this.form.speciality,
                    school_year:  _this.form.school_year,
                    class:  _this.form.class,
                    room_num:  _this.form.room_num,
                    qq:  _this.form.qq,
                    email:  _this.form.email,
                    remark:  _this.form.remark,
                    tag: _this.form.labels
                },
                field: _this.formList
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '学员修改成功!'
                    })
                    callback && callback()
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
            .catch(function (error){
                console.log(error)
            })
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    },
    components: {
        TextField,
        TextareaField,
        SelectField,
        RadioField,
        CheckboxField,
        DateField,
        LabelPanel
    }
}
</script>

<style>
.add-student-panel {
    padding: 30px 40px 20px 20px;
}

.add-student-panel .label-wrapper .label-add {
    margin: 0;
}
</style>