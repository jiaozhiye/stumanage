<template>
<div class="mod-field-wrapper">
    <div class="app-form-item">
        <label class="app-form-label">字段名称</label>
        <div class="app-input-block">
            <el-input v-model="fieldParams.title"></el-input>
        </div>
    </div>
    <div class="app-form-item" v-for="(val, key) in fieldParams.options" :key="key">
        <label class="app-form-label">新增下拉项</label>
        <div class="app-input-block">
            <el-input v-model="val.label" clearable placeholder="请输入名称...">
                <el-button slot="append" icon="el-icon-delete" @click.stop="removeItemHandle(key)"></el-button>
            </el-input>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label"></label>
        <div class="app-input-block">
            <el-button type="primary" icon="el-icon-plus" @click.stop="addItemHandle"></el-button>
        </div>
    </div>
    <div class="app-form-item">
        <label class="app-form-label">是否必填</label>
        <div class="app-input-block">
            <el-checkbox v-model="fieldParams.ismust">{{ refInfo }}</el-checkbox>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="cancelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import {cloneObj} from 'common/js/tools'

export default {
    name: 'ModSelectField',
    props: {
        fieldParams: Object,
        params: Object
    },
    data(){
        return {}
    },
    computed: {
        refInfo (){
            return this.fieldParams.ismust ? '必填' : '非必填'
        }
    },
    methods: {
        addItemHandle(){
            this.fieldParams.options.push({
                label: ''
            })
        },
        removeItemHandle(index){
            this.fieldParams.options.splice(index, 1)
        },
        submitHandle(){
            this.$emit('reloadEvent', 'reload')

            this.closePanelHandle()
        },
        cancelHandle(){
            this.resetParams()
            this.closePanelHandle()
        },
        closePanelHandle(){
            this.params.isPlay = false
        },
        resetParams(){
            for (let i in this.copyData){
                this.fieldParams[i] = this.copyData[i]
            }
        }
    },
    created(){
        this.copyData = cloneObj(this.fieldParams)
    }
}
</script>

<style>
</style>