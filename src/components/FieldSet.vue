<template>
<div class="field-set-wrapper">
    <div class="widget-lib">
        <h4>控件库<span>拖动控件到自定义字段区域进行字段的设置</span></h4>
        <div class="pull-box" id="pull-box">
            <button class="draggable-btn" @mousedown="mousedownHandle('TextField')">单行文本</button>
            <button class="draggable-btn" @mousedown="mousedownHandle('TextareaField')">多行文本</button>
            <button class="draggable-btn" @mousedown="mousedownHandle('SelectField')">下拉菜单</button>
            <button class="draggable-btn" @mousedown="mousedownHandle('RadioField')">单选按钮</button>
            <button class="draggable-btn" @mousedown="mousedownHandle('CheckboxField')">复选框</button>
            <button class="draggable-btn" @mousedown="mousedownHandle('DateField')">日期</button>
        </div>
    </div>
    <div class="self-field">
        <h4>自定义字段：</h4>
        <div class="field-box">
            <ul id="drag-wrapper">
                <li v-for="(item, key) in formList" 
                    :class="{active: activeIndex == key}" 
                    :key="key">
                    <keep-alive>
                        <component v-bind:is="item.name" :params="item"></component>
                    </keep-alive>
                    <i class="el-icon-edit" @click.stop="showPanel(item.name, key)"></i>
                    <i class="el-icon-delete" @click="removeItemHandle(key)"></i>
                </li>
            </ul>
        </div>
        <div class="field-btn">
            <el-button @click="cancelHandle">取消</el-button>
            <el-button type="primary" @click="confirmHandle">保存</el-button>
        </div>
    </div>

    <MoveElement v-if="addField">
        <component v-bind:is="currentView"></component>
    </MoveElement>
    
    <Extract :params="fieldExtract">
        <component v-bind:is="currentView" 
            :fieldParams="formList[activeIndex]" 
            :params="fieldExtract" 
            @reloadEvent="reloadGetData">
        </component>
    </Extract>
</div>
</template>

<script>
import AddItem from 'common/js/add-item'
import DragItem from 'common/js/drag-item'
import {cloneObj} from 'common/js/tools'
import formData from './fields/formData'

import MoveElement from './MoveElement.vue'
import Extract from './Extract.vue'

import TextField from './fields/TextField.vue'
import ModTextField from './fields/ModTextField.vue'
import TextareaField from './fields/TextareaField.vue'
import ModTextareaField from './fields/ModTextareaField.vue'
import SelectField from './fields/SelectField.vue'
import ModSelectField from './fields/ModSelectField.vue'
import RadioField from './fields/RadioField.vue'
import ModRadioField from './fields/ModRadioField.vue'
import CheckboxField from './fields/CheckboxField.vue'
import ModCheckboxField from './fields/ModCheckboxField.vue'
import DateField from './fields/DateField.vue'
import ModDateField from './fields/ModDateField.vue'

