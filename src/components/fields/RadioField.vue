<template>
<div class="dragTips">
    <label class="text">
        <i v-if="params.ismust">*</i>
        <em>{{ params.title }}</em>
    </label>
    <div class="text-field">
        <el-radio v-model="params.val" :label="params.radios[0].label">{{ params.radios[0].label }}</el-radio>
        <el-radio v-model="params.val" :label="params.radios[1].label">{{ params.radios[1].label }}</el-radio>
    </div>
</div>
</template>

<script>
export default {
    name: 'RadioField',
    props: {
        params: {
            type: Object,
            default (){
                return {
                    name: 'RadioField',
                    title: '单选按钮',
                    msg: '请选择...',
                    radios: [
                        {label: '备选项1'},
                        {label: '备选项2'}
                    ],
                    ismust: true,
                    val: '备选项1'
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