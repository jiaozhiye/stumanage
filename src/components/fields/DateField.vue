<template>
<div class="dragTips">
    <label class="text">
        <i v-if="params.ismust">*</i>
        <em>{{ params.title }}</em>
    </label>
    <div class="text-field">
        <el-date-picker
            v-model="params.val"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
    </div>
</div>
</template>

<script>
export default {
    name: 'DateField',
    props: {
        params: {
            type: Object,
            default (){
                return {
                    name: 'DateField',
                    title: '日期',
                    msg: '请选择...',
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