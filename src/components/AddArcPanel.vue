<template>
<div class="add-arc-panel">
    <div class="app-form-item">
        <label class="app-form-label">文章标题</label>
        <div class="app-input-block">
            <el-input name="arctitle" v-model="title" v-validate="'required|spechar'" :class="{'formDanger': errors.has('arctitle')}" clearable placeholder="请输入文章标题..." ></el-input>
            <span v-if="errors.has('arctitle')" class="prompt-title">{{ errors.first('arctitle') }}</span>
        </div>
    </div>
    <div class="arc-editor">
        <quill-editor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
        </quill-editor>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {quillEditor} from 'vue-quill-editor'
import {quillRedefine} from 'vue-quill-editor-upload'

export default {
    name: 'AddArcPanel',
    props: {
        params: Object
    },
    data(){
        return {
            title: '',
            content: '',
            editorOption: {}
        }
    },
    created (){
        this.editorOption = quillRedefine({
            // 图片上传的设置
            uploadConfig: {
                action: 'http://127.0.0.1:2080/upload/do',  // 图片上传地址
                res: (respnse) => {
                    console.log(respnse)
                    return respnse.filePath
                }
            }
        })
    },
    computed: {
        editor(){
            return this.$refs.myQuillEditor.quill
        }
    },
    methods: {
        submitHandle(){
            const _this = this   
            this.insertDataInfo(function(){
                _this.$emit('reloadEvent', 'reload')
                _this.closePanelHandle()
            })
        },
        insertDataInfo(callback){
            const _this = this

            if (this.title == ''){
                return this.$message({
                    message: '请正确填写文章标题再提交！',
                    type: 'warning'
                })
            }

            this.$http.get('/safe/dictMgr/add', {
                params: {
                    name: _this.title,
                    content: _this.content
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '文章添加成功!'
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
    },
    components: {
        quillEditor,
        quillRedefine
    }
}
</script>

<style>
.add-arc-panel {
    padding: 30px 20px 20px 20px;
}
.arc-editor .quill-editor {
    background: #fff;
    margin-bottom: 15px;
    clear: both;
}
.arc-editor .ql-container {
    min-height: 400px;
}
</style>