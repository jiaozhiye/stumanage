<template>
<div class="dragTips">
    <label class="text">
        <i v-if="params.ismust">*</i>
        <em>{{ params.title }}</em>
    </label>
    <div class="text-field">
        <el-input type="textarea" autosize v-model="params.val" :placeholder="params.msg"></el-input>
    </div>
</div>
</template>

<script>
export default {
    name: 'TextareaField',
    props: {
        params: {
            type: Object,
            default (){
                return {
                    name: 'TextareaField',
                    title: '多行文本',
                    msg: '请输入...',
                    ismust: true,
                    val: ''
                }
            }
        }
    },
    data(){
        return {}
    }
}
</script>

<style>
</style>