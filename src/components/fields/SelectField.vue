<template>
<div class="dragTips">
    <label class="text">
        <i v-if="params.ismust">*</i>
        <em>{{ params.title }}</em>
    </label>
    <div class="text-field">
        <el-select v-model="params.val" :placeholder="params.msg">
            <el-option
                v-for="(item, key) in params.options"
                :key="key"
                :label="item.label"
                :value="item.label">
            </el-option>
        </el-select>
    </div>
</div>
</template>

<script>
export default {
    name: 'SelectField',
    props: {
        params: {
            type: Object,
            default (){
                return {
                    name: 'SelectField',
                    title: '下拉菜单',
                    msg: '请选择...',
                    options: [],
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