export default {
    name: 'FieldSet',
    data(){
        return {
            formList: [],
            addField: false,
            currentView: '',
            activeIndex: -1,
            copyList: [],
            fieldExtract: {
                isPlay: false,
                promptTitle: '自定义字段信息'
            }
        }
    },
    watch: {
        fieldExtract: {
            handler(newVal, oldVal){
                if (!newVal.isPlay){
                    this.activeIndex = -1
                }
            },
            deep: true
        }
    },
    methods: {
        getFieldsInfo(){
            const _this = this
            this.$http.get('/safe/studentForm/show', {
                params: {}
            })
            .then(function (response){
                _this.formList = JSON.parse(response.data.content)
                // 复制一份原始数据
                _this.copyList = cloneObj(_this.formList)
            })
        },
        mousedownHandle(name){
            const _this = this
            this.addField = !0
            this.currentView = name
            this.fieldExtract.isPlay = !1
            setTimeout(() => {
                _this.addField = !1
            }, 20)
        },
        showPanel(name, index){
            this.activeIndex = index
            this.currentView = 'Mod' + name
            this.fieldExtract.isPlay = !0
        },
        removeItemHandle(index){
            const _this = this
            this.$confirm('确认删除此字段吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.formList.splice(index, 1)
                _this.$message({
                    type: 'success',
                    message: '字段删除成功!'
                })
            }).catch(() => {})
        },
        reloadGetData(res){
            if (res == 'reload'){
                
            }
        },
        cancelHandle(){
            const _this = this
            this.$confirm('此操作将撤销之前所有的操作, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 恢复数据列表
                _this.formList = cloneObj(_this.copyList)
            }).catch(() => {})
        },
        confirmHandle(){
            const _this = this
            this.$http.post('/safe/studentForm/save', {
                content: _this.formList
            })
            .then(function (response){
                _this.$message({
                    type: 'success',
                    message: '字段保存成功!'
                })
            })
        }
    },
    created(){
        this.getFieldsInfo()
    },
    mounted(){
        const _this = this

        const addItem = new AddItem({
            outerWrapper: document.getElementById('pull-box'),
            targetWrapper: document.getElementById('drag-wrapper'),
            moveItemClass: 'move-item-wrapper',
            callback: function(index){
                let temp = cloneObj(formData[_this.currentView])
                // 对数据进行重新排序
                _this.formList.splice(index, 0, temp)
            }
        })
        addItem.install()

        const dragItem = new DragItem({
            outerWrapper: document.getElementById('drag-wrapper'),
            callback: function(actionType, res){
                // 对数据进行重新排序
                if (actionType == 'move'){
                    // console.log(res.current, res.target)
                    if (res.current == res.target) return
                    _this.formList.splice(res.target, 0, _this.formList[res.current])
                    if (res.current < res.target){
                        _this.formList.splice(res.current, 1)
                    } else {
                        _this.formList.splice(res.current + 1, 1)
                    }
                }
            }
        })
        dragItem.install()
    },
    components: {
        MoveElement,
        TextField,
        TextareaField,
        Extract,
        ModTextField,
        ModTextareaField,
        SelectField,
        ModSelectField,
        RadioField,
        ModRadioField,
        CheckboxField,
        ModCheckboxField,
        DateField,
        ModDateField
    }
}
</script>

<style>
.field-set-wrapper {}

/* 头部控件容器样式 */
.widget-lib {
    padding-bottom: 20px;
}
.widget-lib h4 {
    line-height: 30px;
}
.widget-lib span {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
}
.pull-box {
    height: 40px;
    margin-top: 12px;
}
.draggable-btn {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background: #fff;
    border: none;
    display: inline-block;
    margin-right: 2px;
    font-size: 12px;
    cursor: move;
}
.draggable-btn:hover,
.draggable-btn:active {
    color: #29e;
}

/* 自定义字段容器样式 */
.self-field > h4 {
    font-weight: bold;
}
.field-box {
    width: 40%;
    margin-top: 10px;
    border: 1px dashed #dcdcdc;
    overflow: hidden;
    background: #fff;
}
.field-box > ul {
    min-height: 204px;
    padding: 0 10px 10px;
    position: relative;
    overflow: hidden;
}

/* 自定义字段 表单控件(item) 样式 */
.field-box > ul > li {
    height: 56px;
    border: 1px dashed transparent;
    margin-top: 10px;
    position: relative;
    cursor: move;
}
.field-box > ul > li::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 2;
}
.field-box > ul > li.move {
    margin: 0;
    position: absolute;
    border-color: #43acf7;
    background-color: #ffffe5;
}
.field-box > ul > li.active {
    border-color: #43acf7;
    background-color: #ffffe5;
}
/* 站位元素样式 */
.field-box > ul > i.ref-item {
    display: block;
    height: 56px;
    border: 1px dashed #43acf7;
    margin-top: 10px;
}
/* Li item组件修改、删除按钮样式 */
.field-box > ul > li > i {
    position: absolute;
    right: 10px;
    top: 18px;
    font-size: 18px;
    cursor: pointer;
    z-index: 9;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}
.field-box > ul > li > i:hover {
    color: #409eff;
}
.field-box > ul > li > i.el-icon-edit {
    right: 40px;
}
.field-box > ul > li > i.el-icon-delete {
    right: 10px;
}


/* 保存字段，按钮样式 */
.field-btn {
    height: 40px;
    margin-top: 20px;
}


/* 表单控件(item) 内部元素样式 */
.dragTips {
    height: 40px;
    padding: 8px 70px 8px 8px;
}
.dragTips .text {
    color: #666;
    text-align: right;
    float: left;
    width: 90px;
    padding-right: 10px;
    line-height: 40px;
    font-size: 12px;
}
.dragTips .text > i {
    color: #ff4545
}
.dragTips .text-field {
    margin-left: 100px;
    height: 40px;
    line-height: 40px;
    position: relative;
}

/* 修改表单控件的组件容器样式 */
.mod-field-wrapper {
    padding: 30px 40px 20px 20px;
}
</style>