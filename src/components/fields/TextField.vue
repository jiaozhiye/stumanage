<template>
<div class="dragTips">
    <label class="text">
        <i v-if="params.ismust">*</i>
        <em>{{ params.title }}</em>
    </label>
    <div class="text-field">
        <el-input v-model="params.val" :placeholder="params.msg"></el-input>
    </div>
</div>
</template>

<script>
export default {
    name: 'TextField',
    props: {
        params: {
            type: Object,
            default (){
                return {
                    name: 'TextField',
                    title: '单行文本',
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