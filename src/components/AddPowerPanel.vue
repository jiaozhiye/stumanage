<template>
<div class="app-form-panel power-panel">
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>职务名称</label>
        <div class="app-input-block">
            <el-input name="postname" v-model="form.title" v-validate="'required|spechar'" :class="{'formDanger': errors.has('postname')}" clearable placeholder="请输入职务名称..." ></el-input>
            <span v-if="errors.has('postname')" class="prompt-title">{{ errors.first('postname') }}</span>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">职务描述</label>
        <div class="app-input-block">
            <el-input :rows="5" v-model="form.desc" placeholder="请输入职务描述..." type="textarea"></el-input>
        </div>
    </div>
    <div class="app-form-item power-form-item" v-for="(item, key) in list" :key="key">
        <label class="app-form-label" :class="{isFirst: item.parent_id == '0'}"><i v-if="item.parent_id == '0'" class="icon el-icon-edit-outline"></i>{{ item.name }}</label>
        <div class="app-input-block">
            <el-checkbox v-model="item.power" v-if="item.parent_id != '0'">{{ item.power ? '开启' : '关闭' }}</el-checkbox>
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
    name: 'AddPowerPanel',
    props: {
        params: Object
    },
    data(){
        return {
            list: [],
            form: {
                title: '',
                desc: ''
            }
        }
    },
    created(){
        this.getPowerList()
    },
    methods: {
        getPowerList(){
            const _this = this
            this.$http.get('/safe/job/showResource', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.list = response.data.menuList
            })
        },
        submitHandle(){
            const _this = this   
            this.insertDataInfo(function(){
                _this.$emit('reloadEvent', 'reload')
                _this.closePanelHandle()
            })
        },
        insertDataInfo(callback){
            const _this = this

            if (this.form.title == ''){
                return this.$message({
                    message: '请正确填写职务名称再提交！',
                    type: 'warning'
                })
            }
            
            this.$http.post('/safe/job/add', {
                name: _this.form.title,
                desc: _this.form.desc,
                list: _this.list
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '职务添加成功!'
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